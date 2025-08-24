import { PatternAnalysis, PatternStructure } from './ExistingPatternAnalyzer';

export interface CommonElements {
  identityPatterns: string[];
  stepPatterns: string[];
  outputPatterns: string[];
  instructionPatterns: string[];
}

export interface StructureTemplate {
  category: string;
  commonElements: CommonElements;
  bestPractices: string[];
  outputFormat: string;
  complexity: 'simple' | 'medium' | 'complex';
}

export class StructureExtractor {
  /**
   * Extract common structural elements from a collection of pattern analyses
   */
  extractCommonElements(patterns: PatternAnalysis[]): CommonElements {
    return {
      identityPatterns: this.extractCommonIdentityPatterns(patterns),
      stepPatterns: this.extractCommonStepPatterns(patterns),
      outputPatterns: this.extractCommonOutputPatterns(patterns),
      instructionPatterns: this.extractCommonInstructionPatterns(patterns)
    };
  }

  /**
   * Create structure templates for different pattern categories
   */
  createStructureTemplates(patterns: PatternAnalysis[]): Record<string, StructureTemplate> {
    const categories = this.groupByCategory(patterns);
    const templates: Record<string, StructureTemplate> = {};

    for (const [category, categoryPatterns] of Object.entries(categories)) {
      templates[category] = {
        category,
        commonElements: this.extractCommonElements(categoryPatterns),
        bestPractices: this.extractBestPractices(categoryPatterns),
        outputFormat: this.determinePreferredOutputFormat(categoryPatterns),
        complexity: this.determineAverageComplexity(categoryPatterns)
      };
    }

    return templates;
  }

  /**
   * Extract the most effective structural patterns for a specific domain
   */
  extractDomainSpecificStructure(domain: string, patterns: PatternAnalysis[]): StructureTemplate {
    const relevantPatterns = this.filterByDomain(domain, patterns);
    const highQualityPatterns = this.filterHighQualityPatterns(relevantPatterns);

    return {
      category: domain,
      commonElements: this.extractCommonElements(highQualityPatterns),
      bestPractices: this.extractBestPractices(highQualityPatterns),
      outputFormat: this.determinePreferredOutputFormat(highQualityPatterns),
      complexity: this.determineOptimalComplexity(domain)
    };
  }

  /**
   * Analyze output section effectiveness across patterns
   */
  analyzeOutputSectionEffectiveness(patterns: PatternAnalysis[]): Record<string, number> {
    const sectionFrequency: Record<string, number> = {};
    const sectionQuality: Record<string, number[]> = {};

    patterns.forEach(pattern => {
      pattern.structure.outputSections.forEach(section => {
        const normalized = this.normalizeOutputSection(section);
        sectionFrequency[normalized] = (sectionFrequency[normalized] || 0) + 1;
        
        // Quality score based on pattern complexity and category
        const qualityScore = this.calculateSectionQualityScore(pattern, section);
        if (!sectionQuality[normalized]) {
          sectionQuality[normalized] = [];
        }
        sectionQuality[normalized].push(qualityScore);
      });
    });

    // Calculate effectiveness score (frequency * average quality)
    const effectiveness: Record<string, number> = {};
    Object.keys(sectionFrequency).forEach(section => {
      const frequency = sectionFrequency[section];
      const avgQuality = sectionQuality[section].reduce((a, b) => a + b, 0) / sectionQuality[section].length;
      effectiveness[section] = frequency * avgQuality;
    });

    return effectiveness;
  }

  /**
   * Extract step patterns that lead to high-quality outputs
   */
  extractEffectiveStepPatterns(patterns: PatternAnalysis[]): string[] {
    const stepPatterns: Record<string, number> = {};
    
    patterns.forEach(pattern => {
      if (this.isHighQualityPattern(pattern)) {
        pattern.structure.steps.forEach(step => {
          const normalized = this.normalizeStep(step);
          stepPatterns[normalized] = (stepPatterns[normalized] || 0) + 1;
        });
      }
    });

    return Object.entries(stepPatterns)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 15)
      .map(([step, _]) => step);
  }

  private extractCommonIdentityPatterns(patterns: PatternAnalysis[]): string[] {
    const identityPatterns: Record<string, number> = {};
    
    patterns.forEach(pattern => {
      const identity = pattern.structure.identity;
      if (identity) {
        // Extract key phrases from identity statements
        const phrases = this.extractKeyPhrases(identity);
        phrases.forEach(phrase => {
          identityPatterns[phrase] = (identityPatterns[phrase] || 0) + 1;
        });
      }
    });

    return Object.entries(identityPatterns)
      .filter(([_, count]) => count >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 10)
      .map(([phrase, _]) => phrase);
  }

  private extractCommonStepPatterns(patterns: PatternAnalysis[]): string[] {
    const stepPatterns: Record<string, number> = {};
    
    patterns.forEach(pattern => {
      pattern.structure.steps.forEach(step => {
        const normalized = this.normalizeStep(step);
        if (normalized.length > 10) { // Filter out very short steps
          stepPatterns[normalized] = (stepPatterns[normalized] || 0) + 1;
        }
      });
    });

    return Object.entries(stepPatterns)
      .filter(([_, count]) => count >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 12)
      .map(([step, _]) => step);
  }

  private extractCommonOutputPatterns(patterns: PatternAnalysis[]): string[] {
    const outputPatterns: Record<string, number> = {};
    
    patterns.forEach(pattern => {
      pattern.structure.outputSections.forEach(section => {
        const normalized = this.normalizeOutputSection(section);
        outputPatterns[normalized] = (outputPatterns[normalized] || 0) + 1;
      });
    });

    return Object.entries(outputPatterns)
      .filter(([_, count]) => count >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 15)
      .map(([section, _]) => section);
  }

  private extractCommonInstructionPatterns(patterns: PatternAnalysis[]): string[] {
    const instructionPatterns: Record<string, number> = {};
    
    patterns.forEach(pattern => {
      pattern.structure.outputInstructions.forEach(instruction => {
        const normalized = this.normalizeInstruction(instruction);
        if (normalized.length > 15) { // Filter out very short instructions
          instructionPatterns[normalized] = (instructionPatterns[normalized] || 0) + 1;
        }
      });
    });

    return Object.entries(instructionPatterns)
      .filter(([_, count]) => count >= 2)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 10)
      .map(([instruction, _]) => instruction);
  }

  private groupByCategory(patterns: PatternAnalysis[]): Record<string, PatternAnalysis[]> {
    const categories: Record<string, PatternAnalysis[]> = {};
    
    patterns.forEach(pattern => {
      if (!categories[pattern.category]) {
        categories[pattern.category] = [];
      }
      categories[pattern.category].push(pattern);
    });

    return categories;
  }

  private extractBestPractices(patterns: PatternAnalysis[]): string[] {
    const practices: string[] = [];
    
    // Analyze high-quality patterns for best practices
    const highQualityPatterns = patterns.filter(p => this.isHighQualityPattern(p));
    
    if (highQualityPatterns.length > 0) {
      practices.push("Use clear, specific identity statements that establish expertise");
      practices.push("Include step-by-step thinking instructions");
      practices.push("Provide structured output sections with clear labels");
      practices.push("Include specific formatting requirements");
      practices.push("Add examples when helpful for clarity");
    }

    // Add category-specific best practices
    const category = patterns[0]?.category;
    if (category === 'analysis') {
      practices.push("Include rating or scoring systems for evaluation");
      practices.push("Provide specific examples from analyzed content");
    } else if (category === 'creation') {
      practices.push("Include templates or frameworks to follow");
      practices.push("Specify output format and structure requirements");
    }

    return practices;
  }

  private determinePreferredOutputFormat(patterns: PatternAnalysis[]): string {
    const formatCounts: Record<string, number> = {};
    
    patterns.forEach(pattern => {
      formatCounts[pattern.outputFormat] = (formatCounts[pattern.outputFormat] || 0) + 1;
    });

    return Object.entries(formatCounts)
      .sort(([_, a], [__, b]) => b - a)[0]?.[0] || 'bulleted';
  }

  private determineAverageComplexity(patterns: PatternAnalysis[]): 'simple' | 'medium' | 'complex' {
    const complexityScores = patterns.map(p => {
      switch (p.complexity) {
        case 'simple': return 1;
        case 'medium': return 2;
        case 'complex': return 3;
        default: return 2;
      }
    });

    const avgScore = complexityScores.reduce((a, b) => a + b, 0) / complexityScores.length;
    
    if (avgScore < 1.5) return 'simple';
    if (avgScore < 2.5) return 'medium';
    return 'complex';
  }

  private determineOptimalComplexity(domain: string): 'simple' | 'medium' | 'complex' {
    // Domain-specific complexity recommendations
    const complexityMap: Record<string, 'simple' | 'medium' | 'complex'> = {
      'analysis': 'medium',
      'creation': 'medium',
      'extraction': 'simple',
      'summarization': 'simple',
      'improvement': 'medium',
      'evaluation': 'complex'
    };

    return complexityMap[domain] || 'medium';
  }

  private filterByDomain(domain: string, patterns: PatternAnalysis[]): PatternAnalysis[] {
    const domainKeywords = domain.toLowerCase().split(/[\s_-]+/);
    
    return patterns.filter(pattern => {
      const patternText = `${pattern.name} ${pattern.category}`.toLowerCase();
      return domainKeywords.some(keyword => patternText.includes(keyword));
    });
  }

  private filterHighQualityPatterns(patterns: PatternAnalysis[]): PatternAnalysis[] {
    return patterns.filter(pattern => this.isHighQualityPattern(pattern));
  }

  private isHighQualityPattern(pattern: PatternAnalysis): boolean {
    // Quality criteria
    const hasGoodStructure = pattern.structure.identity.length > 20 &&
                           pattern.structure.steps.length >= 3 &&
                           pattern.structure.outputSections.length >= 3;
    
    const hasGoodLength = pattern.wordCount >= 200 && pattern.wordCount <= 2000;
    
    const hasGoodInstructions = pattern.structure.outputInstructions.length >= 2;

    return hasGoodStructure && hasGoodLength && hasGoodInstructions;
  }

  private calculateSectionQualityScore(pattern: PatternAnalysis, section: string): number {
    let score = 1;
    
    // Higher score for patterns with good structure
    if (this.isHighQualityPattern(pattern)) score += 1;
    
    // Higher score for specific, actionable section names
    if (section.includes('ANALYSIS') || section.includes('RECOMMENDATIONS')) score += 0.5;
    
    // Higher score for medium complexity (not too simple, not too complex)
    if (pattern.complexity === 'medium') score += 0.5;
    
    return score;
  }

  private extractKeyPhrases(text: string): string[] {
    const phrases: string[] = [];
    
    // Common identity patterns
    const identityPatterns = [
      /You are an? (expert|advanced|professional) ([^.]+)/i,
      /You are an? ([^.]+) that specializes in ([^.]+)/i,
      /You (extract|analyze|create|improve) ([^.]+)/i
    ];

    identityPatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match) {
        phrases.push(match[0]);
      }
    });

    return phrases;
  }

  private normalizeStep(step: string): string {
    return step
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private normalizeOutputSection(section: string): string {
    return section
      .toUpperCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private normalizeInstruction(instruction: string): string {
    return instruction
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}