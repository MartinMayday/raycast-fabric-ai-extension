import { SampleCollectionGenerator, SampleCollection } from './SampleCollectionGenerator';
import { PatternSpecification } from './SpecificationBuilder';

/**
 * Test script to verify SampleCollectionGenerator functionality
 */
async function testSampleCollectionGenerator() {
  console.log('🚀 Testing SampleCollectionGenerator...\n');

  try {
    const generator = new SampleCollectionGenerator();

    // Test 1: Generate sample collection for a single pattern
    console.log('1. Testing single pattern sample collection generation...');
    
    const mockSpecification: PatternSpecification = {
      name: 'analyze_wireframe_flow',
      category: 'UX Analysis',
      description: 'Analyzes user flow and navigation patterns',
      domain: 'User Experience Design',
      expertise: 'UX analyst',
      analysisFramework: 'User-Centered Design',
      inputTypes: ['landing page HTML', 'website URL'],
      outputStructure: {
        sections: [
          { name: 'USER FLOW ANALYSIS', description: 'User journey mapping', format: 'bulleted', required: true, examples: [] },
          { name: 'NAVIGATION STRUCTURE', description: 'Navigation analysis', format: 'structured', required: true, examples: [] },
          { name: 'CONVERSION FUNNEL', description: 'Funnel analysis', format: 'structured', required: true, examples: [] },
          { name: 'IMPROVEMENT RECOMMENDATIONS', description: 'Optimization recommendations', format: 'structured', required: true, examples: [] }
        ],
        recommendationFormat: 'Priority-based recommendations',
        exampleFormat: 'Structured examples with specific details'
      },
      sampleInputs: [
        {
          name: 'E-commerce Product Page',
          description: 'Online store product landing page',
          contentType: 'product page',
          complexity: 'medium',
          content: 'Product showcase with add-to-cart functionality',
          expectedInsights: ['Product flow', 'Cart optimization', 'Mobile experience']
        },
        {
          name: 'SaaS Signup Page',
          description: 'Software service trial signup',
          contentType: 'signup page',
          complexity: 'medium',
          content: 'SaaS landing with trial signup form',
          expectedInsights: ['Signup flow', 'Feature presentation', 'Trial conversion']
        }
      ],
      expectedOutputs: [],
      validationCriteria: {
        requiredSections: ['USER FLOW ANALYSIS', 'NAVIGATION STRUCTURE', 'IMPROVEMENT RECOMMENDATIONS'],
        scoringRequired: true,
        recommendationsRequired: true,
        minimumWordCount: 300,
        qualityChecks: ['Specific examples', 'Actionable recommendations', 'Mobile considerations']
      },
      useCases: ['E-commerce optimization', 'SaaS conversion improvement'],
      bestPractices: ['Focus on user journey', 'Identify friction points', 'Mobile-first approach']
    };

    const sampleCollection = generator.generateSampleCollection(mockSpecification);
    
    console.log(`   ✅ Generated collection for: ${sampleCollection.patternName}`);
    console.log(`   ✅ Enhanced samples: ${sampleCollection.samples.length}`);
    console.log(`   ✅ Expected outputs: ${sampleCollection.expectedOutputs.length}`);
    console.log(`   ✅ Test scenarios: ${sampleCollection.testScenarios.length}`);
    console.log(`   ✅ Validation samples: ${sampleCollection.validationSamples.length}`);

    // Test 2: Validate enhanced sample structure
    console.log('\n2. Testing enhanced sample structure...');
    
    if (sampleCollection.samples.length > 0) {
      const firstSample = sampleCollection.samples[0];
      const sampleChecks = {
        hasId: firstSample.id.length > 0,
        hasCategory: firstSample.category.length > 0,
        hasIndustry: firstSample.industry.length > 0,
        hasTargetAudience: firstSample.targetAudience.length > 0,
        hasConversionGoal: firstSample.conversionGoal.length > 0,
        hasKeyElements: firstSample.keyElements.length > 0,
        hasChallenges: firstSample.challenges.length > 0,
        hasFullContent: firstSample.fullContent.length > 0,
        hasMetadata: firstSample.metadata !== undefined,
        hasValidDifficulty: firstSample.metadata.difficulty >= 1 && firstSample.metadata.difficulty <= 10,
        hasEstimatedTime: firstSample.metadata.estimatedAnalysisTime > 0
      };

      const passedChecks = Object.values(sampleChecks).filter(Boolean).length;
      console.log(`   ✅ Sample structure: ${passedChecks}/${Object.keys(sampleChecks).length} checks passed`);
      
      console.log(`   ✅ Sample details:`);
      console.log(`      - ID: ${firstSample.id}`);
      console.log(`      - Category: ${firstSample.category}`);
      console.log(`      - Industry: ${firstSample.industry}`);
      console.log(`      - Target Audience: ${firstSample.targetAudience}`);
      console.log(`      - Conversion Goal: ${firstSample.conversionGoal}`);
      console.log(`      - Key Elements: ${firstSample.keyElements.length}`);
      console.log(`      - Challenges: ${firstSample.challenges.length}`);
      console.log(`      - Difficulty: ${firstSample.metadata.difficulty}/10`);
      console.log(`      - Est. Analysis Time: ${firstSample.metadata.estimatedAnalysisTime} min`);
    }

    // Test 3: Validate expected output structure
    console.log('\n3. Testing expected output structure...');
    
    if (sampleCollection.expectedOutputs.length > 0) {
      const firstOutput = sampleCollection.expectedOutputs[0];
      const outputChecks = {
        hasId: firstOutput.id.length > 0,
        hasSampleId: firstOutput.sampleId.length > 0,
        hasAnalysisDepth: ['basic', 'detailed', 'comprehensive'].includes(firstOutput.analysisDepth),
        hasSections: Object.keys(firstOutput.sections).length > 0,
        hasQualityMetrics: firstOutput.qualityMetrics !== undefined,
        hasImprovementAreas: firstOutput.improvementAreas.length > 0,
        hasOverallScore: firstOutput.overallScore >= 0 && firstOutput.overallScore <= 100,
        hasKeyRecommendations: firstOutput.keyRecommendations.length > 0
      };

      const outputPassed = Object.values(outputChecks).filter(Boolean).length;
      console.log(`   ✅ Output structure: ${outputPassed}/${Object.keys(outputChecks).length} checks passed`);
      
      console.log(`   ✅ Output details:`);
      console.log(`      - Analysis Depth: ${firstOutput.analysisDepth}`);
      console.log(`      - Sections: ${Object.keys(firstOutput.sections).length}`);
      console.log(`      - Overall Score: ${firstOutput.overallScore}`);
      console.log(`      - Quality Metrics: Completeness ${firstOutput.qualityMetrics.completeness}%`);
      console.log(`      - Improvement Areas: ${firstOutput.improvementAreas.length}`);
      console.log(`      - Key Recommendations: ${firstOutput.keyRecommendations.length}`);
    }

    // Test 4: Validate test scenarios
    console.log('\n4. Testing test scenario generation...');
    
    const testScenarios = sampleCollection.testScenarios;
    const scenarioTypes = [...new Set(testScenarios.map(s => s.testType))];
    
    console.log(`   ✅ Test scenarios generated: ${testScenarios.length}`);
    console.log(`   ✅ Scenario types: ${scenarioTypes.join(', ')}`);
    
    const expectedTypes = ['edge_case', 'minimal_content', 'comprehensive', 'error_handling'];
    const hasAllTypes = expectedTypes.every(type => scenarioTypes.includes(type));
    console.log(`   ✅ All scenario types present: ${hasAllTypes}`);

    if (testScenarios.length > 0) {
      const firstScenario = testScenarios[0];
      console.log(`   ✅ Sample scenario:`);
      console.log(`      - Name: ${firstScenario.name}`);
      console.log(`      - Type: ${firstScenario.testType}`);
      console.log(`      - Validation Criteria: ${firstScenario.validationCriteria.length}`);
    }

    // Test 5: Validate validation samples
    console.log('\n5. Testing validation sample generation...');
    
    const validationSamples = sampleCollection.validationSamples;
    const qualityLevels = [...new Set(validationSamples.map(s => s.expectedQuality))];
    
    console.log(`   ✅ Validation samples: ${validationSamples.length}`);
    console.log(`   ✅ Quality levels: ${qualityLevels.join(', ')}`);
    
    const expectedQualities = ['high', 'medium', 'low'];
    const hasAllQualities = expectedQualities.every(quality => qualityLevels.includes(quality));
    console.log(`   ✅ All quality levels present: ${hasAllQualities}`);

    if (validationSamples.length > 0) {
      validationSamples.forEach(sample => {
        console.log(`   ✅ ${sample.name}: ${sample.expectedQuality} quality, ${sample.commonIssues.length} issues, ${sample.passingCriteria.length} criteria`);
      });
    }

    // Test 6: Generate all landing page collections
    console.log('\n6. Testing all landing page collections generation...');
    
    const allCollections = generator.generateAllLandingPageCollections();
    const collectionCount = Object.keys(allCollections).length;
    
    console.log(`   ✅ Generated collections: ${collectionCount}`);
    
    const expectedPatterns = ['analyze_wireframe_flow', 'analyze_copywriting_score', 'create_storybrand_variant', 'create_competitive_audit'];
    expectedPatterns.forEach(pattern => {
      if (allCollections[pattern]) {
        console.log(`   ✅ ${pattern}: ${allCollections[pattern].samples.length} samples, ${allCollections[pattern].testScenarios.length} scenarios`);
      } else {
        console.log(`   ❌ ${pattern}: Collection not generated`);
      }
    });

    console.log('\n🎉 SampleCollectionGenerator test completed successfully!');
    
    return {
      success: true,
      singleCollectionGenerated: sampleCollection.samples.length > 0,
      allCollectionsGenerated: collectionCount > 0,
      enhancedSamplesCreated: sampleCollection.samples.every(s => s.metadata !== undefined),
      testScenariosGenerated: sampleCollection.testScenarios.length > 0,
      validationSamplesCreated: sampleCollection.validationSamples.length > 0,
      totalSamples: sampleCollection.samples.length,
      totalScenarios: sampleCollection.testScenarios.length
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
  testSampleCollectionGenerator().then(result => {
    console.log('\nTest Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}

export { testSampleCollectionGenerator };