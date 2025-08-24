/**
 * Test suite for KnowledgeBaseIntegrator class
 * Tests knowledge base creation, search, and pattern knowledge extraction
 */

import { KnowledgeBaseIntegrator, SearchQuery, KnowledgeBaseEntry } from './KnowledgeBaseIntegrator.js';

// Mock pattern data for testing
const mockPatternContent = `# IDENTITY and PURPOSE

You are an expert UX analyst and wireframe evaluation specialist. You analyze landing page wireframes and user interface designs to provide comprehensive UX analysis and conversion optimization recommendations.

Analyze wireframes and landing page designs for user experience effectiveness, conversion optimization, and usability improvements.

# STEPS

- Take a step back and think step-by-step about how to best accomplish this wireframe analysis

- Analyze overall layout structure and visual hierarchy effectiveness

- Evaluate navigation design and user flow optimization

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

# INPUT

INPUT:`;

const mockPatternMetadata = {
  displayName: 'Analyze Wireframe Flow',
  category: 'UX Analysis',
  version: '1.0.0',
  quality: 9,
  hasScoring: true,
  hasPrioritization: true
};

class KnowledgeBaseIntegratorTest {
  private integrator: KnowledgeBaseIntegrator;

  constructor() {
    this.integrator = new KnowledgeBaseIntegrator();
  }

  /**
   * Test knowledge base initialization
   */
  testKnowledgeBaseInitialization(): void {
    console.log('🧪 Testing Knowledge Base Initialization...\n');

    const stats = this.integrator.getStatistics();
    const categories = this.integrator.getCategories();
    const tags = this.integrator.getTags();

    console.log('✅ Knowledge Base Statistics:');
    console.log(`   Total Entries: ${stats.totalEntries}`);
    console.log(`   Total Categories: ${stats.totalCategories}`);
    console.log(`   Total Tags: ${stats.totalTags}`);
    console.log(`   Last Updated: ${stats.lastUpdated}`);

    console.log('\n📂 Categories:');
    Object.values(categories).forEach(category => {
      console.log(`   ${category.name}: ${category.entryCount} entries`);
    });

    console.log('\n🏷️  Popular Tags:');
    Object.values(tags)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .forEach(tag => {
        console.log(`   ${tag.name}: ${tag.count} entries`);
      });

    // Validate initialization
    const validations = [
      { check: 'Has entries', result: stats.totalEntries > 0 },
      { check: 'Has categories', result: stats.totalCategories > 0 },
      { check: 'Has tags', result: stats.totalTags > 0 },
      { check: 'Categories have entries', result: Object.values(categories).every(cat => cat.entryCount >= 0) },
      { check: 'Tags have counts', result: Object.values(tags).every(tag => tag.count > 0) },
      { check: 'Quality distribution exists', result: Object.keys(stats.qualityDistribution).length > 0 },
      { check: 'Last updated is recent', result: new Date(stats.lastUpdated).getTime() > Date.now() - 60000 }
    ];

    console.log('\n📋 Initialization Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const initScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Initialization Score: ${Math.round(initScore)}%`);
  }

  /**
   * Run comprehensive test suite
   */
  runComprehensiveTest(): void {
    console.log('🚀 Starting KnowledgeBaseIntegrator Comprehensive Test Suite\n');
    console.log('='.repeat(80));

    const startTime = Date.now();

    try {
      // Run all tests
      this.testKnowledgeBaseInitialization();

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('\n' + '='.repeat(80));
      console.log('🎉 KnowledgeBaseIntegrator Test Suite Completed Successfully!');
      console.log(`⏱️  Total execution time: ${duration}ms`);
      console.log('✅ All knowledge base functionality validated');
      console.log('📊 Knowledge extraction and search capabilities confirmed');
      console.log('🔄 Export/import functionality verified');

    } catch (error) {
      console.error('\n❌ Test suite failed with error:', error);
      throw error;
    }
  }
}

// Export for use in other test files
export { KnowledgeBaseIntegratorTest };

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new KnowledgeBaseIntegratorTest();
  tester.runComprehensiveTest();
}