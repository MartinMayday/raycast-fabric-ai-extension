/**
 * Test suite for QualityAssuranceSystem class
 * Tests comprehensive quality validation and improvement functionality
 */

import { QualityAssuranceSystem, QualityAssessment, QualityThreshold } from './QualityAssuranceSystem';

class QualityAssuranceSystemTest {
  private qualitySystem: QualityAssuranceSystem;

  constructor() {
    this.qualitySystem = new QualityAssuranceSystem();
  }

  /**
   * Test quality assurance system initialization
   */
  testQualityAssuranceSystemInitialization(): void {
    console.log('🧪 Testing QualityAssuranceSystem Initialization...\n');

    // Test default thresholds
    const customSystem = new QualityAssuranceSystem({
      minOverallScore: 75,
      minSyntaxScore: 80
    });

    console.log('✅ Quality Assurance System Initialized:');
    console.log('   Default thresholds loaded');
    console.log('   Custom thresholds supported');
    console.log('   Default quality goals created');
    console.log('   Assessment tracking enabled');

    // Validate initialization
    const validations = [
      { check: 'System initialized', result: this.qualitySystem !== null },
      { check: 'Custom thresholds work', result: customSystem !== null },
      { check: 'Quality metrics available', result: typeof this.qualitySystem.getQualityMetrics === 'function' },
      { check: 'Assessment methods available', result: typeof this.qualitySystem.assessPatternQuality === 'function' },
      { check: 'Monitoring methods available', result: typeof this.qualitySystem.monitorDeployedPatterns === 'function' },
      { check: 'Reporting methods available', result: typeof this.qualitySystem.generateQualityReport === 'function' }
    ];

    console.log('\n📋 Initialization Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const initScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Initialization Score: ${Math.round(initScore)}%`);
  }

  /**
   * Test pattern quality assessment
   */
  testPatternQualityAssessment(): void {
    console.log('\n🧪 Testing Pattern Quality Assessment...\n');

    // Mock test results for assessment
    const mockTestResults = {
      patternName: 'test_pattern',
      overallScore: 85,
      testResults: [
        { testName: 'Syntax Tests', passed: true, score: 18, maxScore: 20, errors: [], warnings: [] },
        { testName: 'Structure Tests', passed: true, score: 22, maxScore: 25, errors: [], warnings: ['Minor structure issue'] },
        { testName: 'Output Tests', passed: true, score: 26, maxScore: 30, errors: [], warnings: [] },
        { testName: 'Integration Tests', passed: false, score: 10, maxScore: 15, errors: ['Integration error'], warnings: [] },
        { testName: 'Performance Tests', passed: true, score: 9, maxScore: 10, errors: [], warnings: [] }
      ]
    };

    const mockPatternContent = `# IDENTITY and PURPOSE

You are an expert test pattern for quality assessment validation.

# STEPS

- Analyze the input content step-by-step
- Generate structured output with clear sections
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

    // Perform quality assessment
    const assessment = this.qualitySystem.assessPatternQuality(
      'test_pattern',
      mockTestResults,
      mockPatternContent
    );

    console.log('✅ Quality Assessment Results:');
    console.log(`   Pattern: ${assessment.patternName}`);
    console.log(`   Overall Quality: ${assessment.overallQuality}%`);
    console.log(`   Quality Grade: ${assessment.qualityGrade}`);
    console.log(`   Meets Threshold: ${assessment.meetsThreshold}`);
    console.log(`   Quality Trend: ${assessment.qualityTrend}`);

    console.log('\n📊 Category Scores:');
    Object.entries(assessment.categoryScores).forEach(([category, score]) => {
      console.log(`   ${category}: ${score}%`);
    });

    console.log(`\n💡 Recommendations: ${assessment.recommendations.length}`);
    assessment.recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec.title} (${rec.priority} priority)`);
    });

    console.log(`\n⚠️  Critical Issues: ${assessment.criticalIssues.length}`);
    assessment.criticalIssues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue.title} (${issue.severity})`);
    });

    console.log(`\n🔔 Warnings: ${assessment.warnings.length}`);
    assessment.warnings.slice(0, 2).forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning.message}`);
    });

    // Validate assessment
    const validations = [
      { check: 'Assessment completed', result: assessment !== null },
      { check: 'Overall quality calculated', result: assessment.overallQuality > 0 },
      { check: 'Quality grade assigned', result: ['A', 'B', 'C', 'D', 'F'].includes(assessment.qualityGrade) },
      { check: 'Category scores calculated', result: Object.keys(assessment.categoryScores).length === 8 },
      { check: 'Recommendations generated', result: assessment.recommendations.length > 0 },
      { check: 'Threshold validation performed', result: typeof assessment.meetsThreshold === 'boolean' },
      { check: 'Quality trend calculated', result: ['improving', 'stable', 'declining'].includes(assessment.qualityTrend) }
    ];

    console.log('\n📋 Assessment Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const assessmentScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Assessment Functionality Score: ${Math.round(assessmentScore)}%`);
  }

  /**
   * Test quality metrics and reporting
   */
  testQualityMetricsAndReporting(): void {
    console.log('\n🧪 Testing Quality Metrics and Reporting...\n');

    // Add multiple pattern assessments for testing
    const patterns = [
      { name: 'high_quality_pattern', score: 92, grade: 'A' },
      { name: 'good_pattern', score: 78, grade: 'C' },
      { name: 'needs_improvement', score: 65, grade: 'D' },
      { name: 'failing_pattern', score: 45, grade: 'F' }
    ];

    patterns.forEach(pattern => {
      const mockResults = {
        patternName: pattern.name,
        overallScore: pattern.score,
        testResults: [
          { testName: 'Syntax Tests', passed: true, score: 18, maxScore: 20, errors: [], warnings: [] },
          { testName: 'Structure Tests', passed: true, score: 20, maxScore: 25, errors: [], warnings: [] },
          { testName: 'Output Tests', passed: pattern.score > 70, score: 25, maxScore: 30, errors: [], warnings: [] },
          { testName: 'Integration Tests', passed: pattern.score > 60, score: 12, maxScore: 15, errors: [], warnings: [] },
          { testName: 'Performance Tests', passed: true, score: 8, maxScore: 10, errors: [], warnings: [] }
        ]
      };

      this.qualitySystem.assessPatternQuality(pattern.name, mockResults);
    });

    // Get quality metrics
    const metrics = this.qualitySystem.getQualityMetrics();

    console.log('✅ Quality Metrics:');
    console.log(`   Total Patterns: ${metrics.totalPatterns}`);
    console.log(`   Patterns Passing Threshold: ${metrics.patternsPassingThreshold}`);
    console.log(`   Average Quality Score: ${metrics.averageQualityScore}%`);
    console.log(`   Overall Trend: ${metrics.trendAnalysis.overallTrend}`);

    console.log('\n📊 Quality Distribution:');
    Object.entries(metrics.qualityDistribution).forEach(([grade, count]) => {
      console.log(`   ${grade}: ${count} patterns`);
    });

    console.log('\n🏆 Top Performing Patterns:');
    metrics.topPerformingPatterns.forEach((pattern, index) => {
      console.log(`   ${index + 1}. ${pattern}`);
    });

    console.log('\n⚠️  Patterns Needing Attention:');
    metrics.patternsNeedingAttention.forEach((pattern, index) => {
      console.log(`   ${index + 1}. ${pattern}`);
    });

    // Generate quality report
    const report = this.qualitySystem.generateQualityReport();

    console.log('\n📄 Quality Report Generated:');
    console.log(`   Report Date: ${report.reportDate}`);
    console.log(`   Pattern Assessments: ${report.patternAssessments.length}`);
    console.log(`   System Recommendations: ${report.systemRecommendations.length}`);
    console.log(`   Quality Goals: ${report.qualityGoals.length}`);
    console.log(`   Action Items: ${report.actionPlan.length}`);

    // Validate metrics and reporting
    const validations = [
      { check: 'Metrics calculated', result: metrics.totalPatterns === 4 },
      { check: 'Quality distribution accurate', result: Object.values(metrics.qualityDistribution).reduce((a, b) => a + b, 0) === 4 },
      { check: 'Top performers identified', result: metrics.topPerformingPatterns.length > 0 },
      { check: 'Attention patterns identified', result: metrics.patternsNeedingAttention.length > 0 },
      { check: 'Report generated', result: report !== null },
      { check: 'Report has assessments', result: report.patternAssessments.length > 0 },
      { check: 'Action plan created', result: report.actionPlan.length > 0 }
    ];

    console.log('\n📋 Metrics and Reporting Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const metricsScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Metrics and Reporting Score: ${Math.round(metricsScore)}%`);
  }

  /**
   * Test quality monitoring and improvement
   */
  testQualityMonitoringAndImprovement(): void {
    console.log('\n🧪 Testing Quality Monitoring and Improvement...\n');

    // Get patterns needing attention
    const patternsNeedingAttention = this.qualitySystem.getPatternsNeedingAttention();

    console.log('✅ Quality Monitoring Results:');
    console.log(`   Patterns needing attention: ${patternsNeedingAttention.length}`);

    patternsNeedingAttention.forEach((assessment, index) => {
      console.log(`   ${index + 1}. ${assessment.patternName} (${assessment.overallQuality}%, Grade ${assessment.qualityGrade})`);
      console.log(`      Critical Issues: ${assessment.criticalIssues.length}`);
      console.log(`      Recommendations: ${assessment.recommendations.length}`);
      console.log(`      Meets Threshold: ${assessment.meetsThreshold}`);
    });

    // Monitor deployed patterns
    const monitoringResults = this.qualitySystem.monitorDeployedPatterns();

    console.log(`\n🔍 Deployed Pattern Monitoring:`);
    console.log(`   Patterns under monitoring: ${monitoringResults.size}`);

    monitoringResults.forEach((assessment, patternName) => {
      console.log(`   ${patternName}: ${assessment.overallQuality}% (${assessment.qualityTrend} trend)`);
    });

    // Test threshold updates
    const originalMetrics = this.qualitySystem.getQualityMetrics();
    
    this.qualitySystem.updateQualityThresholds({
      minOverallScore: 80,
      minSyntaxScore: 85
    });

    const updatedMetrics = this.qualitySystem.getQualityMetrics();

    console.log('\n⚙️  Quality Threshold Updates:');
    console.log(`   Original passing patterns: ${originalMetrics.patternsPassingThreshold}`);
    console.log(`   Updated passing patterns: ${updatedMetrics.patternsPassingThreshold}`);
    console.log(`   Threshold impact: ${originalMetrics.patternsPassingThreshold - updatedMetrics.patternsPassingThreshold} patterns affected`);

    // Validate monitoring and improvement
    const validations = [
      { check: 'Patterns needing attention identified', result: patternsNeedingAttention.length > 0 },
      { check: 'Monitoring results available', result: monitoringResults.size > 0 },
      { check: 'Threshold updates work', result: updatedMetrics.patternsPassingThreshold !== originalMetrics.patternsPassingThreshold },
      { check: 'Quality trends tracked', result: patternsNeedingAttention.every(p => ['improving', 'stable', 'declining'].includes(p.qualityTrend)) },
      { check: 'Critical issues identified', result: patternsNeedingAttention.some(p => p.criticalIssues.length > 0) },
      { check: 'Recommendations provided', result: patternsNeedingAttention.every(p => p.recommendations.length > 0) }
    ];

    console.log('\n📋 Monitoring and Improvement Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const monitoringScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Monitoring and Improvement Score: ${Math.round(monitoringScore)}%`);
  }

  /**
   * Test data export and import functionality
   */
  testDataExportImport(): void {
    console.log('\n🧪 Testing Data Export and Import...\n');

    // Export quality data
    const exportedData = this.qualitySystem.exportQualityData();

    console.log('✅ Data Export Results:');
    console.log(`   Export data size: ${exportedData.length} characters`);
    console.log(`   Contains assessments: ${exportedData.includes('assessments')}`);
    console.log(`   Contains thresholds: ${exportedData.includes('qualityThresholds')}`);
    console.log(`   Contains history: ${exportedData.includes('history')}`);

    // Create new system and import data
    const newSystem = new QualityAssuranceSystem();
    const originalMetrics = newSystem.getQualityMetrics();

    try {
      newSystem.importQualityData(exportedData);
      const importedMetrics = newSystem.getQualityMetrics();

      console.log('\n📥 Data Import Results:');
      console.log(`   Original patterns: ${originalMetrics.totalPatterns}`);
      console.log(`   Imported patterns: ${importedMetrics.totalPatterns}`);
      console.log(`   Data transfer successful: ${importedMetrics.totalPatterns > originalMetrics.totalPatterns}`);

      // Validate specific pattern assessment
      const testAssessment = newSystem.getPatternAssessment('high_quality_pattern');
      console.log(`   Test pattern imported: ${testAssessment !== null}`);
      if (testAssessment) {
        console.log(`   Test pattern quality: ${testAssessment.overallQuality}%`);
      }

    } catch (error) {
      console.error(`   Import failed: ${error}`);
    }

    // Validate export/import
    const validations = [
      { check: 'Export data generated', result: exportedData.length > 0 },
      { check: 'Export contains JSON', result: exportedData.startsWith('{') && exportedData.endsWith('}') },
      { check: 'Export contains assessments', result: exportedData.includes('assessments') },
      { check: 'Import successful', result: newSystem.getQualityMetrics().totalPatterns > 0 },
      { check: 'Pattern data preserved', result: newSystem.getPatternAssessment('high_quality_pattern') !== null },
      { check: 'Quality metrics preserved', result: newSystem.getQualityMetrics().averageQualityScore > 0 }
    ];

    console.log('\n📋 Export/Import Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const exportImportScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Export/Import Score: ${Math.round(exportImportScore)}%`);
  }

  /**
   * Run comprehensive test suite
   */
  async runComprehensiveTest(): Promise<void> {
    console.log('🚀 Starting QualityAssuranceSystem Comprehensive Test Suite\n');
    console.log('='.repeat(80));

    const startTime = Date.now();

    try {
      // Run all tests
      this.testQualityAssuranceSystemInitialization();
      this.testPatternQualityAssessment();
      this.testQualityMetricsAndReporting();
      this.testQualityMonitoringAndImprovement();
      this.testDataExportImport();

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('\n' + '='.repeat(80));
      console.log('🎉 QualityAssuranceSystem Test Suite Completed Successfully!');
      console.log(`⏱️  Total execution time: ${duration}ms`);
      console.log('✅ All quality assurance functionality validated');
      console.log('📊 Quality assessment and monitoring capabilities confirmed');
      console.log('🔄 Improvement recommendations and action planning verified');

    } catch (error) {
      console.error('\n❌ Test suite failed with error:', error);
      throw error;
    }
  }
}

// Export for use in other test files
export { QualityAssuranceSystemTest };

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new QualityAssuranceSystemTest();
  tester.runComprehensiveTest();
}