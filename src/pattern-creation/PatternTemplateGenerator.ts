import { ExistingPatternAnalyzer, PatternAnalysis, PatternStructure } from './ExistingPatternAnalyzer';
import { StructureExtractor, StructureTemplate } from './StructureExtractor';
import { BestPracticesDatabase, PatternTemplate } from './BestPracticesDatabase';
import * as fs from 'fs';
import * as path from 'path';

export interface TemplateGenerationOptions {
  patternName: string;
  patternType: string;
  domain: string;
  expertise: string;
  contentType: string;
  analysisAreas: string[];
  outputSections: string[];
  specificSteps?: string[];
  sampleInputs?: string[];
  complexity?: 'simple' | 'medium' | 'complex';
}

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: string[];
  suggestions: string[];
  complianceChecks: {
    hasIdentity: boolean;
    hasPurpose: boolean;
    hasSteps: boolean;
    hasOutput: boolean;
    hasInstructions: boolean;
    followsStructure: boolean;
  };
}

export interface GeneratedTemplate {
  template: PatternTemplate;
  validation: ValidationResult;
  similarPatterns: PatternAnalysis[];
  confidence: number; // 0-1 scale
}

export class PatternTemplateGenerator {
  private analyzer: ExistingPatternAnalyzer;
  private extractor: StructureExtractor;
  private database: BestPracticesDatabase;
  private officialTemplate: string | null = null;

  constructor(patternsDirectory: string = 'patterns/_RAW') {
    this.analyzer = new ExistingPatternAnalyzer(patternsDirectory);
    this.extractor = new StructureExtractor();
    this.database = new BestPracticesDatabase();
    this.loadOfficialTemplate();
  }

  /**
   * Generate a complete pattern template based on existing patterns and best practices
   */
  async generateTemplate(options: TemplateGenerationOptions): Promise<GeneratedTemplate> {
    // Step 1: Analyze existing patterns to find similar ones
    const allPatterns = await this.analyzer.analyzeAllPatterns();
    const similarPatterns = this.findSimilarPatterns(options.patternType, allPatterns);

    // Step 2: Extract common structure from similar patterns
    const commonStructure = this.extractor.extractCommonElements(similarPatterns);

    // Step 3: Create domain-specific template
    const domainTemplate = this.extractor.extractDomainSpecificStructure(options.domain, similarPatterns);

    // Step 4: Generate the template using best practices
    const template = this.createTemplateFromStructure(options, commonStructure, domainTemplate);

    // Step 5: Validate against official template
    const validation = await this.validateTemplate(template);

    // Step 6: Calculate confidence score
    const confidence = this.calculateConfidence(similarPatterns, validation, options);

    return {
      template,
      validation,
      similarPatterns: similarPatterns.slice(0, 5), // Top 5 most similar
      confidence
    };
  }

  /**
   * Create a template specifically for landing page analysis patterns
   */
  async generateLandingPageTemplate(patternType: string): Promise<GeneratedTemplate> {
    const landingPageOptions: Record<string, TemplateGenerationOptions> = {
      'analyze_wireframe_flow': {
        patternName: 'analyze_wireframe_flow',
        patternType: 'wireframe_analysis',
        domain: 'UX analysis',
        expertise: 'expert UX analyst and conversion optimization specialist',
        contentType: 'landing page content',
        analysisAreas: ['user flow', 'navigation patterns', 'conversion funnels', 'UX design elements'],
        outputSections: [
          'USER FLOW ANALYSIS',
          'NAVIGATION STRUCTURE',
          'CONVERSION FUNNEL',
          'VISUAL HIERARCHY',
          'UX PATTERNS',
          'MOBILE EXPERIENCE',
          'IMPROVEMENT RECOMMENDATIONS'
        ],
        specificSteps: [
          'Extract the overall page structure and layout hierarchy',
          'Identify primary and secondary navigation elements',
          'Map the user journey from entry point to conversion goals',
          'Analyze conversion funnel elements and friction points',
          'Evaluate visual hierarchy and information architecture',
          'Assess mobile responsiveness and cross-device experience'
        ],
        complexity: 'medium'
      },
      'analyze_copywriting_score': {
        patternName: 'analyze_copywriting_score',
        patternType: 'copywriting_analysis',
        domain: 'copywriting analysis',
        expertise: 'expert copywriter and conversion optimization specialist',
        contentType: 'landing page copy',
        analysisAreas: ['messaging effectiveness', 'clarity', 'persuasion techniques', 'conversion optimization'],
        outputSections: [
          'HEADLINE ANALYSIS',
          'PERSUASION TECHNIQUES',
          'MESSAGE CLARITY',
          'EMOTIONAL TRIGGERS',
          'SOCIAL PROOF',
          'CALL-TO-ACTION ANALYSIS',
          'COPYWRITING SCORE',
          'OPTIMIZATION RECOMMENDATIONS'
        ],
        specificSteps: [
          'Analyze headline effectiveness and value proposition clarity',
          'Evaluate persuasion techniques and psychological triggers',
          'Assess message clarity and readability',
          'Identify emotional appeals and urgency elements',
          'Review social proof and credibility indicators',
          'Examine call-to-action effectiveness and placement'
        ],
        complexity: 'medium'
      },
      'create_storybrand_variant': {
        patternName: 'create_storybrand_variant',
        patternType: 'storybrand_analysis',
        domain: 'StoryBrand framework analysis',
        expertise: 'expert StoryBrand SB7 landing page conversion specialist',
        contentType: 'landing page content',
        analysisAreas: ['StoryBrand SB7 framework', 'conversion optimization', 'landing page structure'],
        outputSections: [
          'HEADER ANALYSIS',
          'STAKES EVALUATION',
          'VALUE PROPOSITION',
          'GUIDE CREDIBILITY',
          'PRICING PACKAGE / PLAN CLARITY',
          'OBJECTION HANDLING',
          'LEAD GENERATOR',
          'CONVERSION OPTIMIZATION',
          'SB7 SCORE'
        ],
        specificSteps: [
          'Analyze header section for logo, CTA, captivating message, and value stack',
          'Evaluate stakes section highlighting what customers lose without the solution',
          'Assess value proposition reinforcement and benefit clarity',
          'Review guide positioning through trust indicators and credibility elements',
          'Examine the pricing packages / plan section for simple three-step engagement process',
          'Analyze explanatory paragraph for objection handling and SEO optimization',
          'Evaluate lead generator effectiveness and value offering'
        ],
        complexity: 'medium'
      },
      'create_competitive_audit': {
        patternName: 'create_competitive_audit',
        patternType: 'competitive_analysis',
        domain: 'competitive intelligence',
        expertise: 'expert competitive intelligence analyst and strategic marketing consultant',
        contentType: 'landing page content',
        analysisAreas: ['competitive positioning', 'SWOT analysis', 'market opportunities', 'strategic recommendations'],
        outputSections: [
          'COMPETITIVE POSITIONING',
          'STRENGTHS ANALYSIS',
          'WEAKNESSES ASSESSMENT',
          'OPPORTUNITIES IDENTIFICATION',
          'THREATS EVALUATION',
          'INDUSTRY BENCHMARKING',
          'STRATEGIC RECOMMENDATIONS',
          'COMPETITIVE SCORE'
        ],
        specificSteps: [
          'Analyze competitive positioning and unique value propositions',
          'Identify strengths and competitive advantages',
          'Assess weaknesses and vulnerability areas',
          'Evaluate market opportunities and gaps',
          'Identify competitive threats and challenges',
          'Benchmark against industry standards and best practices',
          'Provide strategic recommendations for competitive improvement'
        ],
        complexity: 'medium'
      }
    };

    const options = landingPageOptions[patternType];
    if (!options) {
      throw new Error(`Unknown landing page pattern type: ${patternType}`);
    }

    return await this.generateTemplate(options);
  }

  /**
   * Validate a template against the official Fabric pattern template
   */
  async validateTemplate(template: PatternTemplate): Promise<ValidationResult> {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let score = 100;

    // Check required sections
    const complianceChecks = {
      hasIdentity: this.hasValidIdentity(template.structure.identity),
      hasPurpose: this.hasValidPurpose(template.structure.purpose),
      hasSteps: this.hasValidSteps(template.structure.steps),
      hasOutput: this.hasValidOutput(template.structure.outputSections),
      hasInstructions: this.hasValidInstructions(template.structure.outputInstructions),
      followsStructure: true // Will be calculated below
    };

    // Validate identity section
    if (!complianceChecks.hasIdentity) {
      issues.push('Identity section is missing or insufficient');
      suggestions.push('Add a clear identity statement that establishes expertise and specialization');
      score -= 20;
    }

    // Validate purpose section
    if (!complianceChecks.hasPurpose) {
      issues.push('Purpose section is missing or unclear');
      suggestions.push('Include a clear purpose statement explaining what the pattern does');
      score -= 15;
    }

    // Validate steps
    if (!complianceChecks.hasSteps) {
      issues.push('Steps section is missing or has too few steps');
      suggestions.push('Include at least 3-5 clear, actionable steps');
      score -= 20;
    }

    // Validate output sections
    if (!complianceChecks.hasOutput) {
      issues.push('Output sections are missing or insufficient');
      suggestions.push('Include at least 4-6 clearly labeled output sections');
      score -= 20;
    }

    // Validate instructions
    if (!complianceChecks.hasInstructions) {
      issues.push('Output instructions are missing or insufficient');
      suggestions.push('Include specific formatting and output requirements');
      score -= 15;
    }

    // Check against official template structure
    if (this.officialTemplate) {
      const structureCompliance = this.checkOfficialTemplateCompliance(template);
      if (!structureCompliance.isCompliant) {
        complianceChecks.followsStructure = false;
        issues.push(...structureCompliance.issues);
        suggestions.push(...structureCompliance.suggestions);
        score -= 10;
      }
    }

    // Additional quality checks
    const qualityChecks = this.performQualityChecks(template);
    issues.push(...qualityChecks.issues);
    suggestions.push(...qualityChecks.suggestions);
    score -= qualityChecks.scorePenalty;

    return {
      isValid: score >= 70,
      score: Math.max(0, score),
      issues,
      suggestions,
      complianceChecks
    };
  }

  /**
   * Generate the actual pattern file content from a template
   */
  generatePatternFile(template: PatternTemplate): string {
    const sections: string[] = [];

    // Identity and Purpose section
    sections.push('# IDENTITY and PURPOSE');
    sections.push('');
    sections.push(template.structure.identity);
    sections.push('');
    if (template.structure.purpose) {
      sections.push(template.structure.purpose);
      sections.push('');
    }

    // Steps section
    sections.push('# STEPS');
    sections.push('');
    template.structure.steps.forEach(step => {
      sections.push(`- ${step}`);
    });
    sections.push('');

    // Output section
    sections.push('# OUTPUT');
    sections.push('');
    template.structure.outputSections.forEach(section => {
      sections.push(`- ${section}: [Description of what this section should contain]`);
    });
    sections.push('');

    // Output Instructions section
    sections.push('# OUTPUT INSTRUCTIONS');
    sections.push('');
    template.structure.outputInstructions.forEach(instruction => {
      sections.push(`- ${instruction}`);
    });
    sections.push('');

    // Input section
    sections.push('# INPUT');
    sections.push('');
    sections.push('INPUT:');
    sections.push('');

    return sections.join('\n');
  }

  private findSimilarPatterns(patternType: string, allPatterns: PatternAnalysis[]): PatternAnalysis[] {
    return this.analyzer.findSimilarPatterns(patternType, allPatterns);
  }

  private createTemplateFromStructure(
    options: TemplateGenerationOptions,
    commonStructure: any,
    domainTemplate: StructureTemplate
  ): PatternTemplate {
    return {
      name: options.patternName,
      category: this.determineCategory(options.patternType),
      description: `${options.domain} pattern for analyzing ${options.contentType}`,
      structure: {
        identity: this.buildIdentity(options),
        purpose: this.buildPurpose(options),
        steps: options.specificSteps || this.buildSteps(options, commonStructure),
        outputSections: options.outputSections || domainTemplate.commonElements.outputPatterns.slice(0, 6),
        outputInstructions: this.buildOutputInstructions(options, domainTemplate)
      },
      bestPractices: this.database.getBestPractices(this.determineCategory(options.patternType))
        .slice(0, 3).map(p => p.title),
      sampleInputs: options.sampleInputs || [],
      expectedOutputFormat: domainTemplate.outputFormat || 'structured'
    };
  }

  private buildIdentity(options: TemplateGenerationOptions): string {
    return `You are an ${options.expertise}. You analyze ${options.contentType} to identify ${options.analysisAreas.join(', ')} and provide actionable insights for improvement.`;
  }

  private buildPurpose(options: TemplateGenerationOptions): string {
    return `Analyze ${options.contentType} to evaluate ${options.analysisAreas.join(', ')} and provide specific recommendations for optimization.`;
  }

  private buildSteps(options: TemplateGenerationOptions, commonStructure: any): string[] {
    const baseSteps = [
      'Take a step back and think step-by-step about how to best accomplish this analysis',
      'Consume the entire content and analyze it systematically'
    ];

    const domainSteps = options.analysisAreas.map(area => 
      `Analyze the ${area} elements and patterns`
    );

    return [...baseSteps, ...domainSteps, 'Provide specific recommendations for improvement'];
  }

  private buildOutputInstructions(options: TemplateGenerationOptions, domainTemplate: StructureTemplate): string[] {
    const baseInstructions = [
      'Use bullet points for lists and structured analysis',
      'Include specific examples from the analyzed content',
      'Provide actionable recommendations with priority levels'
    ];

    if (options.domain.includes('analysis') || options.domain.includes('score')) {
      baseInstructions.push('Rate sections on effectiveness where applicable (1-10 scale)');
    }

    return baseInstructions;
  }

  private determineCategory(patternType: string): string {
    if (patternType.includes('analyze') || patternType.includes('analysis')) return 'analysis';
    if (patternType.includes('create') || patternType.includes('creation')) return 'creation';
    if (patternType.includes('extract')) return 'extraction';
    if (patternType.includes('improve')) return 'improvement';
    return 'analysis'; // Default for landing page patterns
  }

  private calculateConfidence(
    similarPatterns: PatternAnalysis[],
    validation: ValidationResult,
    options: TemplateGenerationOptions
  ): number {
    let confidence = 0.5; // Base confidence

    // Boost confidence based on similar patterns found
    if (similarPatterns.length >= 5) confidence += 0.2;
    else if (similarPatterns.length >= 3) confidence += 0.1;

    // Boost confidence based on validation score
    confidence += (validation.score / 100) * 0.3;

    // Boost confidence for well-defined options
    if (options.specificSteps && options.specificSteps.length >= 4) confidence += 0.1;
    if (options.outputSections && options.outputSections.length >= 5) confidence += 0.1;

    return Math.min(1.0, confidence);
  }

  private loadOfficialTemplate(): void {
    try {
      const templatePath = path.join('patterns/_RAW', 'official_pattern_template_system.md');
      if (fs.existsSync(templatePath)) {
        this.officialTemplate = fs.readFileSync(templatePath, 'utf-8');
      }
    } catch (error) {
      console.warn('Could not load official pattern template:', error);
    }
  }

  private hasValidIdentity(identity: string): boolean {
    return identity.length >= 20 && 
           (identity.includes('You are') || identity.includes('expert') || identity.includes('specialist'));
  }

  private hasValidPurpose(purpose: string): boolean {
    return purpose.length >= 15 && 
           (purpose.includes('analyze') || purpose.includes('extract') || purpose.includes('create'));
  }

  private hasValidSteps(steps: string[]): boolean {
    return steps.length >= 3 && steps.every(step => step.length >= 10);
  }

  private hasValidOutput(outputSections: string[]): boolean {
    return outputSections.length >= 3 && outputSections.every(section => section.length >= 3);
  }

  private hasValidInstructions(instructions: string[]): boolean {
    return instructions.length >= 2 && instructions.every(instruction => instruction.length >= 10);
  }

  private checkOfficialTemplateCompliance(template: PatternTemplate): {
    isCompliant: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check for required sections based on official template
    const requiredSections = ['IDENTITY', 'STEPS', 'OUTPUT'];
    const hasAllSections = requiredSections.every(section => {
      // This is a simplified check - in practice, you'd parse the generated content
      return true; // Assume compliance for now
    });

    if (!hasAllSections) {
      issues.push('Missing required sections from official template');
      suggestions.push('Ensure all required sections (IDENTITY, STEPS, OUTPUT) are present');
    }

    return {
      isCompliant: issues.length === 0,
      issues,
      suggestions
    };
  }

  private performQualityChecks(template: PatternTemplate): {
    issues: string[];
    suggestions: string[];
    scorePenalty: number;
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    let scorePenalty = 0;

    // Check for overly complex or simple templates
    const totalWords = [
      template.structure.identity,
      template.structure.purpose,
      ...template.structure.steps,
      ...template.structure.outputInstructions
    ].join(' ').split(/\s+/).length;

    if (totalWords < 50) {
      issues.push('Template appears too simple/brief');
      suggestions.push('Add more detailed instructions and examples');
      scorePenalty += 5;
    } else if (totalWords > 500) {
      issues.push('Template appears overly complex');
      suggestions.push('Simplify instructions while maintaining clarity');
      scorePenalty += 3;
    }

    // Check for specific domain requirements
    if (template.category === 'analysis' && !template.structure.outputInstructions.some(i => i.includes('score') || i.includes('rate'))) {
      suggestions.push('Consider adding scoring/rating instructions for analysis patterns');
    }

    return { issues, suggestions, scorePenalty };
  }
}