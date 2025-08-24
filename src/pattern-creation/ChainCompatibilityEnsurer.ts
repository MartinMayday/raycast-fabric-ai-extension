/**
 * ChainCompatibilityEnsurer - Ensures pattern chaining compatibility for custom patterns
 * 
 * This class provides functionality to:
 * - Enable pattern chaining support for custom patterns
 * - Build compatibility layers for suggestion systems
 * - Validate UI and command structure consistency
 * - Integrate with existing pattern chaining functionality
 */

export interface ChainablePattern {
  name: string;
  displayName: string;
  category: string;
  outputSections: string[];
  inputCompatibility: string[];
  outputCompatibility: string[];
  chainingSuggestions: ChainingSuggestion[];
  uiConfiguration: UIConfiguration;
}

export interface ChainingSuggestion {
  targetPattern: string;
  reason: string;
  confidence: number;
  dataMapping: DataMapping[];
  conditions?: ChainCondition[];
}

export interface DataMapping {
  sourceField: string;
  targetField: string;
  transformation?: 'direct' | 'summarize' | 'extract_key_points' | 'format_for_input';
  description: string;
}

export interface ChainCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
  description: string;
}

export interface UIConfiguration {
  showInChainSuggestions: boolean;
  chainButtonText: string;
  chainButtonIcon: string;
  chainPreviewText: string;
  supportedInputTypes: string[];
  outputPreviewFormat: 'text' | 'structured' | 'scored';
}

export interface PatternChainConfiguration {
  patterns: ChainablePattern[];
  chainRules: ChainRule[];
  suggestionEngine: SuggestionEngineConfig;
  uiSettings: ChainUISettings;
}

export interface ChainRule {
  fromPattern: string;
  toPattern: string;
  priority: number;
  autoSuggest: boolean;
  dataTransformation: DataMapping[];
  validationRules: ChainCondition[];
}

export interface SuggestionEngineConfig {
  enableAutoSuggestions: boolean;
  maxSuggestions: number;
  confidenceThreshold: number;
  categoryWeighting: Record<string, number>;
  outputTypeWeighting: Record<string, number>;
}

export interface ChainUISettings {
  showChainButton: boolean;
  showSuggestionPanel: boolean;
  enableQuickChain: boolean;
  chainHistoryLimit: number;
  defaultChainView: 'list' | 'grid' | 'flow';
}

export class ChainCompatibilityEnsurer {
  private readonly PATTERN_CATEGORIES = {
    'UX Analysis': { weight: 1.0, compatibleWith: ['Content Analysis', 'Conversion Optimization'] },
    'Content Analysis': { weight: 1.0, compatibleWith: ['Marketing Analysis', 'UX Analysis'] },
    'Marketing Analysis': { weight: 1.0, compatibleWith: ['Business Analysis', 'Content Analysis'] },
    'Business Analysis': { weight: 1.0, compatibleWith: ['Marketing Analysis', 'Strategic Analysis'] },
    'Landing Page Analysis': { weight: 1.2, compatibleWith: ['UX Analysis', 'Content Analysis', 'Marketing Analysis'] },
    'Conversion Optimization': { weight: 1.1, compatibleWith: ['UX Analysis', 'Marketing Analysis'] },
    'Strategic Analysis': { weight: 0.9, compatibleWith: ['Business Analysis', 'Marketing Analysis'] }
  };

  private readonly OUTPUT_TYPES = {
    'scored': { weight: 1.2, compatibleWith: ['analysis', 'optimization', 'comparison'] },
    'analysis': { weight: 1.0, compatibleWith: ['scored', 'optimization', 'strategic'] },
    'optimization': { weight: 1.1, compatibleWith: ['analysis', 'scored', 'implementation'] },
    'strategic': { weight: 0.9, compatibleWith: ['analysis', 'implementation'] },
    'comparison': { weight: 1.0, compatibleWith: ['scored', 'analysis'] },
    'implementation': { weight: 0.8, compatibleWith: ['optimization', 'strategic'] }
  };

  private readonly CHAINING_PATTERNS = {
    'analyze_wireframe_flow': {
      bestFollowUps: ['analyze_copywriting_score', 'create_storybrand_variant'],
      dataFields: ['layout_analysis', 'navigation_evaluation', 'conversion_optimization'],
      outputType: 'scored'
    },
    'analyze_copywriting_score': {
      bestFollowUps: ['create_storybrand_variant', 'create_competitive_audit'],
      dataFields: ['headline_analysis', 'persuasion_evaluation', 'clarity_assessment'],
      outputType: 'scored'
    },
    'create_storybrand_variant': {
      bestFollowUps: ['create_competitive_audit', 'analyze_wireframe_flow'],
      dataFields: ['header_analysis', 'stakes_evaluation', 'value_proposition'],
      outputType: 'optimization'
    },
    'create_competitive_audit': {
      bestFollowUps: ['analyze_wireframe_flow', 'analyze_copywriting_score'],
      dataFields: ['competitive_positioning', 'swot_analysis', 'competitive_strength_score'],
      outputType: 'strategic'
    }
  };

  /**
   * Generate chainable pattern configuration
   */
  generateChainablePattern(
    name: string,
    displayName: string,
    category: string,
    outputSections: string[],
    hasScoring: boolean = false,
    hasPrioritization: boolean = false
  ): ChainablePattern {
    const inputCompatibility = this.determineInputCompatibility(name, category);
    const outputCompatibility = this.determineOutputCompatibility(name, category, hasScoring);
    const chainingSuggestions = this.generateChainingSuggestions(name, category, outputSections);
    const uiConfiguration = this.generateUIConfiguration(name, category, hasScoring, hasPrioritization);

    return {
      name,
      displayName,
      category,
      outputSections,
      inputCompatibility,
      outputCompatibility,
      chainingSuggestions,
      uiConfiguration
    };
  }

  /**
   * Determine input compatibility for pattern
   */
  private determineInputCompatibility(patternName: string, category: string): string[] {
    const compatibility: string[] = [];

    // Add category-based compatibility
    const categoryConfig = this.PATTERN_CATEGORIES[category];
    if (categoryConfig) {
      compatibility.push(...categoryConfig.compatibleWith);
    }

    // Add pattern-specific compatibility
    const patternConfig = this.CHAINING_PATTERNS[patternName];
    if (patternConfig) {
      // Patterns that can feed into this pattern
      Object.entries(this.CHAINING_PATTERNS).forEach(([otherPattern, config]) => {
        if (config.bestFollowUps.includes(patternName)) {
          compatibility.push(config.outputType);
        }
      });
    }

    // Add universal compatibility
    compatibility.push('text', 'analysis', 'content');

    return [...new Set(compatibility)];
  }

  /**
   * Determine output compatibility for pattern
   */
  private determineOutputCompatibility(patternName: string, category: string, hasScoring: boolean): string[] {
    const compatibility: string[] = [];

    // Add scoring-based compatibility
    if (hasScoring) {
      compatibility.push('scored', 'analysis', 'comparison');
    }

    // Add category-based compatibility
    if (category.includes('Analysis')) {
      compatibility.push('analysis', 'optimization');
    }
    if (category.includes('Optimization')) {
      compatibility.push('optimization', 'implementation');
    }
    if (category.includes('Business') || category.includes('Strategic')) {
      compatibility.push('strategic', 'implementation');
    }

    // Add pattern-specific compatibility
    const patternConfig = this.CHAINING_PATTERNS[patternName];
    if (patternConfig) {
      compatibility.push(patternConfig.outputType);
    }

    // Add universal compatibility
    compatibility.push('text', 'content');

    return [...new Set(compatibility)];
  }

  /**
   * Generate chaining suggestions for pattern
   */
  private generateChainingSuggestions(
    patternName: string,
    category: string,
    outputSections: string[]
  ): ChainingSuggestion[] {
    const suggestions: ChainingSuggestion[] = [];

    // Get pattern-specific suggestions
    const patternConfig = this.CHAINING_PATTERNS[patternName];
    if (patternConfig) {
      patternConfig.bestFollowUps.forEach(targetPattern => {
        const suggestion = this.createChainingSuggestion(
          patternName,
          targetPattern,
          outputSections,
          0.9
        );
        if (suggestion) {
          suggestions.push(suggestion);
        }
      });
    }

    // Generate category-based suggestions
    const categoryConfig = this.PATTERN_CATEGORIES[category];
    if (categoryConfig) {
      categoryConfig.compatibleWith.forEach(compatibleCategory => {
        const targetPatterns = this.getPatternsInCategory(compatibleCategory);
        targetPatterns.forEach(targetPattern => {
          if (targetPattern !== patternName && !suggestions.some(s => s.targetPattern === targetPattern)) {
            const suggestion = this.createChainingSuggestion(
              patternName,
              targetPattern,
              outputSections,
              0.7
            );
            if (suggestion) {
              suggestions.push(suggestion);
            }
          }
        });
      });
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Create chaining suggestion
   */
  private createChainingSuggestion(
    sourcePattern: string,
    targetPattern: string,
    outputSections: string[],
    baseConfidence: number
  ): ChainingSuggestion | null {
    const targetConfig = this.CHAINING_PATTERNS[targetPattern];
    if (!targetConfig) return null;

    const dataMapping = this.generateDataMapping(outputSections, targetConfig.dataFields);
    const reason = this.generateChainReason(sourcePattern, targetPattern);
    const confidence = this.calculateChainConfidence(sourcePattern, targetPattern, baseConfidence);

    return {
      targetPattern,
      reason,
      confidence,
      dataMapping,
      conditions: this.generateChainConditions(sourcePattern, targetPattern)
    };
  }

  /**
   * Generate data mapping between patterns
   */
  private generateDataMapping(sourceSections: string[], targetFields: string[]): DataMapping[] {
    const mappings: DataMapping[] = [];

    // Direct field mappings
    sourceSections.forEach(section => {
      const sectionKey = this.sectionToKey(section);
      const matchingTarget = targetFields.find(field => 
        field.includes(sectionKey) || sectionKey.includes(field)
      );

      if (matchingTarget) {
        mappings.push({
          sourceField: sectionKey,
          targetField: matchingTarget,
          transformation: 'direct',
          description: `Direct mapping from ${section} to ${matchingTarget}`
        });
      }
    });

    // Summary mappings for comprehensive analysis
    if (sourceSections.length > 3) {
      mappings.push({
        sourceField: 'overall_analysis',
        targetField: 'input_context',
        transformation: 'summarize',
        description: 'Summarized analysis for context'
      });
    }

    // Key points extraction
    mappings.push({
      sourceField: 'recommendations',
      targetField: 'focus_areas',
      transformation: 'extract_key_points',
      description: 'Extract key recommendations as focus areas'
    });

    return mappings;
  }

  /**
   * Generate chain reason
   */
  private generateChainReason(sourcePattern: string, targetPattern: string): string {
    const reasons = {
      'analyze_wireframe_flow': {
        'analyze_copywriting_score': 'Analyze the copy effectiveness after reviewing the UX structure',
        'create_storybrand_variant': 'Apply StoryBrand framework to improve the wireframe structure',
        'create_competitive_audit': 'Compare your wireframe against competitor designs'
      },
      'analyze_copywriting_score': {
        'create_storybrand_variant': 'Implement StoryBrand principles to improve copywriting effectiveness',
        'create_competitive_audit': 'Benchmark your copy against competitor messaging',
        'analyze_wireframe_flow': 'Optimize the UX flow based on copywriting insights'
      },
      'create_storybrand_variant': {
        'create_competitive_audit': 'Compare your StoryBrand implementation against competitors',
        'analyze_wireframe_flow': 'Optimize wireframe structure using StoryBrand insights',
        'analyze_copywriting_score': 'Refine copy based on StoryBrand framework implementation'
      },
      'create_competitive_audit': {
        'analyze_wireframe_flow': 'Improve UX design based on competitive analysis insights',
        'analyze_copywriting_score': 'Enhance copywriting using competitive intelligence',
        'create_storybrand_variant': 'Apply StoryBrand framework informed by competitive analysis'
      }
    };

    return reasons[sourcePattern]?.[targetPattern] || 
           `Continue analysis with ${targetPattern} for comprehensive insights`;
  }

  /**
   * Calculate chain confidence
   */
  private calculateChainConfidence(
    sourcePattern: string,
    targetPattern: string,
    baseConfidence: number
  ): number {
    let confidence = baseConfidence;

    // Boost confidence for known good chains
    const sourceConfig = this.CHAINING_PATTERNS[sourcePattern];
    if (sourceConfig?.bestFollowUps.includes(targetPattern)) {
      confidence += 0.1;
    }

    // Adjust based on pattern types
    const sourceType = sourceConfig?.outputType;
    const targetConfig = this.CHAINING_PATTERNS[targetPattern];
    const targetType = targetConfig?.outputType;

    if (sourceType && targetType) {
      const typeConfig = this.OUTPUT_TYPES[sourceType];
      if (typeConfig?.compatibleWith.includes(targetType)) {
        confidence += 0.05;
      }
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Generate chain conditions
   */
  private generateChainConditions(sourcePattern: string, targetPattern: string): ChainCondition[] {
    const conditions: ChainCondition[] = [];

    // Add scoring-based conditions
    if (sourcePattern.includes('score') || sourcePattern.includes('analysis')) {
      conditions.push({
        field: 'overall_score',
        operator: 'exists',
        value: true,
        description: 'Analysis must have completed with scoring'
      });
    }

    // Add content-based conditions
    conditions.push({
      field: 'input_content',
      operator: 'exists',
      value: true,
      description: 'Original content must be available for chaining'
    });

    // Add pattern-specific conditions
    if (targetPattern === 'create_competitive_audit') {
      conditions.push({
        field: 'analysis_quality',
        operator: 'greater_than',
        value: 7,
        description: 'Analysis quality should be high for competitive audit'
      });
    }

    return conditions;
  }

  /**
   * Generate UI configuration
   */
  private generateUIConfiguration(
    patternName: string,
    category: string,
    hasScoring: boolean,
    hasPrioritization: boolean
  ): UIConfiguration {
    return {
      showInChainSuggestions: true,
      chainButtonText: 'Continue Analysis',
      chainButtonIcon: '🔗',
      chainPreviewText: `Chain with ${patternName} results`,
      supportedInputTypes: ['text', 'analysis', 'content'],
      outputPreviewFormat: hasScoring ? 'scored' : 'structured'
    };
  }

  /**
   * Get patterns in category
   */
  private getPatternsInCategory(category: string): string[] {
    // This would typically query the registry, but for now return known patterns
    const categoryPatterns = {
      'UX Analysis': ['analyze_wireframe_flow'],
      'Content Analysis': ['analyze_copywriting_score'],
      'Marketing Analysis': ['create_storybrand_variant'],
      'Business Analysis': ['create_competitive_audit'],
      'Landing Page Analysis': ['analyze_wireframe_flow', 'analyze_copywriting_score'],
      'Conversion Optimization': ['analyze_wireframe_flow', 'create_storybrand_variant'],
      'Strategic Analysis': ['create_competitive_audit']
    };

    return categoryPatterns[category] || [];
  }

  /**
   * Convert section to key
   */
  private sectionToKey(section: string): string {
    return section
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  /**
   * Generate pattern chain configuration
   */
  generatePatternChainConfiguration(patterns: ChainablePattern[]): PatternChainConfiguration {
    const chainRules = this.generateChainRules(patterns);
    const suggestionEngine = this.generateSuggestionEngineConfig();
    const uiSettings = this.generateChainUISettings();

    return {
      patterns,
      chainRules,
      suggestionEngine,
      uiSettings
    };
  }

  /**
   * Generate chain rules
   */
  private generateChainRules(patterns: ChainablePattern[]): ChainRule[] {
    const rules: ChainRule[] = [];

    patterns.forEach(pattern => {
      pattern.chainingSuggestions.forEach(suggestion => {
        rules.push({
          fromPattern: pattern.name,
          toPattern: suggestion.targetPattern,
          priority: Math.round(suggestion.confidence * 10),
          autoSuggest: suggestion.confidence > 0.8,
          dataTransformation: suggestion.dataMapping,
          validationRules: suggestion.conditions || []
        });
      });
    });

    return rules.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Generate suggestion engine configuration
   */
  private generateSuggestionEngineConfig(): SuggestionEngineConfig {
    return {
      enableAutoSuggestions: true,
      maxSuggestions: 3,
      confidenceThreshold: 0.6,
      categoryWeighting: {
        'Landing Page Analysis': 1.2,
        'UX Analysis': 1.0,
        'Content Analysis': 1.0,
        'Marketing Analysis': 1.0,
        'Business Analysis': 0.9
      },
      outputTypeWeighting: {
        'scored': 1.2,
        'analysis': 1.0,
        'optimization': 1.1,
        'strategic': 0.9
      }
    };
  }

  /**
   * Generate chain UI settings
   */
  private generateChainUISettings(): ChainUISettings {
    return {
      showChainButton: true,
      showSuggestionPanel: true,
      enableQuickChain: true,
      chainHistoryLimit: 10,
      defaultChainView: 'list'
    };
  }

  /**
   * Validate chain compatibility
   */
  validateChainCompatibility(
    sourcePattern: ChainablePattern,
    targetPattern: ChainablePattern
  ): { compatible: boolean; issues: string[]; suggestions: string[] } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check input/output compatibility
    const hasCompatibleOutput = sourcePattern.outputCompatibility.some(output =>
      targetPattern.inputCompatibility.includes(output)
    );

    if (!hasCompatibleOutput) {
      issues.push('No compatible output/input types between patterns');
      suggestions.push('Add data transformation layer to bridge compatibility gap');
    }

    // Check category compatibility
    const sourceCategoryConfig = this.PATTERN_CATEGORIES[sourcePattern.category];
    const isCompatibleCategory = sourceCategoryConfig?.compatibleWith.includes(targetPattern.category);

    if (!isCompatibleCategory) {
      issues.push(`Category ${sourcePattern.category} not compatible with ${targetPattern.category}`);
      suggestions.push('Consider intermediate pattern to bridge category gap');
    }

    // Check UI consistency
    if (sourcePattern.uiConfiguration.outputPreviewFormat !== targetPattern.uiConfiguration.outputPreviewFormat) {
      suggestions.push('Consider standardizing output preview formats for better UX');
    }

    return {
      compatible: issues.length === 0,
      issues,
      suggestions
    };
  }

  /**
   * Generate chaining workflow
   */
  generateChainingWorkflow(patterns: ChainablePattern[]): {
    workflows: ChainWorkflow[];
    recommendations: string[];
  } {
    const workflows: ChainWorkflow[] = [];
    const recommendations: string[] = [];

    // Generate common workflows
    const commonWorkflows = [
      ['analyze_wireframe_flow', 'analyze_copywriting_score', 'create_storybrand_variant'],
      ['analyze_copywriting_score', 'create_competitive_audit'],
      ['create_storybrand_variant', 'create_competitive_audit', 'analyze_wireframe_flow'],
      ['create_competitive_audit', 'analyze_wireframe_flow', 'analyze_copywriting_score']
    ];

    commonWorkflows.forEach((workflow, index) => {
      const availablePatterns = workflow.filter(patternName =>
        patterns.some(p => p.name === patternName)
      );

      if (availablePatterns.length >= 2) {
        workflows.push({
          id: `workflow_${index + 1}`,
          name: `Landing Page Analysis Workflow ${index + 1}`,
          description: this.generateWorkflowDescription(availablePatterns),
          patterns: availablePatterns,
          estimatedTime: availablePatterns.length * 2,
          difficulty: 'intermediate'
        });
      }
    });

    // Generate recommendations
    recommendations.push('Start with wireframe analysis for structural insights');
    recommendations.push('Follow with copywriting analysis for content optimization');
    recommendations.push('Use competitive audit for market positioning');
    recommendations.push('Apply StoryBrand framework for conversion optimization');

    return { workflows, recommendations };
  }

  /**
   * Generate workflow description
   */
  private generateWorkflowDescription(patterns: string[]): string {
    const descriptions = {
      'analyze_wireframe_flow': 'analyze UX structure and user flow',
      'analyze_copywriting_score': 'evaluate copywriting effectiveness',
      'create_storybrand_variant': 'apply StoryBrand framework for conversion',
      'create_competitive_audit': 'conduct competitive analysis and positioning'
    };

    const steps = patterns.map(pattern => descriptions[pattern] || pattern).join(', then ');
    return `Comprehensive analysis workflow: ${steps}`;
  }

  /**
   * Generate multiple chainable patterns
   */
  generateMultipleChainablePatterns(
    patterns: Array<{
      name: string;
      displayName: string;
      category: string;
      outputSections: string[];
      hasScoring: boolean;
      hasPrioritization: boolean;
    }>
  ): ChainablePattern[] {
    return patterns.map(pattern =>
      this.generateChainablePattern(
        pattern.name,
        pattern.displayName,
        pattern.category,
        pattern.outputSections,
        pattern.hasScoring,
        pattern.hasPrioritization
      )
    );
  }
}

interface ChainWorkflow {
  id: string;
  name: string;
  description: string;
  patterns: string[];
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}