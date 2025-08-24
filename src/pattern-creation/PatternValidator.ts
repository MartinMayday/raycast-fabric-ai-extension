import { PatternTemplate } from './BestPracticesDatabase';
import { PatternSpecification } from './SpecificationBuilder';
import * as fs from 'fs';

export interface ValidationResult {
  isValid: boolean;
  score: number; // 0-100
  issues: ValidationIssue[];
  suggestions: ValidationSuggestion[];
  complianceChecks: ComplianceChecks;
  qualityMetrics: QualityMetrics;
}

export interface ValidationIssue {
  severity: 'critical' | 'major' | 'minor' | 'warning';
  category: 'syntax' | 'structure' | 'content' | 'format' | 'compliance';
  message: string;
  location?: string;
  suggestion?: string;
}

export interface ValidationSuggestion {
  type: 'improvement' | 'optimization' | 'best_practice' | 'fix';
  priority: 'high' | 'medium' | 'low';
  description: string;
  expectedImpact: string;
  implementation: string;
}

export interface ComplianceChecks {
  hasIdentity: boolean;
  hasPurpose: boolean;
  hasSteps: boolean;
  hasOutput: boolean;
  hasInstructions: boolean;
  followsStructure: boolean;
  meetsWordCount: boolean;
  hasRequiredSections: boolean;
}

export interface QualityMetrics {
  clarity: number; // 0-100
  completeness: number; // 0-100
  specificity: number; // 0-100
  actionability: number; // 0-100
  consistency: number; // 0-100
  professionalTone: number; // 0-100
}

export interface ValidationConfig {
  strictMode: boolean;
  minimumScore: number;
  requiredSections: string[];
  minimumWordCount: number;
  checkOfficialCompliance: boolean;
  enableQualityMetrics: boolean;
}

export class PatternValidator {
  private officialTemplate: string | null = null;
  private config: ValidationConfig;

  constructor(config: Partial<ValidationConfig> = {}) {
    this.config = {
      strictMode: false,
      minimumScore: 70,
      requiredSections: ['IDENTITY', 'STEPS', 'OUTPUT'],
      minimumWordCount: 200,
      checkOfficialCompliance: true,
      enableQualityMetrics: true,
      ...config
    };
    this.loadOfficialTemplate();
  }

  /**
   * Validate a pattern template against syntax, structure, and quality standards
   */
  async validatePattern(template: PatternTemplate): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const suggestions: ValidationSuggestion[] = [];
    let score = 100;

    // Perform compliance checks
    const complianceChecks = this.performComplianceChecks(template);
    
    // Syntax validation
    const syntaxIssues = this.validateSyntax(template);
    issues.push(...syntaxIssues);
    score -= syntaxIssues.filter(i => i.severity === 'critical').length * 20;
    score -= syntaxIssues.filter(i => i.severity === 'major').length * 10;
    score -= syntaxIssues.filter(i => i.severity === 'minor').length * 5;

    // Structure validation
    const structureIssues = this.validateStructure(template);
    issues.push(...structureIssues);
    score -= structureIssues.filter(i => i.severity === 'critical').length * 15;
    score -= structureIssues.filter(i => i.severity === 'major').length * 8;

    // Content validation
    const contentIssues = this.validateContent(template);
    issues.push(...contentIssues);
    score -= contentIssues.filter(i => i.severity === 'major').length * 12;
    score -= contentIssues.filter(i => i.severity === 'minor').length * 6;

    // Official template compliance
    if (this.config.checkOfficialCompliance && this.officialTemplate) {
      const complianceIssues = this.validateOfficialCompliance(template);
      issues.push(...complianceIssues);
      score -= complianceIssues.filter(i => i.severity === 'major').length * 10;
    }

    // Generate suggestions
    suggestions.push(...this.generateSuggestions(template, issues, complianceChecks));

    // Calculate quality metrics
    const qualityMetrics = this.config.enableQualityMetrics 
      ? this.calculateQualityMetrics(template, issues)
      : this.getDefaultQualityMetrics();

    // Apply quality metric penalties
    const qualityScore = (qualityMetrics.clarity + qualityMetrics.completeness + 
                         qualityMetrics.specificity + qualityMetrics.actionability) / 4;
    score = Math.round(score * (qualityScore / 100));

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    return {
      isValid: score >= this.config.minimumScore && issues.filter(i => i.severity === 'critical').length === 0,
      score,
      issues,
      suggestions,
      complianceChecks,
      qualityMetrics
    };
  }

  /**
   * Validate pattern against specification requirements
   */
  async validateAgainstSpecification(
    template: PatternTemplate, 
    specification: PatternSpecification
  ): Promise<ValidationResult> {
    const baseValidation = await this.validatePattern(template);
    const specIssues: ValidationIssue[] = [];
    const specSuggestions: ValidationSuggestion[] = [];

    // Check required sections from specification
    const requiredSections = specification.validationCriteria.requiredSections;
    const templateSections = template.structure.outputSections;
    
    requiredSections.forEach(requiredSection => {
      if (!templateSections.includes(requiredSection)) {
        specIssues.push({
          severity: 'major',
          category: 'structure',
          message: `Missing required section: ${requiredSection}`,
          suggestion: `Add ${requiredSection} section to output structure`
        });
      }
    });

    // Check minimum word count
    const wordCount = this.calculateWordCount(template);
    if (wordCount < specification.validationCriteria.minimumWordCount) {
      specIssues.push({
        severity: 'minor',
        category: 'content',
        message: `Word count ${wordCount} below minimum ${specification.validationCriteria.minimumWordCount}`,
        suggestion: 'Add more detailed instructions and examples'
      });
    }

    // Check scoring requirement
    if (specification.validationCriteria.scoringRequired) {
      const hasScoring = template.structure.outputInstructions.some(
        instruction => instruction.toLowerCase().includes('score') || instruction.toLowerCase().includes('rate')
      );
      
      if (!hasScoring) {
        specIssues.push({
          severity: 'major',
          category: 'content',
          message: 'Pattern requires scoring but no scoring instructions found',
          suggestion: 'Add scoring instructions (e.g., "Rate each section on a scale of 1-10")'
        });
      }
    }

    // Check recommendations requirement
    if (specification.validationCriteria.recommendationsRequired) {
      const hasRecommendations = template.structure.outputSections.some(
        section => section.toLowerCase().includes('recommendation')
      );
      
      if (!hasRecommendations) {
        specIssues.push({
          severity: 'major',
          category: 'structure',
          message: 'Pattern requires recommendations but no recommendation section found',
          suggestion: 'Add RECOMMENDATIONS or IMPROVEMENT RECOMMENDATIONS section'
        });
      }
    }

    // Validate quality checks
    specification.validationCriteria.qualityChecks.forEach(check => {
      if (!this.checkQualityCriteria(template, check)) {
        specSuggestions.push({
          type: 'improvement',
          priority: 'medium',
          description: `Ensure pattern meets quality criteria: ${check}`,
          expectedImpact: 'Improved pattern quality and effectiveness',
          implementation: `Review and enhance pattern to address: ${check}`
        });
      }
    });

    // Combine with base validation
    const combinedIssues = [...baseValidation.issues, ...specIssues];
    const combinedSuggestions = [...baseValidation.suggestions, ...specSuggestions];
    
    // Recalculate score with specification penalties
    let adjustedScore = baseValidation.score;
    adjustedScore -= specIssues.filter(i => i.severity === 'critical').length * 20;
    adjustedScore -= specIssues.filter(i => i.severity === 'major').length * 15;
    adjustedScore -= specIssues.filter(i => i.severity === 'minor').length * 5;
    adjustedScore = Math.max(0, adjustedScore);

    return {
      ...baseValidation,
      score: adjustedScore,
      issues: combinedIssues,
      suggestions: combinedSuggestions,
      isValid: adjustedScore >= this.config.minimumScore && 
               combinedIssues.filter(i => i.severity === 'critical').length === 0
    };
  }

  /**
   * Batch validate multiple patterns
   */
  async validatePatterns(templates: PatternTemplate[]): Promise<Record<string, ValidationResult>> {
    const results: Record<string, ValidationResult> = {};
    
    for (const template of templates) {
      results[template.name] = await this.validatePattern(template);
    }
    
    return results;
  }

  /**
   * Generate validation report
   */
  generateValidationReport(results: Record<string, ValidationResult>): string {
    const report: string[] = [];
    report.push('# Pattern Validation Report\n');
    
    const totalPatterns = Object.keys(results).length;
    const validPatterns = Object.values(results).filter(r => r.isValid).length;
    const averageScore = Object.values(results).reduce((sum, r) => sum + r.score, 0) / totalPatterns;
    
    report.push(`## Summary`);
    report.push(`- Total Patterns: ${totalPatterns}`);
    report.push(`- Valid Patterns: ${validPatterns} (${Math.round(validPatterns/totalPatterns*100)}%)`);
    report.push(`- Average Score: ${Math.round(averageScore)}/100\n`);
    
    // Individual pattern results
    report.push(`## Pattern Results\n`);
    
    Object.entries(results).forEach(([name, result]) => {
      report.push(`### ${name}`);
      report.push(`- **Status**: ${result.isValid ? '✅ Valid' : '❌ Invalid'}`);
      report.push(`- **Score**: ${result.score}/100`);
      
      if (result.issues.length > 0) {
        report.push(`- **Issues**: ${result.issues.length}`);
        result.issues.slice(0, 3).forEach(issue => {
          report.push(`  - ${issue.severity.toUpperCase()}: ${issue.message}`);
        });
      }
      
      if (result.suggestions.length > 0) {
        report.push(`- **Top Suggestions**:`);
        result.suggestions
          .filter(s => s.priority === 'high')
          .slice(0, 2)
          .forEach(suggestion => {
            report.push(`  - ${suggestion.description}`);
          });
      }
      
      report.push('');
    });
    
    return report.join('\n');
  }

  // Private validation methods

  private performComplianceChecks(template: PatternTemplate): ComplianceChecks {
    return {
      hasIdentity: this.hasValidIdentity(template.structure.identity),
      hasPurpose: this.hasValidPurpose(template.structure.purpose),
      hasSteps: this.hasValidSteps(template.structure.steps),
      hasOutput: this.hasValidOutput(template.structure.outputSections),
      hasInstructions: this.hasValidInstructions(template.structure.outputInstructions),
      followsStructure: this.followsProperStructure(template),
      meetsWordCount: this.calculateWordCount(template) >= this.config.minimumWordCount,
      hasRequiredSections: this.hasRequiredSections(template)
    };
  }

  private validateSyntax(template: PatternTemplate): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check for empty required fields
    if (!template.name || template.name.trim().length === 0) {
      issues.push({
        severity: 'critical',
        category: 'syntax',
        message: 'Pattern name is required',
        suggestion: 'Provide a descriptive pattern name'
      });
    }
    
    if (!template.structure.identity || template.structure.identity.trim().length === 0) {
      issues.push({
        severity: 'critical',
        category: 'syntax',
        message: 'Identity section is required',
        suggestion: 'Add identity statement defining the AI\'s role and expertise'
      });
    }
    
    // Check for proper formatting
    if (template.structure.steps.length === 0) {
      issues.push({
        severity: 'major',
        category: 'syntax',
        message: 'No steps defined',
        suggestion: 'Add at least 3-5 clear processing steps'
      });
    }
    
    if (template.structure.outputSections.length === 0) {
      issues.push({
        severity: 'major',
        category: 'syntax',
        message: 'No output sections defined',
        suggestion: 'Define clear output sections for structured results'
      });
    }
    
    return issues;
  }

  private validateStructure(template: PatternTemplate): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check identity structure
    if (template.structure.identity.length < 20) {
      issues.push({
        severity: 'minor',
        category: 'structure',
        message: 'Identity statement is too brief',
        suggestion: 'Expand identity to clearly establish expertise and role'
      });
    }
    
    // Check steps structure
    if (template.structure.steps.length < 3) {
      issues.push({
        severity: 'major',
        category: 'structure',
        message: 'Insufficient number of steps',
        suggestion: 'Add more detailed processing steps (minimum 3-5)'
      });
    }
    
    // Check for step quality
    const shortSteps = template.structure.steps.filter(step => step.length < 10);
    if (shortSteps.length > 0) {
      issues.push({
        severity: 'minor',
        category: 'structure',
        message: `${shortSteps.length} steps are too brief`,
        suggestion: 'Expand brief steps with more detailed instructions'
      });
    }
    
    // Check output sections
    if (template.structure.outputSections.length < 3) {
      issues.push({
        severity: 'major',
        category: 'structure',
        message: 'Insufficient output sections',
        suggestion: 'Add more output sections for comprehensive analysis'
      });
    }
    
    return issues;
  }

  private validateContent(template: PatternTemplate): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Check for domain expertise indicators
    const identity = template.structure.identity.toLowerCase();
    if (!identity.includes('expert') && !identity.includes('specialist') && !identity.includes('analyst')) {
      issues.push({
        severity: 'minor',
        category: 'content',
        message: 'Identity lacks clear expertise indicators',
        suggestion: 'Include expertise terms like "expert", "specialist", or "analyst"'
      });
    }
    
    // Check for actionable language in steps
    const actionWords = ['analyze', 'extract', 'identify', 'evaluate', 'assess', 'examine'];
    const stepsWithAction = template.structure.steps.filter(step => 
      actionWords.some(word => step.toLowerCase().includes(word))
    );
    
    if (stepsWithAction.length < template.structure.steps.length * 0.6) {
      issues.push({
        severity: 'minor',
        category: 'content',
        message: 'Steps lack actionable language',
        suggestion: 'Use more action-oriented verbs in step descriptions'
      });
    }
    
    // Check for specific output instructions
    const hasSpecificInstructions = template.structure.outputInstructions.some(
      instruction => instruction.includes('specific') || instruction.includes('example')
    );
    
    if (!hasSpecificInstructions) {
      issues.push({
        severity: 'minor',
        category: 'content',
        message: 'Output instructions lack specificity requirements',
        suggestion: 'Add instructions for including specific examples and details'
      });
    }
    
    return issues;
  }

  private validateOfficialCompliance(template: PatternTemplate): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    if (!this.officialTemplate) {
      return issues;
    }
    
    // Check for required sections based on official template
    const requiredSections = ['IDENTITY', 'STEPS', 'OUTPUT'];
    requiredSections.forEach(section => {
      // This is a simplified check - in practice would parse generated content
      const hasSection = template.structure.identity || template.structure.steps.length > 0 || 
                        template.structure.outputSections.length > 0;
      
      if (!hasSection) {
        issues.push({
          severity: 'major',
          category: 'compliance',
          message: `Missing section: ${section}`,
          suggestion: `Add ${section} section following official template structure`
        });
      }
    });
    
    return issues;
  }

  private generateSuggestions(
    template: PatternTemplate, 
    issues: ValidationIssue[], 
    compliance: ComplianceChecks
  ): ValidationSuggestion[] {
    const suggestions: ValidationSuggestion[] = [];
    
    // Generate suggestions based on issues
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    if (criticalIssues.length > 0) {
      suggestions.push({
        type: 'fix',
        priority: 'high',
        description: 'Address critical validation issues immediately',
        expectedImpact: 'Pattern will become functional and usable',
        implementation: 'Fix all critical syntax and structure issues'
      });
    }
    
    // Suggestions for improvement
    if (!compliance.hasRequiredSections) {
      suggestions.push({
        type: 'improvement',
        priority: 'high',
        description: 'Add all required output sections',
        expectedImpact: 'Improved pattern completeness and usability',
        implementation: 'Review specification requirements and add missing sections'
      });
    }
    
    if (template.structure.steps.length < 5) {
      suggestions.push({
        type: 'optimization',
        priority: 'medium',
        description: 'Add more detailed processing steps',
        expectedImpact: 'Better AI guidance and more consistent outputs',
        implementation: 'Break down complex analysis into smaller, specific steps'
      });
    }
    
    // Best practice suggestions
    suggestions.push({
      type: 'best_practice',
      priority: 'low',
      description: 'Include examples in output instructions',
      expectedImpact: 'Clearer guidance for AI and better output quality',
      implementation: 'Add specific examples for each output section'
    });
    
    return suggestions;
  }

  private calculateQualityMetrics(template: PatternTemplate, issues: ValidationIssue[]): QualityMetrics {
    const baseScore = 100;
    const issueImpact = issues.reduce((impact, issue) => {
      switch (issue.severity) {
        case 'critical': return impact + 20;
        case 'major': return impact + 10;
        case 'minor': return impact + 5;
        default: return impact + 2;
      }
    }, 0);
    
    const adjustedScore = Math.max(0, baseScore - issueImpact);
    
    return {
      clarity: Math.max(0, adjustedScore - (issues.filter(i => i.category === 'content').length * 5)),
      completeness: Math.max(0, adjustedScore - (issues.filter(i => i.category === 'structure').length * 8)),
      specificity: Math.max(0, adjustedScore - (issues.filter(i => i.message.includes('brief')).length * 10)),
      actionability: Math.max(0, adjustedScore - (issues.filter(i => i.message.includes('actionable')).length * 8)),
      consistency: adjustedScore,
      professionalTone: Math.max(0, adjustedScore - (issues.filter(i => i.category === 'syntax').length * 5))
    };
  }

  private getDefaultQualityMetrics(): QualityMetrics {
    return {
      clarity: 80,
      completeness: 80,
      specificity: 80,
      actionability: 80,
      consistency: 80,
      professionalTone: 80
    };
  }

  // Helper methods

  private hasValidIdentity(identity: string): boolean {
    return identity.length >= 20 && 
           (identity.includes('You are') || identity.includes('expert') || identity.includes('specialist'));
  }

  private hasValidPurpose(purpose: string): boolean {
    return purpose.length >= 15 && 
           (purpose.includes('analyze') || purpose.includes('extract') || purpose.includes('create'));
  }

  private hasValidSteps(steps: string[]): boolean {
    return steps.length >= 3 && steps.every(step => step.length >= 10);
  }

  private hasValidOutput(outputSections: string[]): boolean {
    return outputSections.length >= 3 && outputSections.every(section => section.length >= 3);
  }

  private hasValidInstructions(instructions: string[]): boolean {
    return instructions.length >= 2 && instructions.every(instruction => instruction.length >= 10);
  }

  private followsProperStructure(template: PatternTemplate): boolean {
    // Check if template follows expected structure patterns
    return template.structure.identity.length > 0 &&
           template.structure.steps.length > 0 &&
           template.structure.outputSections.length > 0 &&
           template.structure.outputInstructions.length > 0;
  }

  private calculateWordCount(template: PatternTemplate): number {
    const allText = [
      template.structure.identity,
      template.structure.purpose,
      ...template.structure.steps,
      ...template.structure.outputInstructions
    ].join(' ');
    
    return allText.split(/\s+/).filter(word => word.length > 0).length;
  }

  private hasRequiredSections(template: PatternTemplate): boolean {
    return this.config.requiredSections.every(section => {
      // Simplified check - would need more sophisticated parsing in practice
      return template.structure.outputSections.some(outputSection => 
        outputSection.toUpperCase().includes(section.toUpperCase())
      );
    });
  }

  private checkQualityCriteria(template: PatternTemplate, criteria: string): boolean {
    const templateText = JSON.stringify(template).toLowerCase();
    const criteriaLower = criteria.toLowerCase();
    
    // Simple keyword matching - would be more sophisticated in practice
    if (criteriaLower.includes('specific examples')) {
      return templateText.includes('example') || templateText.includes('specific');
    }
    
    if (criteriaLower.includes('actionable recommendations')) {
      return templateText.includes('recommendation') || templateText.includes('actionable');
    }
    
    if (criteriaLower.includes('mobile')) {
      return templateText.includes('mobile') || templateText.includes('responsive');
    }
    
    return true; // Default to passing for unknown criteria
  }

  private loadOfficialTemplate(): void {
    try {
      const templatePath = 'patterns/_RAW/official_pattern_template_system.md';
      if (fs.existsSync(templatePath)) {
        this.officialTemplate = fs.readFileSync(templatePath, 'utf-8');
      }
    } catch (error) {
      console.warn('Could not load official pattern template:', error);
    }
  }
}