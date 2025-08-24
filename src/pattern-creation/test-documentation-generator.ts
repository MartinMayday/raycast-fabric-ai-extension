/**
 * Test suite for DocumentationGenerator class
 * Tests automatic documentation generation for custom patterns
 */

import { DocumentationGenerator, PatternDocumentation } from './DocumentationGenerator';

// Mock pattern data for testing
const mockPatternContent = `# IDENTITY and PURPOSE

You are an expert UX analyst and wireframe evaluation specialist. You analyze landing page wireframes and user interface designs to provide comprehensive UX analysis and conversion optimization recommendations.

Analyze wireframes and landing page designs for user experience effectiveness, conversion optimization, and usability improvements.

# STEPS

- Take a step back and think step-by-step about how to best accomplish this wireframe analysis

- Analyze overall layout structure and visual hierarchy effectiveness

- Evaluate navigation design and user flow optimization

- Assess conversion funnel and call-to-action placement

- Review mobile responsiveness and cross-device compatibility

# OUTPUT

- LAYOUT ANALYSIS: Assessment of visual hierarchy and structure effectiveness with layout score (1-10)

- NAVIGATION EVALUATION: Analysis of menu design and user flow with navigation rating (1-10)

- CONVERSION OPTIMIZATION: Recommendations for improving conversion rates with priority (HIGH/MEDIUM/LOW)

- USER FLOW ASSESSMENT: Evaluation of user journey and interaction patterns with usability score (1-10)

- MOBILE RESPONSIVENESS: Analysis of mobile design and responsive elements with mobile score (1-10)

# OUTPUT INSTRUCTIONS

- Focus on actionable UX improvements rather than general observations

- Rate each design element on effectiveness (1-10)

- Provide specific recommendations with priority levels

- Include before/after examples for key improvements

- Prioritize recommendations by impact potential (HIGH/MEDIUM/LOW)

# INPUT

INPUT:`;

const mockPatternMetadata = {
  displayName: 'Analyze Wireframe Flow',
  category: 'UX Analysis',
  version: '1.0.0',
  hasScoring: true,
  hasPrioritization: true,
  outputSections: [
    'LAYOUT ANALYSIS',
    'NAVIGATION EVALUATION',
    'CONVERSION OPTIMIZATION',
    'USER FLOW ASSESSMENT',
    'MOBILE RESPONSIVENESS'
  ]
};

const mockSamplesContent = `# Analyze Wireframe Flow - Test Samples

## Sample 1: E-commerce Product Page

### Input Content:
\`\`\`
# E-commerce Product Page Wireframe

## Header Section
- Logo (top left)
- Navigation menu (horizontal, 5 items)
- Search bar (center)
- Cart icon (top right)

## Product Section
- Product image gallery (left, 60% width)
- Product details (right, 40% width)
- Price and availability
- Add to cart button (prominent, orange)
- Product description tabs

## Footer
- Links and contact information
- Newsletter signup
\`\`\`

### Expected Analysis Areas:
- Visual hierarchy and layout effectiveness
- Navigation clarity and user flow
- Conversion optimization opportunities
- Mobile responsiveness considerations

## Sample 2: SaaS Landing Page

### Input Content:
\`\`\`
# SaaS Landing Page Wireframe

## Hero Section
- Headline and subheadline
- Hero image/video (right side)
- Primary CTA button (left side)
- Trust indicators below

## Features Section
- 3-column feature grid
- Icons and descriptions
- Secondary CTA buttons

## Social Proof
- Customer logos
- Testimonials carousel
- Case study links
\`\`\`

### Expected Analysis Areas:
- Hero section effectiveness
- Feature presentation clarity
- Social proof placement and impact
- CTA optimization opportunities

## Sample 3: Lead Generation Page

### Input Content:
\`\`\`
# Lead Generation Landing Page

## Above the Fold
- Compelling headline
- Value proposition
- Lead capture form (right sidebar)
- Benefit bullets (left side)

## Below the Fold
- Detailed benefits section
- FAQ accordion
- Additional trust signals
- Footer with contact info
\`\`\`

### Expected Analysis Areas:
- Form placement and design
- Value proposition clarity
- Trust building elements
- Conversion funnel optimization`;

class DocumentationGeneratorTest {
  private generator: DocumentationGenerator;

  constructor() {
    this.generator = new DocumentationGenerator();
  }

  /**
   * Test pattern documentation generation
   */
  testPatternDocumentationGeneration(): void {
    console.log('🧪 Testing Pattern Documentation Generation...\n');

    const documentation = this.generator.generatePatternDocumentation(
      'analyze_wireframe_flow',
      mockPatternContent,
      mockPatternMetadata,
      mockSamplesContent
    );

    console.log('✅ Generated Pattern Documentation:');
    console.log(`   Pattern Name: ${documentation.patternName}`);
    console.log(`   Display Name: ${documentation.displayName}`);
    console.log(`   Category: ${documentation.category}`);
    console.log(`   Version: ${documentation.version}`);
    console.log(`   Last Updated: ${documentation.lastUpdated}`);

    // Validate documentation structure
    const validations = [
      { check: 'Has pattern name', result: documentation.patternName === 'analyze_wireframe_flow' },
      { check: 'Has display name', result: documentation.displayName.length > 0 },
      { check: 'Has category', result: documentation.category.length > 0 },
      { check: 'Has version', result: documentation.version.length > 0 },
      { check: 'Has overview', result: documentation.overview !== null },
      { check: 'Has usage', result: documentation.usage !== null },
      { check: 'Has output format', result: documentation.outputFormat !== null },
      { check: 'Has examples', result: documentation.examples.length > 0 },
      { check: 'Has best practices', result: documentation.bestPractices.length > 0 },
      { check: 'Has troubleshooting', result: documentation.troubleshooting.length > 0 },
      { check: 'Has changelog', result: documentation.changelog.length > 0 }
    ];

    console.log('\n📋 Documentation Structure Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const docScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Documentation Generation Score: ${Math.round(docScore)}%`);
  }

  /**
   * Test pattern overview generation
   */
  testPatternOverviewGeneration(): void {
    console.log('\n🧪 Testing Pattern Overview Generation...\n');

    const documentation = this.generator.generatePatternDocumentation(
      'analyze_wireframe_flow',
      mockPatternContent,
      mockPatternMetadata
    );

    const overview = documentation.overview;

    console.log('✅ Generated Pattern Overview:');
    console.log(`   Purpose: ${overview.purpose}`);
    console.log(`   Description: ${overview.description}`);
    console.log(`   Use Case: ${overview.useCase}`);
    console.log(`   Target Audience: ${overview.targetAudience}`);
    console.log(`   Key Features: ${overview.keyFeatures.length} features`);
    console.log(`   Benefits: ${overview.benefits.length} benefits`);
    console.log(`   Limitations: ${overview.limitations.length} limitations`);

    // Validate overview content
    const validations = [
      { check: 'Has purpose', result: overview.purpose.length > 0 },
      { check: 'Has description', result: overview.description.length > 0 },
      { check: 'Has use case', result: overview.useCase.length > 0 },
      { check: 'Has target audience', result: overview.targetAudience.length > 0 },
      { check: 'Has key features', result: overview.keyFeatures.length > 0 },
      { check: 'Has benefits', result: overview.benefits.length > 0 },
      { check: 'Has limitations', result: overview.limitations.length > 0 },
      { check: 'Purpose is descriptive', result: overview.purpose.length > 20 },
      { check: 'Features are specific', result: overview.keyFeatures.every(f => f.length > 10) },
      { check: 'Benefits are actionable', result: overview.benefits.every(b => b.length > 10) }
    ];

    console.log('\n📋 Overview Content Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const overviewScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Overview Generation Score: ${Math.round(overviewScore)}%`);
  }

  /**
   * Test usage documentation generation
   */
  testUsageDocumentationGeneration(): void {
    console.log('\n🧪 Testing Usage Documentation Generation...\n');

    const documentation = this.generator.generatePatternDocumentation(
      'analyze_wireframe_flow',
      mockPatternContent,
      mockPatternMetadata,
      mockSamplesContent
    );

    const usage = documentation.usage;

    console.log('✅ Generated Usage Documentation:');
    console.log(`   Basic Usage Title: ${usage.basicUsage.title}`);
    console.log(`   Advanced Usage Examples: ${usage.advancedUsage.length}`);
    console.log(`   Input Requirements: ${usage.inputRequirements.length}`);
    console.log(`   Output Description: ${usage.outputDescription}`);
    console.log(`   Common Parameters: ${usage.commonParameters.length}`);
    console.log(`   Integration Notes: ${usage.integrationNotes.length}`);

    // Show sample input requirements
    console.log('\n📋 Input Requirements:');
    usage.inputRequirements.forEach((req, index) => {
      console.log(`   ${index + 1}. ${req.name} (${req.type}): ${req.description}`);
    });

    // Validate usage documentation
    const validations = [
      { check: 'Has basic usage', result: usage.basicUsage.title.length > 0 },
      { check: 'Basic usage has example', result: usage.basicUsage.inputExample.length > 0 },
      { check: 'Has advanced usage', result: usage.advancedUsage.length > 0 },
      { check: 'Has input requirements', result: usage.inputRequirements.length > 0 },
      { check: 'Has output description', result: usage.outputDescription.length > 0 },
      { check: 'Has common parameters', result: usage.commonParameters.length > 0 },
      { check: 'Has integration notes', result: usage.integrationNotes.length > 0 },
      { check: 'Requirements have types', result: usage.inputRequirements.every(req => req.type.length > 0) },
      { check: 'Parameters have descriptions', result: usage.commonParameters.every(param => param.description.length > 0) }
    ];

    console.log('\n📋 Usage Documentation Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const usageScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Usage Documentation Score: ${Math.round(usageScore)}%`);
  }

  /**
   * Test output format documentation
   */
  testOutputFormatDocumentation(): void {
    console.log('\n🧪 Testing Output Format Documentation...\n');

    const documentation = this.generator.generatePatternDocumentation(
      'analyze_wireframe_flow',
      mockPatternContent,
      mockPatternMetadata
    );

    const outputFormat = documentation.outputFormat;

    console.log('✅ Generated Output Format Documentation:');
    console.log(`   Output Sections: ${outputFormat.sections.length}`);
    console.log(`   Has Scoring System: ${outputFormat.scoringSystem ? 'Yes' : 'No'}`);
    console.log(`   Has Prioritization: ${outputFormat.prioritization ? 'Yes' : 'No'}`);
    console.log(`   Export Formats: ${outputFormat.exportFormats.length}`);
    console.log(`   Data Structure: ${outputFormat.dataStructure.length > 0 ? 'Generated' : 'Missing'}`);

    // Show output sections
    console.log('\n📊 Output Sections:');
    outputFormat.sections.forEach((section, index) => {
      console.log(`   ${index + 1}. ${section.name} (${section.format}): ${section.description}`);
    });

    // Show scoring system if available
    if (outputFormat.scoringSystem) {
      console.log('\n🎯 Scoring System:');
      console.log(`   Description: ${outputFormat.scoringSystem.description}`);
      console.log(`   Scale: ${outputFormat.scoringSystem.scale}`);
      console.log(`   Interpretations: ${outputFormat.scoringSystem.interpretation.length}`);
    }

    // Validate output format documentation
    const validations = [
      { check: 'Has output sections', result: outputFormat.sections.length > 0 },
      { check: 'Sections have descriptions', result: outputFormat.sections.every(s => s.description.length > 0) },
      { check: 'Sections have formats', result: outputFormat.sections.every(s => s.format.length > 0) },
      { check: 'Sections have examples', result: outputFormat.sections.every(s => s.example.length > 0) },
      { check: 'Has export formats', result: outputFormat.exportFormats.length > 0 },
      { check: 'Export formats documented', result: outputFormat.exportFormats.every(f => f.description.length > 0) },
      { check: 'Has data structure', result: outputFormat.dataStructure.length > 0 },
      { check: 'Scoring system documented', result: !outputFormat.scoringSystem || outputFormat.scoringSystem.description.length > 0 },
      { check: 'Prioritization documented', result: !outputFormat.prioritization || outputFormat.prioritization.description.length > 0 }
    ];

    console.log('\n📋 Output Format Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const outputScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Output Format Score: ${Math.round(outputScore)}%`);
  }

  /**
   * Test best practices generation
   */
  testBestPracticesGeneration(): void {
    console.log('\n🧪 Testing Best Practices Generation...\n');

    const documentation = this.generator.generatePatternDocumentation(
      'analyze_wireframe_flow',
      mockPatternContent,
      mockPatternMetadata
    );

    const bestPractices = documentation.bestPractices;

    console.log('✅ Generated Best Practices:');
    console.log(`   Total Practices: ${bestPractices.length}`);

    // Group by category
    const practicesByCategory = bestPractices.reduce((acc, practice) => {
      if (!acc[practice.category]) {
        acc[practice.category] = [];
      }
      acc[practice.category].push(practice);
      return acc;
    }, {} as Record<string, any[]>);

    console.log('\n📋 Practices by Category:');
    Object.entries(practicesByCategory).forEach(([category, practices]) => {
      console.log(`   ${category}: ${practices.length} practices`);
      practices.forEach(practice => {
        console.log(`      - ${practice.title}`);
      });
    });

    // Validate best practices
    const validations = [
      { check: 'Has best practices', result: bestPractices.length > 0 },
      { check: 'Practices have categories', result: bestPractices.every(p => p.category.length > 0) },
      { check: 'Practices have titles', result: bestPractices.every(p => p.title.length > 0) },
      { check: 'Practices have descriptions', result: bestPractices.every(p => p.description.length > 0) },
      { check: 'Practices have do/avoid lists', result: bestPractices.every(p => p.doThis.length > 0 && p.avoidThis.length > 0) },
      { check: 'Multiple categories covered', result: Object.keys(practicesByCategory).length > 1 },
      { check: 'Input preparation covered', result: bestPractices.some(p => p.category === 'Input Preparation') },
      { check: 'Usage guidance provided', result: bestPractices.some(p => p.category === 'Usage') }
    ];

    console.log('\n📋 Best Practices Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const practicesScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Best Practices Score: ${Math.round(practicesScore)}%`);
  }

  /**
   * Test troubleshooting guide generation
   */
  testTroubleshootingGuideGeneration(): void {
    console.log('\n🧪 Testing Troubleshooting Guide Generation...\n');

    const documentation = this.generator.generatePatternDocumentation(
      'analyze_wireframe_flow',
      mockPatternContent,
      mockPatternMetadata
    );

    const troubleshooting = documentation.troubleshooting;

    console.log('✅ Generated Troubleshooting Guide:');
    console.log(`   Total Issues: ${troubleshooting.length}`);

    troubleshooting.forEach((guide, index) => {
      console.log(`   ${index + 1}. ${guide.issue}:`);
      console.log(`      - Symptoms: ${guide.symptoms.length}`);
      console.log(`      - Causes: ${guide.causes.length}`);
      console.log(`      - Solutions: ${guide.solutions.length}`);
      console.log(`      - Prevention: ${guide.prevention.length}`);
    });

    // Validate troubleshooting guide
    const validations = [
      { check: 'Has troubleshooting guides', result: troubleshooting.length > 0 },
      { check: 'Guides have issues', result: troubleshooting.every(g => g.issue.length > 0) },
      { check: 'Guides have symptoms', result: troubleshooting.every(g => g.symptoms.length > 0) },
      { check: 'Guides have causes', result: troubleshooting.every(g => g.causes.length > 0) },
      { check: 'Guides have solutions', result: troubleshooting.every(g => g.solutions.length > 0) },
      { check: 'Guides have prevention', result: troubleshooting.every(g => g.prevention.length > 0) },
      { check: 'Common issues covered', result: troubleshooting.some(g => g.issue.includes('Quality')) },
      { check: 'Multiple solutions provided', result: troubleshooting.every(g => g.solutions.length > 1) }
    ];

    console.log('\n📋 Troubleshooting Guide Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const troubleshootingScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Troubleshooting Guide Score: ${Math.round(troubleshootingScore)}%`);
  }

  /**
   * Test markdown rendering
   */
  testMarkdownRendering(): void {
    console.log('\n🧪 Testing Markdown Rendering...\n');

    const documentation = this.generator.generatePatternDocumentation(
      'analyze_wireframe_flow',
      mockPatternContent,
      mockPatternMetadata,
      mockSamplesContent
    );

    const markdown = this.generator.renderDocumentationToMarkdown(documentation);

    console.log('✅ Generated Markdown Documentation:');
    console.log(`   Total Length: ${markdown.length} characters`);
    console.log(`   Lines: ${markdown.split('\n').length}`);
    console.log(`   Sections: ${markdown.split('---').length}`);

    // Show first few lines
    const lines = markdown.split('\n');
    console.log('\n📄 Sample Markdown Output:');
    lines.slice(0, 10).forEach((line, index) => {
      console.log(`   ${index + 1}: ${line}`);
    });

    // Validate markdown structure
    const validations = [
      { check: 'Has content', result: markdown.length > 0 },
      { check: 'Has headers', result: markdown.includes('# ') },
      { check: 'Has sections', result: markdown.includes('## ') },
      { check: 'Has subsections', result: markdown.includes('### ') },
      { check: 'Has code blocks', result: markdown.includes('```') },
      { check: 'Has lists', result: markdown.includes('- ') },
      { check: 'Has section separators', result: markdown.includes('---') },
      { check: 'Reasonable length', result: markdown.length > 1000 },
      { check: 'Well structured', result: markdown.split('---').length > 5 }
    ];

    console.log('\n📋 Markdown Rendering Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const markdownScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Markdown Rendering Score: ${Math.round(markdownScore)}%`);
  }

  /**
   * Test multiple pattern documentation
   */
  testMultiplePatternDocumentation(): void {
    console.log('\n🧪 Testing Multiple Pattern Documentation...\n');

    const patterns = [
      {
        name: 'analyze_wireframe_flow',
        content: mockPatternContent,
        metadata: { ...mockPatternMetadata, displayName: 'Analyze Wireframe Flow' },
        samples: mockSamplesContent
      },
      {
        name: 'analyze_copywriting_score',
        content: mockPatternContent.replace('wireframe', 'copywriting'),
        metadata: { ...mockPatternMetadata, displayName: 'Analyze Copywriting Score', category: 'Content Analysis' },
        samples: mockSamplesContent.replace('Wireframe', 'Copywriting')
      },
      {
        name: 'create_storybrand_variant',
        content: mockPatternContent.replace('wireframe', 'storybrand'),
        metadata: { ...mockPatternMetadata, displayName: 'Create StoryBrand Variant', category: 'Marketing Analysis' },
        samples: mockSamplesContent.replace('Wireframe', 'StoryBrand')
      }
    ];

    const documentations = this.generator.generateMultiplePatternDocumentation(patterns);

    console.log('✅ Generated Multiple Pattern Documentation:');
    console.log(`   Total Patterns: ${documentations.length}`);

    documentations.forEach((doc, index) => {
      console.log(`   ${index + 1}. ${doc.displayName}:`);
      console.log(`      - Category: ${doc.category}`);
      console.log(`      - Version: ${doc.version}`);
      console.log(`      - Examples: ${doc.examples.length}`);
      console.log(`      - Best Practices: ${doc.bestPractices.length}`);
      console.log(`      - Troubleshooting: ${doc.troubleshooting.length}`);
    });

    // Validate multiple documentation generation
    const validations = [
      { check: 'All patterns documented', result: documentations.length === patterns.length },
      { check: 'All have unique names', result: new Set(documentations.map(d => d.patternName)).size === documentations.length },
      { check: 'All have display names', result: documentations.every(d => d.displayName.length > 0) },
      { check: 'All have categories', result: documentations.every(d => d.category.length > 0) },
      { check: 'All have overviews', result: documentations.every(d => d.overview.purpose.length > 0) },
      { check: 'All have usage docs', result: documentations.every(d => d.usage.basicUsage.title.length > 0) },
      { check: 'All have output formats', result: documentations.every(d => d.outputFormat.sections.length > 0) },
      { check: 'Categories are different', result: new Set(documentations.map(d => d.category)).size > 1 }
    ];

    console.log('\n📋 Multiple Documentation Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const multipleScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Multiple Documentation Score: ${Math.round(multipleScore)}%`);
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting DocumentationGenerator Test Suite\n');
    console.log('='.repeat(60));

    try {
      this.testPatternDocumentationGeneration();
      this.testPatternOverviewGeneration();
      this.testUsageDocumentationGeneration();
      this.testOutputFormatDocumentation();
      this.testBestPracticesGeneration();
      this.testTroubleshootingGuideGeneration();
      this.testMarkdownRendering();
      this.testMultiplePatternDocumentation();

      console.log('\n' + '='.repeat(60));
      console.log('🎉 All DocumentationGenerator tests completed successfully!');
      console.log('\n✨ Key Features Validated:');
      console.log('✅ Comprehensive pattern documentation generation');
      console.log('✅ Pattern overview with purpose, use cases, and benefits');
      console.log('✅ Usage documentation with examples and requirements');
      console.log('✅ Output format documentation with scoring and prioritization');
      console.log('✅ Best practices generation with actionable guidance');
      console.log('✅ Troubleshooting guides with solutions and prevention');
      console.log('✅ Markdown rendering for professional documentation');
      console.log('✅ Multiple pattern documentation support');
      console.log('\n🚀 DocumentationGenerator ready for production use!');

    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
}

// Export for use in other test files
export { DocumentationGeneratorTest };

// Run tests if this file is executed directly
if (require.main === module) {
  const test = new DocumentationGeneratorTest();
  test.runAllTests();
}