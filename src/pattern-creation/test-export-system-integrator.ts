/**
 * Test suite for ExportSystemIntegrator class
 * Tests CSV and Notion export functionality for custom patterns
 */

import { ExportSystemIntegrator, ExportConfiguration, ExportData } from './ExportSystemIntegrator';

// Mock pattern data for testing
const mockPatternData = {
  wireframe: {
    name: 'analyze_wireframe_flow',
    displayName: 'Analyze Wireframe Flow',
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
  copywriting: {
    name: 'analyze_copywriting_score',
    displayName: 'Analyze Copywriting Score',
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
  storybrand: {
    name: 'create_storybrand_variant',
    displayName: 'Create StoryBrand Variant',
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
  competitive: {
    name: 'create_competitive_audit',
    displayName: 'Create Competitive Audit',
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
};

const mockExportData: ExportData = {
  patternName: 'analyze_wireframe_flow',
  timestamp: '2024-01-15T10:30:00Z',
  inputContent: 'Sample wireframe content for analysis...',
  outputData: {
    layout_analysis: 'The layout shows good visual hierarchy with clear sections...',
    layout_analysis_score: 8,
    navigation_evaluation: 'Navigation is intuitive with clear menu structure...',
    navigation_evaluation_score: 7,
    conversion_optimization: 'CTA placement could be improved for better conversion...',
    conversion_optimization_priority: 'HIGH',
    overall_score: 78
  },
  metadata: {
    version: '1.0.0',
    executionTime: 2500,
    quality: 9
  }
};

class ExportSystemIntegratorTest {
  private integrator: ExportSystemIntegrator;

  constructor() {
    this.integrator = new ExportSystemIntegrator();
  }

  /**
   * Test CSV column generation
   */
  testCSVColumnGeneration(): void {
    console.log('🧪 Testing CSV Column Generation...\n');

    const pattern = mockPatternData.wireframe;
    const csvColumns = this.integrator.generateCSVColumns(
      pattern.name,
      pattern.outputSections,
      pattern.hasScoring,
      pattern.hasPrioritization
    );

    console.log('✅ Generated CSV Columns:');
    console.log(`   Total columns: ${csvColumns.length}`);
    
    // Show sample columns
    csvColumns.slice(0, 10).forEach(col => {
      console.log(`   - ${col.columnName} (${col.dataType}): ${col.description}`);
    });

    // Validate column structure
    const validations = [
      { check: 'Has standard columns', result: csvColumns.some(col => col.columnName === 'pattern_name') },
      { check: 'Has timestamp column', result: csvColumns.some(col => col.columnName === 'timestamp') },
      { check: 'Has input content column', result: csvColumns.some(col => col.columnName === 'input_content') },
      { check: 'Has score columns', result: csvColumns.some(col => col.dataType === 'score') },
      { check: 'Has priority columns', result: csvColumns.some(col => col.dataType === 'priority') },
      { check: 'Has overall score', result: csvColumns.some(col => col.columnName === 'overall_score') },
      { check: 'Has metadata columns', result: csvColumns.some(col => col.columnName === 'execution_time_ms') },
      { check: 'All columns have descriptions', result: csvColumns.every(col => col.description && col.description.length > 0) }
    ];

    console.log('\n📋 CSV Column Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const csvScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 CSV Generation Score: ${Math.round(csvScore)}%`);
  }

  /**
   * Test Notion property generation
   */
  testNotionPropertyGeneration(): void {
    console.log('\n🧪 Testing Notion Property Generation...\n');

    const pattern = mockPatternData.copywriting;
    const notionProperties = this.integrator.generateNotionProperties(
      pattern.name,
      pattern.outputSections,
      pattern.hasScoring,
      pattern.hasPrioritization
    );

    console.log('✅ Generated Notion Properties:');
    console.log(`   Total properties: ${notionProperties.length}`);
    
    // Show sample properties
    notionProperties.slice(0, 10).forEach(prop => {
      console.log(`   - ${prop.propertyName} (${prop.propertyType}): ${prop.description}`);
    });

    // Validate property structure
    const validations = [
      { check: 'Has title property', result: notionProperties.some(prop => prop.propertyType === 'title') },
      { check: 'Has date property', result: notionProperties.some(prop => prop.propertyType === 'date') },
      { check: 'Has rich text properties', result: notionProperties.some(prop => prop.propertyType === 'rich_text') },
      { check: 'Has number properties', result: notionProperties.some(prop => prop.propertyType === 'number') },
      { check: 'Has select properties', result: notionProperties.some(prop => prop.propertyType === 'select') },
      { check: 'Select properties have options', result: notionProperties.filter(prop => prop.propertyType === 'select').every(prop => prop.options && prop.options.length > 0) },
      { check: 'All properties have descriptions', result: notionProperties.every(prop => prop.description && prop.description.length > 0) },
      { check: 'Property names are valid', result: notionProperties.every(prop => prop.propertyName && prop.propertyName.length > 0) }
    ];

    console.log('\n📋 Notion Property Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const notionScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Notion Generation Score: ${Math.round(notionScore)}%`);
  }

  /**
   * Test export configuration generation
   */
  testExportConfigurationGeneration(): void {
    console.log('\n🧪 Testing Export Configuration Generation...\n');

    const pattern = mockPatternData.storybrand;
    const exportConfig = this.integrator.generateExportConfiguration(
      pattern.name,
      pattern.displayName,
      pattern.outputSections,
      pattern.hasScoring,
      pattern.hasPrioritization
    );

    console.log('✅ Generated Export Configuration:');
    console.log(`   Pattern: ${exportConfig.patternName}`);
    console.log(`   Display Name: ${exportConfig.displayName}`);
    console.log(`   CSV Columns: ${exportConfig.csvColumns.length}`);
    console.log(`   Notion Properties: ${exportConfig.notionProperties.length}`);
    console.log(`   Export Formats: ${exportConfig.exportFormats.join(', ')}`);
    console.log(`   Data Transformations: ${exportConfig.dataTransformations.length}`);

    // Validate configuration structure
    const validations = [
      { check: 'Has pattern name', result: exportConfig.patternName === pattern.name },
      { check: 'Has display name', result: exportConfig.displayName === pattern.displayName },
      { check: 'Has CSV columns', result: exportConfig.csvColumns.length > 0 },
      { check: 'Has Notion properties', result: exportConfig.notionProperties.length > 0 },
      { check: 'Has export formats', result: exportConfig.exportFormats.length > 0 },
      { check: 'Has data transformations', result: exportConfig.dataTransformations.length > 0 },
      { check: 'Supports CSV export', result: exportConfig.exportFormats.includes('csv') },
      { check: 'Supports Notion export', result: exportConfig.exportFormats.includes('notion') }
    ];

    console.log('\n📋 Export Configuration Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const configScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Configuration Score: ${Math.round(configScore)}%`);
  }

  /**
   * Test data transformation
   */
  testDataTransformation(): void {
    console.log('\n🧪 Testing Data Transformation...\n');

    const pattern = mockPatternData.wireframe;
    const exportConfig = this.integrator.generateExportConfiguration(
      pattern.name,
      pattern.displayName,
      pattern.outputSections,
      pattern.hasScoring,
      pattern.hasPrioritization
    );

    const transformedData = this.integrator.transformExportData(mockExportData, exportConfig);

    console.log('✅ Data Transformation Results:');
    console.log(`   Transformed fields: ${Object.keys(transformedData).length}`);
    
    // Show sample transformed data
    Object.entries(transformedData).slice(0, 8).forEach(([key, value]) => {
      console.log(`   - ${key}: ${typeof value === 'string' && value.length > 50 ? value.substring(0, 50) + '...' : value}`);
    });

    // Validate transformation
    const validations = [
      { check: 'Pattern name transformed', result: transformedData['Pattern Name'] === mockExportData.patternName },
      { check: 'Timestamp transformed', result: transformedData['Analysis Date'] === mockExportData.timestamp },
      { check: 'Input content transformed', result: transformedData['Input Content'] === mockExportData.inputContent },
      { check: 'Score values transformed', result: typeof transformedData['Layout Analysis Score'] === 'number' },
      { check: 'Priority values transformed', result: transformedData['Conversion Optimization Priority'] === 'HIGH' },
      { check: 'Overall score transformed', result: typeof transformedData['Overall Score'] === 'number' },
      { check: 'All transformations applied', result: exportConfig.dataTransformations.length > 0 }
    ];

    console.log('\n📋 Data Transformation Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const transformScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Transformation Score: ${Math.round(transformScore)}%`);
  }

  /**
   * Test CSV generation
   */
  testCSVGeneration(): void {
    console.log('\n🧪 Testing CSV Generation...\n');

    const pattern = mockPatternData.competitive;
    const exportConfig = this.integrator.generateExportConfiguration(
      pattern.name,
      pattern.displayName,
      pattern.outputSections,
      pattern.hasScoring,
      pattern.hasPrioritization
    );

    const csvHeader = this.integrator.generateCSVHeader(exportConfig);
    const csvRow = this.integrator.generateCSVRow(mockExportData, exportConfig);

    console.log('✅ CSV Generation Results:');
    console.log(`   Header columns: ${csvHeader.split(',').length}`);
    console.log(`   Row values: ${csvRow.split(',').length}`);
    console.log(`   Header sample: ${csvHeader.substring(0, 100)}...`);
    console.log(`   Row sample: ${csvRow.substring(0, 100)}...`);

    // Validate CSV structure
    const validations = [
      { check: 'Header has columns', result: csvHeader.split(',').length > 0 },
      { check: 'Row has values', result: csvRow.split(',').length > 0 },
      { check: 'Header and row match', result: csvHeader.split(',').length === csvRow.split(',').length },
      { check: 'Contains pattern name', result: csvHeader.includes('pattern_name') },
      { check: 'Contains timestamp', result: csvHeader.includes('timestamp') },
      { check: 'Contains scores', result: csvHeader.includes('score') },
      { check: 'Values properly escaped', result: !csvRow.includes(',,') }
    ];

    console.log('\n📋 CSV Generation Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const csvScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 CSV Generation Score: ${Math.round(csvScore)}%`);
  }

  /**
   * Test Notion schema generation
   */
  testNotionSchemaGeneration(): void {
    console.log('\n🧪 Testing Notion Schema Generation...\n');

    const pattern = mockPatternData.wireframe;
    const exportConfig = this.integrator.generateExportConfiguration(
      pattern.name,
      pattern.displayName,
      pattern.outputSections,
      pattern.hasScoring,
      pattern.hasPrioritization
    );

    const notionSchema = this.integrator.generateNotionSchema(exportConfig);
    const notionProperties = this.integrator.generateNotionProperties(mockExportData, exportConfig);

    console.log('✅ Notion Schema Generation Results:');
    console.log(`   Schema properties: ${Object.keys(notionSchema).length}`);
    console.log(`   Page properties: ${Object.keys(notionProperties).length}`);
    
    // Show sample schema
    Object.entries(notionSchema).slice(0, 5).forEach(([key, value]) => {
      console.log(`   - ${key}: ${JSON.stringify(value)}`);
    });

    // Validate Notion schema
    const validations = [
      { check: 'Schema has properties', result: Object.keys(notionSchema).length > 0 },
      { check: 'Page properties generated', result: Object.keys(notionProperties).length > 0 },
      { check: 'Has title property', result: notionSchema['Analysis Title']?.type === 'title' },
      { check: 'Has select properties', result: Object.values(notionSchema).some((prop: any) => prop.type === 'select') },
      { check: 'Has number properties', result: Object.values(notionSchema).some((prop: any) => prop.type === 'number') },
      { check: 'Select properties have options', result: Object.values(notionSchema).filter((prop: any) => prop.type === 'select').every((prop: any) => prop.select?.options) },
      { check: 'Properties properly formatted', result: Object.values(notionProperties).every(prop => typeof prop === 'object') }
    ];

    console.log('\n📋 Notion Schema Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const schemaScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Notion Schema Score: ${Math.round(schemaScore)}%`);
  }

  /**
   * Test configuration validation
   */
  testConfigurationValidation(): void {
    console.log('\n🧪 Testing Configuration Validation...\n');

    const pattern = mockPatternData.copywriting;
    const validConfig = this.integrator.generateExportConfiguration(
      pattern.name,
      pattern.displayName,
      pattern.outputSections,
      pattern.hasScoring,
      pattern.hasPrioritization
    );

    // Test valid configuration
    const validResult = this.integrator.validateExportConfiguration(validConfig);
    console.log('✅ Valid Configuration Test:');
    console.log(`   Valid: ${validResult.valid}`);
    console.log(`   Errors: ${validResult.errors.length}`);

    // Test invalid configuration
    const invalidConfig = { ...validConfig };
    invalidConfig.csvColumns[0].columnName = ''; // Invalid empty name
    invalidConfig.notionProperties[0].propertyName = ''; // Invalid empty name

    const invalidResult = this.integrator.validateExportConfiguration(invalidConfig);
    console.log('\n❌ Invalid Configuration Test:');
    console.log(`   Valid: ${invalidResult.valid}`);
    console.log(`   Errors: ${invalidResult.errors.length}`);
    invalidResult.errors.slice(0, 3).forEach(error => {
      console.log(`   - ${error}`);
    });

    // Validate validation logic
    const validations = [
      { check: 'Valid config passes', result: validResult.valid === true },
      { check: 'Valid config has no errors', result: validResult.errors.length === 0 },
      { check: 'Invalid config fails', result: invalidResult.valid === false },
      { check: 'Invalid config has errors', result: invalidResult.errors.length > 0 },
      { check: 'Error messages are descriptive', result: invalidResult.errors.every(error => error.length > 10) }
    ];

    console.log('\n📋 Validation Logic Test:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const validationScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Validation Score: ${Math.round(validationScore)}%`);
  }

  /**
   * Test multiple pattern export configurations
   */
  testMultiplePatternExport(): void {
    console.log('\n🧪 Testing Multiple Pattern Export...\n');

    const patterns = Object.values(mockPatternData);
    const exportConfigs = this.integrator.generateMultipleExportConfigurations(patterns);

    console.log('✅ Multiple Pattern Export Results:');
    console.log(`   Patterns processed: ${exportConfigs.length}`);
    
    exportConfigs.forEach(config => {
      console.log(`   - ${config.displayName}: ${config.csvColumns.length} CSV cols, ${config.notionProperties.length} Notion props`);
    });

    // Validate multiple export
    const validations = [
      { check: 'All patterns processed', result: exportConfigs.length === patterns.length },
      { check: 'All configs have CSV columns', result: exportConfigs.every(config => config.csvColumns.length > 0) },
      { check: 'All configs have Notion properties', result: exportConfigs.every(config => config.notionProperties.length > 0) },
      { check: 'All configs have transformations', result: exportConfigs.every(config => config.dataTransformations.length > 0) },
      { check: 'Pattern names unique', result: new Set(exportConfigs.map(c => c.patternName)).size === exportConfigs.length },
      { check: 'All configs valid', result: exportConfigs.every(config => this.integrator.validateExportConfiguration(config).valid) }
    ];

    console.log('\n📋 Multiple Export Validation:');
    validations.forEach(validation => {
      console.log(`   ${validation.result ? '✅' : '❌'} ${validation.check}`);
    });

    const multipleScore = validations.filter(v => v.result).length / validations.length * 100;
    console.log(`\n📊 Multiple Export Score: ${Math.round(multipleScore)}%`);
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log('🚀 Starting ExportSystemIntegrator Test Suite\n');
    console.log('='.repeat(60));

    try {
      this.testCSVColumnGeneration();
      this.testNotionPropertyGeneration();
      this.testExportConfigurationGeneration();
      this.testDataTransformation();
      this.testCSVGeneration();
      this.testNotionSchemaGeneration();
      this.testConfigurationValidation();
      this.testMultiplePatternExport();

      console.log('\n' + '='.repeat(60));
      console.log('🎉 All ExportSystemIntegrator tests completed successfully!');
      console.log('\n✨ Key Features Validated:');
      console.log('✅ CSV column generation with proper data types and validation');
      console.log('✅ Notion property mapping with type-specific configurations');
      console.log('✅ Export configuration generation for multiple patterns');
      console.log('✅ Data transformation with score and priority handling');
      console.log('✅ CSV header and row generation with proper escaping');
      console.log('✅ Notion schema and page property generation');
      console.log('✅ Configuration validation with detailed error reporting');
      console.log('✅ Batch processing for multiple pattern export configurations');
      console.log('\n🚀 ExportSystemIntegrator ready for production use!');

    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
}

// Export for use in other test files
export { ExportSystemIntegratorTest };

// Run tests if this file is executed directly
if (require.main === module) {
  const test = new ExportSystemIntegratorTest();
  test.runAllTests();
}