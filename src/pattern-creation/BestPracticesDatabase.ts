import { PatternAnalysis } from './ExistingPatternAnalyzer';
import { StructureTemplate } from './StructureExtractor';

export interface BestPractice {
  id: string;
  title: string;
  description: string;
  category: string;
  examples: string[];
  applicablePatterns: string[];
  effectiveness: number; // 1-10 scale
}

export interface PatternTemplate {
  name: string;
  category: string;
  description: string;
  structure: {
    identity: string;
    purpose: string;
    steps: string[];
    outputSections: string[];
    outputInstructions: string[];
  };
  bestPractices: string[];
  sampleInputs: string[];
  expectedOutputFormat: string;
}

export class BestPracticesDatabase {
  private bestPractices: BestPractice[] = [];
  private patternTemplates: PatternTemplate[] = [];

  constructor() {
    this.initializeCoreBestPractices();
    this.initializeCoreTemplates();
  }

  /**
   * Add best practices learned from successful patterns
   */
  addBestPractice(practice: BestPractice): void {
    this.bestPractices.push(practice);
  }

  /**
   * Get best practices for a specific category or pattern type
   */
  getBestPractices(category?: string, patternType?: string): BestPractice[] {
    let practices = this.bestPractices;

    if (category) {
      practices = practices.filter(p => p.category === category);
    }

    if (patternType) {
      practices = practices.filter(p => 
        p.applicablePatterns.includes(patternType) || 
        p.applicablePatterns.includes('all')
      );
    }

    return practices.sort((a, b) => b.effectiveness - a.effectiveness);
  }

  /**
   * Create a pattern template based on successful patterns and best practices
   */
  createPatternTemplate(
    name: string, 
    category: string, 
    structureTemplate: StructureTemplate,
    domainSpecifics: any
  ): PatternTemplate {
    const relevantPractices = this.getBestPractices(category);
    
    return {
      name,
      category,
      description: `${category} pattern for ${domainSpecifics.domain || 'general'} analysis`,
      structure: {
        identity: this.buildIdentityFromTemplate(structureTemplate, domainSpecifics),
        purpose: this.buildPurposeFromTemplate(structureTemplate, domainSpecifics),
        steps: this.buildStepsFromTemplate(structureTemplate, domainSpecifics),
        outputSections: this.buildOutputSectionsFromTemplate(structureTemplate, domainSpecifics),
        outputInstructions: this.buildOutputInstructionsFromTemplate(structureTemplate, relevantPractices)
      },
      bestPractices: relevantPractices.slice(0, 5).map(p => p.title),
      sampleInputs: domainSpecifics.sampleInputs || [],
      expectedOutputFormat: structureTemplate.outputFormat
    };
  }

  /**
   * Learn from successful pattern implementations
   */
  learnFromPattern(pattern: PatternAnalysis, successMetrics: any): void {
    if (successMetrics.qualityScore > 8) {
      // Extract successful practices from high-quality patterns
      const practices = this.extractPracticesFromPattern(pattern);
      practices.forEach(practice => this.addBestPractice(practice));
    }
  }

  /**
   * Get template for specific landing page pattern types
   */
  getLandingPagePatternTemplate(patternType: string): PatternTemplate | null {
    const templates = {
      'analyze_wireframe_flow': this.createWireframeFlowTemplate(),
      'analyze_copywriting_score': this.createCopywritingScoreTemplate(),
      'create_storybrand_variant': this.createStorybrandVariantTemplate(),
      'create_competitive_audit': this.createCompetitiveAuditTemplate()
    };

    return templates[patternType as keyof typeof templates] || null;
  }

  /**
   * Search best practices database
   */
  searchBestPractices(query: string): BestPractice[] {
    const queryLower = query.toLowerCase();
    
    return this.bestPractices.filter(practice => 
      practice.title.toLowerCase().includes(queryLower) ||
      practice.description.toLowerCase().includes(queryLower) ||
      practice.category.toLowerCase().includes(queryLower)
    ).sort((a, b) => b.effectiveness - a.effectiveness);
  }

  private initializeCoreBestPractices(): void {
    this.bestPractices = [
      {
        id: 'identity-expertise',
        title: 'Establish Clear Expertise in Identity',
        description: 'Use specific, credible expertise statements that establish authority in the domain',
        category: 'identity',
        examples: [
          'You are an expert UX analyst and conversion optimization specialist',
          'You are an advanced copywriter with expertise in persuasion psychology'
        ],
        applicablePatterns: ['all'],
        effectiveness: 9
      },
      {
        id: 'structured-output',
        title: 'Use Structured Output Sections',
        description: 'Organize outputs into clear, labeled sections for better readability and usability',
        category: 'output',
        examples: [
          'ANALYSIS:', 'RECOMMENDATIONS:', 'SCORE:', 'IMPROVEMENTS:'
        ],
        applicablePatterns: ['analysis', 'evaluation'],
        effectiveness: 9
      },
      {
        id: 'scoring-systems',
        title: 'Include Numerical Scoring Systems',
        description: 'Provide quantitative assessments alongside qualitative analysis',
        category: 'analysis',
        examples: [
          'Rate each section on a scale of 1-10',
          'Overall effectiveness score: X/100'
        ],
        applicablePatterns: ['analysis', 'evaluation'],
        effectiveness: 8
      },
      {
        id: 'actionable-recommendations',
        title: 'Provide Actionable Recommendations',
        description: 'Include specific, prioritized recommendations that users can implement',
        category: 'recommendations',
        examples: [
          'HIGH PRIORITY: Reduce form fields from 8 to 3',
          'MEDIUM PRIORITY: Add social proof elements'
        ],
        applicablePatterns: ['analysis', 'improvement'],
        effectiveness: 9
      },
      {
        id: 'step-by-step-thinking',
        title: 'Include Step-by-Step Thinking Instructions',
        description: 'Guide the AI through systematic analysis processes',
        category: 'steps',
        examples: [
          'Take a step back and think step-by-step',
          'Analyze each component systematically'
        ],
        applicablePatterns: ['all'],
        effectiveness: 8
      },
      {
        id: 'domain-specific-frameworks',
        title: 'Use Domain-Specific Frameworks',
        description: 'Incorporate established frameworks relevant to the analysis domain',
        category: 'frameworks',
        examples: [
          'StoryBrand SB7 framework for marketing analysis',
          'SWOT analysis for competitive assessment'
        ],
        applicablePatterns: ['business', 'marketing', 'strategy'],
        effectiveness: 9
      }
    ];
  }

  private initializeCoreTemplates(): void {
    // Initialize with core pattern templates that can be customized
    this.patternTemplates = [];
  }

  private buildIdentityFromTemplate(template: StructureTemplate, domainSpecifics: any): string {
    const expertise = domainSpecifics.expertise || 'expert analyst';
    const domain = domainSpecifics.domain || 'content analysis';
    
    return `You are an ${expertise} that specializes in ${domain}. You analyze content to provide insights and recommendations that help users improve their ${domainSpecifics.goal || 'outcomes'}.`;
  }

  private buildPurposeFromTemplate(template: StructureTemplate, domainSpecifics: any): string {
    return `Analyze ${domainSpecifics.contentType || 'content'} to identify ${domainSpecifics.analysisAreas?.join(', ') || 'key insights'} and provide actionable recommendations for improvement.`;
  }

  private buildStepsFromTemplate(template: StructureTemplate, domainSpecifics: any): string[] {
    const baseSteps = [
      'Take a step back and think step-by-step about how to best accomplish this analysis',
      'Consume the entire content and analyze it systematically',
      'Extract key elements and patterns from the content'
    ];

    if (domainSpecifics.specificSteps) {
      return [...baseSteps, ...domainSpecifics.specificSteps];
    }

    return baseSteps;
  }

  private buildOutputSectionsFromTemplate(template: StructureTemplate, domainSpecifics: any): string[] {
    if (domainSpecifics.outputSections) {
      return domainSpecifics.outputSections;
    }

    return template.commonElements.outputPatterns.slice(0, 6);
  }

  private buildOutputInstructionsFromTemplate(template: StructureTemplate, practices: BestPractice[]): string[] {
    const baseInstructions = [
      'Use bullet points for lists and structured analysis',
      'Include specific examples from the analyzed content',
      'Provide actionable recommendations with priority levels'
    ];

    const practiceInstructions = practices
      .filter(p => p.category === 'output' || p.category === 'formatting')
      .slice(0, 3)
      .map(p => p.description);

    return [...baseInstructions, ...practiceInstructions];
  }

  private extractPracticesFromPattern(pattern: PatternAnalysis): BestPractice[] {
    const practices: BestPractice[] = [];
    
    // Analyze successful pattern elements
    if (pattern.structure.identity.includes('expert')) {
      practices.push({
        id: `identity-${pattern.name}`,
        title: 'Effective Identity Pattern',
        description: pattern.structure.identity,
        category: 'identity',
        examples: [pattern.structure.identity],
        applicablePatterns: [pattern.category],
        effectiveness: 8
      });
    }

    return practices;
  }

  private createWireframeFlowTemplate(): PatternTemplate {
    return {
      name: 'analyze_wireframe_flow',
      category: 'analysis',
      description: 'Analyze user flow, navigation patterns, and UX design elements',
      structure: {
        identity: 'You are an expert UX analyst and conversion optimization specialist. You analyze landing pages to identify user flow patterns, navigation structures, conversion funnels, and UX design elements that impact user experience and conversion rates.',
        purpose: 'Analyze user flow, navigation patterns, conversion funnels, and UX design elements from landing page content.',
        steps: [
          'Extract the overall page structure and layout hierarchy',
          'Identify primary and secondary navigation elements',
          'Map the user journey from entry point to conversion goals',
          'Analyze conversion funnel elements and friction points',
          'Evaluate visual hierarchy and information architecture',
          'Assess mobile responsiveness and cross-device experience'
        ],
        outputSections: [
          'USER FLOW ANALYSIS',
          'NAVIGATION STRUCTURE', 
          'CONVERSION FUNNEL',
          'VISUAL HIERARCHY',
          'UX PATTERNS',
          'MOBILE EXPERIENCE',
          'IMPROVEMENT RECOMMENDATIONS'
        ],
        outputInstructions: [
          'Use bullet points for lists and structured analysis',
          'Include specific examples from the analyzed content',
          'Provide actionable recommendations with priority levels',
          'Rate each section on a scale of 1-10 for effectiveness'
        ]
      },
      bestPractices: ['structured-output', 'scoring-systems', 'actionable-recommendations'],
      sampleInputs: ['E-commerce product page', 'SaaS signup page', 'Lead generation page'],
      expectedOutputFormat: 'structured'
    };
  }

  private createCopywritingScoreTemplate(): PatternTemplate {
    return {
      name: 'analyze_copywriting_score',
      category: 'analysis',
      description: 'Score messaging effectiveness, clarity, and persuasion techniques',
      structure: {
        identity: 'You are an expert copywriter and conversion optimization specialist. You analyze landing page copy to evaluate messaging effectiveness, clarity, persuasion techniques, emotional triggers, and conversion optimization elements.',
        purpose: 'Score messaging effectiveness, clarity, persuasion techniques, and conversion optimization elements in landing page copy.',
        steps: [
          'Analyze headline effectiveness and value proposition clarity',
          'Evaluate persuasion techniques and psychological triggers',
          'Assess message clarity and readability',
          'Identify emotional appeals and urgency elements',
          'Review social proof and credibility indicators',
          'Examine call-to-action effectiveness and placement'
        ],
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
        outputInstructions: [
          'Provide numerical scores (1-10) for each analysis section',
          'Include specific examples and quotes from the analyzed copy',
          'Suggest alternative copy variations for key elements',
          'Prioritize recommendations by potential conversion impact'
        ]
      },
      bestPractices: ['scoring-systems', 'actionable-recommendations', 'domain-specific-frameworks'],
      sampleInputs: ['High-converting SaaS page', 'E-commerce sales page', 'B2B service page'],
      expectedOutputFormat: 'structured'
    };
  }

  private createStorybrandVariantTemplate(): PatternTemplate {
    return {
      name: 'create_storybrand_variant',
      category: 'analysis',
      description: 'Analyze and optimize using StoryBrand SB7 framework for landing pages',
      structure: {
        identity: 'You are an expert StoryBrand SB7 landing page conversion specialist. You analyze landing pages against the proven SB7 landing page structure to optimize for conversions, focusing on the specific elements that drive action rather than general storytelling.',
        purpose: 'Analyze and optimize landing pages using the StoryBrand SB7 framework specifically for conversion-focused landing page structure and elements.',
        steps: [
          'Analyze header section for logo, CTA, captivating message, and value stack',
          'Evaluate stakes section highlighting what customers lose without the solution',
          'Assess value proposition reinforcement and benefit clarity',
          'Review guide positioning through trust indicators and credibility elements',
          'Examine the pricing packages / plan section for simple three-step engagement process',
          'Analyze explanatory paragraph for objection handling and SEO optimization',
          'Evaluate lead generator effectiveness and value offering',
          'Review optional elements (video, product choices, junk drawer organization)'
        ],
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
        outputInstructions: [
          'Focus on conversion elements rather than general storytelling',
          'Rate each SB7 landing page element on conversion effectiveness (1-10)',
          'Provide specific optimization recommendations for each section',
          'Include before/after examples for key improvements',
          'Prioritize recommendations by conversion impact potential'
        ]
      },
      bestPractices: ['domain-specific-frameworks', 'scoring-systems', 'actionable-recommendations'],
      sampleInputs: ['Fitness app landing page', 'Business consulting page', 'Financial planning service'],
      expectedOutputFormat: 'structured'
    };
  }

  private createCompetitiveAuditTemplate(): PatternTemplate {
    return {
      name: 'create_competitive_audit',
      category: 'analysis',
      description: 'Conduct SWOT-style competitive analysis and identify improvement opportunities',
      structure: {
        identity: 'You are an expert competitive intelligence analyst and strategic marketing consultant. You analyze landing pages to understand competitive positioning, identify market opportunities, and provide strategic recommendations for competitive advantage.',
        purpose: 'Conduct SWOT-style competitive analysis and identify improvement opportunities through comprehensive market positioning assessment.',
        steps: [
          'Analyze competitive positioning and unique value propositions',
          'Identify strengths and competitive advantages',
          'Assess weaknesses and vulnerability areas',
          'Evaluate market opportunities and gaps',
          'Identify competitive threats and challenges',
          'Benchmark against industry standards and best practices',
          'Provide strategic recommendations for competitive improvement'
        ],
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
        outputInstructions: [
          'Use SWOT framework structure for analysis',
          'Include specific examples and evidence for each point',
          'Provide benchmarking data where possible',
          'Prioritize recommendations by impact and feasibility',
          'Rate competitive strength on 1-10 scale for each area'
        ]
      },
      bestPractices: ['domain-specific-frameworks', 'structured-output', 'actionable-recommendations'],
      sampleInputs: ['SaaS productivity tool', 'E-commerce fashion brand', 'Professional services firm'],
      expectedOutputFormat: 'structured'
    };
  }
}