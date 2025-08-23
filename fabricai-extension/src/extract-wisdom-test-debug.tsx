import { useState } from "react";
import {
  List,
  ActionPanel,
  Action,
  showToast,
  Toast,
  Clipboard,
  Icon,
  Detail,
  getPreferenceValues,
} from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface Preferences {
  fabricInstallPath?: string;
  maxContentLength?: string;
  timeoutSeconds?: string;
}

interface ExtractedWisdom {
  content: string;
  wisdom: string;
  timestamp: Date;
  contentType: 'text' | 'youtube' | 'url' | 'clipboard';
  originalInput: string;
  debugInfo?: string;
}

export default function ExtractWisdomTestDebug() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedWisdom, setExtractedWisdom] = useState<ExtractedWisdom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugLog, setDebugLog] = useState<string[]>([]);

  const preferences = getPreferenceValues<Preferences>();

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    setDebugLog(prev => [...prev, logEntry]);
    console.log(logEntry);
  };

  const getFabricPath = () => {
    // Use system fabric command instead of hardcoded path
    const path = preferences.fabricInstallPath || "fabric";
    addDebugLog(`Using fabric path: ${path}`);
    return path;
  };

  const isYouTubeUrl = (text: string): boolean => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/;
    const isYT = youtubeRegex.test(text);
    addDebugLog(`YouTube URL check for "${text}": ${isYT}`);
    return isYT;
  };

  const testFabricInstallation = async () => {
    addDebugLog("Testing fabric installation...");
    setIsLoading(true);
    
    try {
      const fabricPath = getFabricPath();
      
      // Test 1: Check if fabric command exists
      const { stdout: whichOutput } = await execAsync(`which ${fabricPath}`);
      addDebugLog(`Fabric location: ${whichOutput.trim()}`);
      
      // Test 2: Check fabric version
      const { stdout: versionOutput } = await execAsync(`${fabricPath} --version`);
      addDebugLog(`Fabric version: ${versionOutput.trim()}`);
      
      // Test 3: List patterns
      const { stdout: patternsOutput } = await execAsync(`${fabricPath} --listpatterns`);
      addDebugLog(`Available patterns: ${patternsOutput.substring(0, 200)}...`);
      
      await showToast({
        style: Toast.Style.Success,
        title: "Fabric Test Passed",
        message: "Fabric is properly installed and accessible",
      });
      
    } catch (error: any) {
      addDebugLog(`Fabric test failed: ${error.message}`);
      await showToast({
        style: Toast.Style.Failure,
        title: "Fabric Test Failed",
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractWisdom = async (content: string, contentType: 'text' | 'youtube' | 'url' | 'clipboard' = 'text') => {
    if (!content.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Please enter some content",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    addDebugLog(`Starting extraction for content type: ${contentType}`);
    addDebugLog(`Content preview: ${content.substring(0, 100)}...`);

    try {
      const fabricPath = getFabricPath();
      const timeout = parseInt(preferences.timeoutSeconds || "120") * 1000;
      
      let command: string;
      let processedContent = content;

      // Build command based on content type
      if (isYouTubeUrl(content)) {
        contentType = 'youtube';
        addDebugLog("Detected YouTube URL, using YouTube extraction");
        
        // Try the primary YouTube command format
        command = `${fabricPath} --youtube "${content}" --transcript --pattern extract_wisdom`;
        processedContent = `YouTube Video: ${content}`;
      } else {
        addDebugLog("Using standard text extraction");
        const maxLength = parseInt(preferences.maxContentLength || "10000");
        processedContent = content.length > maxLength 
          ? content.substring(0, maxLength) + "..."
          : content;
        
        command = `echo ${JSON.stringify(processedContent)} | ${fabricPath} --pattern extract_wisdom`;
      }

      addDebugLog(`Executing command: ${command}`);

      await showToast({
        style: Toast.Style.Animated,
        title: "Extracting",
        message: `Processing ${contentType} content...`,
      });

      const startTime = Date.now();
      const { stdout, stderr } = await execAsync(command, { 
        timeout,
        maxBuffer: 5 * 1024 * 1024,
        encoding: 'utf8',
        env: { ...process.env, PATH: process.env.PATH }
      });
      
      const duration = Date.now() - startTime;
      addDebugLog(`Command completed in ${duration}ms`);

      if (stderr) {
        addDebugLog(`Command stderr: ${stderr}`);
      }

      if (!stdout || !stdout.trim()) {
        throw new Error(`No output received from fabric command. Check if the pattern 'extract_wisdom' is available.`);
      }

      const wisdom = stdout.trim();
      addDebugLog(`Extracted wisdom length: ${wisdom.length} characters`);

      const extraction: ExtractedWisdom = {
        content: processedContent,
        wisdom,
        timestamp: new Date(),
        contentType,
        originalInput: content,
        debugInfo: debugLog.join('\n'),
      };

      setExtractedWisdom(extraction);

      await showToast({
        style: Toast.Style.Success,
        title: "Success",
        message: `Wisdom extracted from ${contentType} in ${duration}ms!`,
      });

    } catch (error: any) {
      const errorMessage = error.message || "Unknown error";
      addDebugLog(`Extraction failed: ${errorMessage}`);
      setError(errorMessage);

      await showToast({
        style: Toast.Style.Failure,
        title: "Extraction Failed",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtractFromClipboard = async () => {
    try {
      const clipboardText = await Clipboard.readText();
      if (!clipboardText) {
        await showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: "Clipboard is empty",
        });
        return;
      }
      
      addDebugLog(`Clipboard content: ${clipboardText.substring(0, 100)}...`);
      await extractWisdom(clipboardText, 'clipboard');
    } catch (error: any) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Clipboard Error",
        message: error.message,
      });
    }
  };

  if (extractedWisdom) {
    return (
      <Detail
        markdown={`# Extracted Wisdom

## Source
**Type:** ${extractedWisdom.contentType === 'youtube' ? '🎥 YouTube Video' : 
                extractedWisdom.contentType === 'url' ? '🔗 URL' : 
                extractedWisdom.contentType === 'clipboard' ? '📋 Clipboard' : '📝 Text'}
**Original:** ${extractedWisdom.originalInput}
**Processed:** ${new Date(extractedWisdom.timestamp).toLocaleString()}

## Wisdom

${extractedWisdom.wisdom}

## Debug Information

\`\`\`
${extractedWisdom.debugInfo || 'No debug info available'}
\`\`\`
`}
        actions={
          <ActionPanel>
            <Action
              title="Copy Wisdom"
              icon={Icon.Clipboard}
              onAction={() => Clipboard.copy(extractedWisdom.wisdom)}
            />
            <Action
              title="Copy Debug Info"
              icon={Icon.Bug}
              onAction={() => Clipboard.copy(extractedWisdom.debugInfo || '')}
            />
            <Action
              title="Back to Input"
              icon={Icon.ArrowLeft}
              onAction={() => setExtractedWisdom(null)}
            />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Enter text, URL, or YouTube link to extract wisdom..."
      throttle
    >
      <List.Item
        title="🧪 Test Fabric Installation"
        subtitle="Check if Fabric AI is properly installed and configured"
        actions={
          <ActionPanel>
            <Action
              title="Run Fabric Tests"
              icon={Icon.Bug}
              onAction={testFabricInstallation}
            />
          </ActionPanel>
        }
      />
      
      {searchText && (
        <List.Item
          title={isYouTubeUrl(searchText) ? "🎥 Extract Wisdom from YouTube Video" : "📝 Extract Wisdom from Text"}
          subtitle={`Ready to extract from: ${searchText.substring(0, 50)}${searchText.length > 50 ? '...' : ''}`}
          actions={
            <ActionPanel>
              <Action
                title="Extract Wisdom"
                icon={Icon.Wand}
                onAction={() => extractWisdom(searchText)}
              />
            </ActionPanel>
          }
        />
      )}
      
      <List.Item
        title="📋 Extract from Clipboard"
        subtitle="Use content from your clipboard"
        actions={
          <ActionPanel>
            <Action
              title="Extract from Clipboard"
              icon={Icon.Clipboard}
              onAction={handleExtractFromClipboard}
            />
          </ActionPanel>
        }
      />

      {debugLog.length > 0 && (
        <List.Item
          title="🐛 Debug Log"
          subtitle={`${debugLog.length} log entries`}
          actions={
            <ActionPanel>
              <Action
                title="View Debug Log"
                icon={Icon.Bug}
                onAction={() => {
                  const logContent = debugLog.join('\n');
                  Clipboard.copy(logContent);
                  showToast({
                    style: Toast.Style.Success,
                    title: "Debug Log Copied",
                    message: "Debug log copied to clipboard",
                  });
                }}
              />
              <Action
                title="Clear Debug Log"
                icon={Icon.Trash}
                onAction={() => setDebugLog([])}
              />
            </ActionPanel>
          }
        />
      )}

      {error && (
        <List.Item
          title="❌ Last Error"
          subtitle={error}
          actions={
            <ActionPanel>
              <Action
                title="Copy Error"
                icon={Icon.Clipboard}
                onAction={() => Clipboard.copy(error)}
              />
              <Action
                title="Clear Error"
                icon={Icon.Trash}
                onAction={() => setError(null)}
              />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}