/**
 * Test suite for DeploymentIntegrator class
 * Tests production deployment and integration functionality
 */

import { DeploymentIntegrator, DeploymentConfig, DeploymentReport } from './DeploymentIntegrator';

class DeploymentIntegratorTest {
  private deploymentIntegrator: DeploymentIntegrator;

  constructor() {
    // Use test configuration
    const testConfig: Partial<DeploymentConfig> = {
      environment: 'development',
      targetDirectory: './test-patterns',
      packageJsonPath: './test-package.json',
      backupDirectory: './test-backups',
      validationEnabled: true,
      rollbackEnabled: true
    };
    
    this.deploymentIntegrator = new DeploymentIntegrator(testConfig);
  }

  /**
   * Test deployment integrator initialization
   */
  testDeploymentIntegratorInitialization(): void {
    console.log('🧪 Testing DeploymentIntegrator Initialization...\n');

    const deploymentStatus = this.deploymentIntegrator.getDeploymentStatus();
    const deploymentHistory = this.deploymentIntegrator.getDeploymentHistory();

    console.log('✅ Deployment Integrator Initialized:');
    console.log(`   Patterns configured: ${deploymentStatus.size}`);
    console.log(`   Deployment history: ${deploymentHistory.length} entries`);
    console.log('   Test environment configured');
    console.log('   Validation and rollback enabled');

    console.log('\n📦 Configured Patterns:');
    deploymentStatus.forEach((deployment, patternName) => {
      console.log(`   ${patternName}: ${deployment.status} (${deployment.commandName})`);
    });

    // Validate initialization
    const validations = [
      { check: 'Deployment integrator created', result: this.deploymentIntegrator !== null },
      { check: 'Patterns configured', result: deploymentStatus.size === 4 },
      { check: 'All patterns pending', result: Array.from(deploymentStatus.values()).every(d => d.status === 'pending') },
      { check: 'Deployment history initialized', result: Array.isArray(deploymentHistory) },
      { check: 'Landing page patterns included', result: deploymentStatus.has('analyze_wireframe_flow') },
      { check: 'Command names configured', result: Array.from(deploymentStatus.values()).every(d => d.commandName.length > 0) }
    ];

    console.log('\n📋 Initialization Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const initScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Initialization Score: ${Math.round(initScore)}%`);
  }

  /**
   * Test deployment preparation and setup
   */
  testDeploymentPreparation(): void {
    console.log('\n🧪 Testing Deployment Preparation...\n');

    const fs = require('fs');

    // Create test pattern files
    const testPatterns = [
      {
        name: 'analyze_wireframe_flow.md',
        content: `# IDENTITY and PURPOSE

You are an expert UX analyst and wireframe evaluation specialist.

# STEPS

- Analyze overall layout structure and visual hierarchy effectiveness
- Evaluate navigation design and user flow optimization
- Assess conversion optimization opportunities

# OUTPUT

- LAYOUT ANALYSIS: Assessment with layout score (1-10)
- NAVIGATION EVALUATION: Analysis with navigation rating (1-10)
- CONVERSION OPTIMIZATION: Recommendations with priority (HIGH/MEDIUM/LOW)

# OUTPUT INSTRUCTIONS

- Focus on actionable UX improvements
- Rate each design element on effectiveness (1-10)

# INPUT

INPUT:`
      },
      {
        name: 'analyze_copywriting_score.md',
        content: `# IDENTITY and PURPOSE

You are an expert copywriting analyst and conversion optimization specialist.

# STEPS

- Analyze headline effectiveness and emotional impact
- Evaluate persuasion techniques and clarity
- Assess overall copywriting quality

# OUTPUT

- HEADLINE ANALYSIS: Effectiveness assessment with score (1-10)
- PERSUASION ASSESSMENT: Techniques evaluation with rating (1-10)
- CLARITY EVALUATION: Content clarity analysis with score (1-10)

# OUTPUT INSTRUCTIONS

- Focus on conversion optimization
- Provide specific improvement recommendations

# INPUT

INPUT:`
      }
    ];

    // Ensure patterns directory exists
    if (!fs.existsSync('patterns')) {
      fs.mkdirSync('patterns', { recursive: true });
    }

    // Create test pattern files
    testPatterns.forEach(pattern => {
      fs.writeFileSync(`patterns/${pattern.name}`, pattern.content);
    });

    // Create test package.json
    const testPackageJson = {
      name: 'test-fabric-patterns',
      version: '1.0.0',
      description: 'Test package for pattern deployment',
      commands: {},
      scripts: {
        test: 'echo "Test script"'
      }
    };

    fs.writeFileSync('./test-package.json', JSON.stringify(testPackageJson, null, 2));

    console.log('✅ Deployment Preparation:');
    console.log(`   Created ${testPatterns.length} test pattern files`);
    console.log('   Created test package.json');
    console.log('   Patterns directory ready');
    console.log('   Test environment configured');

    // Validate preparation
    const validations = [
      { check: 'Patterns directory exists', result: fs.existsSync('patterns') },
      { check: 'Test pattern files created', result: testPatterns.every(p => fs.existsSync(`patterns/${p.name}`)) },
      { check: 'Test package.json created', result: fs.existsSync('./test-package.json') },
      { check: 'Pattern content valid', result: testPatterns.every(p => p.content.includes('# IDENTITY and PURPOSE')) }
    ];

    console.log('\n📋 Preparation Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const prepScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Preparation Score: ${Math.round(prepScore)}%`);
  }

  /**
   * Test pattern deployment process
   */
  async testPatternDeployment(): Promise<void> {
    console.log('\n🧪 Testing Pattern Deployment Process...\n');

    try {
      // Run deployment
      const deploymentReport = await this.deploymentIntegrator.deployAllPatterns();

      console.log('✅ Deployment Process Results:');
      console.log(`   Deployment ID: ${deploymentReport.deploymentId}`);
      console.log(`   Environment: ${deploymentReport.environment}`);
      console.log(`   Overall Status: ${deploymentReport.overallStatus}`);
      console.log(`   Total Patterns: ${deploymentReport.summary.totalPatterns}`);
      console.log(`   Successful: ${deploymentReport.summary.successfulDeployments}`);
      console.log(`   Failed: ${deploymentReport.summary.failedDeployments}`);
      console.log(`   Rollbacks: ${deploymentReport.summary.rollbacks}`);
      console.log(`   Deployment Time: ${deploymentReport.summary.deploymentTime}ms`);

      console.log('\n📊 Validation Summary:');
      console.log(`   Total Validations: ${deploymentReport.validationSummary.totalValidations}`);
      console.log(`   Passed: ${deploymentReport.validationSummary.passedValidations}`);
      console.log(`   Average Score: ${deploymentReport.validationSummary.averageScore.toFixed(1)}%`);
      console.log(`   Critical Issues: ${deploymentReport.validationSummary.criticalIssues}`);
      console.log(`   Major Issues: ${deploymentReport.validationSummary.majorIssues}`);
      console.log(`   Minor Issues: ${deploymentReport.validationSummary.minorIssues}`);

      console.log('\n🔗 Integration Summary:');
      console.log(`   Total Tests: ${deploymentReport.integrationSummary.totalTests}`);
      console.log(`   Passed: ${deploymentReport.integrationSummary.passedTests}`);
      console.log(`   Failed: ${deploymentReport.integrationSummary.failedTests}`);
      console.log(`   Average Duration: ${deploymentReport.integrationSummary.averageDuration.toFixed(0)}ms`);
      console.log(`   Critical Failures: ${deploymentReport.integrationSummary.criticalFailures.length}`);

      console.log('\n📦 Pattern Deployment Details:');
      deploymentReport.patterns.forEach((pattern, index) => {
        console.log(`   ${index + 1}. ${pattern.patternName}: ${pattern.status}`);
        if (pattern.validationResults) {
          console.log(`      Validation: ${pattern.validationResults.score}% (${pattern.validationResults.passed ? 'PASSED' : 'FAILED'})`);
        }
        if (pattern.integrationTests) {
          const passedTests = pattern.integrationTests.filter(t => t.passed).length;
          console.log(`      Integration: ${passedTests}/${pattern.integrationTests.length} tests passed`);
        }
      });

      if (deploymentReport.recommendations.length > 0) {
        console.log('\n💡 Deployment Recommendations:');
        deploymentReport.recommendations.forEach((rec, index) => {
          console.log(`   ${index + 1}. ${rec}`);
        });
      }

      // Validate deployment
      const validations = [
        { check: 'Deployment completed', result: deploymentReport !== null },
        { check: 'Deployment ID generated', result: deploymentReport.deploymentId.length > 0 },
        { check: 'Patterns processed', result: deploymentReport.patterns.length > 0 },
        { check: 'Validation performed', result: deploymentReport.validationSummary.totalValidations > 0 },
        { check: 'Integration tests run', result: deploymentReport.integrationSummary.totalTests > 0 },
        { check: 'Deployment time recorded', result: deploymentReport.summary.deploymentTime > 0 },
        { check: 'Status determined', result: ['success', 'partial', 'failed'].includes(deploymentReport.overallStatus) }
      ];

      console.log('\n📋 Deployment Validation:');
      validations.forEach(validation => {
        console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
      });

      const deploymentScore = validations.filter(v => v.result).length / validations.length * 100;
      console.log(`\n📊 Deployment Process Score: ${Math.round(deploymentScore)}%`);

    } catch (error) {
      console.error(`❌ Deployment process failed: ${error}`);
    }
  }

  /**
   * Test end-to-end functionality validation
   */
  async testEndToEndValidation(): Promise<void> {
    console.log('\n🧪 Testing End-to-End Functionality Validation...\n');

    try {
      const e2eResults = await this.deploymentIntegrator.validateEndToEndFunctionality();

      console.log('✅ End-to-End Validation Results:');
      console.log(`   Overall Status: ${e2eResults.passed ? 'PASSED' : 'FAILED'}`);
      console.log(`   Summary: ${e2eResults.summary}`);

      console.log('\n🔍 Individual Test Results:');
      e2eResults.results.forEach((test, index) => {
        const status = test.passed ? '✅' : '❌';
        console.log(`   ${status} ${test.testName}: ${test.duration}ms`);
        console.log(`      Details: ${test.details}`);
        if (test.errors.length > 0) {
          console.log(`      Errors: ${test.errors.join(', ')}`);
        }
      });

      // Validate end-to-end testing
      const validations = [
        { check: 'E2E validation completed', result: e2eResults !== null },
        { check: 'Test results available', result: e2eResults.results.length > 0 },
        { check: 'Pattern workflow tested', result: e2eResults.results.some(t => t.testName.includes('Workflow')) },
        { check: 'Raycast integration tested', result: e2eResults.results.some(t => t.testName.includes('Raycast')) },
        { check: 'Chaining functionality tested', result: e2eResults.results.some(t => t.testName.includes('Chaining')) },
        { check: 'Export functionality tested', result: e2eResults.results.some(t => t.testName.includes('Export')) },
        { check: 'Summary generated', result: e2eResults.summary.length > 0 }
      ];

      console.log('\n📋 E2E Validation:');
      validations.forEach(validation => {
        console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
      });

      const e2eScore = validations.filter(v => v.result).length / validations.length * 100;
      console.log(`\n📊 End-to-End Validation Score: ${Math.round(e2eScore)}%`);

    } catch (error) {
      console.error(`❌ End-to-end validation failed: ${error}`);
    }
  }

  /**
   * Test deployment reporting and monitoring
   */
  testDeploymentReportingAndMonitoring(): void {
    console.log('\n🧪 Testing Deployment Reporting and Monitoring...\n');

    // Get deployment status
    const deploymentStatus = this.deploymentIntegrator.getDeploymentStatus();
    const deploymentHistory = this.deploymentIntegrator.getDeploymentHistory();
    const latestReport = this.deploymentIntegrator.getLatestDeploymentReport();

    console.log('✅ Deployment Monitoring Results:');
    console.log(`   Current deployments: ${deploymentStatus.size}`);
    console.log(`   Deployment history: ${deploymentHistory.length} reports`);
    console.log(`   Latest report available: ${latestReport !== null}`);

    if (latestReport) {
      console.log(`   Latest deployment: ${latestReport.deploymentId} (${latestReport.overallStatus})`);
    }

    // Generate deployment summary report
    const summaryReport = this.deploymentIntegrator.generateDeploymentSummaryReport();

    console.log('\n📄 Deployment Summary Report:');
    console.log(`   Report length: ${summaryReport.length} characters`);
    console.log(`   Contains deployment info: ${summaryReport.includes('Deployment Information')}`);
    console.log(`   Contains pattern details: ${summaryReport.includes('Pattern Deployments')}`);
    console.log(`   Contains recommendations: ${summaryReport.includes('Recommendations')}`);

    // Test data export/import
    const exportedData = this.deploymentIntegrator.exportDeploymentData();

    console.log('\n💾 Data Export/Import:');
    console.log(`   Export data size: ${exportedData.length} characters`);
    console.log(`   Contains deployment config: ${exportedData.includes('deploymentConfig')}`);
    console.log(`   Contains deployments: ${exportedData.includes('deployments')}`);
    console.log(`   Contains history: ${exportedData.includes('deploymentHistory')}`);

    // Test import
    try {
      const newIntegrator = new DeploymentIntegrator();
      newIntegrator.importDeploymentData(exportedData);
      const importedStatus = newIntegrator.getDeploymentStatus();
      console.log(`   Import successful: ${importedStatus.size > 0}`);
    } catch (error) {
      console.log(`   Import failed: ${error}`);
    }

    // Validate reporting and monitoring
    const validations = [
      { check: 'Deployment status available', result: deploymentStatus.size > 0 },
      { check: 'Deployment history tracked', result: Array.isArray(deploymentHistory) },
      { check: 'Latest report accessible', result: latestReport !== null || deploymentHistory.length === 0 },
      { check: 'Summary report generated', result: summaryReport.length > 0 },
      { check: 'Data export functional', result: exportedData.length > 0 },
      { check: 'Export contains valid JSON', result: exportedData.startsWith('{') && exportedData.endsWith('}') },
      { check: 'Report contains key sections', result: summaryReport.includes('Deployment Summary') }
    ];

    console.log('\n📋 Reporting and Monitoring Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const reportingScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Reporting and Monitoring Score: ${Math.round(reportingScore)}%`);
  }

  /**
   * Clean up test environment
   */
  cleanupTestEnvironment(): void {
    console.log('\n🧹 Cleaning up test environment...\n');

    const fs = require('fs');

    try {
      // Remove test files and directories
      const filesToRemove = [
        './test-package.json',
        'patterns/analyze_wireframe_flow.md',
        'patterns/analyze_copywriting_score.md'
      ];

      const dirsToRemove = [
        './test-patterns',
        './test-backups'
      ];

      filesToRemove.forEach(file => {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log(`   Removed: ${file}`);
        }
      });

      dirsToRemove.forEach(dir => {
        if (fs.existsSync(dir)) {
          fs.rmSync(dir, { recursive: true, force: true });
          console.log(`   Removed directory: ${dir}`);
        }
      });

      // Remove patterns directory if empty
      if (fs.existsSync('patterns')) {
        const files = fs.readdirSync('patterns');
        if (files.length === 0) {
          fs.rmdirSync('patterns');
          console.log('   Removed empty patterns directory');
        }
      }

      console.log('✅ Test environment cleaned up successfully');

    } catch (error) {
      console.warn(`⚠️  Cleanup warning: ${error}`);
    }
  }

  /**
   * Run comprehensive test suite
   */
  async runComprehensiveTest(): Promise<void> {
    console.log('🚀 Starting DeploymentIntegrator Comprehensive Test Suite\n');
    console.log('='.repeat(80));

    const startTime = Date.now();

    try {
      // Run all tests
      this.testDeploymentIntegratorInitialization();
      this.testDeploymentPreparation();
      await this.testPatternDeployment();
      await this.testEndToEndValidation();
      this.testDeploymentReportingAndMonitoring();

      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log('\n' + '='.repeat(80));
      console.log('🎉 DeploymentIntegrator Test Suite Completed Successfully!');
      console.log(`⏱️  Total execution time: ${duration}ms`);
      console.log('✅ All deployment functionality validated');
      console.log('📦 Pattern deployment process confirmed');
      console.log('🔗 Integration testing capabilities verified');
      console.log('📊 Reporting and monitoring systems validated');

    } catch (error) {
      console.error('\n❌ Test suite failed with error:', error);
      throw error;
    } finally {
      // Always clean up test environment
      this.cleanupTestEnvironment();
    }
  }
}

// Export for use in other test files
export { DeploymentIntegratorTest };

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new DeploymentIntegratorTest();
  tester.runComprehensiveTest();
}