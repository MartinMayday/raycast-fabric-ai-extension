import * as fs from 'fs';
import * as path from 'path';

export interface PatternStructure {
  identity: string;
  purpose: string;
  steps: string[];
  outputSections: string[];
  outputInstructions: string[];
  examples?: string[];
}

export interface PatternAnalysis {
  name: string;
  category: string;
  structure: PatternStructure;
  wordCount: number;
  complexity: 'simple' | 'medium' | 'complex';
  outputFormat: 'bulleted' | 'numbered' | 'structured' | 'mixed';
}

export class ExistingPatternAnalyzer {
  private patternsDirectory: string;

  constructor(patternsDirectory: string = 'patterns/_RAW') {
    this.patternsDirectory = patternsDirectory;
  }

  /**
   * Analyze all existing patterns to extract common structures and best practices
   */
  async analyzeAllPatterns(): Promise<PatternAnalysis[]> {
    const patternFiles = this.getPatternFiles();
    const analyses: PatternAnalysis[] = [];

    for (const file of patternFiles) {
      try {
        const analysis = await this.analyzePattern(file);
        if (analysis) {
          analyses.push(analysis);
        }
      } catch (error) {
        console.warn(`Failed to analyze pattern ${file}:`, error);
      }
    }

    return analyses;
  }

  /**
   * Analyze a specific pattern file
   */
  async analyzePattern(filename: string): Promise<PatternAnalysis | null> {
    const filePath = path.join(this.patternsDirectory, filename);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const structure = this.extractPatternStructure(content);
    
    return {
      name: this.extractPatternName(filename),
      category: this.categorizePattern(filename, content),
      structure,
      wordCount: content.split(/\s+/).length,
      complexity: this.assessComplexity(content, structure),
      outputFormat: this.determineOutputFormat(content)
    };
  }

  /**
   * Find patterns similar to a given pattern type
   */
  findSimilarPatterns(targetType: string, allAnalyses: PatternAnalysis[]): PatternAnalysis[] {
    const targetKeywords = this.extractKeywords(targetType);
    
    return allAnalyses
      .map(analysis => ({
        analysis,
        similarity: this.calculateSimilarity(targetKeywords, analysis)
      }))
      .filter(item => item.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10)
      .map(item => item.analysis);
  }

  /**
   * Extract common structural elements from multiple patterns
   */
  extractCommonStructure(patterns: PatternAnalysis[]): PatternStructure {
    const commonIdentityPatterns = this.findCommonIdentityPatterns(patterns);
    const commonStepPatterns = this.findCommonStepPatterns(patterns);
    const commonOutputPatterns = this.findCommonOutputPatterns(patterns);

    return {
      identity: commonIdentityPatterns[0] || "You are an expert analyst that specializes in [DOMAIN].",
      purpose: "Analyze and provide insights on [CONTENT_TYPE] to help users understand [SPECIFIC_GOAL].",
      steps: commonStepPatterns,
      outputSections: commonOutputPatterns,
      outputInstructions: [
        "Use bullet points for lists and structured analysis",
        "Include specific examples from the analyzed content", 
        "Provide actionable recommendations with priority levels",
        "Rate sections on effectiveness where applicable"
      ]
    };
  }

  private getPatternFiles(): string[] {
    if (!fs.existsSync(this.patternsDirectory)) {
      return [];
    }

    return fs.readdirSync(this.patternsDirectory)
      .filter(file => file.endsWith('_system.md'))
      .slice(0, 50); // Limit for performance
  }

  private extractPatternStructure(content: string): PatternStructure {
    const sections = this.parseSections(content);
    
    return {
      identity: sections['IDENTITY'] || sections['IDENTITY and PURPOSE'] || '',
      purpose: sections['PURPOSE'] || sections['GOALS'] || '',
      steps: this.extractSteps(sections['STEPS'] || ''),
      outputSections: this.extractOutputSections(content),
      outputInstructions: this.extractOutputInstructions(sections['OUTPUT INSTRUCTIONS'] || ''),
      examples: this.extractExamples(content)
    };
  }

  private parseSections(content: string): Record<string, string> {
    const sections: Record<string, string> = {};
    const lines = content.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.startsWith('# ')) {
        if (currentSection) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.substring(2).trim();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    }

    if (currentSection) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  }

  private extractSteps(stepsContent: string): string[] {
    const steps: string[] = [];
    const lines = stepsContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        steps.push(trimmed.substring(2).trim());
      }
    }

    return steps;
  }

  private extractOutputSections(content: string): string[] {
    const sections: string[] = [];
    const outputMatch = content.match(/# OUTPUT[\s\S]*?(?=# |$)/);
    
    if (outputMatch) {
      const outputContent = outputMatch[0];
      const sectionMatches = outputContent.match(/- [A-Z\s]+:/g);
      
      if (sectionMatches) {
        sections.push(...sectionMatches.map(match => 
          match.replace(/^- /, '').replace(/:$/, '').trim()
        ));
      }
    }

    return sections;
  }

  private extractOutputInstructions(instructionsContent: string): string[] {
    const instructions: string[] = [];
    const lines = instructionsContent.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        instructions.push(trimmed.substring(2).trim());
      }
    }

    return instructions;
  }

  private extractExamples(content: string): string[] {
    const examples: string[] = [];
    const exampleMatches = content.match(/EXAMPLE[S]?:[\s\S]*?(?=\n\n|# |$)/g);
    
    if (exampleMatches) {
      examples.push(...exampleMatches.map(match => match.trim()));
    }

    return examples;
  }

  private extractPatternName(filename: string): string {
    return filename.replace('_system.md', '').replace(/_/g, ' ');
  }

  private categorizePattern(filename: string, content: string): string {
    const name = filename.toLowerCase();
    
    if (name.includes('analyze')) return 'analysis';
    if (name.includes('create')) return 'creation';
    if (name.includes('extract')) return 'extraction';
    if (name.includes('summarize')) return 'summarization';
    if (name.includes('improve') || name.includes('enhance')) return 'improvement';
    if (name.includes('rate') || name.includes('judge')) return 'evaluation';
    
    return 'general';
  }

  private assessComplexity(content: string, structure: PatternStructure): 'simple' | 'medium' | 'complex' {
    const wordCount = content.split(/\s+/).length;
    const stepCount = structure.steps.length;
    const outputSectionCount = structure.outputSections.length;
    
    if (wordCount < 300 && stepCount < 5 && outputSectionCount < 5) return 'simple';
    if (wordCount < 800 && stepCount < 10 && outputSectionCount < 8) return 'medium';
    return 'complex';
  }

  private determineOutputFormat(content: string): 'bulleted' | 'numbered' | 'structured' | 'mixed' {
    const bulletCount = (content.match(/^- /gm) || []).length;
    const numberCount = (content.match(/^\d+\. /gm) || []).length;
    const structuredCount = (content.match(/^[A-Z\s]+:/gm) || []).length;
    
    if (structuredCount > bulletCount && structuredCount > numberCount) return 'structured';
    if (numberCount > bulletCount) return 'numbered';
    if (bulletCount > 0 && numberCount > 0) return 'mixed';
    return 'bulleted';
  }

  private extractKeywords(text: string): string[] {
    return text.toLowerCase()
      .split(/[\s_-]+/)
      .filter(word => word.length > 2)
      .slice(0, 10);
  }

  private calculateSimilarity(targetKeywords: string[], analysis: PatternAnalysis): number {
    const analysisText = `${analysis.name} ${analysis.category}`.toLowerCase();
    const matches = targetKeywords.filter(keyword => analysisText.includes(keyword));
    return matches.length / targetKeywords.length;
  }

  private findCommonIdentityPatterns(patterns: PatternAnalysis[]): string[] {
    const identityPatterns = patterns
      .map(p => p.structure.identity)
      .filter(identity => identity.length > 0);
    
    // Find most common identity pattern structure
    const commonPhrases = [
      "You are an expert",
      "You are a",
      "You are an advanced",
      "You extract",
      "You analyze"
    ];

    return commonPhrases.filter(phrase => 
      identityPatterns.some(identity => identity.includes(phrase))
    );
  }

  private findCommonStepPatterns(patterns: PatternAnalysis[]): string[] {
    const allSteps = patterns.flatMap(p => p.structure.steps);
    const commonStepPhrases = [
      "Take a step back and think step-by-step",
      "Consume the entire content and think deeply about it",
      "Extract the most important",
      "Analyze the",
      "Create a summary"
    ];

    return commonStepPhrases.filter(phrase =>
      allSteps.some(step => step.toLowerCase().includes(phrase.toLowerCase()))
    );
  }

  private findCommonOutputPatterns(patterns: PatternAnalysis[]): string[] {
    const allOutputSections = patterns.flatMap(p => p.structure.outputSections);
    const sectionCounts: Record<string, number> = {};

    allOutputSections.forEach(section => {
      const normalized = section.toUpperCase().trim();
      sectionCounts[normalized] = (sectionCounts[normalized] || 0) + 1;
    });

    return Object.entries(sectionCounts)
      .filter(([_, count]) => count >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 10)
      .map(([section, _]) => section);
  }
}