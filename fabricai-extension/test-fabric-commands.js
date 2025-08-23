#!/usr/bin/env node

/**
 * Comprehensive test script for FabricAI Raycast extension
 * Tests all fabric commands and YouTube functionality
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Test configuration
const TEST_CONFIG = {
  fabricPath: 'fabric', // Use system fabric command
  testYouTubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Rick Roll for testing
  testText: 'This is a test text for wisdom extraction.',
  timeout: 120000, // 2 minutes
};

// ANSI colors for better output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testCommand(description, command, expectedSuccess = true) {
  log(`\n🧪 Testing: ${description}`, colors.cyan);
  log(`📝 Command: ${command}`, colors.blue);
  
  try {
    const startTime = Date.now();
    const { stdout, stderr } = await execAsync(command, { 
      timeout: TEST_CONFIG.timeout,
      maxBuffer: 5 * 1024 * 1024,
      encoding: 'utf8'
    });
    
    const duration = Date.now() - startTime;
    
    if (stderr && !stdout) {
      throw new Error(`Command failed: ${stderr}`);
    }
    
    if (stderr && stdout) {
      log(`⚠️  Warnings: ${stderr}`, colors.yellow);
    }
    
    if (stdout.trim()) {
      log(`✅ Success (${duration}ms)`, colors.green);
      log(`📄 Output preview: ${stdout.substring(0, 200)}...`, colors.reset);
      return { success: true, output: stdout, duration, stderr };
    } else {
      throw new Error('No output received');
    }
    
  } catch (error) {
    log(`❌ Failed: ${error.message}`, colors.red);
    return { success: false, error: error.message, duration: 0 };
  }
}

async function runTests() {
  log('🚀 Starting FabricAI Raycast Extension Tests', colors.magenta);
  log('=' * 50, colors.magenta);
  
  const results = [];
  
  // Test 1: Check if fabric is installed and accessible
  results.push(await testCommand(
    'Fabric Installation Check',
    'which fabric'
  ));
  
  // Test 2: Check fabric version
  results.push(await testCommand(
    'Fabric Version Check',
    'fabric --version'
  ));
  
  // Test 3: List available patterns
  results.push(await testCommand(
    'Available Patterns Check',
    'fabric --listpatterns'
  ));
  
  // Test 4: Test basic text extraction
  results.push(await testCommand(
    'Basic Text Wisdom Extraction',
    `echo "${TEST_CONFIG.testText}" | fabric --pattern extract_wisdom`
  ));
  
  // Test 5: Test YouTube URL extraction (the main issue)
  results.push(await testCommand(
    'YouTube Wisdom Extraction',
    `fabric --youtube "${TEST_CONFIG.testYouTubeUrl}" --transcript --pattern extract_wisdom`
  ));
  
  // Test 6: Alternative YouTube command format
  results.push(await testCommand(
    'Alternative YouTube Command',
    `fabric --youtube "${TEST_CONFIG.testYouTubeUrl}" --pattern extract_wisdom`
  ));
  
  // Test 7: Check if yt-dlp is available (fabric dependency)
  results.push(await testCommand(
    'yt-dlp Availability Check',
    'which yt-dlp'
  ));
  
  // Test 8: Test fabric help to see available options
  results.push(await testCommand(
    'Fabric Help Output',
    'fabric --help'
  ));
  
  // Generate test report
  log('\n📊 TEST RESULTS SUMMARY', colors.magenta);
  log('=' * 50, colors.magenta);
  
  let passed = 0;
  let failed = 0;
  
  results.forEach((result, index) => {
    const testNum = index + 1;
    if (result.success) {
      log(`✅ Test ${testNum}: PASSED (${result.duration}ms)`, colors.green);
      passed++;
    } else {
      log(`❌ Test ${testNum}: FAILED - ${result.error}`, colors.red);
      failed++;
    }
  });
  
  log(`\n📈 Summary: ${passed} passed, ${failed} failed`, 
      failed === 0 ? colors.green : colors.red);
  
  // Recommendations based on results
  log('\n💡 RECOMMENDATIONS:', colors.cyan);
  
  if (results[0].success) {
    log('✅ Fabric is properly installed', colors.green);
  } else {
    log('❌ Install fabric: pip install fabric-ai', colors.red);
  }
  
  if (results[4].success || results[5].success) {
    log('✅ YouTube extraction is working', colors.green);
  } else {
    log('❌ YouTube extraction failed - check yt-dlp and API setup', colors.red);
  }
  
  if (results[6].success) {
    log('✅ yt-dlp is available', colors.green);
  } else {
    log('❌ Install yt-dlp: pip install yt-dlp', colors.red);
  }
  
  return results;
}

// Run the tests
runTests().catch(console.error);