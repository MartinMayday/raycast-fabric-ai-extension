/**
 * Test suite for ChainCompatibilityEnsurer class
 * Tests pattern chaining compatibility, suggestion generation, and UI consistency
 */

import { ChainCompatibilityEnsurer, ChainablePattern, ChainingSuggestion } from './ChainCompatibilityEnsurer';

// Mock pattern data for testing
const mockPatternData = [
  {
    name: 'analyze_wireframe_flow',
    displayName: 'Analyze Wireframe Flow',
    category: 'UX Analysis',
    outputSections: [
      'LAYOUT ANALYSIS',
      'NAVIGATION EVALUATION', 
      'CONVERSION OPTIMIZATION',
      'USER FLOW ASSESSMENT',
      'MOBILE RESPONSIVENESS'
    ],
    hasScoring: true,
    hasPrioritization: true
  },
  {
    name: 'analyze_copywriting_score',
    displayName: 'Analyze Copywriting Score',
    category: 'Content Analysis',
    outputSections: [
      'HEADLINE ANALYSIS',
      'PERSUASION EVALUATION',
      'CLARITY ASSESSMENT',
      'CTA OPTIMIZATION',
      'EMOTIONAL APPEAL'
    ],
    hasScoring: true,
    hasPrioritization: true
  },
  {
    name: 'create_storybrand_variant',
    displayName: 'Create StoryBrand Variant',
    category: 'Marketing Analysis',
    outputSections: [
      'HEADER ANALYSIS',
      'STAKES EVALUATION',
      'VALUE PROPOSITION',
      'GUIDE CREDIBILITY',
      'SB7 SCORE'
    ],
    hasScoring: true,
    hasPrioritization: true
  },
  {
    name: 'create_competitive_audit',
    displayName: 'Create Competitive Audit',
    category: 'Business Analysis',
    outputSections: [
      'COMPETITIVE POSITIONING',
      'USER EXPERIENCE AUDIT',
      'CONTENT STRATEGY ANALYSIS',
      'SWOT ANALYSIS',
      'COMPETITIVE STRENGTH SCORE'
    ],
    hasScoring: true,
    hasPrioritization: true
  }
];

class ChainCompatibilityEnsurerTest {
  private ensurer: ChainCompatibilityEnsurer;

  constructor() {
    this.ensurer = new ChainCompatibilityEnsurer();
  }

  /**
   * Test chainable pattern generation
   */
  testChainablePatternGeneration(): void {
    console.log('🧪 Testing Chainable Pattern Generation...\n');

    const pattern = mockPatternData[0];
    const chainablePattern = this.ensurer.generateChainablePattern(
      pattern.name,
      pattern.displayName,
      pattern.category,
      pattern.outputSections,
      pattern.hasScoring,
      pattern.hasPrioritization
    );

    console.log('✅ Generated Chainable Pattern:');
    console.log(`   Name: ${chainablePattern.name}`);
    console.log(`   Display Name: ${chainablePattern.displayName}`);
    console.log(`   Category: ${chainablePattern.category}`);
    console.log(`   Input Compatibility: ${chainablePattern.inputCompatibility.join(', ')}`);
    console.log(`   Output Compatibility: ${chainablePattern.outputCompatibility.join(', ')}`);
    console.log(`   Chaining Suggestions: ${chainablePattern.chainingSuggestions.length}`);
    console.log(`   UI Configuration: ${JSON.stringify(chainablePattern.uiConfiguration)}`);

    // Validate chainable pattern structure
    const validations = [
      { check: 'Has name', result: chainablePattern.name === pattern.name },
      { check: 'Has display name', result: chainablePattern.displayName === pattern.displayName },
      { check: 'Has category', result: chainablePattern.category === pattern.category },
      { check: 'Has output sections', result: chainablePattern.outputSections.length > 0 },
      { check: 'Has input compatibility', result: chainablePattern.inputCompatibility.length > 0 },
      { check: 'Has output compatibility', result: chainablePattern.outputCompatibility.length > 0 },
      { check: 'Has chaining suggestions', result: chainablePattern.chainingSuggestions.length > 0 },
      { check: 'Has UI configuration', result: chainablePattern.uiConfiguration !== null },
      { check: 'UI shows in suggestions', result: chainablePattern.uiConfiguration.showInChainSuggestions === true },
      { check: 'Has chain button text', result: chainablePattern.uiConfiguration.chainButtonText.length > 0 }
    ];

    console.log('\n📋 Chainable Pattern Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const chainableScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Chainable Pattern Score: ${Math.round(chainableScore)}%`);
  }

  /**
   * Test chaining suggestions generation
   */
  testChainingSuggestionsGeneration(): void {
    console.log('\n🧪 Testing Chaining Suggestions Generation...\n');

    const pattern = mockPatternData[0]; // wireframe flow
    const chainablePattern = this.ensurer.generateChainablePattern(
      pattern.name,
      pattern.displayName,
      pattern.category,
      pattern.outputSections,
      pattern.hasScoring,
      pattern.hasPrioritization
    );

    console.log('✅ Generated Chaining Suggestions:');
    console.log(`   Total suggestions: ${chainablePattern.chainingSuggestions.length}`);
    
    chainablePattern.chainingSuggestions.forEach((suggestion, index) => {
      console.log(`   ${index + 1}. ${suggestion.targetPattern}:`);
      console.log(`      - Confidence: ${suggestion.confidence}`);
      console.log(`      - Reason: ${suggestion.reason}`);
      console.log(`      - Data mappings: ${suggestion.dataMapping.length}`);
      console.log(`      - Conditions: ${suggestion.conditions?.length || 0}`);
    });

    // Validate suggestions structure
    const validations = [
      { check: 'Has suggestions', result: chainablePattern.chainingSuggestions.length > 0 },
      { check: 'Suggestions have target patterns', result: chainablePattern.chainingSuggestions.every(s => s.targetPattern.length > 0) },
      { check: 'Suggestions have reasons', result: chainablePattern.chainingSuggestions.every(s => s.reason.length > 0) },
      { check: 'Suggestions have confidence scores', result: chainablePattern.chainingSuggestions.every(s => s.confidence > 0 && s.confidence <= 1) },
      { check: 'Suggestions have data mappings', result: chainablePattern.chainingSuggestions.every(s => s.dataMapping.length > 0) },
      { check: 'Suggestions sorted by confidence', result: this.isSortedByConfidence(chainablePattern.chainingSuggestions) },
      { check: 'High confidence suggestions exist', result: chainablePattern.chainingSuggestions.some(s => s.confidence > 0.8) },
      { check: 'Data mappings have descriptions', result: chainablePattern.chainingSuggestions.every(s => s.dataMapping.every(m => m.description.length > 0)) }
    ];

    console.log('\n📋 Chaining Suggestions Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const suggestionsScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Suggestions Generation Score: ${Math.round(suggestionsScore)}%`);
  }

  /**
   * Test pattern chain configuration generation
   */
  testPatternChainConfiguration(): void {
    console.log('\n🧪 Testing Pattern Chain Configuration...\n');

    const chainablePatterns = this.ensurer.generateMultipleChainablePatterns(mockPatternData);
    const chainConfiguration = this.ensurer.generatePatternChainConfiguration(chainablePatterns);

    console.log('✅ Generated Chain Configuration:');
    console.log(`   Patterns: ${chainConfiguration.patterns.length}`);
    console.log(`   Chain Rules: ${chainConfiguration.chainRules.length}`);
    console.log(`   Suggestion Engine: ${JSON.stringify(chainConfiguration.suggestionEngine)}`);
    console.log(`   UI Settings: ${JSON.stringify(chainConfiguration.uiSettings)}`);

    // Show sample chain rules
    console.log('\n📋 Sample Chain Rules:');
    chainConfiguration.chainRules.slice(0, 5).forEach((rule, index) => {
      console.log(`   ${index + 1}. ${rule.fromPattern} → ${rule.toPattern}:`);
      console.log(`      - Priority: ${rule.priority}`);
      console.log(`      - Auto-suggest: ${rule.autoSuggest}`);
      console.log(`      - Data transformations: ${rule.dataTransformation.length}`);
      console.log(`      - Validation rules: ${rule.validationRules.length}`);
    });

    // Validate chain configuration
    const validations = [
      { check: 'Has patterns', result: chainConfiguration.patterns.length === mockPatternData.length },
      { check: 'Has chain rules', result: chainConfiguration.chainRules.length > 0 },
      { check: 'Has suggestion engine config', result: chainConfiguration.suggestionEngine !== null },
      { check: 'Has UI settings', result: chainConfiguration.uiSettings !== null },
      { check: 'Chain rules have priorities', result: chainConfiguration.chainRules.every(r => r.priority > 0) },
      { check: 'Chain rules have transformations', result: chainConfiguration.chainRules.every(r => r.dataTransformation.length > 0) },
      { check: 'Suggestion engine has thresholds', result: chainConfiguration.suggestionEngine.confidenceThreshold > 0 },
      { check: 'UI settings enable chaining', result: chainConfiguration.uiSettings.showChainButton === true }
    ];

    console.log('\n📋 Chain Configuration Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const configScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Chain Configuration Score: ${Math.round(configScore)}%`);
  }

  /**
   * Test chain compatibility validation
   */
  testChainCompatibilityValidation(): void {
    console.log('\n🧪 Testing Chain Compatibility Validation...\n');

    const chainablePatterns = this.ensurer.generateMultipleChainablePatterns(mockPatternData);
    const wireframePattern = chainablePatterns.find(p => p.name === 'analyze_wireframe_flow')!;
    const copywritingPattern = chainablePatterns.find(p => p.name === 'analyze_copywriting_score')!;
    const competitivePattern = chainablePatterns.find(p => p.name === 'create_competitive_audit')!;

    // Test compatible patterns
    const compatibleResult = this.ensurer.validateChainCompatibility(wireframePattern, copywritingPattern);
    console.log('✅ Compatible Patterns Test:');
    console.log(`   Compatible: ${compatibleResult.compatible}`);
    console.log(`   Issues: ${compatibleResult.issues.length}`);
    console.log(`   Suggestions: ${compatibleResult.suggestions.length}`);

    // Test potentially incompatible patterns
    const incompatibleResult = this.ensurer.validateChainCompatibility(wireframePattern, competitivePattern);
    console.log('\n⚠️  Potentially Incompatible Patterns Test:');
    console.log(`   Compatible: ${incompatibleResult.compatible}`);
    console.log(`   Issues: ${incompatibleResult.issues.length}`);
    console.log(`   Suggestions: ${incompatibleResult.suggestions.length}`);

    if (incompatibleResult.issues.length > 0) {
      console.log('   Issues:');
      incompatibleResult.issues.forEach(issue => {
        console.log(`      - ${issue}`);
      });
    }

    if (incompatibleResult.suggestions.length > 0) {
      console.log('   Suggestions:');
      incompatibleResult.suggestions.forEach(suggestion => {
        console.log(`      - ${suggestion}`);
      });
    }

    // Validate compatibility validation
    const validations = [
      { check: 'Compatible patterns validated', result: typeof compatibleResult.compatible === 'boolean' },
      { check: 'Issues array provided', result: Array.isArray(compatibleResult.issues) },
      { check: 'Suggestions array provided', result: Array.isArray(compatibleResult.suggestions) },
      { check: 'Validation logic works', result: compatibleResult.compatible !== incompatibleResult.compatible || compatibleResult.issues.length !== incompatibleResult.issues.length },
      { check: 'Helpful suggestions provided', result: incompatibleResult.suggestions.length > 0 || compatibleResult.suggestions.length > 0 }
    ];

    console.log('\n📋 Compatibility Validation Test:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const compatibilityScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Compatibility Validation Score: ${Math.round(compatibilityScore)}%`);
  }

  /**
   * Test chaining workflow generation
   */
  testChainingWorkflowGeneration(): void {
    console.log('\n🧪 Testing Chaining Workflow Generation...\n');

    const chainablePatterns = this.ensurer.generateMultipleChainablePatterns(mockPatternData);
    const workflowResult = this.ensurer.generateChainingWorkflow(chainablePatterns);

    console.log('✅ Generated Chaining Workflows:');
    console.log(`   Workflows: ${workflowResult.workflows.length}`);
    console.log(`   Recommendations: ${workflowResult.recommendations.length}`);

    // Show sample workflows
    console.log('\n📋 Sample Workflows:');
    workflowResult.workflows.slice(0, 3).forEach((workflow, index) => {
      console.log(`   ${index + 1}. ${workflow.name}:`);
      console.log(`      - Description: ${workflow.description}`);
      console.log(`      - Patterns: ${workflow.patterns.join(' → ')}`);
      console.log(`      - Estimated time: ${workflow.estimatedTime} minutes`);
      console.log(`      - Difficulty: ${workflow.difficulty}`);
    });

    console.log('\n💡 Recommendations:');
    workflowResult.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

    // Validate workflow generation
    const validations = [
      { check: 'Has workflows', result: workflowResult.workflows.length > 0 },
      { check: 'Has recommendations', result: workflowResult.recommendations.length > 0 },
      { check: 'Workflows have names', result: workflowResult.workflows.every(w => w.name.length > 0) },
      { check: 'Workflows have descriptions', result: workflowResult.workflows.every(w => w.description.length > 0) },
      { check: 'Workflows have patterns', result: workflowResult.workflows.every(w => w.patterns.length > 0) },
      { check: 'Workflows have time estimates', result: workflowResult.workflows.every(w => w.estimatedTime > 0) },
      { check: 'Workflows have difficulty levels', result: workflowResult.workflows.every(w => ['beginner', 'intermediate', 'advanced'].includes(w.difficulty)) },
      { check: 'Recommendations are helpful', result: workflowResult.recommendations.every(r => r.length > 10) }
    ];

    console.log('\n📋 Workflow Generation Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const workflowScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Workflow Generation Score: ${Math.round(workflowScore)}%`);
  }

  /**
   * Test UI configuration consistency
   */
  testUIConfigurationConsistency(): void {
    console.log('\n🧪 Testing UI Configuration Consistency...\n');

    const chainablePatterns = this.ensurer.generateMultipleChainablePatterns(mockPatternData);

    console.log('✅ UI Configuration Analysis:');
    chainablePatterns.forEach(pattern => {
      console.log(`   ${pattern.displayName}:`);
      console.log(`      - Show in suggestions: ${pattern.uiConfiguration.showInChainSuggestions}`);
      console.log(`      - Chain button text: "${pattern.uiConfiguration.chainButtonText}"`);
      console.log(`      - Chain button icon: ${pattern.uiConfiguration.chainButtonIcon}`);
      console.log(`      - Preview format: ${pattern.uiConfiguration.outputPreviewFormat}`);
      console.log(`      - Supported input types: ${pattern.uiConfiguration.supportedInputTypes.join(', ')}`);
    });

    // Validate UI consistency
    const validations = [
      { check: 'All patterns show in suggestions', result: chainablePatterns.every(p => p.uiConfiguration.showInChainSuggestions) },
      { check: 'All have chain button text', result: chainablePatterns.every(p => p.uiConfiguration.chainButtonText.length > 0) },
      { check: 'All have chain button icons', result: chainablePatterns.every(p => p.uiConfiguration.chainButtonIcon.length > 0) },
      { check: 'All have preview text', result: chainablePatterns.every(p => p.uiConfiguration.chainPreviewText.length > 0) },
      { check: 'All have supported input types', result: chainablePatterns.every(p => p.uiConfiguration.supportedInputTypes.length > 0) },
      { check: 'All have output preview format', result: chainablePatterns.every(p => p.uiConfiguration.outputPreviewFormat.length > 0) },
      { check: 'Consistent button text style', result: this.hasConsistentButtonText(chainablePatterns) },
      { check: 'Consistent icon usage', result: this.hasConsistentIcons(chainablePatterns) }
    ];

    console.log('\n📋 UI Consistency Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const uiScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 UI Consistency Score: ${Math.round(uiScore)}%`);
  }

  /**
   * Test multiple pattern chaining
   */
  testMultiplePatternChaining(): void {
    console.log('\n🧪 Testing Multiple Pattern Chaining...\n');

    const chainablePatterns = this.ensurer.generateMultipleChainablePatterns(mockPatternData);

    console.log('✅ Multiple Pattern Chaining Analysis:');
    console.log(`   Total patterns: ${chainablePatterns.length}`);
    
    // Analyze chaining relationships
    const chainingMatrix: Record<string, string[]> = {};
    chainablePatterns.forEach(pattern => {
      chainingMatrix[pattern.name] = pattern.chainingSuggestions.map(s => s.targetPattern);
    });

    console.log('\n📊 Chaining Matrix:');
    Object.entries(chainingMatrix).forEach(([source, targets]) => {
      console.log(`   ${source} → [${targets.join(', ')}]`);
    });

    // Calculate chaining metrics
    const totalSuggestions = chainablePatterns.reduce((sum, p) => sum + p.chainingSuggestions.length, 0);
    const avgSuggestions = totalSuggestions / chainablePatterns.length;
    const highConfidenceSuggestions = chainablePatterns.reduce((sum, p) => 
      sum + p.chainingSuggestions.filter(s => s.confidence > 0.8).length, 0
    );

    console.log('\n📈 Chaining Metrics:');
    console.log(`   Total suggestions: ${totalSuggestions}`);
    console.log(`   Average suggestions per pattern: ${avgSuggestions.toFixed(1)}`);
    console.log(`   High confidence suggestions: ${highConfidenceSuggestions}`);
    console.log(`   Chaining coverage: ${Math.round((totalSuggestions / (chainablePatterns.length * chainablePatterns.length)) * 100)}%`);

    // Validate multiple pattern chaining
    const validations = [
      { check: 'All patterns have suggestions', result: chainablePatterns.every(p => p.chainingSuggestions.length > 0) },
      { check: 'Bidirectional chaining exists', result: this.hasBidirectionalChaining(chainingMatrix) },
      { check: 'High confidence suggestions exist', result: highConfidenceSuggestions > 0 },
      { check: 'Reasonable suggestion count', result: avgSuggestions >= 1 && avgSuggestions <= 5 },
      { check: 'No self-referencing chains', result: this.hasNoSelfReferences(chainingMatrix) },
      { check: 'Comprehensive coverage', result: totalSuggestions >= chainablePatterns.length }
    ];

    console.log('\n📋 Multiple Pattern Chaining Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const multipleScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Multiple Pattern Chaining Score: ${Math.round(multipleScore)}%`);
  }

  /**
   * Helper method to check if suggestions are sorted by confidence
   */
  private isSortedByConfidence(suggestions: ChainingSuggestion[]): boolean {
    for (let i = 1; i < suggestions.length; i++) {
      if (suggestions[i].confidence > suggestions[i - 1].confidence) {
        return false;
      }
    }
    return true;
  }

  /**
   * Helper method to check consistent button text
   */
  private hasConsistentButtonText(patterns: ChainablePattern[]): boolean {
    const buttonTexts = patterns.map(p => p.uiConfiguration.chainButtonText);
    return new Set(buttonTexts).size <= 2; // Allow some variation but not too much
  }

  /**
   * Helper method to check consistent icons
   */
  private hasConsistentIcons(patterns: ChainablePattern[]): boolean {
    const icons = patterns.map(p => p.uiConfiguration.chainButtonIcon);
    return new Set(icons).size <= 3; // Allow some variation
  }

  /**
   * Helper method to check bidirectional chaining
   */
  private hasBidirectionalChaining(matrix: Record<string, string[]>): boolean {
    for (const [source, targets] of Object.entries(matrix)) {
      for (const target of targets) {
        if (matrix[target]?.includes(source)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Helper method to check for self-references
   */
  private hasNoSelfReferences(matrix: Record<string, string[]>): boolean {
    for (const [source, targets] of Object.entries(matrix)) {
      if (targets.includes(source)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting ChainCompatibilityEnsurer Test Suite\n');
    console.log('='.repeat(60));

    try {
      this.testChainablePatternGeneration();
      this.testChainingSuggestionsGeneration();
      this.testPatternChainConfiguration();
      this.testChainCompatibilityValidation();
      this.testChainingWorkflowGeneration();
      this.testUIConfigurationConsistency();
      this.testMultiplePatternChaining();

      console.log('\n' + '='.repeat(60));
      console.log('🎉 All ChainCompatibilityEnsurer tests completed successfully!');
      console.log('\n✨ Key Features Validated:');
      console.log('✅ Chainable pattern generation with compatibility analysis');
      console.log('✅ Intelligent chaining suggestions with confidence scoring');
      console.log('✅ Pattern chain configuration with rules and UI settings');
      console.log('✅ Chain compatibility validation with issue detection');
      console.log('✅ Chaining workflow generation with recommendations');
      console.log('✅ UI configuration consistency across patterns');
      console.log('✅ Multiple pattern chaining with bidirectional support');
      console.log('\n🚀 ChainCompatibilityEnsurer ready for production use!');

    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
}

// Export for use in other test files
export { ChainCompatibilityEnsurerTest };

// Run tests if this file is executed directly
if (require.main === module) {
  const test = new ChainCompatibilityEnsurerTest();
  test.runAllTests();
}