import { PatternTemplate } from './BestPracticesDatabase';

export interface PatternSpecification {
  name: string;
  category: string;
  description: string;
  domain: string;
  expertise: string;
  analysisFramework: string;
  inputTypes: string[];
  outputStructure: OutputStructure;
  sampleInputs: SampleInput[];
  expectedOutputs: ExpectedOutput[];
  validationCriteria: ValidationCriteria;
  useCases: string[];
  bestPractices: string[];
}

export interface OutputStructure {
  sections: OutputSection[];
  scoringSystem?: ScoringSystem;
  recommendationFormat: string;
  exampleFormat: string;
}

export interface OutputSection {
  name: string;
  description: string;
  format: 'bulleted' | 'numbered' | 'structured' | 'paragraph';
  required: boolean;
  examples: string[];
}

export interface ScoringSystem {
  scale: string;
  criteria: string[];
  aggregation: 'average' | 'weighted' | 'total';
}

export interface SampleInput {
  name: string;
  description: string;
  contentType: string;
  complexity: 'simple' | 'medium' | 'complex';
  content: string;
  expectedInsights: string[];
}

export interface ExpectedOutput {
  inputName: string;
  sections: Record<string, string>;
  overallScore?: number;
  keyRecommendations: string[];
}

export interface ValidationCriteria {
  requiredSections: string[];
  scoringRequired: boolean;
  recommendationsRequired: boolean;
  minimumWordCount: number;
  qualityChecks: string[];
}

export class SpecificationBuilder {
  /**
   * Build specification for analyze_wireframe_flow pattern
   */
  buildAnalyzeWireframeFlowSpec(): PatternSpecification {
    return {
      name: 'analyze_wireframe_flow',
      category: 'UX Analysis',
      description: 'Analyzes user flow, navigation patterns, conversion funnels, and UX design elements from landing page content to identify optimization opportunities.',
      domain: 'User Experience Design',
      expertise: 'UX analyst and conversion optimization specialist',
      analysisFramework: 'User-Centered Design principles with conversion optimization focus',
      inputTypes: ['landing page HTML', 'website URL', 'page screenshots', 'wireframe descriptions'],
      outputStructure: {
        sections: [
          {
            name: 'USER FLOW ANALYSIS',
            description: 'Step-by-step mapping of user journey from entry to conversion',
            format: 'bulleted',
            required: true,
            examples: [
              'Entry point: Homepage navigation link',
              'Primary action: "Start Free Trial" button (prominent, above fold)',
              'Secondary actions: "Learn More", "View Pricing" (supporting flow)',
              'Conversion goal: Account creation form (3-step process)',
              'Exit points: Footer links, social media icons'
            ]
          },
          {
            name: 'NAVIGATION STRUCTURE',
            description: 'Analysis of primary, secondary, and utility navigation elements',
            format: 'structured',
            required: true,
            examples: [
              'Primary: Logo, Products, Pricing, Resources, Login (clear hierarchy)',
              'Secondary: Breadcrumbs, in-page anchors (good wayfinding)',
              'Utility: Search, language selector, support chat (accessible)'
            ]
          },
          {
            name: 'CONVERSION FUNNEL',
            description: 'Evaluation of funnel stages, friction points, and optimization opportunities',
            format: 'structured',
            required: true,
            examples: [
              'Awareness: Hero section with value proposition',
              'Interest: Feature highlights and social proof',
              'Consideration: Pricing comparison table',
              'Action: Signup form with progress indicator',
              'Friction points: Too many form fields, unclear pricing'
            ]
          },
          {
            name: 'VISUAL HIERARCHY',
            description: 'Assessment of information prioritization and visual flow',
            format: 'bulleted',
            required: true,
            examples: [
              'Primary focus: Hero headline and CTA button',
              'Secondary elements: Feature benefits and testimonials',
              'Supporting content: Footer links and legal information'
            ]
          },
          {
            name: 'UX PATTERNS',
            description: 'Identification of design patterns, conventions, and usability elements',
            format: 'bulleted',
            required: true,
            examples: [
              'Progressive disclosure in feature explanations',
              'Social proof placement near conversion points',
              'Consistent button styling and interaction feedback'
            ]
          },
          {
            name: 'MOBILE EXPERIENCE',
            description: 'Responsive design and mobile-specific considerations',
            format: 'bulleted',
            required: true,
            examples: [
              'Touch-friendly button sizes (minimum 44px)',
              'Readable text without zooming',
              'Simplified navigation for mobile screens'
            ]
          },
          {
            name: 'IMPROVEMENT RECOMMENDATIONS',
            description: 'Specific, prioritized recommendations for UX and conversion optimization',
            format: 'structured',
            required: true,
            examples: [
              'HIGH: Reduce signup form from 8 to 3 fields (increase conversion by ~40%)',
              'MEDIUM: Add exit-intent popup for abandoning users',
              'LOW: Improve mobile button sizing for better touch targets'
            ]
          }
        ],
        scoringSystem: {
          scale: '1-10 for each section',
          criteria: ['Clarity', 'Usability', 'Conversion Optimization', 'Mobile Experience'],
          aggregation: 'average'
        },
        recommendationFormat: 'Priority level (HIGH/MEDIUM/LOW) with specific action and expected impact',
        exampleFormat: 'Bulleted lists with specific examples and quantitative assessments where possible'
      },
      sampleInputs: this.createWireframeFlowSamples(),
      expectedOutputs: this.createWireframeFlowExpectedOutputs(),
      validationCriteria: {
        requiredSections: ['USER FLOW ANALYSIS', 'NAVIGATION STRUCTURE', 'CONVERSION FUNNEL', 'IMPROVEMENT RECOMMENDATIONS'],
        scoringRequired: true,
        recommendationsRequired: true,
        minimumWordCount: 300,
        qualityChecks: [
          'Contains specific examples from analyzed content',
          'Includes quantitative assessments where possible',
          'Provides actionable recommendations with priority levels',
          'Addresses both desktop and mobile experiences'
        ]
      },
      useCases: [
        'E-commerce product page optimization',
        'SaaS landing page conversion improvement',
        'Lead generation page analysis',
        'Mobile app landing page evaluation',
        'B2B service page assessment'
      ],
      bestPractices: [
        'Focus on user journey mapping from entry to conversion',
        'Identify specific friction points with quantitative impact estimates',
        'Provide mobile-first recommendations',
        'Include competitive benchmarking where relevant'
      ]
    };
  }

  /**
   * Build specification for analyze_copywriting_score pattern
   */
  buildAnalyzeCopywritingScoreSpec(): PatternSpecification {
    return {
      name: 'analyze_copywriting_score',
      category: 'Copywriting Analysis',
      description: 'Evaluates messaging effectiveness, clarity, persuasion techniques, and conversion optimization elements in landing page copy with numerical scoring.',
      domain: 'Copywriting and Conversion Optimization',
      expertise: 'copywriter and conversion optimization specialist',
      analysisFramework: 'Persuasion psychology principles with conversion copywriting best practices',
      inputTypes: ['landing page copy', 'website content', 'marketing materials', 'sales pages'],
      outputStructure: {
        sections: [
          {
            name: 'HEADLINE ANALYSIS',
            description: 'Evaluation of headline effectiveness, value proposition clarity, and impact',
            format: 'structured',
            required: true,
            examples: [
              'Primary headline: "Double Your Sales in 30 Days or Your Money Back"',
              'Strengths: Specific benefit, timeframe, risk reversal',
              'Weaknesses: May seem too good to be true for some audiences',
              'Alternative: "Increase Sales by 50-200% in Your First Month"'
            ]
          },
          {
            name: 'PERSUASION TECHNIQUES',
            description: 'Analysis of psychological triggers and influence methods used',
            format: 'structured',
            required: true,
            examples: [
              'Scarcity: "Limited time offer - 48 hours remaining"',
              'Authority: "Used by 10,000+ businesses worldwide"',
              'Social proof: Customer logos and testimonials',
              'Risk reversal: 30-day money-back guarantee'
            ]
          },
          {
            name: 'MESSAGE CLARITY',
            description: 'Assessment of readability, comprehension, and communication effectiveness',
            format: 'structured',
            required: true,
            examples: [
              'Reading level: 8th grade (appropriate for broad audience)',
              'Jargon usage: Minimal technical terms',
              'Sentence structure: Mix of short and medium sentences',
              'Improvement: Simplify feature descriptions'
            ]
          },
          {
            name: 'EMOTIONAL TRIGGERS',
            description: 'Identification of emotional appeals, urgency, and motivation elements',
            format: 'bulleted',
            required: true,
            examples: [
              'Fear of missing out (FOMO) through limited-time offers',
              'Aspiration through success stories and testimonials',
              'Security through guarantees and risk reversal'
            ]
          },
          {
            name: 'SOCIAL PROOF',
            description: 'Analysis of testimonials, reviews, and credibility indicators',
            format: 'structured',
            required: true,
            examples: [
              'Customer testimonials: 3 specific success stories with names and results',
              'Company logos: 12 recognizable brand logos displayed',
              'Statistics: "10,000+ satisfied customers" with verification'
            ]
          },
          {
            name: 'CALL-TO-ACTION ANALYSIS',
            description: 'Evaluation of CTA effectiveness, placement, and optimization',
            format: 'structured',
            required: true,
            examples: [
              'Primary CTA: "Start Your Free Trial" (action-oriented, benefit-focused)',
              'Placement: Above fold, repeated 3 times throughout page',
              'Design: High contrast button with urgency indicator',
              'Improvement: Test "Get Instant Access" for higher urgency'
            ]
          },
          {
            name: 'COPYWRITING SCORE',
            description: 'Overall effectiveness rating with detailed breakdown',
            format: 'structured',
            required: true,
            examples: [
              'Overall Score: 82/100',
              'Headline: 9/10',
              'Value proposition: 8/10',
              'Features/benefits: 7/10',
              'Social proof: 9/10',
              'Call-to-action: 8/10'
            ]
          },
          {
            name: 'OPTIMIZATION RECOMMENDATIONS',
            description: 'Specific copy improvements with expected conversion impact',
            format: 'structured',
            required: true,
            examples: [
              'HIGH IMPACT: Test headline variation emphasizing guarantee',
              'MEDIUM IMPACT: Add specific customer success metrics',
              'LOW IMPACT: Improve feature bullet point formatting'
            ]
          }
        ],
        scoringSystem: {
          scale: '1-10 for each section, 0-100 overall',
          criteria: ['Clarity', 'Persuasiveness', 'Emotional Appeal', 'Conversion Focus'],
          aggregation: 'weighted'
        },
        recommendationFormat: 'Impact level (HIGH/MEDIUM/LOW) with specific copy suggestions and A/B test recommendations',
        exampleFormat: 'Structured analysis with specific quotes and alternative copy suggestions'
      },
      sampleInputs: this.createCopywritingScoreSamples(),
      expectedOutputs: this.createCopywritingScoreExpectedOutputs(),
      validationCriteria: {
        requiredSections: ['HEADLINE ANALYSIS', 'PERSUASION TECHNIQUES', 'COPYWRITING SCORE', 'OPTIMIZATION RECOMMENDATIONS'],
        scoringRequired: true,
        recommendationsRequired: true,
        minimumWordCount: 400,
        qualityChecks: [
          'Includes specific quotes from analyzed copy',
          'Provides numerical scores for all sections',
          'Suggests alternative copy variations',
          'Prioritizes recommendations by conversion impact'
        ]
      },
      useCases: [
        'SaaS landing page copy optimization',
        'E-commerce product description analysis',
        'B2B service page copy evaluation',
        'Email marketing campaign analysis',
        'Sales page conversion optimization'
      ],
      bestPractices: [
        'Quote specific copy examples in analysis',
        'Provide alternative copy suggestions for key elements',
        'Focus on conversion impact rather than general writing quality',
        'Include A/B testing recommendations for improvements'
      ]
    };
  }

  /**
   * Build specification for create_storybrand_variant pattern
   */
  buildCreateStorybrandVariantSpec(): PatternSpecification {
    return {
      name: 'create_storybrand_variant',
      category: 'StoryBrand Framework Analysis',
      description: 'Analyzes and optimizes landing pages using the StoryBrand SB7 framework specifically for conversion-focused landing page structure and elements.',
      domain: 'StoryBrand Marketing Framework',
      expertise: 'StoryBrand SB7 landing page conversion specialist',
      analysisFramework: 'StoryBrand SB7 Landing Page Framework with conversion optimization focus',
      inputTypes: ['landing page content', 'marketing materials', 'website copy', 'sales pages'],
      outputStructure: {
        sections: [
          {
            name: 'HEADER ANALYSIS',
            description: 'Evaluation of logo, CTA, captivating message, and value stack effectiveness',
            format: 'structured',
            required: true,
            examples: [
              'Logo placement: Top left, appropriate size and visibility',
              'Primary CTA: "Get Started" button - prominent, action-oriented',
              'Captivating message: "Transform Your Business in 90 Days"',
              'Value stack: Clear benefit hierarchy with supporting points'
            ]
          },
          {
            name: 'STAKES EVALUATION',
            description: 'Analysis of what customers lose without the solution (failure stakes)',
            format: 'structured',
            required: true,
            examples: [
              'Current problem: "Losing $10K monthly to inefficient processes"',
              'Consequences: "Competitors gaining market share while you struggle"',
              'Urgency: "Every day of delay costs your business money"',
              'Emotional stakes: "Stress and uncertainty about business future"'
            ]
          },
          {
            name: 'VALUE PROPOSITION',
            description: 'Assessment of benefit reinforcement and customer need alignment',
            format: 'structured',
            required: true,
            examples: [
              'Primary benefit: "Streamline operations and increase revenue"',
              'Supporting benefits: "Save 20 hours/week, reduce costs by 30%"',
              'Customer alignment: Addresses specific pain points mentioned',
              'Clarity: Benefits clearly stated and quantified'
            ]
          },
          {
            name: 'GUIDE CREDIBILITY',
            description: 'Analysis of trust building through testimonials, awards, and certifications',
            format: 'structured',
            required: true,
            examples: [
              'Authority indicators: "15 years helping 500+ businesses"',
              'Empathy statements: "We understand the sleepless nights"',
              'Credentials: Industry certifications and case studies',
              'Social proof: Customer testimonials and success stories'
            ]
          },
          {
            name: 'PRICING PACKAGE / PLAN CLARITY',
            description: 'Evaluation of simple three-step engagement process',
            format: 'structured',
            required: true,
            examples: [
              'Step 1: "Free financial assessment" (low commitment)',
              'Step 2: "Custom cash flow strategy" (value demonstration)',
              'Step 3: "Implementation and monitoring" (ongoing support)',
              'Clarity: Each step clearly explained with expected outcomes'
            ]
          },
          {
            name: 'OBJECTION HANDLING',
            description: 'Analysis of explanatory content and concern addressing',
            format: 'bulleted',
            required: true,
            examples: [
              'Price objection: "ROI typically pays for itself in 60 days"',
              'Time objection: "Implementation takes just 2 weeks"',
              'Trust objection: "30-day money-back guarantee"',
              'Complexity objection: "Our team handles all technical setup"'
            ]
          },
          {
            name: 'LEAD GENERATOR',
            description: 'Assessment of value offering and reciprocity creation',
            format: 'structured',
            required: true,
            examples: [
              'Lead magnet: "Free Business Efficiency Audit ($500 value)"',
              'Value perception: Clear benefit and monetary value stated',
              'Reciprocity: Provides immediate value before asking for commitment',
              'Relevance: Directly related to main service offering'
            ]
          },
          {
            name: 'CONVERSION OPTIMIZATION',
            description: 'Overall SB7 structure adherence and conversion recommendations',
            format: 'structured',
            required: true,
            examples: [
              'SB7 compliance: 85% - most elements present and effective',
              'Missing elements: Stronger failure stakes needed',
              'Optimization opportunities: Enhance guide empathy statements',
              'Conversion flow: Clear path from awareness to action'
            ]
          },
          {
            name: 'SB7 SCORE',
            description: 'Landing page conversion optimization rating using SB7 framework',
            format: 'structured',
            required: true,
            examples: [
              'Overall SB7 Score: 74/100',
              'Header effectiveness: 8/10',
              'Stakes clarity: 6/10',
              'Value proposition: 8/10',
              'Guide credibility: 9/10',
              'Plan simplicity: 7/10'
            ]
          }
        ],
        scoringSystem: {
          scale: '1-10 for each SB7 element, 0-100 overall',
          criteria: ['SB7 Compliance', 'Conversion Focus', 'Message Clarity', 'Trust Building'],
          aggregation: 'weighted'
        },
        recommendationFormat: 'SB7 framework improvements with conversion impact focus',
        exampleFormat: 'StoryBrand element analysis with specific landing page optimization suggestions'
      },
      sampleInputs: this.createStorybrandVariantSamples(),
      expectedOutputs: this.createStorybrandVariantExpectedOutputs(),
      validationCriteria: {
        requiredSections: ['HEADER ANALYSIS', 'STAKES EVALUATION', 'GUIDE CREDIBILITY', 'SB7 SCORE'],
        scoringRequired: true,
        recommendationsRequired: true,
        minimumWordCount: 350,
        qualityChecks: [
          'Focuses on conversion elements rather than general storytelling',
          'Rates each SB7 landing page element on effectiveness',
          'Provides specific optimization recommendations',
          'Includes before/after examples for improvements'
        ]
      },
      useCases: [
        'Business consulting landing page optimization',
        'Professional services page analysis',
        'SaaS product landing page evaluation',
        'E-commerce brand story optimization',
        'Non-profit donation page analysis'
      ],
      bestPractices: [
        'Focus on landing page conversion elements, not general storytelling',
        'Emphasize the SB7 landing page structure specifically',
        'Provide concrete examples of missing or weak elements',
        'Prioritize recommendations by conversion impact potential'
      ]
    };
  }

  /**
   * Build specification for create_competitive_audit pattern
   */
  buildCreateCompetitiveAuditSpec(): PatternSpecification {
    return {
      name: 'create_competitive_audit',
      category: 'Competitive Intelligence',
      description: 'Conducts SWOT-style competitive analysis and identifies improvement opportunities through comprehensive market positioning assessment.',
      domain: 'Competitive Intelligence and Strategic Marketing',
      expertise: 'competitive intelligence analyst and strategic marketing consultant',
      analysisFramework: 'SWOT Analysis with competitive positioning and market opportunity assessment',
      inputTypes: ['competitor landing pages', 'market research data', 'industry websites', 'product comparisons'],
      outputStructure: {
        sections: [
          {
            name: 'COMPETITIVE POSITIONING',
            description: 'Analysis of market position and differentiation strategy',
            format: 'structured',
            required: true,
            examples: [
              'Market position: "Premium automation solution for mid-market"',
              'Key differentiator: "No-code implementation in 24 hours"',
              'Positioning strength: Clear target market focus',
              'Positioning weakness: Premium pricing may limit market size'
            ]
          },
          {
            name: 'STRENGTHS ANALYSIS',
            description: 'Identification of competitive advantages and strong points',
            format: 'bulleted',
            required: true,
            examples: [
              'Rapid implementation (24 hours vs industry 2-4 weeks)',
              'Strong customer support (24/7 chat, 98% satisfaction)',
              'Proven ROI metrics (average 300% ROI in 6 months)',
              'Industry partnerships and integrations'
            ]
          },
          {
            name: 'WEAKNESSES ASSESSMENT',
            description: 'Analysis of vulnerability areas and improvement needs',
            format: 'bulleted',
            required: true,
            examples: [
              'Higher price point than competitors (30-50% premium)',
              'Limited customization options for enterprise clients',
              'Newer brand with less market recognition',
              'Smaller feature set compared to established players'
            ]
          },
          {
            name: 'OPPORTUNITIES IDENTIFICATION',
            description: 'Market gaps and growth potential analysis',
            format: 'bulleted',
            required: true,
            examples: [
              'Growing mid-market segment (25% annual growth)',
              'Increasing demand for no-code solutions',
              'Potential for industry-specific versions',
              'Partnership opportunities with consultants'
            ]
          },
          {
            name: 'THREATS EVALUATION',
            description: 'Competitive risks and market challenges assessment',
            format: 'bulleted',
            required: true,
            examples: [
              'Large competitors adding no-code features',
              'Economic downturn affecting mid-market spending',
              'New entrants with lower pricing models',
              'Technology changes requiring platform updates'
            ]
          },
          {
            name: 'INDUSTRY BENCHMARKING',
            description: 'Comparison to market standards and best practices',
            format: 'structured',
            required: true,
            examples: [
              'Implementation time: 24 hours (Industry avg: 2-4 weeks) - ADVANTAGE',
              'Pricing: $500/month (Industry avg: $350/month) - PREMIUM',
              'Feature count: 25 features (Industry avg: 40 features) - BELOW',
              'Customer satisfaction: 98% (Industry avg: 85%) - ADVANTAGE'
            ]
          },
          {
            name: 'STRATEGIC RECOMMENDATIONS',
            description: 'Actionable competitive improvements prioritized by impact',
            format: 'structured',
            required: true,
            examples: [
              'HIGH PRIORITY: Develop entry-level pricing tier for market expansion',
              'MEDIUM PRIORITY: Create industry-specific solution variants',
              'LOW PRIORITY: Enhance customization capabilities for enterprise'
            ]
          },
          {
            name: 'COMPETITIVE SCORE',
            description: 'Overall competitive strength rating with breakdown',
            format: 'structured',
            required: true,
            examples: [
              'Overall Competitive Score: 73/100',
              'Market positioning: 7/10',
              'Competitive advantages: 8/10',
              'Market opportunity: 8/10',
              'Competitive moat: 6/10',
              'Execution capability: 7/10'
            ]
          }
        ],
        scoringSystem: {
          scale: '1-10 for each competitive area, 0-100 overall',
          criteria: ['Market Position', 'Competitive Advantage', 'Growth Opportunity', 'Threat Mitigation'],
          aggregation: 'weighted'
        },
        recommendationFormat: 'Priority level (HIGH/MEDIUM/LOW) with strategic actions and expected business impact',
        exampleFormat: 'SWOT framework with specific examples, benchmarking data, and strategic recommendations'
      },
      sampleInputs: this.createCompetitiveAuditSamples(),
      expectedOutputs: this.createCompetitiveAuditExpectedOutputs(),
      validationCriteria: {
        requiredSections: ['COMPETITIVE POSITIONING', 'STRENGTHS ANALYSIS', 'WEAKNESSES ASSESSMENT', 'OPPORTUNITIES IDENTIFICATION', 'THREATS EVALUATION', 'STRATEGIC RECOMMENDATIONS'],
        scoringRequired: true,
        recommendationsRequired: true,
        minimumWordCount: 400,
        qualityChecks: [
          'Uses SWOT framework structure for analysis',
          'Includes specific examples and evidence for each point',
          'Provides benchmarking data where possible',
          'Prioritizes recommendations by impact and feasibility'
        ]
      },
      useCases: [
        'SaaS competitive positioning analysis',
        'E-commerce market opportunity assessment',
        'B2B service differentiation strategy',
        'Startup competitive landscape evaluation',
        'Product launch competitive intelligence'
      ],
      bestPractices: [
        'Include quantitative benchmarking data where available',
        'Focus on actionable strategic recommendations',
        'Provide specific evidence for strengths and weaknesses',
        'Consider both direct and indirect competitors'
      ]
    };
  }

  /**
   * Get all landing page pattern specifications
   */
  getAllLandingPageSpecs(): Record<string, PatternSpecification> {
    return {
      'analyze_wireframe_flow': this.buildAnalyzeWireframeFlowSpec(),
      'analyze_copywriting_score': this.buildAnalyzeCopywritingScoreSpec(),
      'create_storybrand_variant': this.buildCreateStorybrandVariantSpec(),
      'create_competitive_audit': this.buildCreateCompetitiveAuditSpec()
    };
  }

  /**
   * Get specification for a specific pattern
   */
  getPatternSpec(patternName: string): PatternSpecification | null {
    const specs = this.getAllLandingPageSpecs();
    return specs[patternName] || null;
  }

  // Sample input creation methods
  private createWireframeFlowSamples(): SampleInput[] {
    return [
      {
        name: 'E-commerce Product Page',
        description: 'Online store product landing page with add-to-cart flow',
        contentType: 'product page',
        complexity: 'medium',
        content: 'Product showcase page with hero image, product details, customer reviews, related products, and prominent add-to-cart button. Navigation includes categories, search, and user account access.',
        expectedInsights: ['Clear product-to-cart flow', 'Review social proof placement', 'Related product cross-selling', 'Mobile checkout optimization']
      },
      {
        name: 'SaaS Signup Page',
        description: 'Software service landing page with trial signup process',
        contentType: 'signup page',
        complexity: 'medium',
        content: 'SaaS landing page with value proposition, feature highlights, pricing tiers, customer testimonials, and free trial signup form. Multi-step onboarding process.',
        expectedInsights: ['Trial signup friction analysis', 'Feature presentation effectiveness', 'Pricing clarity', 'Onboarding flow optimization']
      },
      {
        name: 'Lead Generation Page',
        description: 'B2B service page with contact form conversion',
        contentType: 'lead generation',
        complexity: 'simple',
        content: 'Professional services landing page with service overview, case studies, team credentials, and contact form. Clear value proposition and trust indicators.',
        expectedInsights: ['Contact form optimization', 'Trust signal placement', 'Service clarity', 'Professional credibility']
      },
      {
        name: 'Content Marketing Page',
        description: 'Blog/resource page with newsletter signup',
        contentType: 'content page',
        complexity: 'simple',
        content: 'Content hub with blog articles, downloadable resources, newsletter signup, and related content recommendations. Focus on engagement and lead capture.',
        expectedInsights: ['Content engagement flow', 'Newsletter signup placement', 'Resource accessibility', 'Content discovery']
      },
      {
        name: 'Mobile App Landing Page',
        description: 'App download page with app store redirects',
        contentType: 'app landing',
        complexity: 'medium',
        content: 'Mobile app promotion page with app screenshots, feature highlights, user testimonials, and app store download buttons. Mobile-optimized design.',
        expectedInsights: ['App store conversion flow', 'Feature demonstration', 'Mobile optimization', 'Download friction reduction']
      }
    ];
  }

  private createWireframeFlowExpectedOutputs(): ExpectedOutput[] {
    return [
      {
        inputName: 'E-commerce Product Page',
        sections: {
          'USER FLOW ANALYSIS': 'Product discovery → Product details → Add to cart → Checkout initiation',
          'NAVIGATION STRUCTURE': 'Primary: Categories, Search, Cart. Secondary: Breadcrumbs, Filters',
          'CONVERSION FUNNEL': 'Product interest → Feature evaluation → Purchase decision → Cart action',
          'IMPROVEMENT RECOMMENDATIONS': 'HIGH: Optimize mobile cart button placement. MEDIUM: Add product comparison feature'
        },
        overallScore: 78,
        keyRecommendations: ['Improve mobile cart accessibility', 'Add product comparison tool', 'Enhance review visibility']
      }
    ];
  }

  private createCopywritingScoreSamples(): SampleInput[] {
    return [
      {
        name: 'High-Converting SaaS Page',
        description: 'Proven landing page with strong conversion metrics',
        contentType: 'SaaS landing',
        complexity: 'medium',
        content: 'SaaS landing page with compelling headline, clear value proposition, feature benefits, customer testimonials, pricing transparency, and strong call-to-action. Proven 15% conversion rate.',
        expectedInsights: ['Headline effectiveness analysis', 'Value proposition clarity', 'Social proof utilization', 'CTA optimization']
      },
      {
        name: 'E-commerce Sales Page',
        description: 'Product page with promotional copy and urgency elements',
        contentType: 'sales page',
        complexity: 'complex',
        content: 'E-commerce promotional page with limited-time offer, product benefits, customer reviews, urgency indicators, and multiple purchase options. Heavy use of persuasion techniques.',
        expectedInsights: ['Urgency technique effectiveness', 'Benefit vs feature balance', 'Review credibility', 'Purchase option clarity']
      }
    ];
  }

  private createCopywritingScoreExpectedOutputs(): ExpectedOutput[] {
    return [
      {
        inputName: 'High-Converting SaaS Page',
        sections: {
          'HEADLINE ANALYSIS': 'Score: 9/10. Strong value proposition with specific benefit and timeframe',
          'PERSUASION TECHNIQUES': 'Score: 8/10. Effective use of social proof and risk reversal',
          'COPYWRITING SCORE': 'Overall: 85/100. Strong performance across all elements',
          'OPTIMIZATION RECOMMENDATIONS': 'HIGH: Test urgency variation in headline. MEDIUM: Add specific ROI metrics'
        },
        overallScore: 85,
        keyRecommendations: ['Test headline urgency', 'Add ROI specifics', 'Enhance social proof']
      }
    ];
  }

  private createStorybrandVariantSamples(): SampleInput[] {
    return [
      {
        name: 'Fitness App Landing Page',
        description: 'Personal transformation and health improvement focus',
        contentType: 'fitness app',
        complexity: 'medium',
        content: 'Fitness app landing page positioning user as hero seeking health transformation, with app as guide providing workout plans and nutrition guidance to achieve fitness goals.',
        expectedInsights: ['Hero identification clarity', 'Problem definition strength', 'Guide authority establishment', 'Success visualization']
      }
    ];
  }

  private createStorybrandVariantExpectedOutputs(): ExpectedOutput[] {
    return [
      {
        inputName: 'Fitness App Landing Page',
        sections: {
          'HEADER ANALYSIS': 'Score: 8/10. Clear value proposition with strong CTA placement',
          'STAKES EVALUATION': 'Score: 7/10. Good problem identification, could strengthen consequences',
          'SB7 SCORE': 'Overall: 76/100. Strong guide positioning, needs better stakes definition',
          'CONVERSION OPTIMIZATION': 'Focus on landing page conversion elements rather than storytelling'
        },
        overallScore: 76,
        keyRecommendations: ['Strengthen failure stakes', 'Enhance guide empathy', 'Simplify plan steps']
      }
    ];
  }

  private createCompetitiveAuditSamples(): SampleInput[] {
    return [
      {
        name: 'SaaS Productivity Tool',
        description: 'Competitive software market with established players',
        contentType: 'SaaS platform',
        complexity: 'complex',
        content: 'Mid-market productivity software competing against established players like Asana and Monday.com. Focuses on no-code automation and rapid implementation.',
        expectedInsights: ['Market positioning analysis', 'Feature differentiation', 'Pricing strategy evaluation', 'Competitive moat assessment']
      }
    ];
  }

  private createCompetitiveAuditExpectedOutputs(): ExpectedOutput[] {
    return [
      {
        inputName: 'SaaS Productivity Tool',
        sections: {
          'COMPETITIVE POSITIONING': 'Score: 7/10. Clear mid-market focus with no-code differentiation',
          'STRENGTHS ANALYSIS': 'Rapid implementation, strong support, proven ROI metrics',
          'COMPETITIVE SCORE': 'Overall: 73/100. Strong positioning with growth opportunities',
          'STRATEGIC RECOMMENDATIONS': 'HIGH: Develop entry-level pricing. MEDIUM: Industry-specific versions'
        },
        overallScore: 73,
        keyRecommendations: ['Entry-level pricing tier', 'Industry specialization', 'Enterprise customization']
      }
    ];
  }
}