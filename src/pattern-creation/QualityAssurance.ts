import { PatternTemplate } from './BestPracticesDatabase';
import { ValidationResult } from './PatternValidator';
import { TestSuite } from './OutputTester';
import { PatternSpecification } from './SpecificationBuilder';

export interface QualityReport {
  patternName: string;
  overallQuality: QualityRating;
  qualityScore: number; // 0-100
  complianceLevel: ComplianceLevel;
  qualityMetrics: QualityMetrics;
  standardsCompliance: StandardsCompliance;
  recommendations: QualityRecommendation[];
  certificationStatus: CertificationStatus;
}

export interface QualityMetrics {
  functionality: number; // 0-100
  reliability: number; // 0-100
  usability: number; // 0-100
  efficiency: number; // 0-100
  maintainability: number; // 0-100
  portability: number; // 0-100
}

export interface StandardsCompliance {
  fabricStandards: boolean;
  outputFormatting: boolean;
  contentQuality: boolean;
  performanceStandards: boolean;
  errorHandling: boolean;
  documentation: boolean;
}

export interface QualityRecommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'functionality' | 'reliability' | 'usability' | 'performance' | 'maintainability';
  title: string;
  description: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  implementation: string[];
}

export interface CertificationStatus {
  certified: boolean;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'none';
  requirements: CertificationRequirement[];
  nextLevel?: string;
  improvementsNeeded: string[];
}

export interface CertificationRequirement {
  name: string;
  met: boolean;
  threshold: number;
  actual: number;
  description: string;
}

export type QualityRating = 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'poor';
export type ComplianceLevel = 'full' | 'substantial' | 'partial' | 'minimal' | 'non_compliant';

export interface QualityConfig {
  minimumQualityScore: number;
  strictMode: boolean;
  enableCertification: boolean;
  performanceThresholds: PerformanceThresholds;
  qualityStandards: QualityStandards;
}

export interface PerformanceThresholds {
  maxExecutionTime: number; // milliseconds
  minThroughput: number; // tests per second
  maxMemoryUsage: number; // MB
  minReliability: number; // percentage
}

export interface QualityStandards {
  minFunctionality: number;
  minReliability: number;
  minUsability: number;
  minEfficiency: number;
  minMaintainability: number;
  minPortability: number;
}

export class QualityAssurance {
  private config: QualityConfig;

  constructor(config: Partial<QualityConfig> = {}) {
    this.config = {
      minimumQualityScore: 75,
      strictMode: false,
      enableCertification: true,
      performanceThresholds: {
        maxExecutionTime: 5000,
        minThroughput: 1.0,
        maxMemoryUsage: 100,
        minReliability: 95
      },
      qualityStandards: {
        minFunctionality: 80,
        minReliability: 85,
        minUsability: 75,
        minEfficiency: 70,
        minMaintainability: 75,
        minPortability: 70
      },
      ...config
    };
  }

  /**
   * Perform comprehensive quality assessment
   */
  async assessQuality(
    template: PatternTemplate,
    validationResult: ValidationResult,
    testSuite: TestSuite,
    specification: PatternSpecification
  ): Promise<QualityReport> {
    // Calculate quality metrics
    const qualityMetrics = this.calculateQualityMetrics(validationResult, testSuite, specification);
    
    // Assess standards compliance
    const standardsCompliance = this.assessStandardsCompliance(template, validationResult, testSuite);
    
    // Calculate overall quality score
    const qualityScore = this.calculateOverallQualityScore(qualityMetrics, standardsCompliance);
    
    // Determine quality rating
    const overallQuality = this.determineQualityRating(qualityScore, validationResult, testSuite);
    
    // Assess compliance level
    const complianceLevel = this.determineComplianceLevel(standardsCompliance, validationResult);
    
    // Generate recommendations
    const recommendations = this.generateQualityRecommendations(
      template, validationResult, testSuite, qualityMetrics, standardsCompliance
    );
    
    // Assess certification status
    const certificationStatus = this.config.enableCertification 
      ? this.assessCertificationStatus(qualityScore, qualityMetrics, standardsCompliance, testSuite)
      : this.getDefaultCertificationStatus();

    return {
      patternName: template.name,
      overallQuality,
      qualityScore,
      complianceLevel,
      qualityMetrics,
      standardsCompliance,
      recommendations,
      certificationStatus
    };
  }

  /**
   * Batch quality assessment for multiple patterns
   */
  async assessMultiplePatterns(
    templates: PatternTemplate[],
    validationResults: Record<string, ValidationResult>,
    testSuites: Record<string, TestSuite>,
    specifications: Record<string, PatternSpecification>
  ): Promise<Record<string, QualityReport>> {
    const reports: Record<string, QualityReport> = {};

    for (const template of templates) {
      const validationResult = validationResults[template.name];
      const testSuite = testSuites[template.name];
      const specification = specifications[template.name];

      if (validationResult && testSuite && specification) {
        reports[template.name] = await this.assessQuality(
          template, validationResult, testSuite, specification
        );
      }
    }

    return reports;
  }

  /**
   * Generate comprehensive quality report
   */
  generateQualityReport(reports: Record<string, QualityReport>): string {
    const report: string[] = [];
    report.push('# Pattern Quality Assurance Report\n');

    // Executive summary
    const totalPatterns = Object.keys(reports).length;
    const certifiedPatterns = Object.values(reports).filter(r => r.certificationStatus.certified).length;
    const averageQuality = Object.values(reports).reduce((sum, r) => sum + r.qualityScore, 0) / totalPatterns;
    const excellentPatterns = Object.values(reports).filter(r => r.overallQuality === 'excellent').length;

    report.push('## Executive Summary');
    report.push(`- **Total Patterns Assessed**: ${totalPatterns}`);
    report.push(`- **Certified Patterns**: ${certifiedPatterns} (${Math.round(certifiedPatterns/totalPatterns*100)}%)`);
    report.push(`- **Average Quality Score**: ${Math.round(averageQuality)}/100`);
    report.push(`- **Excellent Quality**: ${excellentPatterns} patterns`);
    report.push(`- **Assessment Date**: ${new Date().toISOString().split('T')[0]}\n`);

    // Quality distribution
    const qualityDistribution = this.calculateQualityDistribution(reports);
    report.push('## Quality Distribution');
    Object.entries(qualityDistribution).forEach(([rating, count]) => {
      const percentage = Math.round(count / totalPatterns * 100);
      report.push(`- **${rating.charAt(0).toUpperCase() + rating.slice(1)}**: ${count} patterns (${percentage}%)`);
    });
    report.push('');

    // Certification levels
    const certificationDistribution = this.calculateCertificationDistribution(reports);
    report.push('## Certification Levels');
    Object.entries(certificationDistribution).forEach(([level, count]) => {
      if (count > 0) {
        report.push(`- **${level.charAt(0).toUpperCase() + level.slice(1)}**: ${count} patterns`);
      }
    });
    report.push('');

    // Individual pattern assessments
    report.push('## Pattern Quality Assessments\n');

    Object.entries(reports)
      .sort(([, a], [, b]) => b.qualityScore - a.qualityScore)
      .forEach(([patternName, qualityReport]) => {
        report.push(`### ${patternName}`);
        report.push(`- **Quality Rating**: ${qualityReport.overallQuality.toUpperCase()}`);
        report.push(`- **Quality Score**: ${qualityReport.qualityScore}/100`);
        report.push(`- **Compliance Level**: ${qualityReport.complianceLevel.replace('_', ' ').toUpperCase()}`);
        
        if (qualityReport.certificationStatus.certified) {
          report.push(`- **Certification**: ${qualityReport.certificationStatus.level.toUpperCase()} ✅`);
        } else {
          report.push(`- **Certification**: Not certified`);
        }

        // Quality metrics breakdown
        report.push(`- **Quality Metrics**:`);
        Object.entries(qualityReport.qualityMetrics).forEach(([metric, score]) => {
          const status = score >= this.config.qualityStandards[`min${metric.charAt(0).toUpperCase() + metric.slice(1)}` as keyof QualityStandards] ? '✅' : '❌';
          report.push(`  - ${metric.charAt(0).toUpperCase() + metric.slice(1)}: ${score}/100 ${status}`);
        });

        // Top recommendations
        const highPriorityRecs = qualityReport.recommendations.filter(r => r.priority === 'critical' || r.priority === 'high');
        if (highPriorityRecs.length > 0) {
          report.push(`- **Priority Recommendations**:`);
          highPriorityRecs.slice(0, 3).forEach(rec => {
            report.push(`  - **${rec.priority.toUpperCase()}**: ${rec.title}`);
          });
        }

        report.push('');
      });

    // Critical issues requiring immediate attention
    const criticalIssues = this.identifyCriticalIssues(reports);
    if (criticalIssues.length > 0) {
      report.push('## Critical Issues Requiring Immediate Attention\n');
      criticalIssues.forEach(issue => {
        report.push(`### ${issue.patternName}`);
        report.push(`- **Issue**: ${issue.description}`);
        report.push(`- **Impact**: ${issue.impact}`);
        report.push(`- **Action Required**: ${issue.action}\n`);
      });
    }

    // Recommendations summary
    const topRecommendations = this.aggregateTopRecommendations(reports);
    report.push('## Top Quality Improvement Recommendations\n');
    topRecommendations.slice(0, 10).forEach((rec, index) => {
      report.push(`${index + 1}. **${rec.title}** (${rec.count} patterns affected)`);
      report.push(`   - Impact: ${rec.impact}`);
      report.push(`   - Effort: ${rec.effort}\n`);
    });

    return report.join('\n');
  }

  /**
   * Ensure patterns meet minimum quality standards
   */
  ensureStandardsCompliance(reports: Record<string, QualityReport>): {
    compliant: string[];
    nonCompliant: string[];
    requiresImprovement: string[];
  } {
    const compliant: string[] = [];
    const nonCompliant: string[] = [];
    const requiresImprovement: string[] = [];

    Object.entries(reports).forEach(([patternName, report]) => {
      if (report.qualityScore >= this.config.minimumQualityScore && 
          report.complianceLevel === 'full') {
        compliant.push(patternName);
      } else if (report.qualityScore < 50 || report.complianceLevel === 'non_compliant') {
        nonCompliant.push(patternName);
      } else {
        requiresImprovement.push(patternName);
      }
    });

    return { compliant, nonCompliant, requiresImprovement };
  }

  // Private assessment methods

  private calculateQualityMetrics(
    validationResult: ValidationResult,
    testSuite: TestSuite,
    specification: PatternSpecification
  ): QualityMetrics {
    // Functionality: How well the pattern performs its intended function
    const functionality = Math.min(100, (testSuite.passedTests / testSuite.totalTests) * 100);

    // Reliability: Consistency and error handling
    const reliability = Math.min(100, 
      (validationResult.score * 0.6) + 
      ((testSuite.summary.criticalIssues === 0 ? 100 : Math.max(0, 100 - testSuite.summary.criticalIssues * 20)) * 0.4)
    );

    // Usability: Ease of use and output quality
    const usability = Math.min(100,
      (validationResult.qualityMetrics.clarity * 0.4) +
      (validationResult.qualityMetrics.actionability * 0.3) +
      (testSuite.averageScore * 0.3)
    );

    // Efficiency: Performance and resource usage
    const efficiency = Math.min(100,
      testSuite.summary.performanceMetrics.averageExecutionTime <= this.config.performanceThresholds.maxExecutionTime ? 100 :
      Math.max(0, 100 - ((testSuite.summary.performanceMetrics.averageExecutionTime - this.config.performanceThresholds.maxExecutionTime) / 100))
    );

    // Maintainability: Code quality and structure
    const maintainability = Math.min(100,
      (validationResult.qualityMetrics.consistency * 0.5) +
      (validationResult.qualityMetrics.completeness * 0.3) +
      ((testSuite.summary.majorIssues === 0 ? 100 : Math.max(0, 100 - testSuite.summary.majorIssues * 10)) * 0.2)
    );

    // Portability: Adaptability and reusability
    const portability = Math.min(100,
      (validationResult.complianceChecks.followsStructure ? 100 : 60) * 0.6 +
      (validationResult.qualityMetrics.specificity * 0.4)
    );

    return {
      functionality: Math.round(functionality),
      reliability: Math.round(reliability),
      usability: Math.round(usability),
      efficiency: Math.round(efficiency),
      maintainability: Math.round(maintainability),
      portability: Math.round(portability)
    };
  }

  private assessStandardsCompliance(
    template: PatternTemplate,
    validationResult: ValidationResult,
    testSuite: TestSuite
  ): StandardsCompliance {
    return {
      fabricStandards: validationResult.complianceChecks.followsStructure && 
                      validationResult.complianceChecks.hasRequiredSections,
      outputFormatting: validationResult.complianceChecks.hasOutput && 
                       validationResult.complianceChecks.hasInstructions,
      contentQuality: validationResult.qualityMetrics.clarity >= 70 && 
                     validationResult.qualityMetrics.specificity >= 60,
      performanceStandards: testSuite.summary.performanceMetrics.averageExecutionTime <= 
                           this.config.performanceThresholds.maxExecutionTime,
      errorHandling: testSuite.summary.criticalIssues === 0,
      documentation: template.description.length > 50 && template.bestPractices.length > 0
    };
  }

  private calculateOverallQualityScore(
    qualityMetrics: QualityMetrics,
    standardsCompliance: StandardsCompliance
  ): number {
    // Weighted average of quality metrics
    const metricsScore = (
      qualityMetrics.functionality * 0.25 +
      qualityMetrics.reliability * 0.20 +
      qualityMetrics.usability * 0.20 +
      qualityMetrics.efficiency * 0.15 +
      qualityMetrics.maintainability * 0.15 +
      qualityMetrics.portability * 0.05
    );

    // Compliance bonus/penalty
    const complianceCount = Object.values(standardsCompliance).filter(Boolean).length;
    const complianceBonus = (complianceCount / Object.keys(standardsCompliance).length) * 10;

    return Math.round(Math.min(100, metricsScore + complianceBonus));
  }

  private determineQualityRating(
    qualityScore: number,
    validationResult: ValidationResult,
    testSuite: TestSuite
  ): QualityRating {
    if (qualityScore >= 90 && testSuite.summary.criticalIssues === 0 && validationResult.isValid) {
      return 'excellent';
    } else if (qualityScore >= 80 && testSuite.summary.criticalIssues === 0) {
      return 'good';
    } else if (qualityScore >= 70 && testSuite.summary.criticalIssues <= 1) {
      return 'satisfactory';
    } else if (qualityScore >= 50) {
      return 'needs_improvement';
    } else {
      return 'poor';
    }
  }

  private determineComplianceLevel(
    standardsCompliance: StandardsCompliance,
    validationResult: ValidationResult
  ): ComplianceLevel {
    const complianceCount = Object.values(standardsCompliance).filter(Boolean).length;
    const totalStandards = Object.keys(standardsCompliance).length;
    const complianceRatio = complianceCount / totalStandards;

    if (complianceRatio >= 1.0 && validationResult.isValid) {
      return 'full';
    } else if (complianceRatio >= 0.8) {
      return 'substantial';
    } else if (complianceRatio >= 0.6) {
      return 'partial';
    } else if (complianceRatio >= 0.3) {
      return 'minimal';
    } else {
      return 'non_compliant';
    }
  }

  private generateQualityRecommendations(
    template: PatternTemplate,
    validationResult: ValidationResult,
    testSuite: TestSuite,
    qualityMetrics: QualityMetrics,
    standardsCompliance: StandardsCompliance
  ): QualityRecommendation[] {
    const recommendations: QualityRecommendation[] = [];

    // Critical issues first
    if (testSuite.summary.criticalIssues > 0) {
      recommendations.push({
        priority: 'critical',
        category: 'functionality',
        title: 'Fix Critical Functionality Issues',
        description: `Pattern has ${testSuite.summary.criticalIssues} critical issues that prevent proper operation`,
        impact: 'Pattern may not function correctly or produce invalid outputs',
        effort: 'high',
        implementation: [
          'Review and fix all critical validation errors',
          'Test pattern with sample inputs to verify functionality',
          'Ensure all required sections are properly implemented'
        ]
      });
    }

    // Performance issues
    if (qualityMetrics.efficiency < this.config.qualityStandards.minEfficiency) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        title: 'Improve Pattern Performance',
        description: `Pattern execution time exceeds acceptable thresholds`,
        impact: 'Slow pattern execution affects user experience and system throughput',
        effort: 'medium',
        implementation: [
          'Optimize pattern steps for better performance',
          'Reduce unnecessary processing in analysis steps',
          'Consider caching frequently used data'
        ]
      });
    }

    // Usability improvements
    if (qualityMetrics.usability < this.config.qualityStandards.minUsability) {
      recommendations.push({
        priority: 'medium',
        category: 'usability',
        title: 'Enhance Output Clarity and Usability',
        description: 'Pattern outputs could be clearer and more actionable',
        impact: 'Improved user understanding and implementation of recommendations',
        effort: 'medium',
        implementation: [
          'Add more specific examples in output sections',
          'Include priority levels for recommendations',
          'Improve formatting and structure of outputs'
        ]
      });
    }

    // Reliability improvements
    if (qualityMetrics.reliability < this.config.qualityStandards.minReliability) {
      recommendations.push({
        priority: 'medium',
        category: 'reliability',
        title: 'Improve Pattern Reliability',
        description: 'Pattern shows inconsistent behavior or error handling issues',
        impact: 'More consistent and reliable pattern outputs',
        effort: 'medium',
        implementation: [
          'Add better error handling for edge cases',
          'Improve input validation and sanitization',
          'Add fallback behaviors for unusual inputs'
        ]
      });
    }

    // Standards compliance
    if (!standardsCompliance.fabricStandards) {
      recommendations.push({
        priority: 'high',
        category: 'maintainability',
        title: 'Ensure Fabric Standards Compliance',
        description: 'Pattern does not fully comply with Fabric AI standards',
        impact: 'Better integration with Fabric ecosystem and tools',
        effort: 'low',
        implementation: [
          'Review official Fabric pattern template',
          'Ensure all required sections are present',
          'Follow standard naming conventions and structure'
        ]
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private assessCertificationStatus(
    qualityScore: number,
    qualityMetrics: QualityMetrics,
    standardsCompliance: StandardsCompliance,
    testSuite: TestSuite
  ): CertificationStatus {
    const requirements: CertificationRequirement[] = [
      {
        name: 'Quality Score',
        met: qualityScore >= 75,
        threshold: 75,
        actual: qualityScore,
        description: 'Overall quality score must be 75 or higher'
      },
      {
        name: 'Functionality',
        met: qualityMetrics.functionality >= 80,
        threshold: 80,
        actual: qualityMetrics.functionality,
        description: 'Functionality score must be 80 or higher'
      },
      {
        name: 'Reliability',
        met: qualityMetrics.reliability >= 85,
        threshold: 85,
        actual: qualityMetrics.reliability,
        description: 'Reliability score must be 85 or higher'
      },
      {
        name: 'Standards Compliance',
        met: Object.values(standardsCompliance).filter(Boolean).length >= 5,
        threshold: 5,
        actual: Object.values(standardsCompliance).filter(Boolean).length,
        description: 'Must meet at least 5 out of 6 compliance standards'
      },
      {
        name: 'No Critical Issues',
        met: testSuite.summary.criticalIssues === 0,
        threshold: 0,
        actual: testSuite.summary.criticalIssues,
        description: 'Must have zero critical issues'
      }
    ];

    const metRequirements = requirements.filter(r => r.met).length;
    const certified = metRequirements >= 4; // Need to meet at least 4 out of 5 requirements

    let level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'none' = 'none';
    if (certified) {
      if (qualityScore >= 95 && metRequirements === 5) level = 'platinum';
      else if (qualityScore >= 90 && metRequirements >= 4) level = 'gold';
      else if (qualityScore >= 85 && metRequirements >= 4) level = 'silver';
      else level = 'bronze';
    }

    const improvementsNeeded = requirements
      .filter(r => !r.met)
      .map(r => `${r.name}: ${r.description}`);

    return {
      certified,
      level,
      requirements,
      nextLevel: this.getNextCertificationLevel(level),
      improvementsNeeded
    };
  }

  private getDefaultCertificationStatus(): CertificationStatus {
    return {
      certified: false,
      level: 'none',
      requirements: [],
      improvementsNeeded: ['Certification assessment disabled']
    };
  }

  private getNextCertificationLevel(currentLevel: string): string | undefined {
    const levels = ['none', 'bronze', 'silver', 'gold', 'platinum'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : undefined;
  }

  // Helper methods for reporting

  private calculateQualityDistribution(reports: Record<string, QualityReport>): Record<string, number> {
    const distribution: Record<string, number> = {
      excellent: 0,
      good: 0,
      satisfactory: 0,
      needs_improvement: 0,
      poor: 0
    };

    Object.values(reports).forEach(report => {
      distribution[report.overallQuality]++;
    });

    return distribution;
  }

  private calculateCertificationDistribution(reports: Record<string, QualityReport>): Record<string, number> {
    const distribution: Record<string, number> = {
      platinum: 0,
      gold: 0,
      silver: 0,
      bronze: 0,
      none: 0
    };

    Object.values(reports).forEach(report => {
      distribution[report.certificationStatus.level]++;
    });

    return distribution;
  }

  private identifyCriticalIssues(reports: Record<string, QualityReport>): Array<{
    patternName: string;
    description: string;
    impact: string;
    action: string;
  }> {
    const criticalIssues: Array<{
      patternName: string;
      description: string;
      impact: string;
      action: string;
    }> = [];

    Object.entries(reports).forEach(([patternName, report]) => {
      const criticalRecs = report.recommendations.filter(r => r.priority === 'critical');
      criticalRecs.forEach(rec => {
        criticalIssues.push({
          patternName,
          description: rec.description,
          impact: rec.impact,
          action: rec.implementation.join('; ')
        });
      });
    });

    return criticalIssues;
  }

  private aggregateTopRecommendations(reports: Record<string, QualityReport>): Array<{
    title: string;
    count: number;
    impact: string;
    effort: string;
  }> {
    const recommendationCounts: Record<string, {
      count: number;
      impact: string;
      effort: string;
    }> = {};

    Object.values(reports).forEach(report => {
      report.recommendations.forEach(rec => {
        if (!recommendationCounts[rec.title]) {
          recommendationCounts[rec.title] = {
            count: 0,
            impact: rec.impact,
            effort: rec.effort
          };
        }
        recommendationCounts[rec.title].count++;
      });
    });

    return Object.entries(recommendationCounts)
      .map(([title, data]) => ({ title, ...data }))
      .sort((a, b) => b.count - a.count);
  }
}