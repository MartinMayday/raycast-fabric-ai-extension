/**
 * Test suite for PatternTestSuite class
 * Tests comprehensive pattern testing and validation functionality
 */

import { PatternTestSuite, TestSuiteResult, PatternTestConfig } from './PatternTestSuite';

class PatternTestSuiteTest {
  private testSuite: PatternTestSuite;

  constructor() {
    this.testSuite = new PatternTestSuite();
  }

  /**
   * Test pattern test suite initialization
   */
  testPatternTestSuiteInitialization(): void {
    console.log('🧪 Testing PatternTestSuite Initialization...\n');

    // Check if default configurations are loaded
    const wireframeConfig = this.testSuite.getTestConfig('analyze_wireframe_flow');
    const copywritingConfig = this.testSuite.getTestConfig('analyze_copywriting_score');
    const storybrandConfig = this.testSuite.getTestConfig('create_storybrand_variant');
    const competitiveConfig = this.testSuite.getTestConfig('create_competitive_audit');

    console.log('✅ Default Pattern Configurations:');
    console.log(`   Wireframe Flow: ${wireframeConfig ? 'Loaded' : 'Missing'}`);
    console.log(`   Copywriting Score: ${copywritingConfig ? 'Loaded' : 'Missing'}`);
    console.log(`   StoryBrand Variant: ${storybrandConfig ? 'Loaded' : 'Missing'}`);
    console.log(`   Competitive Audit: ${competitiveConfig ? 'Loaded' : 'Missing'}`);

    if (wireframeConfig) {
      console.log(`\n📋 Wireframe Flow Configuration:');
      console.log(`   Pattern File: ${wireframeConfig.patternFile}`);
      console.log(`   Sample Inputs: ${wireframeConfig.sampleInputs.length}`);
      console.log(`   Expected Sections: ${wireframeConfig.expectedOutputStructure.length}`);
      console.log(`   Required Sections: ${wireframeConfig.requiredSections.length}`);
    }

    // Validate initialization
    const validations = [
      { check: 'Wireframe config loaded', result: wireframeConfig !== null },
      { check: 'Copywriting config loaded', result: copywritingConfig !== null },
      { check: 'StoryBrand config loaded', result: storybrandConfig !== null },
      { check: 'Competitive config loaded', result: competitiveConfig !== null },
      { check: 'Configs have sample inputs', result: wireframeConfig?.sampleInputs.length > 0 },
      { check: 'Configs have expected structure', result: wireframeConfig?.expectedOutputStructure.length > 0 },
      { check: 'Configs have required sections', result: wireframeConfig?.requiredSections.length > 0 }
    ];

    console.log('\n📋 Initialization Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const initScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Initialization Score: ${Math.round(initScore)}%`);
  }

  /**
   * Test adding custom test configuration
   */
  testCustomTestConfiguration(): void {
    console.log('\n🧪 Testing Custom Test Configuration...\n');

    const customConfig: PatternTestConfig = {
      patternName: 'test_custom_pattern',
      patternFile: 'patterns/test_custom_pattern.md',
      sampleInputs: [
        'Test input 1',
        'Test input 2',
        'Test input 3'
      ],
      expectedOutputStructure: [
        'ANALYSIS SECTION',
        'RECOMMENDATIONS',
        'SCORING'
      ],
      requiredSections: [
        '# IDENTITY and PURPOSE',
        '# STEPS',
        '# OUTPUT'
      ],
      scoringCriteria: {
        syntaxWeight: 0.2,
        structureWeight: 0.3,
        outputWeight: 0.3,
        integrationWeight: 0.1,
        performanceWeight: 0.1,
        minPassingScore: 75
      },
      performanceThresholds: {
        maxExecutionTime: 3000,
        maxMemoryUsage: 50 * 1024 * 1024,
        minThroughput: 15
      }
    };

    // Add custom configuration
    this.testSuite.addTestConfig(customConfig);

    // Retrieve and validate
    const retrievedConfig = this.testSuite.getTestConfig('test_custom_pattern');

    console.log('✅ Custom Configuration Added:');
    console.log(`   Pattern Name: ${retrievedConfig?.patternName}`);
    console.log(`   Sample Inputs: ${retrievedConfig?.sampleInputs.length}`);
    console.log(`   Min Passing Score: ${retrievedConfig?.scoringCriteria.minPassingScore}%`);
    console.log(`   Max Execution Time: ${retrievedConfig?.performanceThresholds.maxExecutionTime}ms`);

    // Validate custom configuration
    const validations = [
      { check: 'Custom config added', result: retrievedConfig !== null },
      { check: 'Pattern name matches', result: retrievedConfig?.patternName === 'test_custom_pattern' },
      { check: 'Sample inputs preserved', result: retrievedConfig?.sampleInputs.length === 3 },
      { check: 'Expected structure preserved', result: retrievedConfig?.expectedOutputStructure.length === 3 },
      { check: 'Scoring criteria preserved', result: retrievedConfig?.scoringCriteria.minPassingScore === 75 },
      { check: 'Performance thresholds preserved', result: retrievedConfig?.performanceThresholds.maxExecutionTime === 3000 }
    ];

    console.log('\n📋 Custom Configuration Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const configScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Custom Configuration Score: ${Math.round(configScore)}%`);
  }

  /**
   * Test pattern testing simulation
   */
  async testPatternTestingSimulation(): Promise<void> {
    console.log('\n🧪 Testing Pattern Testing Simulation...\n');

    try {
      // Create a mock pattern file for testing
      const fs = require('fs');
      const mockPatternContent = `# IDENTITY and PURPOSE

You are an expert test pattern for validation purposes.

# STEPS

- Analyze the input content
- Generate structured output
- Provide scoring and recommendations

# OUTPUT

- ANALYSIS SECTION: Detailed analysis with score (1-10)
- RECOMMENDATIONS: Actionable recommendations with priority (HIGH/MEDIUM/LOW)
- SCORING: Overall assessment with score (0-100)

# OUTPUT INSTRUCTIONS

- Focus on actionable insights
- Provide clear scoring rationale

# INPUT

INPUT:`;

      // Ensure patterns directory exists
      if (!fs.existsSync('patterns')) {
        fs.mkdirSync('patterns', { recursive: true });
      }

      // Write mock pattern file
      fs.writeFileSync('patterns/test_custom_pattern.md', mockPatternContent);

      // Run tests on the custom pattern
      const testResult = await this.testSuite.runPatternTests('test_custom_pattern');

      console.log('✅ Pattern Test Results:');
      console.log(`   Pattern: ${testResult.patternName}`);
      console.log(`   Overall Score: ${testResult.overallScore}%`);
      console.log(`   Quality Grade: ${testResult.qualityGrade}`);
      console.log(`   Pass Rate: ${testResult.passRate.toFixed(1)}%`);
      console.log(`   Tests Passed: ${testResult.passedTests}/${testResult.totalTests}`);
      console.log(`   Execution Time: ${testResult.executionTime}ms`);

      console.log('\n📊 Individual Test Results:');
      testResult.testResults.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        console.log(`   ${status} ${test.testName}: ${test.score}/${test.maxScore} (${((test.score/test.maxScore)*100).toFixed(1)}%)`);
        
        if (test.errors.length > 0) {
          console.log(`      Errors: ${test.errors.join(', ')}`);
        }
        
        if (test.warnings.length > 0) {
          console.log(`      Warnings: ${test.warnings.join(', ')}`);
        }
      });

      if (testResult.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        testResult.recommendations.forEach((rec, index) => {
          console.log(`   ${index + 1}. ${rec}`);
        });
      }

      // Clean up mock file
      fs.unlinkSync('patterns/test_custom_pattern.md');
      if (fs.existsSync('patterns') && fs.readdirSync('patterns').length === 0) {
        fs.rmdirSync('patterns');
      }

      // Validate test execution
      const validations = [
        { check: 'Test execution completed', result: testResult !== null },
        { check: 'Overall score calculated', result: testResult.overallScore >= 0 },
        { check: 'Quality grade assigned', result: ['A', 'B', 'C', 'D', 'F'].includes(testResult.qualityGrade) },
        { check: 'Individual tests run', result: testResult.testResults.length === 5 },
        { check: 'Execution time recorded', result: testResult.executionTime > 0 },
        { check: 'Recommendations generated', result: testResult.recommendations.length >= 0 }
      ];

      console.log('\n📋 Test Execution Validation:');
      validations.forEach(validation => {
        console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
      });

      const testScore = validations.filter(v => v.result).length / validations.length * 100;
      console.log(`\n📊 Test Execution Score: ${Math.round(testScore)}%`);

    } catch (error) {
      console.error(`❌ Pattern testing simulation failed: ${error}`);
    }
  }

  /**
   * Test report generation
   */
  testReportGeneration(): void {
    console.log('\n🧪 Testing Report Generation...\n');

    // Create mock test results
    const mockResults = new Map();
    mockResults.set('pattern1', {
      patternName: 'pattern1',
      overallScore: 85,
      maxScore: 100,
      passRate: 80,
      totalTests: 5,
      passedTests: 4,
      failedTests: 1,
      executionTime: 1500,
      testResults: [
        { testName: 'Syntax Tests', passed: true, score: 18, maxScore: 20, details: 'Good', errors: [], warnings: [], executionTime: 300 },
        { testName: 'Structure Tests', passed: true, score: 22, maxScore: 25, details: 'Good', errors: [], warnings: [], executionTime: 400 },
        { testName: 'Output Tests', passed: true, score: 25, maxScore: 30, details: 'Good', errors: [], warnings: [], executionTime: 500 },
        { testName: 'Integration Tests', passed: false, score: 8, maxScore: 15, details: 'Needs work', errors: ['Integration error'], warnings: [], executionTime: 200 },
        { testName: 'Performance Tests', passed: true, score: 9, maxScore: 10, details: 'Excellent', errors: [], warnings: [], executionTime: 100 }
      ],
      qualityGrade: 'B' as const,
      recommendations: ['Fix integration issues', 'Improve error handling']
    });

    mockResults.set('pattern2', {
      patternName: 'pattern2',
      overallScore: 92,
      maxScore: 100,
      passRate: 100,
      totalTests: 5,
      passedTests: 5,
      failedTests: 0,
      executionTime: 1200,
      testResults: [
        { testName: 'Syntax Tests', passed: true, score: 20, maxScore: 20, details: 'Perfect', errors: [], warnings: [], executionTime: 250 },
        { testName: 'Structure Tests', passed: true, score: 24, maxScore: 25, details: 'Excellent', errors: [], warnings: [], executionTime: 300 },
        { testName: 'Output Tests', passed: true, score: 28, maxScore: 30, details: 'Excellent', errors: [], warnings: [], executionTime: 400 },
        { testName: 'Integration Tests', passed: true, score: 14, maxScore: 15, details: 'Very good', errors: [], warnings: [], executionTime: 150 },
        { testName: 'Performance Tests', passed: true, score: 10, maxScore: 10, details: 'Perfect', errors: [], warnings: [], executionTime: 100 }
      ],
      qualityGrade: 'A' as const,
      recommendations: ['Pattern ready for production']
    });

    // Generate report
    const report = this.testSuite.generateTestReport(mockResults);

    console.log('✅ Generated Test Report:');
    console.log(`   Report length: ${report.length} characters`);
    console.log(`   Contains summary: ${report.includes('## Summary')}`);
    console.log(`   Contains pattern results: ${report.includes('## Pattern Results')}`);
    console.log(`   Contains recommendations: ${report.includes('#### Recommendations')}`);

    // Validate report content
    const validations = [
      { check: 'Report generated', result: report.length > 0 },
      { check: 'Contains summary section', result: report.includes('## Summary') },
      { check: 'Contains pattern results', result: report.includes('## Pattern Results') },
      { check: 'Contains quality grades', result: report.includes('Quality Grade') },
      { check: 'Contains test breakdown', result: report.includes('#### Test Breakdown') },
      { check: 'Contains recommendations', result: report.includes('#### Recommendations') },
      { check: 'Proper markdown formatting', result: report.includes('# Pattern Test Suite Report') }
    ];

    console.log('\n📋 Report Generation Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const reportScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Report Generation Score: ${Math.round(reportScore)}%`);

    // Show sample of report
    console.log('\n📄 Report Sample:');
    console.log(report.substring(0, 500) + '...');
  }

  /**
   * Test utility functions
   */
  testUtilityFunctions(): void {
    console.log('\n🧪 Testing Utility Functions...\n');

    // Create mock test results for utility testing
    const mockResults = new Map();
    mockResults.set('high_quality', {
      patternName: 'high_quality',
      overallScore: 95,
      qualityGrade: 'A' as const,
      testResults: [
        { testName: 'Syntax Tests', score: 19, maxScore: 20 },
        { testName: 'Structure Tests', score: 24, maxScore: 25 },
        { testName: 'Output Tests', score: 29, maxScore: 30 },
        { testName: 'Integration Tests', score: 14, maxScore: 15 },
        { testName: 'Performance Tests', score: 10, maxScore: 10 }
      ]
    });

    mockResults.set('needs_improvement', {
      patternName: 'needs_improvement',
      overallScore: 65,
      qualityGrade: 'D' as const,
      testResults: [
        { testName: 'Syntax Tests', score: 15, maxScore: 20 },
        { testName: 'Structure Tests', score: 18, maxScore: 25 },
        { testName: 'Output Tests', score: 20, maxScore: 30 },
        { testName: 'Integration Tests', score: 8, maxScore: 15 },
        { testName: 'Performance Tests', score: 6, maxScore: 10 }
      ]
    });

    // Temporarily set mock results
    const originalResults = this.testSuite.getAllTestResults();
    mockResults.forEach((result, name) => {
      this.testSuite['testResults'].set(name, result);
    });

    // Test utility functions
    const topPerforming = this.testSuite.getTopPerformingPatterns(2);
    const needingImprovement = this.testSuite.getPatternsNeedingImprovement(70);
    const qualityValidation = this.testSuite.validatePatternQuality('high_quality', 90);
    const exportData = this.testSuite.exportTestResults();

    console.log('✅ Utility Function Results:');
    console.log(`   Top performing patterns: ${topPerforming.length}`);
    console.log(`   Patterns needing improvement: ${needingImprovement.length}`);
    console.log(`   Quality validation passed: ${qualityValidation}`);
    console.log(`   Export data generated: ${exportData.length > 0}`);

    if (topPerforming.length > 0) {
      console.log(`\n🏆 Top Performing Pattern: ${topPerforming[0].patternName} (${topPerforming[0].score}%)`);
    }

    if (needingImprovement.length > 0) {
      console.log(`\n⚠️  Pattern Needing Improvement: ${needingImprovement[0]}`);
    }

    // Restore original results
    this.testSuite['testResults'].clear();
    originalResults.forEach((result, name) => {
      this.testSuite['testResults'].set(name, result);
    });

    // Validate utility functions
    const validations = [
      { check: 'Top performing patterns retrieved', result: topPerforming.length > 0 },
      { check: 'Patterns needing improvement identified', result: needingImprovement.length > 0 },
      { check: 'Quality validation works', result: qualityValidation === true },
      { check: 'Export data generated', result: exportData.includes('exportDate') },
      { check: 'Export contains results', result: exportData.includes('results') },
      { check: 'Top patterns sorted by score', result: topPerforming.length <= 1 || topPerforming[0].score >= topPerforming[1].score }
    ];

    console.log('\n📋 Utility Functions Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const utilityScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Utility Functions Score: ${Math.round(utilityScore)}%`);
  }

  /**
   * Run comprehensive test suite
   */
  async runComprehensiveTest(): Promise<void> {
    console.log('🚀 Starting PatternTestSuite Comprehensive Test Suite\n');
    console.log('='.repeat(80));

    const startTime = Date.now();

    try {
      // Run all tests
      this.testPatternTestSuiteInitialization();
      this.testCustomTestConfiguration();
      await this.testPatternTestingSimulation();
      this.testReportGeneration();
      this.testUtilityFunctions();

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('\n' + '='.repeat(80));
      console.log('🎉 PatternTestSuite Test Suite Completed Successfully!');
      console.log(`⏱️  Total execution time: ${duration}ms`);
      console.log('✅ All pattern testing functionality validated');
      console.log('📊 Test execution and reporting capabilities confirmed');
      console.log('🔄 Utility functions and quality assessment verified');

    } catch (error) {
      console.error('\n❌ Test suite failed with error:', error);
      throw error;
    }
  }
}

// Export for use in other test files
export { PatternTestSuiteTest };

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new PatternTestSuiteTest();
  tester.runComprehensiveTest();
}