import { PatternTemplateGenerator, TemplateGenerationOptions } from './PatternTemplateGenerator';

/**
 * Test script to verify PatternTemplateGenerator functionality
 */
async function testPatternTemplateGenerator() {
  console.log('🚀 Testing PatternTemplateGenerator...\n');

  try {
    const generator = new PatternTemplateGenerator();

    // Test 1: Generate a custom template
    console.log('1. Testing custom template generation...');
    const customOptions: TemplateGenerationOptions = {
      patternName: 'test_analysis_pattern',
      patternType: 'content_analysis',
      domain: 'content analysis',
      expertise: 'expert content analyst',
      contentType: 'web content',
      analysisAreas: ['structure', 'readability', 'engagement'],
      outputSections: ['STRUCTURE ANALYSIS', 'READABILITY SCORE', 'ENGAGEMENT METRICS', 'RECOMMENDATIONS'],
      complexity: 'medium'
    };

    const customTemplate = await generator.generateTemplate(customOptions);
    console.log(`   ✅ Generated custom template with confidence: ${(customTemplate.confidence * 100).toFixed(1)}%`);
    console.log(`   ✅ Validation score: ${customTemplate.validation.score}/100`);
    console.log(`   ✅ Found ${customTemplate.similarPatterns.length} similar patterns`);

    if (customTemplate.validation.issues.length > 0) {
      console.log(`   ⚠️  Issues found: ${customTemplate.validation.issues.length}`);
      customTemplate.validation.issues.slice(0, 2).forEach(issue => {
        console.log(`      - ${issue}`);
      });
    }

    // Test 2: Generate landing page templates
    console.log('\n2. Testing landing page template generation...');
    const landingPagePatterns = [
      'analyze_wireframe_flow',
      'analyze_copywriting_score',
      'create_storybrand_variant',
      'create_competitive_audit'
    ];

    for (const patternType of landingPagePatterns) {
      try {
        const landingPageTemplate = await generator.generateLandingPageTemplate(patternType);
        console.log(`   ✅ ${patternType}: confidence ${(landingPageTemplate.confidence * 100).toFixed(1)}%, validation ${landingPageTemplate.validation.score}/100`);
        
        // Test pattern file generation
        const patternFile = generator.generatePatternFile(landingPageTemplate.template);
        const hasRequiredSections = ['# IDENTITY and PURPOSE', '# STEPS', '# OUTPUT', '# OUTPUT INSTRUCTIONS'].every(
          section => patternFile.includes(section)
        );
        
        if (hasRequiredSections) {
          console.log(`      ✅ Generated valid pattern file structure`);
        } else {
          console.log(`      ❌ Missing required sections in pattern file`);
        }
      } catch (error) {
        console.log(`   ❌ Failed to generate ${patternType}: ${error.message}`);
      }
    }

    // Test 3: Template validation
    console.log('\n3. Testing template validation...');
    const testTemplate = customTemplate.template;
    const validation = await generator.validateTemplate(testTemplate);
    
    console.log(`   ✅ Validation completed:`);
    console.log(`      - Valid: ${validation.isValid}`);
    console.log(`      - Score: ${validation.score}/100`);
    console.log(`      - Has Identity: ${validation.complianceChecks.hasIdentity}`);
    console.log(`      - Has Steps: ${validation.complianceChecks.hasSteps}`);
    console.log(`      - Has Output: ${validation.complianceChecks.hasOutput}`);

    if (validation.suggestions.length > 0) {
      console.log(`   💡 Suggestions (${validation.suggestions.length}):`);
      validation.suggestions.slice(0, 3).forEach(suggestion => {
        console.log(`      - ${suggestion}`);
      });
    }

    // Test 4: Pattern file generation
    console.log('\n4. Testing pattern file generation...');
    const patternFileContent = generator.generatePatternFile(testTemplate);
    const lineCount = patternFileContent.split('\n').length;
    const hasInput = patternFileContent.includes('# INPUT');
    
    console.log(`   ✅ Generated pattern file: ${lineCount} lines`);
    console.log(`   ✅ Contains INPUT section: ${hasInput}`);
    console.log(`   ✅ Sample content preview:`);
    console.log(`      ${patternFileContent.split('\n').slice(0, 3).join('\n      ')}`);

    console.log('\n🎉 PatternTemplateGenerator test completed successfully!');
    
    return {
      success: true,
      customTemplateGenerated: true,
      landingPageTemplatesGenerated: landingPagePatterns.length,
      validationWorking: validation.isValid !== undefined,
      patternFileGenerated: patternFileContent.length > 0
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testPatternTemplateGenerator().then(result => {
    console.log('\nTest Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}

export { testPatternTemplateGenerator };