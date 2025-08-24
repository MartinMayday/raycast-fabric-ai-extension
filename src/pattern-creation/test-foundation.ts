import { ExistingPatternAnalyzer } from './ExistingPatternAnalyzer';
import { StructureExtractor } from './StructureExtractor';
import { BestPracticesDatabase } from './BestPracticesDatabase';

/**
 * Test script to verify the pattern analysis foundation is working correctly
 */
async function testPatternAnalysisFoundation() {
  console.log('🚀 Testing Pattern Analysis Foundation...\n');

  try {
    // Test 1: ExistingPatternAnalyzer
    console.log('1. Testing ExistingPatternAnalyzer...');
    const analyzer = new ExistingPatternAnalyzer();
    
    // Analyze a few key patterns
    const extractWisdomAnalysis = await analyzer.analyzePattern('extract_wisdom_system.md');
    const analyzePaperAnalysis = await analyzer.analyzePattern('analyze_paper_system.md');
    
    if (extractWisdomAnalysis) {
      console.log(`   ✅ Successfully analyzed extract_wisdom pattern`);
      console.log(`      - Category: ${extractWisdomAnalysis.category}`);
      console.log(`      - Complexity: ${extractWisdomAnalysis.complexity}`);
      console.log(`      - Output sections: ${extractWisdomAnalysis.structure.outputSections.length}`);
    }

    if (analyzePaperAnalysis) {
      console.log(`   ✅ Successfully analyzed analyze_paper pattern`);
      console.log(`      - Category: ${analyzePaperAnalysis.category}`);
      console.log(`      - Word count: ${analyzePaperAnalysis.wordCount}`);
    }

    // Test 2: StructureExtractor
    console.log('\n2. Testing StructureExtractor...');
    const extractor = new StructureExtractor();
    
    const patterns = [extractWisdomAnalysis, analyzePaperAnalysis].filter(Boolean);
    if (patterns.length > 0) {
      const commonElements = extractor.extractCommonElements(patterns);
      console.log(`   ✅ Extracted common elements:`);
      console.log(`      - Identity patterns: ${commonElements.identityPatterns.length}`);
      console.log(`      - Step patterns: ${commonElements.stepPatterns.length}`);
      console.log(`      - Output patterns: ${commonElements.outputPatterns.length}`);
    }

    // Test 3: BestPracticesDatabase
    console.log('\n3. Testing BestPracticesDatabase...');
    const database = new BestPracticesDatabase();
    
    const analysisPractices = database.getBestPractices('analysis');
    console.log(`   ✅ Found ${analysisPractices.length} best practices for analysis patterns`);
    
    const wireframeTemplate = database.getLandingPagePatternTemplate('analyze_wireframe_flow');
    if (wireframeTemplate) {
      console.log(`   ✅ Successfully created wireframe flow template`);
      console.log(`      - Output sections: ${wireframeTemplate.structure.outputSections.length}`);
      console.log(`      - Steps: ${wireframeTemplate.structure.steps.length}`);
    }

    // Test 4: Integration test
    console.log('\n4. Testing integration...');
    const allAnalyses = await analyzer.analyzeAllPatterns();
    console.log(`   ✅ Analyzed ${allAnalyses.length} total patterns`);
    
    const templates = extractor.createStructureTemplates(allAnalyses);
    const templateCount = Object.keys(templates).length;
    console.log(`   ✅ Created ${templateCount} structure templates`);

    console.log('\n🎉 Pattern Analysis Foundation test completed successfully!');
    
    return {
      success: true,
      patternsAnalyzed: allAnalyses.length,
      templatesCreated: templateCount,
      bestPracticesAvailable: database.getBestPractices().length
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
  testPatternAnalysisFoundation().then(result => {
    console.log('\nTest Result:', result);
    process.exit(result.success ? 0 : 1);
  });
}

export { testPatternAnalysisFoundation };