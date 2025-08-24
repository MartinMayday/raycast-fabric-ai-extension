// Pattern Creation Framework - Main Exports

export { ExistingPatternAnalyzer, PatternAnalysis, PatternStructure } from './ExistingPatternAnalyzer';
export { StructureExtractor, CommonElements, StructureTemplate } from './StructureExtractor';
export { BestPracticesDatabase, BestPractice, PatternTemplate } from './BestPracticesDatabase';
export { 
  PatternTemplateGenerator, 
  TemplateGenerationOptions, 
  ValidationResult, 
  GeneratedTemplate 
} from './PatternTemplateGenerator';
export {
  SpecificationBuilder,
  PatternSpecification,
  OutputStructure,
  OutputSection,
  SampleInput,
  ExpectedOutput,
  ValidationCriteria
} from './SpecificationBuilder';
export {
  SampleCollectionGenerator,
  SampleCollection,
  EnhancedSampleInput,
  DetailedExpectedOutput,
  TestScenario,
  ValidationSample
} from './SampleCollectionGenerator';
export {
  PatternValidator,
  ValidationResult,
  ValidationIssue,
  ValidationSuggestion,
  ComplianceChecks,
  QualityMetrics as ValidationQualityMetrics
} from './PatternValidator';
export {
  OutputTester,
  TestResult,
  TestSuite,
  OutputAnalysis,
  ContentQuality,
  FormatCompliance
} from './OutputTester';
export {
  QualityAssurance,
  QualityReport,
  QualityMetrics,
  StandardsCompliance,
  QualityRecommendation,
  CertificationStatus
} from './QualityAssurance';

// Re-export test functions for verification
export { testPatternAnalysisFoundation } from './test-foundation';
export { testPatternTemplateGenerator } from './test-template-generator';
export { testSpecificationBuilder } from './test-specification-builder';
export { testSampleCollectionGenerator } from './test-sample-collection-generator';
export { testAutomatedTestingFramework } from './test-automated-testing-framework';

/**
 * Custom Pattern Creation Framework
 * 
 * This framework provides tools for analyzing existing Fabric AI patterns,
 * extracting common structures and best practices, and creating new custom
 * patterns based on proven templates and methodologies.
 * 
 * Main Components:
 * - ExistingPatternAnalyzer: Analyzes existing patterns to understand structure
 * - StructureExtractor: Extracts common elements and creates templates
 * - BestPracticesDatabase: Stores and retrieves pattern creation best practices
 * 
 * Usage:
 * ```typescript
 * import { ExistingPatternAnalyzer, StructureExtractor, BestPracticesDatabase } from './pattern-creation';
 * 
 * const analyzer = new ExistingPatternAnalyzer();
 * const extractor = new StructureExtractor();
 * const database = new BestPracticesDatabase();
 * 
 * // Analyze existing patterns
 * const analyses = await analyzer.analyzeAllPatterns();
 * 
 * // Extract common structures
 * const templates = extractor.createStructureTemplates(analyses);
 * 
 * // Get best practices and create new patterns
 * const template = database.getLandingPagePatternTemplate('analyze_wireframe_flow');
 * ```
 */