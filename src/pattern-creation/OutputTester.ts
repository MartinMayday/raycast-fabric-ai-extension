import { PatternTemplate } from './BestPracticesDatabase';
import { SampleCollection, EnhancedSampleInput, DetailedExpectedOutput, TestScenario } from './SampleCollectionGenerator';
import { PatternSpecification } from './SpecificationBuilder';

export interface TestResult {
  testId: string;
  sampleId: string;
  patternName: string;
  passed: boolean;
  score: number; // 0-100
  executionTime: number; // milliseconds
  outputAnalysis: OutputAnalysis;
  issues: TestIssue[];
  recommendations: string[];
}

export interface OutputAnalysis {
  sectionsGenerated: string[];
  sectionsExpected: string[];
  sectionsMatched: number;
  contentQuality: ContentQuality;
  formatCompliance: FormatCompliance;
  specificityScore: number; // 0-100
  actionabilityScore: number; // 0-100
}

export interface ContentQuality {
  hasSpecificExamples: boolean;
  hasActionableRecommendations: boolean;
  hasQuantitativeAssessments: boolean;
  hasPriorityLevels: boolean;
  professionalTone: boolean;
  appropriateLength: boolean;
}

export interface FormatCompliance {
  followsStructure: boolean;
  properSectionLabels: boolean;
  consistentFormatting: boolean;
  includesScoring: boolean;
  meetsWordCount: boolean;
}

export interface TestIssue {
  severity: 'critical' | 'major' | 'minor';
  category: 'output_format' | 'content_quality' | 'missing_sections' | 'performance';
  message: string;
  expectedValue?: string;
  actualValue?: string;
  suggestion: string;
}

export interface TestSuite {
  patternName: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageScore: number;
  executionTime: number;
  testResults: TestResult[];
  summary: TestSummary;
}

export interface TestSummary {
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  topRecommendations: string[];
  performanceMetrics: PerformanceMetrics;
}

export interface PerformanceMetrics {
  averageExecutionTime: number;
  slowestTest: string;
  fastestTest: string;
  memoryUsage?: number;
  throughput: number; // tests per second
}

export class OutputTester {
  private testTimeout: number = 30000; // 30 seconds
  private enablePerformanceMetrics: boolean = true;

  constructor(options: { timeout?: number; enablePerformanceMetrics?: boolean } = {}) {
    this.testTimeout = options.timeout || 30000;
    this.enablePerformanceMetrics = options.enablePerformanceMetrics !== false;
  }

  /**
   * Test a pattern with sample inputs and validate outputs
   */
  async testPattern(
    template: PatternTemplate,
    sampleCollection: SampleCollection,
    specification: PatternSpecification
  ): Promise<TestSuite> {
    const startTime = Date.now();
    const testResults: TestResult[] = [];

    // Test with enhanced samples
    for (const sample of sampleCollection.samples) {
      const result = await this.testSampleInput(template, sample, specification);
      testResults.push(result);
    }

    // Test with validation samples
    for (const validationSample of sampleCollection.validationSamples) {
      const mockSample: EnhancedSampleInput = {
        id: validationSample.id,
        name: validationSample.name,
        description: `Validation sample: ${validationSample.name}`,
        contentType: 'validation',
        complexity: validationSample.expectedQuality === 'high' ? 'simple' : 
                   validationSample.expectedQuality === 'medium' ? 'medium' : 'complex',
        content: validationSample.input,
        expectedInsights: [],
        category: 'Validation',
        industry: 'Test',
        targetAudience: 'Test users',
        conversionGoal: 'Test validation',
        keyElements: [],
        challenges: validationSample.commonIssues,
        fullContent: validationSample.input,
        metadata: {
          createdDate: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
          version: '1.0.0',
          tags: ['validation'],
          difficulty: validationSample.expectedQuality === 'high' ? 3 : 
                     validationSample.expectedQuality === 'medium' ? 6 : 9,
          estimatedAnalysisTime: 10
        }
      };

      const result = await this.testSampleInput(template, mockSample, specification);
      testResults.push(result);
    }

    // Test scenarios
    for (const scenario of sampleCollection.testScenarios) {
      const result = await this.testScenario(template, scenario, specification);
      testResults.push(result);
    }

    const executionTime = Date.now() - startTime;
    const passedTests = testResults.filter(r => r.passed).length;
    const averageScore = testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length;

    return {
      patternName: template.name,
      totalTests: testResults.length,
      passedTests,
      failedTests: testResults.length - passedTests,
      averageScore: Math.round(averageScore),
      executionTime,
      testResults,
      summary: this.generateTestSummary(testResults, executionTime)
    };
  }

  /**
   * Test multiple patterns in batch
   */
  async testPatterns(
    templates: PatternTemplate[],
    sampleCollections: Record<string, SampleCollection>,
    specifications: Record<string, PatternSpecification>
  ): Promise<Record<string, TestSuite>> {
    const results: Record<string, TestSuite> = {};

    for (const template of templates) {
      const sampleCollection = sampleCollections[template.name];
      const specification = specifications[template.name];

      if (sampleCollection && specification) {
        results[template.name] = await this.testPattern(template, sampleCollection, specification);
      }
    }

    return results;
  }

  /**
   * Generate comprehensive test report
   */
  generateTestReport(testSuites: Record<string, TestSuite>): string {
    const report: string[] = [];
    report.push('# Pattern Output Testing Report\n');

    // Overall summary
    const totalTests = Object.values(testSuites).reduce((sum, suite) => sum + suite.totalTests, 0);
    const totalPassed = Object.values(testSuites).reduce((sum, suite) => sum + suite.passedTests, 0);
    const averageScore = Object.values(testSuites).reduce((sum, suite) => sum + suite.averageScore, 0) / Object.keys(testSuites).length;
    const totalExecutionTime = Object.values(testSuites).reduce((sum, suite) => sum + suite.executionTime, 0);

    report.push('## Executive Summary');
    report.push(`- **Total Tests**: ${totalTests}`);
    report.push(`- **Passed Tests**: ${totalPassed} (${Math.round(totalPassed/totalTests*100)}%)`);
    report.push(`- **Average Score**: ${Math.round(averageScore)}/100`);
    report.push(`- **Total Execution Time**: ${Math.round(totalExecutionTime/1000)}s\n`);

    // Pattern-specific results
    report.push('## Pattern Test Results\n');

    Object.entries(testSuites).forEach(([patternName, suite]) => {
      report.push(`### ${patternName}`);
      report.push(`- **Status**: ${suite.summary.overallHealth.toUpperCase()}`);
      report.push(`- **Tests**: ${suite.passedTests}/${suite.totalTests} passed (${Math.round(suite.passedTests/suite.totalTests*100)}%)`);
      report.push(`- **Average Score**: ${suite.averageScore}/100`);
      report.push(`- **Execution Time**: ${Math.round(suite.executionTime/1000)}s`);
      
      if (suite.summary.criticalIssues > 0) {
        report.push(`- **Critical Issues**: ${suite.summary.criticalIssues}`);
      }
      
      if (suite.summary.topRecommendations.length > 0) {
        report.push(`- **Top Recommendations**:`);
        suite.summary.topRecommendations.slice(0, 3).forEach(rec => {
          report.push(`  - ${rec}`);
        });
      }

      // Performance metrics
      if (this.enablePerformanceMetrics) {
        const perf = suite.summary.performanceMetrics;
        report.push(`- **Performance**: ${Math.round(perf.averageExecutionTime)}ms avg, ${perf.throughput.toFixed(1)} tests/sec`);
      }

      report.push('');
    });

    // Detailed issues
    report.push('## Critical Issues\n');
    Object.entries(testSuites).forEach(([patternName, suite]) => {
      const criticalIssues = suite.testResults.flatMap(r => r.issues.filter(i => i.severity === 'critical'));
      if (criticalIssues.length > 0) {
        report.push(`### ${patternName}`);
        criticalIssues.slice(0, 5).forEach(issue => {
          report.push(`- **${issue.category}**: ${issue.message}`);
          if (issue.suggestion) {
            report.push(`  - *Suggestion*: ${issue.suggestion}`);
          }
        });
        report.push('');
      }
    });

    return report.join('\n');
  }

  // Private testing methods

  private async testSampleInput(
    template: PatternTemplate,
    sample: EnhancedSampleInput,
    specification: PatternSpecification
  ): Promise<TestResult> {
    const startTime = Date.now();
    const testId = `${template.name}_${sample.id}`;

    try {
      // Simulate pattern execution (in real implementation, this would call the actual pattern)
      const simulatedOutput = await this.simulatePatternExecution(template, sample);
      
      // Analyze the output
      const outputAnalysis = this.analyzeOutput(simulatedOutput, template, specification);
      
      // Check against expected output if available
      const expectedOutput = this.findExpectedOutput(sample.id, template.name);
      
      // Calculate score and determine pass/fail
      const score = this.calculateTestScore(outputAnalysis, expectedOutput);
      const passed = score >= 70 && outputAnalysis.sectionsMatched >= outputAnalysis.sectionsExpected.length * 0.8;
      
      // Identify issues
      const issues = this.identifyTestIssues(outputAnalysis, expectedOutput, specification);
      
      // Generate recommendations
      const recommendations = this.generateTestRecommendations(issues, outputAnalysis);

      return {
        testId,
        sampleId: sample.id,
        patternName: template.name,
        passed,
        score,
        executionTime: Date.now() - startTime,
        outputAnalysis,
        issues,
        recommendations
      };

    } catch (error) {
      return {
        testId,
        sampleId: sample.id,
        patternName: template.name,
        passed: false,
        score: 0,
        executionTime: Date.now() - startTime,
        outputAnalysis: this.getEmptyOutputAnalysis(),
        issues: [{
          severity: 'critical',
          category: 'performance',
          message: `Test execution failed: ${error.message}`,
          suggestion: 'Review pattern implementation and fix execution errors'
        }],
        recommendations: ['Fix critical execution errors before proceeding']
      };
    }
  }

  private async testScenario(
    template: PatternTemplate,
    scenario: TestScenario,
    specification: PatternSpecification
  ): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Simulate pattern execution with scenario input
      const simulatedOutput = await this.simulatePatternExecution(template, {
        id: scenario.id,
        name: scenario.name,
        content: scenario.input
      } as any);

      // Analyze based on scenario expectations
      const outputAnalysis = this.analyzeScenarioOutput(simulatedOutput, scenario, specification);
      
      // Score based on scenario validation criteria
      const score = this.calculateScenarioScore(outputAnalysis, scenario);
      const passed = score >= 60; // Lower threshold for edge cases
      
      const issues = this.identifyScenarioIssues(outputAnalysis, scenario);
      const recommendations = this.generateScenarioRecommendations(scenario, issues);

      return {
        testId: scenario.id,
        sampleId: scenario.id,
        patternName: template.name,
        passed,
        score,
        executionTime: Date.now() - startTime,
        outputAnalysis,
        issues,
        recommendations
      };

    } catch (error) {
      return {
        testId: scenario.id,
        sampleId: scenario.id,
        patternName: template.name,
        passed: false,
        score: 0,
        executionTime: Date.now() - startTime,
        outputAnalysis: this.getEmptyOutputAnalysis(),
        issues: [{
          severity: 'critical',
          category: 'performance',
          message: `Scenario test failed: ${error.message}`,
          suggestion: 'Review scenario handling and error management'
        }],
        recommendations: ['Improve error handling for edge cases']
      };
    }
  }

  private async simulatePatternExecution(template: PatternTemplate, input: any): Promise<string> {
    // Simulate pattern execution - in real implementation, this would execute the actual pattern
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50)); // Simulate processing time
    
    const sections = template.structure.outputSections.map(section => {
      return `# ${section}\n\nSimulated analysis for ${section.toLowerCase()} based on input: ${input.name || input.id}\n\nDetailed analysis would appear here with specific examples and recommendations.\n`;
    });

    return sections.join('\n');
  }

  private analyzeOutput(
    output: string,
    template: PatternTemplate,
    specification: PatternSpecification
  ): OutputAnalysis {
    const sectionsExpected = template.structure.outputSections;
    const sectionsGenerated = this.extractSectionsFromOutput(output);
    const sectionsMatched = sectionsExpected.filter(expected => 
      sectionsGenerated.some(generated => generated.includes(expected))
    ).length;

    return {
      sectionsGenerated,
      sectionsExpected,
      sectionsMatched,
      contentQuality: this.analyzeContentQuality(output, specification),
      formatCompliance: this.analyzeFormatCompliance(output, template, specification),
      specificityScore: this.calculateSpecificityScore(output),
      actionabilityScore: this.calculateActionabilityScore(output)
    };
  }

  private analyzeScenarioOutput(
    output: string,
    scenario: TestScenario,
    specification: PatternSpecification
  ): OutputAnalysis {
    // Simplified analysis for scenarios
    return {
      sectionsGenerated: this.extractSectionsFromOutput(output),
      sectionsExpected: specification.outputStructure.sections.map(s => s.name),
      sectionsMatched: 1, // Simplified for scenarios
      contentQuality: {
        hasSpecificExamples: output.includes('example') || output.includes('specific'),
        hasActionableRecommendations: output.includes('recommend') || output.includes('improve'),
        hasQuantitativeAssessments: /\d+/.test(output),
        hasPriorityLevels: output.includes('high') || output.includes('medium') || output.includes('low'),
        professionalTone: output.length > 50,
        appropriateLength: output.length > 100
      },
      formatCompliance: {
        followsStructure: output.includes('#'),
        properSectionLabels: true,
        consistentFormatting: true,
        includesScoring: /\d+\/\d+|\d+%/.test(output),
        meetsWordCount: output.split(/\s+/).length >= 50
      },
      specificityScore: Math.min(100, output.length / 10),
      actionabilityScore: output.includes('recommend') ? 80 : 60
    };
  }

  private analyzeContentQuality(output: string, specification: PatternSpecification): ContentQuality {
    return {
      hasSpecificExamples: output.includes('example') || output.includes('specific') || output.includes('instance'),
      hasActionableRecommendations: output.includes('recommend') || output.includes('improve') || output.includes('optimize'),
      hasQuantitativeAssessments: /\d+\/\d+|\d+%|\d+\.\d+/.test(output),
      hasPriorityLevels: output.includes('HIGH') || output.includes('MEDIUM') || output.includes('LOW'),
      professionalTone: !output.includes('awesome') && !output.includes('terrible') && output.length > 100,
      appropriateLength: output.split(/\s+/).length >= specification.validationCriteria.minimumWordCount
    };
  }

  private analyzeFormatCompliance(
    output: string,
    template: PatternTemplate,
    specification: PatternSpecification
  ): FormatCompliance {
    return {
      followsStructure: output.includes('#') && output.includes('\n'),
      properSectionLabels: template.structure.outputSections.some(section => output.includes(section)),
      consistentFormatting: output.includes('# ') || output.includes('## '),
      includesScoring: specification.validationCriteria.scoringRequired ? 
        /\d+\/\d+|\d+%|score|rating/i.test(output) : true,
      meetsWordCount: output.split(/\s+/).length >= specification.validationCriteria.minimumWordCount
    };
  }

  private calculateSpecificityScore(output: string): number {
    let score = 50; // Base score
    
    // Check for specific indicators
    if (output.includes('specific')) score += 10;
    if (output.includes('example')) score += 10;
    if (/\d+/.test(output)) score += 15; // Contains numbers
    if (output.includes('%')) score += 10;
    if (output.length > 500) score += 15; // Detailed content
    
    return Math.min(100, score);
  }

  private calculateActionabilityScore(output: string): number {
    let score = 40; // Base score
    
    // Check for actionable language
    const actionWords = ['improve', 'optimize', 'add', 'remove', 'change', 'implement', 'test', 'consider'];
    const actionCount = actionWords.filter(word => output.toLowerCase().includes(word)).length;
    score += actionCount * 8;
    
    // Check for priority indicators
    if (output.includes('HIGH') || output.includes('MEDIUM') || output.includes('LOW')) score += 15;
    
    // Check for specific recommendations
    if (output.includes('recommend')) score += 10;
    
    return Math.min(100, score);
  }

  private calculateTestScore(outputAnalysis: OutputAnalysis, expectedOutput?: DetailedExpectedOutput): number {
    let score = 0;
    
    // Section matching (40% of score)
    const sectionScore = (outputAnalysis.sectionsMatched / outputAnalysis.sectionsExpected.length) * 40;
    score += sectionScore;
    
    // Content quality (30% of score)
    const qualityMetrics = outputAnalysis.contentQuality;
    const qualityScore = Object.values(qualityMetrics).filter(Boolean).length / Object.keys(qualityMetrics).length * 30;
    score += qualityScore;
    
    // Format compliance (20% of score)
    const formatMetrics = outputAnalysis.formatCompliance;
    const formatScore = Object.values(formatMetrics).filter(Boolean).length / Object.keys(formatMetrics).length * 20;
    score += formatScore;
    
    // Specificity and actionability (10% of score)
    const specificityActionabilityScore = (outputAnalysis.specificityScore + outputAnalysis.actionabilityScore) / 2 * 0.1;
    score += specificityActionabilityScore;
    
    return Math.round(score);
  }

  private calculateScenarioScore(outputAnalysis: OutputAnalysis, scenario: TestScenario): number {
    let score = 50; // Base score for scenarios
    
    // Adjust based on scenario type
    switch (scenario.testType) {
      case 'edge_case':
        // Lower expectations for edge cases
        score += outputAnalysis.contentQuality.hasActionableRecommendations ? 30 : 0;
        score += outputAnalysis.formatCompliance.followsStructure ? 20 : 0;
        break;
      case 'error_handling':
        // Focus on graceful handling
        score += outputAnalysis.contentQuality.professionalTone ? 40 : 0;
        score += outputAnalysis.actionabilityScore > 60 ? 10 : 0;
        break;
      default:
        score = this.calculateTestScore(outputAnalysis);
    }
    
    return Math.min(100, Math.max(0, score));
  }

  private identifyTestIssues(
    outputAnalysis: OutputAnalysis,
    expectedOutput: DetailedExpectedOutput | undefined,
    specification: PatternSpecification
  ): TestIssue[] {
    const issues: TestIssue[] = [];
    
    // Missing sections
    const missingSections = outputAnalysis.sectionsExpected.filter(expected => 
      !outputAnalysis.sectionsGenerated.some(generated => generated.includes(expected))
    );
    
    missingSections.forEach(section => {
      issues.push({
        severity: 'major',
        category: 'missing_sections',
        message: `Missing required section: ${section}`,
        expectedValue: section,
        actualValue: 'Not found',
        suggestion: `Add ${section} section to output structure`
      });
    });
    
    // Content quality issues
    if (!outputAnalysis.contentQuality.hasSpecificExamples) {
      issues.push({
        severity: 'minor',
        category: 'content_quality',
        message: 'Output lacks specific examples',
        suggestion: 'Include concrete examples from the analyzed content'
      });
    }
    
    if (!outputAnalysis.contentQuality.hasActionableRecommendations) {
      issues.push({
        severity: 'major',
        category: 'content_quality',
        message: 'Output lacks actionable recommendations',
        suggestion: 'Add specific, implementable recommendations'
      });
    }
    
    // Format compliance issues
    if (!outputAnalysis.formatCompliance.meetsWordCount) {
      issues.push({
        severity: 'minor',
        category: 'output_format',
        message: `Output below minimum word count (${specification.validationCriteria.minimumWordCount})`,
        suggestion: 'Expand analysis with more detailed content'
      });
    }
    
    return issues;
  }

  private identifyScenarioIssues(outputAnalysis: OutputAnalysis, scenario: TestScenario): TestIssue[] {
    const issues: TestIssue[] = [];
    
    // Scenario-specific validation
    if (scenario.testType === 'error_handling' && !outputAnalysis.contentQuality.professionalTone) {
      issues.push({
        severity: 'major',
        category: 'content_quality',
        message: 'Error handling lacks professional tone',
        suggestion: 'Maintain professional language even when handling errors'
      });
    }
    
    if (scenario.testType === 'minimal_content' && outputAnalysis.specificityScore < 40) {
      issues.push({
        severity: 'minor',
        category: 'content_quality',
        message: 'Analysis lacks specificity for minimal content',
        suggestion: 'Provide more specific guidance even with limited input'
      });
    }
    
    return issues;
  }

  private generateTestRecommendations(issues: TestIssue[], outputAnalysis: OutputAnalysis): string[] {
    const recommendations: string[] = [];
    
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const majorIssues = issues.filter(i => i.severity === 'major');
    
    if (criticalIssues.length > 0) {
      recommendations.push('Address critical issues immediately to ensure pattern functionality');
    }
    
    if (majorIssues.length > 0) {
      recommendations.push('Fix major issues to improve pattern reliability and output quality');
    }
    
    if (outputAnalysis.specificityScore < 60) {
      recommendations.push('Enhance output specificity with more concrete examples and details');
    }
    
    if (outputAnalysis.actionabilityScore < 70) {
      recommendations.push('Improve actionability by adding more implementable recommendations');
    }
    
    return recommendations.slice(0, 5); // Limit to top 5 recommendations
  }

  private generateScenarioRecommendations(scenario: TestScenario, issues: TestIssue[]): string[] {
    const recommendations: string[] = [];
    
    switch (scenario.testType) {
      case 'edge_case':
        recommendations.push('Improve handling of edge cases and minimal content scenarios');
        break;
      case 'error_handling':
        recommendations.push('Enhance error handling with more graceful failure modes');
        break;
      case 'comprehensive':
        recommendations.push('Optimize performance for complex, feature-rich content');
        break;
      default:
        recommendations.push('Review scenario-specific requirements and validation criteria');
    }
    
    return recommendations;
  }

  private generateTestSummary(testResults: TestResult[], executionTime: number): TestSummary {
    const criticalIssues = testResults.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'critical').length, 0);
    const majorIssues = testResults.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'major').length, 0);
    const minorIssues = testResults.reduce((sum, r) => sum + r.issues.filter(i => i.severity === 'minor').length, 0);
    
    const averageScore = testResults.reduce((sum, r) => sum + r.score, 0) / testResults.length;
    const passRate = testResults.filter(r => r.passed).length / testResults.length;
    
    let overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
    if (averageScore >= 85 && passRate >= 0.9 && criticalIssues === 0) overallHealth = 'excellent';
    else if (averageScore >= 70 && passRate >= 0.8 && criticalIssues === 0) overallHealth = 'good';
    else if (averageScore >= 60 && passRate >= 0.6) overallHealth = 'fair';
    else overallHealth = 'poor';
    
    // Collect top recommendations
    const allRecommendations = testResults.flatMap(r => r.recommendations);
    const recommendationCounts = allRecommendations.reduce((counts, rec) => {
      counts[rec] = (counts[rec] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    const topRecommendations = Object.entries(recommendationCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([rec]) => rec);
    
    // Performance metrics
    const executionTimes = testResults.map(r => r.executionTime);
    const averageExecutionTime = executionTimes.reduce((sum, time) => sum + time, 0) / executionTimes.length;
    const slowestTest = testResults.reduce((slowest, current) => 
      current.executionTime > slowest.executionTime ? current : slowest
    ).testId;
    const fastestTest = testResults.reduce((fastest, current) => 
      current.executionTime < fastest.executionTime ? current : fastest
    ).testId;
    
    return {
      overallHealth,
      criticalIssues,
      majorIssues,
      minorIssues,
      topRecommendations,
      performanceMetrics: {
        averageExecutionTime,
        slowestTest,
        fastestTest,
        throughput: testResults.length / (executionTime / 1000)
      }
    };
  }

  // Helper methods

  private extractSectionsFromOutput(output: string): string[] {
    const sectionRegex = /^#\s+(.+)$/gm;
    const matches = output.match(sectionRegex);
    return matches ? matches.map(match => match.replace(/^#\s+/, '')) : [];
  }

  private findExpectedOutput(sampleId: string, patternName: string): DetailedExpectedOutput | undefined {
    // In real implementation, this would look up expected outputs from sample collection
    return undefined;
  }

  private getEmptyOutputAnalysis(): OutputAnalysis {
    return {
      sectionsGenerated: [],
      sectionsExpected: [],
      sectionsMatched: 0,
      contentQuality: {
        hasSpecificExamples: false,
        hasActionableRecommendations: false,
        hasQuantitativeAssessments: false,
        hasPriorityLevels: false,
        professionalTone: false,
        appropriateLength: false
      },
      formatCompliance: {
        followsStructure: false,
        properSectionLabels: false,
        consistentFormatting: false,
        includesScoring: false,
        meetsWordCount: false
      },
      specificityScore: 0,
      actionabilityScore: 0
    };
  }
}