/**
 * ExportSystemIntegrator - Handles CSV and Notion export compatibility for custom patterns
 * 
 * This class provides functionality to:
 * - Generate CSV column mappings from pattern output sections
 * - Create Notion property mappings for custom patterns
 * - Handle export data transformation and formatting
 * - Integrate with existing export systems
 */

export interface CSVColumnMapping {
  columnName: string;
  dataType: 'text' | 'number' | 'boolean' | 'date' | 'score' | 'priority';
  description: string;
  required: boolean;
  defaultValue?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
}

export interface NotionPropertyMapping {
  propertyName: string;
  propertyType: 'title' | 'rich_text' | 'number' | 'select' | 'multi_select' | 'date' | 'checkbox' | 'url' | 'email';
  description: string;
  required: boolean;
  options?: string[];
  numberFormat?: 'number' | 'number_with_commas' | 'percent' | 'dollar' | 'euro' | 'pound' | 'yen' | 'ruble' | 'rupee' | 'won' | 'yuan';
}

export interface ExportConfiguration {
  patternName: string;
  displayName: string;
  csvColumns: CSVColumnMapping[];
  notionProperties: NotionPropertyMapping[];
  exportFormats: string[];
  dataTransformations: DataTransformation[];
}

export interface DataTransformation {
  sourceField: string;
  targetField: string;
  transformationType: 'direct' | 'score_to_number' | 'priority_to_select' | 'text_to_rich_text' | 'custom';
  customTransform?: (value: any) => any;
}

export interface ExportData {
  patternName: string;
  timestamp: string;
  inputContent: string;
  outputData: Record<string, any>;
  metadata: {
    version: string;
    executionTime: number;
    quality: number;
  };
}

export class ExportSystemIntegrator {
  private readonly SCORE_COLUMNS = [
    'layout_score', 'navigation_score', 'conversion_score',
    'headline_score', 'persuasion_score', 'clarity_score',
    'header_score', 'stakes_score', 'value_proposition_score',
    'positioning_score', 'ux_score', 'content_score'
  ];

  private readonly PRIORITY_OPTIONS = ['HIGH', 'MEDIUM', 'LOW'];

  private readonly NOTION_PROPERTY_LIMITS = {
    title: 2000,
    rich_text: 2000,
    select_options: 100,
    multi_select_options: 100
  };

  /**
   * Generate CSV column mappings from pattern output sections
   */
  generateCSVColumns(
    patternName: string,
    outputSections: string[],
    hasScoring: boolean = false,
    hasPrioritization: boolean = false
  ): CSVColumnMapping[] {
    const columns: CSVColumnMapping[] = [];

    // Add standard columns
    columns.push({
      columnName: 'pattern_name',
      dataType: 'text',
      description: 'Name of the pattern used for analysis',
      required: true,
      defaultValue: patternName
    });

    columns.push({
      columnName: 'timestamp',
      dataType: 'date',
      description: 'When the analysis was performed',
      required: true
    });

    columns.push({
      columnName: 'input_content',
      dataType: 'text',
      description: 'Original content that was analyzed',
      required: true
    });

    // Add columns for each output section
    outputSections.forEach(section => {
      const columnName = this.sectionToColumnName(section);
      
      // Check if this is a scoring section
      if (hasScoring && this.isScoreSection(section)) {
        columns.push({
          columnName: `${columnName}_score`,
          dataType: 'score',
          description: `Score for ${section} (1-10)`,
          required: false,
          validation: { min: 1, max: 10 }
        });
      }

      // Add main content column
      columns.push({
        columnName: columnName,
        dataType: 'text',
        description: `Analysis results for ${section}`,
        required: false
      });

      // Add priority column if applicable
      if (hasPrioritization && this.isPrioritySection(section)) {
        columns.push({
          columnName: `${columnName}_priority`,
          dataType: 'priority',
          description: `Priority level for ${section} recommendations`,
          required: false,
          validation: { options: this.PRIORITY_OPTIONS }
        });
      }
    });

    // Add overall score if pattern has scoring
    if (hasScoring) {
      columns.push({
        columnName: 'overall_score',
        dataType: 'score',
        description: 'Overall analysis score (0-100)',
        required: false,
        validation: { min: 0, max: 100 }
      });
    }

    // Add metadata columns
    columns.push({
      columnName: 'execution_time_ms',
      dataType: 'number',
      description: 'Time taken to execute the analysis (milliseconds)',
      required: false
    });

    columns.push({
      columnName: 'quality_score',
      dataType: 'score',
      description: 'Quality score of the analysis output (1-10)',
      required: false,
      validation: { min: 1, max: 10 }
    });

    return columns;
  }

  /**
   * Generate Notion property mappings from pattern output sections
   */
  generateNotionProperties(
    patternName: string,
    outputSections: string[],
    hasScoring: boolean = false,
    hasPrioritization: boolean = false
  ): NotionPropertyMapping[] {
    const properties: NotionPropertyMapping[] = [];

    // Add title property
    properties.push({
      propertyName: 'Analysis Title',
      propertyType: 'title',
      description: 'Title of the analysis entry',
      required: true
    });

    // Add standard properties
    properties.push({
      propertyName: 'Pattern Name',
      propertyType: 'select',
      description: 'Name of the pattern used for analysis',
      required: true,
      options: [patternName]
    });

    properties.push({
      propertyName: 'Analysis Date',
      propertyType: 'date',
      description: 'When the analysis was performed',
      required: true
    });

    properties.push({
      propertyName: 'Input Content',
      propertyType: 'rich_text',
      description: 'Original content that was analyzed',
      required: true
    });

    // Add properties for each output section
    outputSections.forEach(section => {
      const propertyName = this.sectionToPropertyName(section);
      
      // Check if this is a scoring section
      if (hasScoring && this.isScoreSection(section)) {
        properties.push({
          propertyName: `${propertyName} Score`,
          propertyType: 'number',
          description: `Score for ${section} (1-10)`,
          required: false,
          numberFormat: 'number'
        });
      }

      // Add main content property
      properties.push({
        propertyName: propertyName,
        propertyType: 'rich_text',
        description: `Analysis results for ${section}`,
        required: false
      });

      // Add priority property if applicable
      if (hasPrioritization && this.isPrioritySection(section)) {
        properties.push({
          propertyName: `${propertyName} Priority`,
          propertyType: 'select',
          description: `Priority level for ${section} recommendations`,
          required: false,
          options: this.PRIORITY_OPTIONS
        });
      }
    });

    // Add overall score if pattern has scoring
    if (hasScoring) {
      properties.push({
        propertyName: 'Overall Score',
        propertyType: 'number',
        description: 'Overall analysis score (0-100)',
        required: false,
        numberFormat: 'number'
      });
    }

    // Add metadata properties
    properties.push({
      propertyName: 'Execution Time',
      propertyType: 'number',
      description: 'Time taken to execute the analysis (milliseconds)',
      required: false,
      numberFormat: 'number_with_commas'
    });

    properties.push({
      propertyName: 'Quality Score',
      propertyType: 'number',
      description: 'Quality score of the analysis output (1-10)',
      required: false,
      numberFormat: 'number'
    });

    properties.push({
      propertyName: 'Status',
      propertyType: 'select',
      description: 'Status of the analysis',
      required: false,
      options: ['Completed', 'In Progress', 'Failed', 'Pending Review']
    });

    return properties;
  }

  /**
   * Convert section name to CSV column name
   */
  private sectionToColumnName(section: string): string {
    return section
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  /**
   * Convert section name to Notion property name
   */
  private sectionToPropertyName(section: string): string {
    return section
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .trim();
  }

  /**
   * Check if section should have scoring
   */
  private isScoreSection(section: string): boolean {
    const sectionLower = section.toLowerCase();
    return sectionLower.includes('analysis') || 
           sectionLower.includes('evaluation') || 
           sectionLower.includes('assessment') ||
           sectionLower.includes('audit') ||
           sectionLower.includes('score');
  }

  /**
   * Check if section should have prioritization
   */
  private isPrioritySection(section: string): boolean {
    const sectionLower = section.toLowerCase();
    return sectionLower.includes('recommendation') || 
           sectionLower.includes('optimization') || 
           sectionLower.includes('improvement') ||
           sectionLower.includes('action');
  }

  /**
   * Generate complete export configuration for a pattern
   */
  generateExportConfiguration(
    patternName: string,
    displayName: string,
    outputSections: string[],
    hasScoring: boolean = false,
    hasPrioritization: boolean = false
  ): ExportConfiguration {
    const csvColumns = this.generateCSVColumns(patternName, outputSections, hasScoring, hasPrioritization);
    const notionProperties = this.generateNotionProperties(patternName, outputSections, hasScoring, hasPrioritization);
    const dataTransformations = this.generateDataTransformations(outputSections, hasScoring, hasPrioritization);

    return {
      patternName,
      displayName,
      csvColumns,
      notionProperties,
      exportFormats: ['csv', 'notion', 'json'],
      dataTransformations
    };
  }

  /**
   * Generate data transformations for export
   */
  private generateDataTransformations(
    outputSections: string[],
    hasScoring: boolean,
    hasPrioritization: boolean
  ): DataTransformation[] {
    const transformations: DataTransformation[] = [];

    // Standard transformations
    transformations.push({
      sourceField: 'pattern_name',
      targetField: 'Pattern Name',
      transformationType: 'direct'
    });

    transformations.push({
      sourceField: 'timestamp',
      targetField: 'Analysis Date',
      transformationType: 'direct'
    });

    transformations.push({
      sourceField: 'input_content',
      targetField: 'Input Content',
      transformationType: 'text_to_rich_text'
    });

    // Section-specific transformations
    outputSections.forEach(section => {
      const columnName = this.sectionToColumnName(section);
      const propertyName = this.sectionToPropertyName(section);

      // Main content transformation
      transformations.push({
        sourceField: columnName,
        targetField: propertyName,
        transformationType: 'text_to_rich_text'
      });

      // Score transformation
      if (hasScoring && this.isScoreSection(section)) {
        transformations.push({
          sourceField: `${columnName}_score`,
          targetField: `${propertyName} Score`,
          transformationType: 'score_to_number'
        });
      }

      // Priority transformation
      if (hasPrioritization && this.isPrioritySection(section)) {
        transformations.push({
          sourceField: `${columnName}_priority`,
          targetField: `${propertyName} Priority`,
          transformationType: 'priority_to_select'
        });
      }
    });

    // Overall score transformation
    if (hasScoring) {
      transformations.push({
        sourceField: 'overall_score',
        targetField: 'Overall Score',
        transformationType: 'score_to_number'
      });
    }

    return transformations;
  }

  /**
   * Transform export data according to configuration
   */
  transformExportData(data: ExportData, config: ExportConfiguration): Record<string, any> {
    const transformedData: Record<string, any> = {};

    config.dataTransformations.forEach(transformation => {
      const sourceValue = this.getNestedValue(data, transformation.sourceField);
      
      if (sourceValue !== undefined) {
        transformedData[transformation.targetField] = this.applyTransformation(
          sourceValue,
          transformation.transformationType,
          transformation.customTransform
        );
      }
    });

    return transformedData;
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Apply transformation to value
   */
  private applyTransformation(
    value: any,
    type: DataTransformation['transformationType'],
    customTransform?: (value: any) => any
  ): any {
    switch (type) {
      case 'direct':
        return value;
      
      case 'score_to_number':
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(numValue) ? null : numValue;
      
      case 'priority_to_select':
        return this.PRIORITY_OPTIONS.includes(value) ? value : 'MEDIUM';
      
      case 'text_to_rich_text':
        return typeof value === 'string' ? value : String(value);
      
      case 'custom':
        return customTransform ? customTransform(value) : value;
      
      default:
        return value;
    }
  }

  /**
   * Generate CSV header row from configuration
   */
  generateCSVHeader(config: ExportConfiguration): string {
    return config.csvColumns.map(col => col.columnName).join(',');
  }

  /**
   * Generate CSV row from export data
   */
  generateCSVRow(data: ExportData, config: ExportConfiguration): string {
    const transformedData = this.transformExportData(data, config);
    
    return config.csvColumns.map(col => {
      const value = transformedData[col.columnName] || col.defaultValue || '';
      return this.escapeCSVValue(String(value));
    }).join(',');
  }

  /**
   * Escape CSV value
   */
  private escapeCSVValue(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Generate Notion database schema
   */
  generateNotionSchema(config: ExportConfiguration): Record<string, any> {
    const schema: Record<string, any> = {};

    config.notionProperties.forEach(prop => {
      const property: any = {
        type: prop.propertyType
      };

      // Add type-specific configurations
      switch (prop.propertyType) {
        case 'select':
        case 'multi_select':
          if (prop.options) {
            property[prop.propertyType] = {
              options: prop.options.map(option => ({ name: option }))
            };
          }
          break;
        
        case 'number':
          if (prop.numberFormat) {
            property.number = { format: prop.numberFormat };
          }
          break;
      }

      schema[prop.propertyName] = property;
    });

    return schema;
  }

  /**
   * Generate Notion page properties from export data
   */
  generateNotionProperties(data: ExportData, config: ExportConfiguration): Record<string, any> {
    const transformedData = this.transformExportData(data, config);
    const properties: Record<string, any> = {};

    config.notionProperties.forEach(prop => {
      const value = transformedData[prop.propertyName];
      
      if (value !== undefined) {
        properties[prop.propertyName] = this.formatNotionProperty(value, prop.propertyType);
      }
    });

    return properties;
  }

  /**
   * Format value for Notion property type
   */
  private formatNotionProperty(value: any, propertyType: NotionPropertyMapping['propertyType']): any {
    switch (propertyType) {
      case 'title':
        return { title: [{ text: { content: String(value) } }] };
      
      case 'rich_text':
        return { rich_text: [{ text: { content: String(value) } }] };
      
      case 'number':
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        return { number: isNaN(numValue) ? null : numValue };
      
      case 'select':
        return { select: { name: String(value) } };
      
      case 'multi_select':
        const options = Array.isArray(value) ? value : [value];
        return { multi_select: options.map(opt => ({ name: String(opt) })) };
      
      case 'date':
        return { date: { start: value instanceof Date ? value.toISOString() : String(value) } };
      
      case 'checkbox':
        return { checkbox: Boolean(value) };
      
      case 'url':
        return { url: String(value) };
      
      case 'email':
        return { email: String(value) };
      
      default:
        return { rich_text: [{ text: { content: String(value) } }] };
    }
  }

  /**
   * Validate export configuration
   */
  validateExportConfiguration(config: ExportConfiguration): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate CSV columns
    config.csvColumns.forEach(col => {
      if (!col.columnName || col.columnName.trim() === '') {
        errors.push(`CSV column missing name: ${JSON.stringify(col)}`);
      }
      
      if (col.validation) {
        if (col.dataType === 'score' && (!col.validation.min || !col.validation.max)) {
          errors.push(`Score column ${col.columnName} missing min/max validation`);
        }
      }
    });

    // Validate Notion properties
    config.notionProperties.forEach(prop => {
      if (!prop.propertyName || prop.propertyName.trim() === '') {
        errors.push(`Notion property missing name: ${JSON.stringify(prop)}`);
      }
      
      if (prop.propertyName.length > this.NOTION_PROPERTY_LIMITS.title) {
        errors.push(`Notion property name too long: ${prop.propertyName}`);
      }
      
      if ((prop.propertyType === 'select' || prop.propertyType === 'multi_select') && !prop.options) {
        errors.push(`Select property ${prop.propertyName} missing options`);
      }
    });

    // Validate data transformations
    config.dataTransformations.forEach(transform => {
      if (!transform.sourceField || !transform.targetField) {
        errors.push(`Data transformation missing source or target field: ${JSON.stringify(transform)}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate export configuration for multiple patterns
   */
  generateMultipleExportConfigurations(
    patterns: Array<{
      name: string;
      displayName: string;
      outputSections: string[];
      hasScoring: boolean;
      hasPrioritization: boolean;
    }>
  ): ExportConfiguration[] {
    return patterns.map(pattern => 
      this.generateExportConfiguration(
        pattern.name,
        pattern.displayName,
        pattern.outputSections,
        pattern.hasScoring,
        pattern.hasPrioritization
      )
    );
  }
}