// Demo script for DocumentationGenerator functionality
const fs = require('fs');

console.log('🚀 DocumentationGenerator Demo - Automatic Pattern Documentation\n');

// Simulate DocumentationGenerator functionality
class DocumentationGeneratorDemo {
  constructor() {
    this.SCORING_INTERPRETATIONS = {
      '9-10': { meaning: 'Excellent', actionable: 'Maintain current approach, consider as best practice example' },
      '7-8': { meaning: 'Good', actionable: 'Minor improvements possible, generally effective' },
      '5-6': { meaning: 'Average', actionable: 'Moderate improvements needed, focus on key areas' },
      '3-4': { meaning: 'Below Average', actionable: 'Significant improvements required, prioritize changes' },
      '1-2': { meaning: 'Poor', actionable: 'Major overhaul needed, consider complete redesign' }
    };
  }

  // Load pattern files for demo
  loadPatternFiles() {
    const patterns = {};
    const samples = {};

    try {
      patterns.wireframe = fs.readFileSync('patterns/analyze_wireframe_flow.md', 'utf-8');
      samples.wireframe = fs.readFileSync('patterns/test-samples/wireframe_flow_samples.md', 'utf-8');
    } catch (e) { console.log('   ⚠️  Wireframe pattern not found'); }

    try {
      patterns.copywriting = fs.readFileSync('patterns/analyze_copywriting_score.md', 'utf-8');
      samples.copywriting = fs.readFileSync('patterns/test-samples/copywriting_score_samples.md', 'utf-8');
    } catch (e) { console.log('   ⚠️  Copywriting pattern not found'); }

    try {
      patterns.storybrand = fs.readFileSync('patterns/create_storybrand_variant.md', 'utf-8');
      samples.storybrand = fs.readFileSync('patterns/test-samples/storybrand_variant_samples.md', 'utf-8');
    } catch (e) { console.log('   ⚠️  StoryBrand pattern not found'); }

    try {
      patterns.competitive = fs.readFileSync('patterns/create_competitive_audit.md', 'utf-8');
      samples.competitive = fs.readFileSync('patterns/test-samples/competitive_audit_samples.md', 'utf-8');
    } catch (e) { console.log('   ⚠️  Competitive audit pattern not found'); }

    return { patterns, samples };
  }

  // Generate pattern documentation
  generatePatternDocumentation(patternName, patternContent, patternMetadata, samplesContent) {
    const overview = this.generatePatternOverview(patternName, patternContent, patternMetadata);
    const usage = this.generatePatternUsage(patternName, patternContent, samplesContent);
    const outputFormat = this.generateOutputFormatDocumentation(patternContent, patternMetadata);
    const examples = this.generatePatternExamples(patternName, samplesContent);
    const bestPractices = this.generateBestPractices(patternName, patternContent);
    const troubleshooting = this.generateTroubleshootingGuide(patternName, patternContent);

    return {
      patternName,
      displayName: patternMetadata.displayName || this.formatDisplayName(patternName),
      category: patternMetadata.category || 'Custom Analysis',
      version: patternMetadata.version || '1.0.0',
      lastUpdated: new Date().toISOString(),
      overview,
      usage,
      outputFormat,
      examples,
      bestPractices,
      troubleshooting
    };
  }  // G
enerate pattern overview
  generatePatternOverview(patternName, patternContent, patternMetadata) {
    const purpose = this.extractPurpose(patternContent);
    const description = this.extractDescription(patternContent);
    const useCase = this.generateUseCase(patternName, patternContent);
    const targetAudience = this.determineTargetAudience(patternName, patternContent);
    const keyFeatures = this.extractKeyFeatures(patternContent);
    const benefits = this.generateBenefits(patternName, patternContent);
    const limitations = this.generateLimitations(patternName, patternContent);

    return {
      purpose,
      description,
      useCase,
      targetAudience,
      keyFeatures,
      benefits,
      limitations
    };
  }

  // Extract purpose from pattern content
  extractPurpose(patternContent) {
    const purposeMatch = patternContent.match(/# IDENTITY and PURPOSE\s*\n\n([^#]+)/);
    if (purposeMatch) {
      const lines = purposeMatch[1].trim().split('\n');
      return lines[0].trim();
    }
    return 'Specialized analysis pattern for extracting insights and recommendations.';
  }

  // Extract description from pattern content
  extractDescription(patternContent) {
    const purposeMatch = patternContent.match(/# IDENTITY and PURPOSE\s*\n\n([^#]+)/);
    if (purposeMatch) {
      const lines = purposeMatch[1].trim().split('\n').filter(line => line.trim().length > 0);
      if (lines.length > 1) {
        return lines.slice(1).join(' ').trim();
      }
    }
    return 'This pattern provides comprehensive analysis and actionable recommendations based on the input content.';
  }

  // Generate use case description
  generateUseCase(patternName, patternContent) {
    const useCases = {
      'wireframe': 'Analyze wireframes and landing page designs for UX effectiveness and conversion optimization.',
      'copywriting': 'Evaluate copywriting effectiveness including headlines, persuasion techniques, and clarity.',
      'storybrand': 'Apply StoryBrand SB7 framework to optimize landing pages for conversion and engagement.',
      'competitive': 'Conduct comprehensive competitive analysis using SWOT framework and strategic intelligence.'
    };

    for (const [key, useCase] of Object.entries(useCases)) {
      if (patternName.includes(key)) {
        return useCase;
      }
    }

    return 'Analyze content and provide structured insights with actionable recommendations for improvement.';
  }

  // Determine target audience
  determineTargetAudience(patternName, patternContent) {
    const audiences = {
      'wireframe': 'UX designers, product managers, and web developers working on user interface optimization.',
      'copywriting': 'Copywriters, marketers, and content creators focused on persuasive messaging.',
      'storybrand': 'Marketing professionals and business owners implementing StoryBrand methodology.',
      'competitive': 'Business strategists, product managers, and marketing teams conducting market analysis.'
    };

    for (const [key, audience] of Object.entries(audiences)) {
      if (patternName.includes(key) || patternContent.toLowerCase().includes(key)) {
        return audience;
      }
    }

    return 'Professionals and analysts requiring structured content analysis and actionable insights.';
  }  /
/ Extract key features from pattern content
  extractKeyFeatures(patternContent) {
    const features = [];

    if (patternContent.includes('1-10') || patternContent.includes('0-100')) {
      features.push('Comprehensive scoring system with numerical ratings');
    }

    if (patternContent.includes('HIGH/MEDIUM/LOW')) {
      features.push('Priority-based recommendations for actionable insights');
    }

    if (patternContent.includes('# OUTPUT')) {
      features.push('Structured output format with clearly defined sections');
    }

    if (patternContent.includes('SWOT')) {
      features.push('SWOT analysis framework for strategic insights');
    }

    if (patternContent.includes('conversion')) {
      features.push('Conversion optimization focus with actionable recommendations');
    }

    features.push('Detailed analysis with specific improvement suggestions');
    features.push('Professional formatting suitable for reports and presentations');

    return features;
  }

  // Generate benefits list
  generateBenefits(patternName, patternContent) {
    const benefits = [];

    if (patternName.includes('wireframe')) {
      benefits.push('Improve user experience and interface design');
      benefits.push('Identify navigation and usability issues');
      benefits.push('Optimize conversion funnel effectiveness');
    } else if (patternName.includes('copywriting')) {
      benefits.push('Enhance persuasive messaging and clarity');
      benefits.push('Improve headline effectiveness and engagement');
      benefits.push('Optimize call-to-action performance');
    } else if (patternName.includes('storybrand')) {
      benefits.push('Apply proven StoryBrand framework for conversion');
      benefits.push('Create compelling brand narrative and messaging');
      benefits.push('Improve customer engagement and retention');
    } else if (patternName.includes('competitive')) {
      benefits.push('Gain strategic insights into competitive landscape');
      benefits.push('Identify market opportunities and threats');
      benefits.push('Develop competitive advantages and positioning');
    }

    benefits.push('Save time with automated analysis and insights');
    benefits.push('Receive objective, data-driven recommendations');
    benefits.push('Access professional-quality analysis and reporting');

    return benefits;
  }

  // Generate limitations list
  generateLimitations(patternName, patternContent) {
    return [
      'Analysis quality depends on input content quality and completeness',
      'Recommendations require human judgment for implementation decisions',
      'Results may need customization based on specific business context',
      'Pattern effectiveness improves with detailed and comprehensive input'
    ];
  }  
// Generate pattern usage documentation
  generatePatternUsage(patternName, patternContent, samplesContent) {
    const basicUsage = this.generateBasicUsage(patternName, samplesContent);
    const inputRequirements = this.generateInputRequirements(patternContent);
    const outputDescription = this.generateOutputDescription(patternContent);
    const commonParameters = this.generateCommonParameters(patternName);
    const integrationNotes = this.generateIntegrationNotes(patternName);

    return {
      basicUsage,
      inputRequirements,
      outputDescription,
      commonParameters,
      integrationNotes
    };
  }

  // Generate basic usage example
  generateBasicUsage(patternName, samplesContent) {
    let inputExample = 'Paste your content here for analysis...';
    let expectedOutput = 'Structured analysis with scores and recommendations will be provided.';

    if (samplesContent) {
      inputExample = 'Sample landing page content with headers, navigation, and call-to-action elements...';
      expectedOutput = 'Detailed analysis with section-by-section insights, numerical scores (1-10), and prioritized recommendations...';
    }

    return {
      title: `Basic ${this.formatDisplayName(patternName)} Usage`,
      description: `Simple example of using the ${patternName} pattern for analysis.`,
      inputExample,
      expectedOutput,
      notes: [
        'Ensure input content is complete and well-formatted',
        'Review all output sections for comprehensive insights',
        'Use scoring information to prioritize improvements'
      ]
    };
  }

  // Generate input requirements
  generateInputRequirements(patternContent) {
    const requirements = [
      {
        name: 'Content',
        type: 'required',
        description: 'The main content to be analyzed',
        format: 'Plain text, HTML, or Markdown',
        examples: [
          'Landing page copy and structure',
          'Website content and messaging',
          'Marketing materials and communications'
        ],
        validation: 'Minimum 100 characters for meaningful analysis'
      }
    ];

    if (patternContent.includes('wireframe')) {
      requirements.push({
        name: 'Design Elements',
        type: 'optional',
        description: 'Information about visual design and layout',
        format: 'Descriptive text about design elements',
        examples: [
          'Navigation structure and menu items',
          'Button placement and styling',
          'Visual hierarchy and layout'
        ]
      });
    }

    return requirements;
  } 
 // Generate output description
  generateOutputDescription(patternContent) {
    const outputMatch = patternContent.match(/# OUTPUT\s*\n\n([^#]+)/);
    if (outputMatch) {
      const outputText = outputMatch[1].trim();
      const firstLine = outputText.split('\n')[0];
      return firstLine.replace(/^- /, '').trim();
    }
    return 'Structured analysis with detailed insights and actionable recommendations.';
  }

  // Generate common parameters
  generateCommonParameters(patternName) {
    return [
      {
        name: 'format',
        type: 'string',
        default: 'markdown',
        description: 'Output format for the analysis results',
        options: ['markdown', 'json', 'plain']
      },
      {
        name: 'detail_level',
        type: 'string',
        default: 'comprehensive',
        description: 'Level of detail in the analysis',
        options: ['basic', 'standard', 'comprehensive']
      }
    ];
  }

  // Generate integration notes
  generateIntegrationNotes(patternName) {
    return [
      'Pattern can be chained with other analysis patterns for comprehensive insights',
      'Output can be exported to CSV or Notion for further processing',
      'Results integrate with existing workflow and reporting systems'
    ];
  }

  // Generate output format documentation
  generateOutputFormatDocumentation(patternContent, patternMetadata) {
    const sections = this.extractOutputSections(patternContent);
    const scoringSystem = patternMetadata.hasScoring ? this.generateScoringSystemDoc() : undefined;
    const exportFormats = this.generateExportFormatDocs();
    const dataStructure = this.generateDataStructure(sections, patternMetadata);

    return {
      sections,
      scoringSystem,
      exportFormats,
      dataStructure
    };
  }

  // Extract output sections from pattern content
  extractOutputSections(patternContent) {
    const sections = [];
    const outputMatch = patternContent.match(/# OUTPUT\s*\n\n([\s\S]*?)(?=\n# |$)/);
    
    if (outputMatch) {
      const outputContent = outputMatch[1];
      const sectionMatches = outputContent.match(/- ([A-Z][A-Z\s/&]+):\s*([^-\n]+)/g);
      
      if (sectionMatches) {
        sectionMatches.forEach(match => {
          const [, name, description] = match.match(/- ([A-Z][A-Z\s/&]+):\s*(.+)/) || [];
          if (name && description) {
            sections.push({
              name: name.trim(),
              description: description.trim(),
              format: this.determineOutputFormat(description),
              required: true,
              example: this.generateSectionExample(name, description)
            });
          }
        });
      }
    }

    return sections;
  }  // D
etermine output format based on description
  determineOutputFormat(description) {
    if (description.includes('score') || description.includes('rating')) {
      return 'scored';
    }
    if (description.includes('analysis') || description.includes('assessment')) {
      return 'structured';
    }
    return 'text';
  }

  // Generate section example
  generateSectionExample(name, description) {
    if (description.includes('score') || description.includes('rating')) {
      return `${name}: 8/10 - Strong performance with minor areas for improvement.`;
    }
    if (name.includes('RECOMMENDATION') || name.includes('OPTIMIZATION')) {
      return `${name}: 1. Improve headline clarity (HIGH priority)\n2. Enhance call-to-action visibility (MEDIUM priority)`;
    }
    return `${name}: Detailed analysis and insights for this section with specific observations and recommendations.`;
  }

  // Generate scoring system documentation
  generateScoringSystemDoc() {
    return {
      description: 'Numerical scoring system providing objective assessment of effectiveness',
      scale: '1-10 scale where 10 represents optimal performance',
      criteria: [
        'Effectiveness and impact potential',
        'Clarity and user comprehension',
        'Alignment with best practices',
        'Conversion optimization potential'
      ],
      interpretation: Object.entries(this.SCORING_INTERPRETATIONS).map(([range, data]) => ({
        range,
        meaning: data.meaning,
        actionable: data.actionable
      }))
    };
  }

  // Generate export format documentation
  generateExportFormatDocs() {
    return [
      {
        format: 'CSV',
        description: 'Comma-separated values format for spreadsheet analysis',
        structure: 'Columns for each output section with scores and recommendations',
        usage: 'Import into Excel, Google Sheets, or data analysis tools'
      },
      {
        format: 'Notion',
        description: 'Structured database format for Notion workspace integration',
        structure: 'Database properties mapped to output sections with appropriate types',
        usage: 'Create Notion database entries for tracking and collaboration'
      },
      {
        format: 'JSON',
        description: 'Structured data format for programmatic processing',
        structure: 'Nested object structure with all analysis data and metadata',
        usage: 'Integrate with APIs, automation tools, and custom applications'
      }
    ];
  }

  // Generate data structure example
  generateDataStructure(sections, patternMetadata) {
    const structure = {
      pattern_name: 'pattern_name',
      timestamp: 'ISO_timestamp',
      input_content: 'original_input',
      analysis: {}
    };

    sections.forEach(section => {
      const sectionKey = section.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      structure.analysis[sectionKey] = {
        content: 'analysis_text',
        ...(section.format === 'scored' && { score: 'number_1_to_10' })
      };
    });

    if (patternMetadata.hasScoring) {
      structure.overall_score = 'number_0_to_100';
    }

    structure.metadata = {
      execution_time: 'milliseconds',
      quality_score: 'number_1_to_10'
    };

    return JSON.stringify(structure, null, 2);
  }