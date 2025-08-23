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
  environment,
} from "@raycast/api";
import { spawn } from "child_process";
import { promisify } from "util";
import { exec } from "child_process";
import { writeFileSync, existsSync, mkdirSync, appendFileSync } from "fs";
import { join } from "path";

const execAsync = promisify(exec);

interface Preferences {
  fabricInstallPath?: string;
  maxContentLength?: string;
  timeoutSeconds?: string;
  exportPath?: string;
}

interface ExtractedWisdom {
  content: string;
  wisdom: string;
  timestamp: Date;
  contentType: 'text' | 'youtube' | 'url' | 'clipboard';
  originalInput: string;
  youtubeChannel?: string;
  author?: string;
  hook?: string;
  summary?: string;
  ideas?: string[];
  insights?: string[];
  quotes?: string[];
  habits?: string[];
  facts?: string[];
  references?: string[];
  takeaway?: string;
  recommendations?: string[];
  ctaUrls?: string[];
}

export default function ExtractWisdomUltimate() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedWisdom, setExtractedWisdom] = useState<ExtractedWisdom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const preferences = getPreferenceValues<Preferences>();

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    setDebugLogs(prev => [...prev, logEntry]);
    
    // Write to Raycast logs directory
    try {
      const logsDir = join(environment.supportPath, "logs");
      if (!existsSync(logsDir)) {
        mkdirSync(logsDir, { recursive: true });
      }
      
      const logFile = join(logsDir, "fabric-extraction.log");
      appendFileSync(logFile, logEntry + "\n");
    } catch (error) {
      console.warn("Failed to write to log file:", error);
    }
    
    console.log(logEntry);
  };

  const getFabricPath = () => {
    return preferences.fabricInstallPath || "/Volumes/askuss/cloudworkspace/.creatorworkspace/.add-ons/fabric-ai/fabric";
  };

  const isYouTubeUrl = (text: string): boolean => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(text);
  };

  const extractYouTubeContent = async (url: string): Promise<{ title: string; channel?: string }> => {
    try {
      const ytDlpPath = "/opt/homebrew/bin/yt-dlp";
      addDebugLog(`Extracting YouTube content from: ${url}`);
      
      // Get both title and channel
      const { stdout: title } = await execAsync(`"${ytDlpPath}" --get-title "${url}"`, {
        timeout: 15000,
        maxBuffer: 1024 * 1024,
        env: { 
          ...process.env, 
          PATH: `${process.env.PATH}:/opt/homebrew/bin:/usr/local/bin`
        }
      });

      let channel = "";
      try {
        const { stdout: channelName } = await execAsync(`"${ytDlpPath}" --print "%(uploader)s" "${url}"`, {
          timeout: 10000,
          maxBuffer: 1024 * 1024,
          env: { 
            ...process.env, 
            PATH: `${process.env.PATH}:/opt/homebrew/bin:/usr/local/bin`
          }
        });
        channel = channelName.trim();
        addDebugLog(`YouTube channel extracted: ${channel}`);
      } catch {
        addDebugLog("Channel extraction failed, continuing without it");
      }
      
      if (title && title.trim()) {
        addDebugLog(`YouTube title extracted: ${title.trim()}`);
        return {
          title: title.trim(),
          channel: channel || undefined
        };
      }
      
      throw new Error("Could not extract YouTube title");
      
    } catch (error: any) {
      addDebugLog(`YouTube extraction error: ${error.message}`);
      const videoIdMatch = url.match(/(?:v=|\/embed\/|\/v\/|youtu\.be\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
      if (videoIdMatch) {
        return {
          title: `YouTube Video ID: ${videoIdMatch[1]}`,
          channel: undefined
        };
      }
      
      throw new Error(`YouTube extraction failed: ${error.message}`);
    }
  };

  const runFabricCommand = (input: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fabricPath = getFabricPath();
      addDebugLog(`Running fabric command with path: ${fabricPath}`);
      addDebugLog(`Input length: ${input.length} characters`);
      
      const fabricProcess = spawn(fabricPath, ['--pattern', 'extract_wisdom'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          PATH: `${process.env.PATH}:/opt/homebrew/bin:/usr/local/bin:/Volumes/askuss/cloudworkspace/.creatorworkspace/.add-ons/fabric-ai`
        }
      });

      let stdout = '';
      let stderr = '';

      fabricProcess.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      fabricProcess.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      fabricProcess.on('close', (code) => {
        addDebugLog(`Fabric process closed with code: ${code}`);
        if (code === 0 && stdout.trim()) {
          addDebugLog(`Fabric output length: ${stdout.length} characters`);
          resolve(stdout.trim());
        } else {
          addDebugLog(`Fabric error: ${stderr}`);
          reject(new Error(stderr || `Process exited with code ${code}`));
        }
      });

      fabricProcess.on('error', (error) => {
        addDebugLog(`Fabric process error: ${error.message}`);
        reject(error);
      });

      fabricProcess.stdin.write(input);
      fabricProcess.stdin.end();

      setTimeout(() => {
        fabricProcess.kill();
        addDebugLog('Fabric command timed out');
        reject(new Error('Fabric command timed out'));
      }, 60000);
    });
  };

  const parseWisdomOutput = (wisdom: string, originalInput: string, contentType: string, youtubeData?: { title: string; channel?: string }): ExtractedWisdom => {
    addDebugLog('Parsing wisdom output into structured data');
    
    // Parse the structured output from fabric
    const sections = wisdom.split('\n# ');
    const parsed: any = {};

    sections.forEach(section => {
      const lines = section.split('\n');
      const title = lines[0].replace('#', '').trim().toLowerCase();
      const content = lines.slice(1).join('\n').trim();

      switch (title) {
        case 'summary':
          parsed.summary = content;
          break;
        case 'ideas':
          parsed.ideas = content.split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
          break;
        case 'insights':
          parsed.insights = content.split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
          break;
        case 'quotes':
          parsed.quotes = content.split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
          break;
        case 'habits':
          parsed.habits = content.split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
          break;
        case 'facts':
          parsed.facts = content.split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
          break;
        case 'references':
          parsed.references = content.split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
          break;
        case 'one-sentence takeaway':
          parsed.takeaway = content;
          break;
        case 'recommendations':
          parsed.recommendations = content.split('\n').filter(line => line.startsWith('-')).map(line => line.substring(1).trim());
          break;
      }
    });

    // Extract URLs from content for CTA URLs
    const urlRegex = /https?:\/\/[^\s]+/g;
    const ctaUrls = wisdom.match(urlRegex) || [];

    return {
      content: originalInput,
      wisdom,
      timestamp: new Date(),
      contentType: contentType as any,
      originalInput,
      youtubeChannel: youtubeData?.channel,
      author: youtubeData?.channel || 'Unknown',
      hook: parsed.quotes?.[0] || parsed.ideas?.[0] || '',
      summary: parsed.summary || '',
      ideas: parsed.ideas || [],
      insights: parsed.insights || [],
      quotes: parsed.quotes || [],
      habits: parsed.habits || [],
      facts: parsed.facts || [],
      references: parsed.references || [],
      takeaway: parsed.takeaway || '',
      recommendations: parsed.recommendations || [],
      ctaUrls: ctaUrls,
    };
  };

  const exportToSpreadsheet = async (data: ExtractedWisdom) => {
    try {
      addDebugLog('Starting CSV export');
      const exportPath = preferences.exportPath || join(environment.supportPath, "exports");
      
      if (!existsSync(exportPath)) {
        mkdirSync(exportPath, { recursive: true });
        addDebugLog(`Created export directory: ${exportPath}`);
      }

      // Create CSV content
      const csvHeaders = [
        'Date', 'Author', 'Hook', 'Source Type', 'Pattern Type', 'Extracted Content Full',
        'Summary', 'Ideas', 'Insights', 'Notable Quotes', 'Habits', 'Facts', 'References',
        'One-Sentence Takeaway', 'Recommendations', 'YouTube Channel', 'CTA URLs', 'Connect with Hosts',
        'Pattern Suggest Next', 'Original URL'
      ];

      const csvRow = [
        data.timestamp.toISOString(),
        data.author || '',
        data.hook || '',
        data.contentType,
        'extract_wisdom',
        `"${data.wisdom.replace(/"/g, '""')}"`,
        `"${data.summary?.replace(/"/g, '""') || ''}"`,
        `"${data.ideas?.join('; ').replace(/"/g, '""') || ''}"`,
        `"${data.insights?.join('; ').replace(/"/g, '""') || ''}"`,
        `"${data.quotes?.join('; ').replace(/"/g, '""') || ''}"`,
        `"${data.habits?.join('; ').replace(/"/g, '""') || ''}"`,
        `"${data.facts?.join('; ').replace(/"/g, '""') || ''}"`,
        `"${data.references?.join('; ').replace(/"/g, '""') || ''}"`,
        `"${data.takeaway?.replace(/"/g, '""') || ''}"`,
        `"${data.recommendations?.join('; ').replace(/"/g, '""') || ''}"`,
        data.youtubeChannel || '',
        `"${data.ctaUrls?.join('; ') || ''}"`,
        data.youtubeChannel || '',
        'summarize, create_art, write_essay',
        data.originalInput
      ];

      const csvFile = join(exportPath, "fabric-extractions.csv");
      const isNewFile = !existsSync(csvFile);

      if (isNewFile) {
        writeFileSync(csvFile, csvHeaders.join(',') + '\n');
        addDebugLog('Created new CSV file with headers');
      }

      appendFileSync(csvFile, csvRow.join(',') + '\n');
      addDebugLog(`Exported data to CSV: ${csvFile}`);

      await showToast({
        style: Toast.Style.Success,
        title: "Exported to CSV",
        message: `Saved to: ${csvFile}`,
      });

    } catch (error: any) {
      addDebugLog(`Export failed: ${error.message}`);
      await showToast({
        style: Toast.Style.Failure,
        title: "Export Failed",
        message: error.message,
      });
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

    try {
      addDebugLog(`Starting extraction for content type: ${contentType}`);
      let processedContent = content;
      let textToProcess = content;
      let youtubeData: { title: string; channel?: string } | undefined;

      if (isYouTubeUrl(content)) {
        contentType = 'youtube';
        
        await showToast({
          style: Toast.Style.Animated,
          title: "Extracting",
          message: "Getting YouTube content...",
        });

        try {
          youtubeData = await extractYouTubeContent(content);
          textToProcess = `YouTube Video: ${youtubeData.title}`;
          processedContent = textToProcess;
        } catch (ytError: any) {
          addDebugLog(`YouTube extraction failed: ${ytError.message}`);
          textToProcess = `YouTube Video URL: ${content}`;
          processedContent = textToProcess;
        }
      } else {
        const maxLength = parseInt(preferences.maxContentLength || "2000");
        textToProcess = content.length > maxLength 
          ? content.substring(0, maxLength) + "..."
          : content;
        processedContent = textToProcess;
      }

      await showToast({
        style: Toast.Style.Animated,
        title: "Extracting",
        message: `Processing ${contentType} with Fabric AI...`,
      });

      const wisdom = await runFabricCommand(textToProcess);

      if (!wisdom) {
        throw new Error("No wisdom extracted from Fabric AI");
      }

      const extraction = parseWisdomOutput(wisdom, content, contentType, youtubeData);
      setExtractedWisdom(extraction);

      await showToast({
        style: Toast.Style.Success,
        title: "Success",
        message: `Wisdom extracted from ${contentType}!`,
      });

      addDebugLog(`Extraction completed successfully for ${contentType}`);

    } catch (error: any) {
      const errorMessage = error.message || "Unknown error";
      setError(errorMessage);
      addDebugLog(`Extraction failed: ${errorMessage}`);

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
      
      addDebugLog(`Extracting from clipboard: ${clipboardText.substring(0, 100)}...`);
      await extractWisdom(clipboardText, 'clipboard');
    } catch (error: any) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Clipboard Error",
        message: error.message,
      });
    }
  };

  const sendDebugLogs = async () => {
    try {
      addDebugLog('Copying debug logs to clipboard');
      const logsContent = debugLogs.join('\n');
      await Clipboard.copy(logsContent);
      
      await showToast({
        style: Toast.Style.Success,
        title: "Debug Logs Copied",
        message: `${debugLogs.length} log entries copied to clipboard`,
      });
    } catch (error: any) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed to Copy Logs",
        message: error.message,
      });
    }
  };

  const testFabricConnection = async () => {
    setIsLoading(true);
    try {
      await showToast({
        style: Toast.Style.Animated,
        title: "Testing",
        message: "Testing Fabric AI connection...",
      });

      const testContent = "This is a test message for Fabric AI.";
      const result = await runFabricCommand(testContent);

      if (result) {
        await showToast({
          style: Toast.Style.Success,
          title: "Test Successful",
          message: "Fabric AI is working correctly!",
        });
      } else {
        throw new Error("No output from Fabric AI");
      }

    } catch (error: any) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Test Failed",
        message: `${error.message}. Path: ${getFabricPath()}`,
      });
    } finally {
      setIsLoading(false);
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
**Channel:** ${extractedWisdom.youtubeChannel || 'N/A'}
**Processed:** ${new Date(extractedWisdom.timestamp).toLocaleString()}

## Summary
${extractedWisdom.summary || 'No summary available'}

## Key Takeaway
${extractedWisdom.takeaway || 'No takeaway available'}

## Full Wisdom

${extractedWisdom.wisdom}

---
*Extracted using Fabric AI - extract_wisdom pattern*
`}
        actions={
          <ActionPanel>
            <Action
              title="Export to Spreadsheet"
              icon={Icon.Document}
              onAction={() => exportToSpreadsheet(extractedWisdom)}
            />
            <Action
              title="Copy Wisdom"
              icon={Icon.Clipboard}
              onAction={() => Clipboard.copy(extractedWisdom.wisdom)}
            />
            <Action
              title="Copy Summary"
              icon={Icon.Text}
              onAction={() => Clipboard.copy(extractedWisdom.summary || '')}
            />
            <Action
              title="Copy Takeaway"
              icon={Icon.Star}
              onAction={() => Clipboard.copy(extractedWisdom.takeaway || '')}
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
      searchBarPlaceholder="Enter text or YouTube link to extract wisdom..."
      throttle
    >
      <List.Item
        title="🧪 Test Fabric AI Connection"
        subtitle={`Using spawn method with path: ${getFabricPath()}`}
        actions={
          <ActionPanel>
            <Action
              title="Run Test"
              icon={Icon.Bug}
              onAction={testFabricConnection}
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

      <List.Item
        title="🐛 Debug & Send Logs"
        subtitle={`${debugLogs.length} log entries available`}
        actions={
          <ActionPanel>
            <Action
              title="Copy Debug Logs"
              icon={Icon.Bug}
              onAction={sendDebugLogs}
            />
          </ActionPanel>
        }
      />

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