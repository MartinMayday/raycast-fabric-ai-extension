import { SampleInput, ExpectedOutput, PatternSpecification } from './SpecificationBuilder';

export interface SampleCollection {
  patternName: string;
  samples: EnhancedSampleInput[];
  expectedOutputs: DetailedExpectedOutput[];
  testScenarios: TestScenario[];
  validationSamples: ValidationSample[];
}

export interface EnhancedSampleInput extends SampleInput {
  id: string;
  category: string;
  industry: string;
  targetAudience: string;
  conversionGoal: string;
  keyElements: string[];
  challenges: string[];
  fullContent: string;
  metadata: SampleMetadata;
}

export interface DetailedExpectedOutput extends ExpectedOutput {
  id: string;
  sampleId: string;
  analysisDepth: 'basic' | 'detailed' | 'comprehensive';
  sections: Record<string, DetailedSection>;
  qualityMetrics: QualityMetrics;
  improvementAreas: ImprovementArea[];
}

export interface DetailedSection {
  content: string;
  score?: number;
  examples: string[];
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
}

export interface TestScenario {
  id: string;
  name: string;
  description: string;
  testType: 'edge_case' | 'minimal_content' | 'comprehensive' | 'error_handling';
  input: string;
  expectedBehavior: string;
  validationCriteria: string[];
}

export interface ValidationSample {
  id: string;
  name: string;
  input: string;
  expectedQuality: 'high' | 'medium' | 'low';
  commonIssues: string[];
  passingCriteria: string[];
}

export interface SampleMetadata {
  createdDate: string;
  lastUpdated: string;
  version: string;
  tags: string[];
  difficulty: number; // 1-10 scale
  estimatedAnalysisTime: number; // minutes
}

export interface QualityMetrics {
  overallScore: number;
  sectionScores: Record<string, number>;
  completeness: number;
  actionability: number;
  specificity: number;
}

export interface ImprovementArea {
  area: string;
  priority: 'high' | 'medium' | 'low';
  description: string;
  expectedImpact: string;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
}

export class SampleCollectionGenerator {
  /**
   * Generate comprehensive sample collection for a specific pattern
   */
  generateSampleCollection(specification: PatternSpecification): SampleCollection {
    const samples = this.generateEnhancedSamples(specification);
    const expectedOutputs = this.generateDetailedExpectedOutputs(specification, samples);
    const testScenarios = this.generateTestScenarios(specification);
    const validationSamples = this.generateValidationSamples(specification);

    return {
      patternName: specification.name,
      samples,
      expectedOutputs,
      testScenarios,
      validationSamples
    };
  }

  /**
   * Generate sample collections for all landing page patterns
   */
  generateAllLandingPageCollections(): Record<string, SampleCollection> {
    const collections: Record<string, SampleCollection> = {};
    
    // Generate collections for each pattern type
    const patternTypes = [
      'analyze_wireframe_flow',
      'analyze_copywriting_score',
      'create_storybrand_variant',
      'create_competitive_audit'
    ];

    patternTypes.forEach(patternType => {
      const specification = this.getPatternSpecification(patternType);
      if (specification) {
        collections[patternType] = this.generateSampleCollection(specification);
      }
    });

    return collections;
  }

  /**
   * Generate enhanced sample inputs with comprehensive metadata
   */
  private generateEnhancedSamples(specification: PatternSpecification): EnhancedSampleInput[] {
    const baseSamples = specification.sampleInputs;
    const enhancedSamples: EnhancedSampleInput[] = [];

    baseSamples.forEach((sample, index) => {
      const enhanced = this.enhanceSampleInput(sample, specification, index);
      enhancedSamples.push(enhanced);
    });

    // Add additional samples for comprehensive coverage
    const additionalSamples = this.generateAdditionalSamples(specification);
    enhancedSamples.push(...additionalSamples);

    return enhancedSamples;
  }

  /**
   * Enhance a basic sample input with detailed metadata and content
   */
  private enhanceSampleInput(
    sample: SampleInput, 
    specification: PatternSpecification, 
    index: number
  ): EnhancedSampleInput {
    const patternType = specification.name;
    
    return {
      ...sample,
      id: `${patternType}_sample_${index + 1}`,
      category: this.determineSampleCategory(sample.name),
      industry: this.determineIndustry(sample.name),
      targetAudience: this.determineTargetAudience(sample.name),
      conversionGoal: this.determineConversionGoal(sample.name),
      keyElements: this.extractKeyElements(sample.content, patternType),
      challenges: this.identifyCommonChallenges(sample.name, patternType),
      fullContent: this.generateFullContent(sample, patternType),
      metadata: {
        createdDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
        tags: this.generateTags(sample.name, patternType),
        difficulty: this.assessDifficulty(sample.complexity),
        estimatedAnalysisTime: this.estimateAnalysisTime(sample.complexity, patternType)
      }
    };
  }

  /**
   * Generate detailed expected outputs for each sample
   */
  private generateDetailedExpectedOutputs(
    specification: PatternSpecification, 
    samples: EnhancedSampleInput[]
  ): DetailedExpectedOutput[] {
    return samples.map(sample => this.generateDetailedExpectedOutput(sample, specification));
  }

  /**
   * Generate detailed expected output for a specific sample
   */
  private generateDetailedExpectedOutput(
    sample: EnhancedSampleInput, 
    specification: PatternSpecification
  ): DetailedExpectedOutput {
    const patternType = specification.name;
    const sections = this.generateDetailedSections(sample, specification);
    const qualityMetrics = this.calculateQualityMetrics(sections);
    const improvementAreas = this.identifyImprovementAreas(sample, patternType);

    return {
      id: `${sample.id}_output`,
      sampleId: sample.id,
      inputName: sample.name,
      analysisDepth: this.determineAnalysisDepth(sample.complexity),
      sections,
      overallScore: qualityMetrics.overallScore,
      keyRecommendations: this.generateKeyRecommendations(improvementAreas),
      qualityMetrics,
      improvementAreas
    };
  }

  /**
   * Generate comprehensive test scenarios for edge cases and validation
   */
  private generateTestScenarios(specification: PatternSpecification): TestScenario[] {
    const patternType = specification.name;
    const scenarios: TestScenario[] = [];

    // Edge case scenarios
    scenarios.push(...this.generateEdgeCaseScenarios(patternType));
    
    // Minimal content scenarios
    scenarios.push(...this.generateMinimalContentScenarios(patternType));
    
    // Comprehensive content scenarios
    scenarios.push(...this.generateComprehensiveScenarios(patternType));
    
    // Error handling scenarios
    scenarios.push(...this.generateErrorHandlingScenarios(patternType));

    return scenarios;
  }

  /**
   * Generate validation samples for quality assurance
   */
  private generateValidationSamples(specification: PatternSpecification): ValidationSample[] {
    const patternType = specification.name;
    
    return [
      this.generateHighQualitySample(patternType),
      this.generateMediumQualitySample(patternType),
      this.generateLowQualitySample(patternType),
      this.generateProblematicSample(patternType)
    ];
  }

  // Pattern-specific sample generation methods

  /**
   * Generate wireframe flow specific samples
   */
  private generateWireframeFlowSamples(): EnhancedSampleInput[] {
    return [
      {
        id: 'wireframe_ecommerce_complex',
        name: 'Complex E-commerce Checkout Flow',
        description: 'Multi-step e-commerce checkout with guest options, payment methods, and upsells',
        contentType: 'e-commerce checkout',
        complexity: 'complex',
        content: 'Complex checkout flow with multiple decision points and conversion opportunities',
        expectedInsights: ['Multi-step flow optimization', 'Guest checkout friction', 'Payment method clarity', 'Upsell placement'],
        category: 'E-commerce',
        industry: 'Retail',
        targetAudience: 'Online shoppers',
        conversionGoal: 'Complete purchase',
        keyElements: ['Product selection', 'Cart review', 'Shipping options', 'Payment processing', 'Order confirmation'],
        challenges: ['Cart abandonment', 'Payment friction', 'Mobile optimization', 'Trust indicators'],
        fullContent: this.generateEcommerceCheckoutContent(),
        metadata: {
          createdDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          version: '1.0.0',
          tags: ['ecommerce', 'checkout', 'conversion', 'mobile'],
          difficulty: 8,
          estimatedAnalysisTime: 15
        }
      }
    ];
  }

  /**
   * Generate copywriting score specific samples
   */
  private generateCopywritingScoreSamples(): EnhancedSampleInput[] {
    return [
      {
        id: 'copy_saas_high_converting',
        name: 'High-Converting SaaS Landing Page',
        description: 'Proven SaaS landing page with strong conversion metrics and persuasive copy',
        contentType: 'SaaS landing page',
        complexity: 'medium',
        content: 'High-performing SaaS page with compelling headlines and clear value propositions',
        expectedInsights: ['Headline effectiveness', 'Value proposition clarity', 'Social proof usage', 'CTA optimization'],
        category: 'SaaS',
        industry: 'Software',
        targetAudience: 'Business professionals',
        conversionGoal: 'Free trial signup',
        keyElements: ['Compelling headline', 'Value proposition', 'Feature benefits', 'Social proof', 'Strong CTA'],
        challenges: ['Feature complexity', 'Pricing transparency', 'Trust building', 'Competitive differentiation'],
        fullContent: this.generateSaaSLandingPageContent(),
        metadata: {
          createdDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          version: '1.0.0',
          tags: ['saas', 'conversion', 'b2b', 'trial'],
          difficulty: 6,
          estimatedAnalysisTime: 12
        }
      }
    ];
  }

  // Content generation methods

  private generateEcommerceCheckoutContent(): string {
    return `
# E-commerce Checkout Flow Analysis

## Page Structure
- Header: Logo, search, cart icon (3 items), account login
- Breadcrumb: Home > Category > Product > Cart > Checkout
- Progress indicator: Cart → Shipping → Payment → Confirmation (currently on Shipping)

## Main Content Areas
### Cart Summary (Right Sidebar)
- 3 items with thumbnails, names, quantities, prices
- Subtotal: $247.99
- Shipping: $12.99
- Tax: $20.80
- Total: $281.78
- Promo code field with "Apply" button

### Shipping Information (Main Content)
- Guest checkout option vs. account creation
- Shipping address form (8 fields)
- Shipping method selection (3 options: Standard $12.99, Express $24.99, Overnight $39.99)
- Delivery date estimates for each option

### Trust Indicators
- SSL certificate badge
- "Secure checkout" messaging
- Return policy link
- Customer service phone number

## Navigation Elements
- "Continue Shopping" link
- "Back to Cart" button
- "Continue to Payment" primary CTA button
- Footer with policies and contact info

## Mobile Considerations
- Single column layout on mobile
- Sticky cart summary
- Touch-friendly form fields
- Simplified shipping options display
    `;
  }

  private generateSaaSLandingPageContent(): string {
    return `
# SaaS Landing Page Copy Analysis

## Header Section
**Headline:** "Automate Your Business Processes in 24 Hours or Less"
**Subheadline:** "Join 10,000+ businesses using our no-code automation platform to save 20+ hours per week and increase productivity by 300%"
**Primary CTA:** "Start Free 14-Day Trial"
**Secondary CTA:** "Watch 2-Min Demo"

## Value Proposition Section
**Main Benefit:** "Transform manual workflows into automated processes without writing a single line of code"
**Supporting Points:**
- "Set up in minutes, not months"
- "No technical expertise required"
- "Integrates with 500+ popular tools"
- "24/7 customer support included"

## Social Proof Section
**Customer Logos:** Microsoft, Shopify, Slack, HubSpot, Zoom (12 total)
**Testimonial:** "We saved 25 hours per week and increased our team's productivity by 400% in just 30 days" - Sarah Johnson, Operations Manager at TechCorp
**Statistics:** "10,000+ businesses automated • 2M+ workflows created • 99.9% uptime"

## Features Section
**Feature 1:** "Drag & Drop Workflow Builder"
- "Create complex automations with our visual builder"
- "No coding required - if you can use PowerPoint, you can use our platform"

**Feature 2:** "Smart Integrations"
- "Connect your favorite tools in seconds"
- "Pre-built templates for common workflows"

**Feature 3:** "Real-time Analytics"
- "Track performance and ROI of your automations"
- "Detailed reports and insights dashboard"

## Pricing Section
**Free Plan:** "Get started free - No credit card required"
**Pro Plan:** "$49/month - Everything in Free plus advanced features"
**Enterprise:** "Custom pricing for large teams"
**Money-back guarantee:** "30-day money-back guarantee"

## Final CTA Section
**Headline:** "Ready to Automate Your Business?"
**Subtext:** "Join thousands of businesses already saving time with our platform"
**CTA Button:** "Start Your Free Trial Today"
**Risk Reversal:** "No setup fees • Cancel anytime • 30-day guarantee"
    `;
  }

  // Helper methods for sample enhancement

  private determineSampleCategory(sampleName: string): string {
    if (sampleName.toLowerCase().includes('ecommerce') || sampleName.toLowerCase().includes('product')) return 'E-commerce';
    if (sampleName.toLowerCase().includes('saas') || sampleName.toLowerCase().includes('software')) return 'SaaS';
    if (sampleName.toLowerCase().includes('b2b') || sampleName.toLowerCase().includes('business')) return 'B2B Services';
    if (sampleName.toLowerCase().includes('app') || sampleName.toLowerCase().includes('mobile')) return 'Mobile App';
    return 'General';
  }

  private determineIndustry(sampleName: string): string {
    if (sampleName.toLowerCase().includes('fitness') || sampleName.toLowerCase().includes('health')) return 'Health & Fitness';
    if (sampleName.toLowerCase().includes('finance') || sampleName.toLowerCase().includes('financial')) return 'Financial Services';
    if (sampleName.toLowerCase().includes('education') || sampleName.toLowerCase().includes('learning')) return 'Education';
    if (sampleName.toLowerCase().includes('consulting')) return 'Professional Services';
    return 'Technology';
  }

  private determineTargetAudience(sampleName: string): string {
    if (sampleName.toLowerCase().includes('b2b') || sampleName.toLowerCase().includes('business')) return 'Business professionals';
    if (sampleName.toLowerCase().includes('consumer') || sampleName.toLowerCase().includes('ecommerce')) return 'General consumers';
    if (sampleName.toLowerCase().includes('enterprise')) return 'Enterprise decision makers';
    return 'Small business owners';
  }

  private determineConversionGoal(sampleName: string): string {
    if (sampleName.toLowerCase().includes('signup') || sampleName.toLowerCase().includes('trial')) return 'Free trial signup';
    if (sampleName.toLowerCase().includes('purchase') || sampleName.toLowerCase().includes('buy')) return 'Complete purchase';
    if (sampleName.toLowerCase().includes('lead') || sampleName.toLowerCase().includes('contact')) return 'Lead generation';
    if (sampleName.toLowerCase().includes('download')) return 'App download';
    return 'Contact form submission';
  }

  private extractKeyElements(content: string, patternType: string): string[] {
    const baseElements = ['Header', 'Navigation', 'Main content', 'Call-to-action'];
    
    if (patternType === 'analyze_wireframe_flow') {
      return [...baseElements, 'User flow', 'Conversion funnel', 'Mobile layout'];
    } else if (patternType === 'analyze_copywriting_score') {
      return [...baseElements, 'Headlines', 'Value proposition', 'Social proof', 'Persuasion elements'];
    } else if (patternType === 'create_storybrand_variant') {
      return [...baseElements, 'Hero identification', 'Problem definition', 'Guide positioning', 'Success visualization'];
    } else if (patternType === 'create_competitive_audit') {
      return [...baseElements, 'Unique value proposition', 'Competitive advantages', 'Market positioning'];
    }
    
    return baseElements;
  }

  private identifyCommonChallenges(sampleName: string, patternType: string): string[] {
    const baseChallenges = ['Mobile optimization', 'Loading speed', 'Trust indicators'];
    
    if (sampleName.toLowerCase().includes('ecommerce')) {
      return [...baseChallenges, 'Cart abandonment', 'Payment friction', 'Product discovery'];
    } else if (sampleName.toLowerCase().includes('saas')) {
      return [...baseChallenges, 'Feature complexity', 'Pricing clarity', 'Trial conversion'];
    } else if (sampleName.toLowerCase().includes('b2b')) {
      return [...baseChallenges, 'Lead qualification', 'Decision maker targeting', 'ROI demonstration'];
    }
    
    return baseChallenges;
  }

  private generateFullContent(sample: SampleInput, patternType: string): string {
    // This would generate comprehensive content based on the sample type
    // For now, return the existing content with enhancement
    return `${sample.content}\n\n[Enhanced with detailed structural elements, user flow descriptions, and conversion optimization opportunities specific to ${patternType} analysis]`;
  }

  private generateTags(sampleName: string, patternType: string): string[] {
    const baseTags = [patternType.replace('_', '-')];
    
    if (sampleName.toLowerCase().includes('ecommerce')) baseTags.push('ecommerce', 'retail');
    if (sampleName.toLowerCase().includes('saas')) baseTags.push('saas', 'software');
    if (sampleName.toLowerCase().includes('mobile')) baseTags.push('mobile', 'responsive');
    if (sampleName.toLowerCase().includes('b2b')) baseTags.push('b2b', 'enterprise');
    
    return baseTags;
  }

  private assessDifficulty(complexity: 'simple' | 'medium' | 'complex'): number {
    switch (complexity) {
      case 'simple': return Math.floor(Math.random() * 3) + 1; // 1-3
      case 'medium': return Math.floor(Math.random() * 3) + 4; // 4-6
      case 'complex': return Math.floor(Math.random() * 3) + 7; // 7-9
      default: return 5;
    }
  }

  private estimateAnalysisTime(complexity: 'simple' | 'medium' | 'complex', patternType: string): number {
    const baseTime = {
      'simple': 8,
      'medium': 12,
      'complex': 18
    };
    
    const patternMultiplier = patternType === 'create_competitive_audit' ? 1.5 : 1.0;
    
    return Math.round(baseTime[complexity] * patternMultiplier);
  }

  private generateDetailedSections(
    sample: EnhancedSampleInput, 
    specification: PatternSpecification
  ): Record<string, DetailedSection> {
    const sections: Record<string, DetailedSection> = {};
    
    specification.outputStructure.sections.forEach(sectionSpec => {
      sections[sectionSpec.name] = {
        content: this.generateSectionContent(sectionSpec.name, sample, specification.name),
        score: this.generateSectionScore(sectionSpec.name, sample),
        examples: this.generateSectionExamples(sectionSpec.name, sample),
        recommendations: this.generateSectionRecommendations(sectionSpec.name, sample),
        priority: this.determineSectionPriority(sectionSpec.name, sample)
      };
    });
    
    return sections;
  }

  private generateSectionContent(sectionName: string, sample: EnhancedSampleInput, patternType: string): string {
    // Generate realistic section content based on the section name and sample
    return `Detailed analysis of ${sectionName.toLowerCase()} for ${sample.name}. [Generated content would include specific insights, observations, and analysis relevant to this section and sample type.]`;
  }

  private generateSectionScore(sectionName: string, sample: EnhancedSampleInput): number {
    // Generate realistic scores based on sample quality and section importance
    const baseScore = sample.metadata.difficulty <= 3 ? 8 : sample.metadata.difficulty <= 6 ? 7 : 6;
    const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
    return Math.max(1, Math.min(10, baseScore + variation));
  }

  private generateSectionExamples(sectionName: string, sample: EnhancedSampleInput): string[] {
    return [
      `Specific example from ${sample.name} related to ${sectionName.toLowerCase()}`,
      `Additional example demonstrating key point in ${sectionName.toLowerCase()}`
    ];
  }

  private generateSectionRecommendations(sectionName: string, sample: EnhancedSampleInput): string[] {
    return [
      `Improve ${sectionName.toLowerCase()} by addressing key friction points`,
      `Optimize ${sectionName.toLowerCase()} for better user experience`
    ];
  }

  private determineSectionPriority(sectionName: string, sample: EnhancedSampleInput): 'high' | 'medium' | 'low' {
    // Determine priority based on section importance and sample characteristics
    if (sectionName.includes('RECOMMENDATIONS') || sectionName.includes('SCORE')) return 'high';
    if (sectionName.includes('ANALYSIS') || sectionName.includes('EVALUATION')) return 'medium';
    return 'low';
  }

  private calculateQualityMetrics(sections: Record<string, DetailedSection>): QualityMetrics {
    const sectionScores: Record<string, number> = {};
    let totalScore = 0;
    let sectionCount = 0;

    Object.entries(sections).forEach(([name, section]) => {
      if (section.score) {
        sectionScores[name] = section.score;
        totalScore += section.score;
        sectionCount++;
      }
    });

    const overallScore = sectionCount > 0 ? Math.round((totalScore / sectionCount) * 10) : 70;

    return {
      overallScore,
      sectionScores,
      completeness: Math.min(100, sectionCount * 15), // Assume 7 sections for 100%
      actionability: Math.round(overallScore * 0.9), // Slightly lower than overall
      specificity: Math.round(overallScore * 0.85) // Even more specific requirement
    };
  }

  private identifyImprovementAreas(sample: EnhancedSampleInput, patternType: string): ImprovementArea[] {
    return sample.challenges.map(challenge => ({
      area: challenge,
      priority: 'medium' as const,
      description: `Address ${challenge} to improve overall effectiveness`,
      expectedImpact: 'Moderate improvement in conversion rates',
      implementationDifficulty: 'medium' as const
    }));
  }

  private generateKeyRecommendations(improvementAreas: ImprovementArea[]): string[] {
    return improvementAreas
      .filter(area => area.priority === 'high')
      .slice(0, 3)
      .map(area => `${area.priority.toUpperCase()}: ${area.description}`);
  }

  private determineAnalysisDepth(complexity: 'simple' | 'medium' | 'complex'): 'basic' | 'detailed' | 'comprehensive' {
    switch (complexity) {
      case 'simple': return 'basic';
      case 'medium': return 'detailed';
      case 'complex': return 'comprehensive';
      default: return 'detailed';
    }
  }

  // Test scenario generation methods

  private generateEdgeCaseScenarios(patternType: string): TestScenario[] {
    return [
      {
        id: `${patternType}_edge_1`,
        name: 'Minimal Content Page',
        description: 'Landing page with very minimal content and few elements',
        testType: 'edge_case',
        input: 'Single headline, one paragraph, and basic contact form',
        expectedBehavior: 'Should identify lack of content and provide specific recommendations for enhancement',
        validationCriteria: ['Identifies content gaps', 'Provides actionable recommendations', 'Maintains professional tone']
      }
    ];
  }

  private generateMinimalContentScenarios(patternType: string): TestScenario[] {
    return [
      {
        id: `${patternType}_minimal_1`,
        name: 'Basic Landing Page',
        description: 'Simple landing page with essential elements only',
        testType: 'minimal_content',
        input: 'Header, value proposition, single CTA, footer',
        expectedBehavior: 'Should analyze available elements and suggest enhancements',
        validationCriteria: ['Analyzes existing elements', 'Suggests missing components', 'Provides priority recommendations']
      }
    ];
  }

  private generateComprehensiveScenarios(patternType: string): TestScenario[] {
    return [
      {
        id: `${patternType}_comprehensive_1`,
        name: 'Feature-Rich Landing Page',
        description: 'Complex landing page with multiple sections and advanced features',
        testType: 'comprehensive',
        input: 'Multi-section page with hero, features, testimonials, pricing, FAQ, and multiple CTAs',
        expectedBehavior: 'Should provide detailed analysis of all sections with specific optimization recommendations',
        validationCriteria: ['Analyzes all sections thoroughly', 'Provides section-specific scores', 'Offers prioritized improvements']
      }
    ];
  }

  private generateErrorHandlingScenarios(patternType: string): TestScenario[] {
    return [
      {
        id: `${patternType}_error_1`,
        name: 'Invalid Input Format',
        description: 'Test handling of malformed or invalid input content',
        testType: 'error_handling',
        input: 'Corrupted HTML or incomplete content structure',
        expectedBehavior: 'Should gracefully handle errors and provide meaningful feedback',
        validationCriteria: ['Handles errors gracefully', 'Provides helpful error messages', 'Suggests input corrections']
      }
    ];
  }

  // Validation sample generation methods

  private generateHighQualitySample(patternType: string): ValidationSample {
    return {
      id: `${patternType}_validation_high`,
      name: 'High Quality Sample',
      input: 'Well-structured landing page with all recommended elements and best practices implemented',
      expectedQuality: 'high',
      commonIssues: [],
      passingCriteria: ['Score above 85', 'All sections analyzed', 'Specific recommendations provided', 'Professional tone maintained']
    };
  }

  private generateMediumQualitySample(patternType: string): ValidationSample {
    return {
      id: `${patternType}_validation_medium`,
      name: 'Medium Quality Sample',
      input: 'Average landing page with some optimization opportunities and missing elements',
      expectedQuality: 'medium',
      commonIssues: ['Missing social proof', 'Weak call-to-action', 'Limited mobile optimization'],
      passingCriteria: ['Score between 60-84', 'Identifies improvement areas', 'Provides actionable recommendations']
    };
  }

  private generateLowQualitySample(patternType: string): ValidationSample {
    return {
      id: `${patternType}_validation_low`,
      name: 'Low Quality Sample',
      input: 'Poor landing page with multiple issues and significant optimization needs',
      expectedQuality: 'low',
      commonIssues: ['Unclear value proposition', 'Poor navigation', 'No trust indicators', 'Weak conversion elements'],
      passingCriteria: ['Score below 60', 'Identifies major issues', 'Provides comprehensive improvement plan']
    };
  }

  private generateProblematicSample(patternType: string): ValidationSample {
    return {
      id: `${patternType}_validation_problematic`,
      name: 'Problematic Sample',
      input: 'Landing page with structural issues, broken elements, or confusing layout',
      expectedQuality: 'low',
      commonIssues: ['Broken navigation', 'Confusing layout', 'Missing critical elements', 'Poor user experience'],
      passingCriteria: ['Identifies critical issues', 'Provides urgent recommendations', 'Maintains analytical objectivity']
    };
  }

  // Additional sample generation methods

  private generateAdditionalSamples(specification: PatternSpecification): EnhancedSampleInput[] {
    const patternType = specification.name;
    const additionalSamples: EnhancedSampleInput[] = [];

    // Add pattern-specific additional samples
    if (patternType === 'analyze_wireframe_flow') {
      additionalSamples.push(...this.generateWireframeFlowSamples());
    } else if (patternType === 'analyze_copywriting_score') {
      additionalSamples.push(...this.generateCopywritingScoreSamples());
    }

    return additionalSamples;
  }

  private getPatternSpecification(patternType: string): PatternSpecification | null {
    // This would typically integrate with SpecificationBuilder
    // For now, return a mock specification
    return {
      name: patternType,
      category: 'Analysis',
      description: `Pattern for ${patternType}`,
      domain: 'Landing Page Analysis',
      expertise: 'specialist',
      analysisFramework: 'Best practices framework',
      inputTypes: ['landing page content'],
      outputStructure: {
        sections: [
          { name: 'ANALYSIS', description: 'Main analysis', format: 'structured', required: true, examples: [] },
          { name: 'RECOMMENDATIONS', description: 'Recommendations', format: 'bulleted', required: true, examples: [] }
        ],
        recommendationFormat: 'Priority-based recommendations',
        exampleFormat: 'Structured examples'
      },
      sampleInputs: [],
      expectedOutputs: [],
      validationCriteria: {
        requiredSections: ['ANALYSIS', 'RECOMMENDATIONS'],
        scoringRequired: true,
        recommendationsRequired: true,
        minimumWordCount: 200,
        qualityChecks: ['Specific examples', 'Actionable recommendations']
      },
      useCases: ['Landing page optimization'],
      bestPractices: ['Use specific examples', 'Provide actionable recommendations']
    };
  }
}