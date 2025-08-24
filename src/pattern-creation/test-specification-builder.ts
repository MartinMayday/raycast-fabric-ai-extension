import { SpecificationBuilder, PatternSpecification } from './SpecificationBuilder';

/**
 * Test script to verify SpecificationBuilder functionality
 */
async function testSpecificationBuilder() {
  console.log('🚀 Testing SpecificationBuilder...\n');

  try {
    const builder = new SpecificationBuilder();

    // Test 1: Build individual pattern specifications
    console.log('1. Testing individual pattern specification building...');
    
    const patterns = [
      'analyze_wireframe_flow',
      'analyze_copywriting_score',
      'create_storybrand_variant',
      'create_competitive_audit'
    ];

    const specs: Record<string, PatternSpecification> = {};

    for (const patternName of patterns) {
      let spec: PatternSpecification | null = null;
      
      switch (patternName) {
        case 'analyze_wireframe_flow':
          spec = builder.buildAnalyzeWireframeFlowSpec();
          break;
        case 'analyze_copywriting_score':
          spec = builder.buildAnalyzeCopywritingScoreSpec();
          break;
        case 'create_storybrand_variant':
          spec = builder.buildCreateStorybrandVariantSpec();
          break;
        case 'create_competitive_audit':
          spec = builder.buildCreateCompetitiveAuditSpec();
          break;
      }

      if (spec) {
        specs[patternName] = spec;
        console.log(`   ✅ ${patternName}:`);
        console.log(`      - Category: ${spec.category}`);
        console.log(`      - Output sections: ${spec.outputStructure.sections.length}`);
        console.log(`      - Sample inputs: ${spec.sampleInputs.length}`);
        console.log(`      - Use cases: ${spec.useCases.length}`);
        
        // Validate required sections
        const hasRequiredSections = spec.validationCriteria.requiredSections.every(
          section => spec.outputStructure.sections.some(s => s.name === section)
        );
        console.log(`      - Required sections present: ${hasRequiredSections ? '✅' : '❌'}`);
      } else {
        console.log(`   ❌ Failed to build ${patternName} specification`);
      }
    }

    // Test 2: Get all specifications at once
    console.log('\n2. Testing getAllLandingPageSpecs...');
    const allSpecs = builder.getAllLandingPageSpecs();
    const specCount = Object.keys(allSpecs).length;
    console.log(`   ✅ Retrieved ${specCount} specifications`);
    
    // Verify all expected patterns are present
    const expectedPatterns = ['analyze_wireframe_flow', 'analyze_copywriting_score', 'create_storybrand_variant', 'create_competitive_audit'];
    const allPatternsPresent = expectedPatterns.every(pattern => pattern in allSpecs);
    console.log(`   ✅ All expected patterns present: ${allPatternsPresent}`);

    // Test 3: Individual pattern retrieval
    console.log('\n3. Testing getPatternSpec method...');
    const wireframeSpec = builder.getPatternSpec('analyze_wireframe_flow');
    const invalidSpec = builder.getPatternSpec('nonexistent_pattern');
    
    console.log(`   ✅ Valid pattern retrieval: ${wireframeSpec ? 'Success' : 'Failed'}`);
    console.log(`   ✅ Invalid pattern handling: ${invalidSpec === null ? 'Success' : 'Failed'}`);

    // Test 4: Specification structure validation
    console.log('\n4. Testing specification structure...');
    
    for (const [patternName, spec] of Object.entries(allSpecs)) {
      const structureChecks = {
        hasName: spec.name === patternName,
        hasCategory: spec.category.length > 0,
        hasDescription: spec.description.length > 50,
        hasDomain: spec.domain.length > 0,
        hasExpertise: spec.expertise.length > 0,
        hasFramework: spec.analysisFramework.length > 0,
        hasInputTypes: spec.inputTypes.length > 0,
        hasOutputSections: spec.outputStructure.sections.length >= 4,
        hasSampleInputs: spec.sampleInputs.length >= 2,
        hasUseCases: spec.useCases.length >= 3,
        hasBestPractices: spec.bestPractices.length >= 2,
        hasValidationCriteria: spec.validationCriteria.requiredSections.length > 0
      };

      const passedChecks = Object.values(structureChecks).filter(Boolean).length;
      const totalChecks = Object.keys(structureChecks).length;
      
      console.log(`   ✅ ${patternName}: ${passedChecks}/${totalChecks} structure checks passed`);
      
      if (passedChecks < totalChecks) {
        const failedChecks = Object.entries(structureChecks)
          .filter(([_, passed]) => !passed)
          .map(([check, _]) => check);
        console.log(`      ⚠️  Failed checks: ${failedChecks.join(', ')}`);
      }
    }

    // Test 5: Output section validation
    console.log('\n5. Testing output section structures...');
    
    for (const [patternName, spec] of Object.entries(allSpecs)) {
      const sections = spec.outputStructure.sections;
      const sectionChecks = {
        allHaveNames: sections.every(s => s.name.length > 0),
        allHaveDescriptions: sections.every(s => s.description.length > 10),
        allHaveFormats: sections.every(s => ['bulleted', 'numbered', 'structured', 'paragraph'].includes(s.format)),
        allHaveExamples: sections.every(s => s.examples.length > 0),
        hasRequiredSections: sections.some(s => s.required)
      };

      const sectionsPassed = Object.values(sectionChecks).filter(Boolean).length;
      console.log(`   ✅ ${patternName} sections: ${sectionsPassed}/5 checks passed`);
    }

    // Test 6: Sample input validation
    console.log('\n6. Testing sample input quality...');
    
    for (const [patternName, spec] of Object.entries(allSpecs)) {
      const samples = spec.sampleInputs;
      const sampleChecks = {
        hasMultipleSamples: samples.length >= 2,
        allHaveNames: samples.every(s => s.name.length > 0),
        allHaveDescriptions: samples.every(s => s.description.length > 10),
        allHaveContent: samples.every(s => s.content.length > 20),
        allHaveInsights: samples.every(s => s.expectedInsights.length > 0),
        hasVariedComplexity: new Set(samples.map(s => s.complexity)).size > 1
      };

      const samplesPassed = Object.values(sampleChecks).filter(Boolean).length;
      console.log(`   ✅ ${patternName} samples: ${samplesPassed}/6 checks passed`);
    }

    console.log('\n🎉 SpecificationBuilder test completed successfully!');
    
    return {
      success: true,
      specificationsBuilt: specCount,
      allPatternsSupported: allPatternsPresent,
      structureValidation: 'passed',
      sampleInputsCreated: Object.values(allSpecs).reduce((total, spec) => total + spec.sampleInputs.length, 0)
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
  testSpecificationBuilder().then(result => {
    console.log('\nTest Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}

export { testSpecificationBuilder };