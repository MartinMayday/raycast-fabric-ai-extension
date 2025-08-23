#!/bin/bash

# Test script to verify YouTube transcript extraction with Fabric AI
# Run this script to test if the yt command works in your environment

echo "🧪 Testing YouTube Transcript Extraction with Fabric AI"
echo "=================================================="

# Test YouTube URL
TEST_URL="https://www.youtube.com/watch?v=lo0e0IQqUwM"
FABRIC_PATH="/Volumes/askuss/cloudworkspace/.creatorworkspace/.add-ons/fabric-ai/fabric"

echo "📺 Testing URL: $TEST_URL"
echo "🔧 Fabric Path: $FABRIC_PATH"
echo ""

# Test 1: Check if yt command exists
echo "🔍 Test 1: Checking if 'yt' command is available..."
if command -v yt &> /dev/null; then
    echo "✅ 'yt' command found"
    yt --help | head -5
else
    echo "❌ 'yt' command not found"
    echo "💡 You may need to install the YouTube helper tool"
    echo "   Try: pip install yt-dlp"
    echo "   Or check Fabric AI documentation for setup"
fi

echo ""

# Test 2: Check Fabric AI
echo "🔍 Test 2: Checking Fabric AI..."
if [ -f "$FABRIC_PATH" ]; then
    echo "✅ Fabric AI found at: $FABRIC_PATH"
    "$FABRIC_PATH" --version
else
    echo "❌ Fabric AI not found at: $FABRIC_PATH"
    echo "💡 Check the path in your extension preferences"
fi

echo ""

# Test 3: Test YouTube transcript extraction (if both tools available)
if command -v yt &> /dev/null && [ -f "$FABRIC_PATH" ]; then
    echo "🔍 Test 3: Testing YouTube transcript extraction..."
    echo "⏳ This may take a moment..."
    
    # Test just the transcript extraction first
    echo "📝 Testing transcript extraction only..."
    timeout 30s yt --transcript "$TEST_URL" | head -10
    
    if [ $? -eq 0 ]; then
        echo "✅ Transcript extraction successful"
        
        echo ""
        echo "📝 Testing full wisdom extraction..."
        echo "⏳ This will take longer..."
        
        # Test the full command with a timeout
        timeout 60s bash -c "yt --transcript '$TEST_URL' | '$FABRIC_PATH' -p extract_wisdom" | head -20
        
        if [ $? -eq 0 ]; then
            echo "✅ Full wisdom extraction successful!"
        else
            echo "⚠️  Full extraction timed out or failed"
            echo "💡 Try increasing timeout in extension settings"
        fi
    else
        echo "❌ Transcript extraction failed"
        echo "💡 Check if the video has captions/transcript available"
    fi
else
    echo "⏭️  Skipping Test 3: Missing required tools"
fi

echo ""
echo "🏁 Test Complete!"
echo ""
echo "📋 Summary:"
echo "- If all tests pass, the YouTube extension should work"
echo "- If 'yt' command is missing, install it with: pip install yt-dlp"
echo "- If Fabric AI path is wrong, update it in extension preferences"
echo "- If transcript extraction fails, try a different YouTube video"
echo ""
echo "🚀 Ready to test the extension!"