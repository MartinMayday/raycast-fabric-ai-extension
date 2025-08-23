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
}

export default function ExtractWisdomYouTubeFixed() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedWisdom, setExtractedWisdom] = useState<ExtractedWisdom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clipboardPreview, setClipboardPreview] = useState<string>("");

  const preferences = getPreferenceValues<Preferences>();

  const getFabricPath = () => {
    return preferences.fabricInstallPath || "fabric";
  };

  const isYouTubeUrl = (text: string): boolean => {
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(text);
  };

  const isUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };



  const loadClipboardPreview = async () => {
    try {
      const clipboardText = await Clipboard.readText();
      if (clipboardText) {
        const preview = clipboardText.length > 200 
          ? clipboardText.substring(0, 200) + "..."
          : clipboardText;
        setClipboardPreview(preview);
        
        await showToast({
          style: Toast.Style.Success,
          title: "Clipboard Loaded",
          message: `${clipboardText.length} characters ready`,
        });
      } else {
        setClipboardPreview("");
        await showToast({
          style: Toast.Style.Failure,
          title: "No Clipboard Content",
          message: "Clipboard is empty",
        });
      }
    } catch (error: any) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Clipboard Error",
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
      const fabricPath = getFabricPath();
      const timeout = parseInt(preferences.timeoutSeconds || "120") * 1000; // Longer timeout for YouTube
      
      let command: string;
      let processedContent = content;
      let toastMessage = "Running Fabric AI...";

      // Determine content type and build appropriate command
      if (isYouTubeUrl(content)) {
        contentType = 'youtube';
        toastMessage = "Extracting YouTube transcript and wisdom...";
        
        // Use the correct Fabric AI YouTube command with built-in YouTube support
        // Primary command: fabric --youtube URL --transcript --pattern extract_wisdom
        command = `"${fabricPath}" --youtube "${content}" --transcript --pattern extract_wisdom`;
        
        processedContent = `YouTube Video: ${content}`;
      } else if (isUrl(content)) {
        contentType = 'url';
        toastMessage = "Processing URL with Fabric AI...";
        
        // For other URLs, pass directly to Fabric AI
        command = `echo ${JSON.stringify(content)} | "${fabricPath}" --pattern extract_wisdom`;
        processedContent = content;
      } else {
        // For text content, apply length limits and use standard processing
        const maxLength = parseInt(preferences.maxContentLength || "10000");
        processedContent = content.length > maxLength 
          ? content.substring(0, maxLength) + "..."
          : content;
        
        command = `echo ${JSON.stringify(processedContent)} | "${fabricPath}" --pattern extract_wisdom`;
      }

      await showToast({
        style: Toast.Style.Animated,
        title: "Extracting",
        message: toastMessage,
      });

      console.log(`Executing command: ${command}`);
      
      const { stdout, stderr } = await execAsync(command, { 
        timeout,
        maxBuffer: 5 * 1024 * 1024, // 5MB buffer for large transcripts
        encoding: 'utf8',
        env: { ...process.env, PATH: process.env.PATH }
      });

      if (stderr && !stdout) {
        throw new Error(`Fabric AI error: ${stderr}`);
      }

      // Handle case where stderr contains warnings but stdout has content
      if (stderr && stdout) {
        console.warn(`Fabric AI warnings: ${stderr}`);
      }

      const wisdom = stdout.trim();
      if (!wisdom) {
        if (contentType === 'youtube') {
          throw new Error("No transcript extracted. The video might be private, have no captions, or the YouTube API might not be configured properly.");
        } else {
          throw new Error("No wisdom extracted. The content might be too short or the pattern might not be available.");
        }
      }

      const extraction: ExtractedWisdom = {
        content: processedContent,
        wisdom,
        timestamp: new Date(),
        contentType,
        originalInput: content,
      };

      setExtractedWisdom(extraction);

      await showToast({
        style: Toast.Style.Success,
        title: "Success",
        message: `Wisdom extracted from ${contentType}!`,
      });

    } catch (error: any) {
      const errorMessage = error.message || "Unknown error";
      setError(errorMessage);

      // Provide specific guidance based on content type and error
      let helpMessage = errorMessage;
      if (isYouTubeUrl(content)) {
        if (errorMessage.includes("youtube") || errorMessage.includes("transcript")) {
          helpMessage = "YouTube extraction failed: Please ensure Fabric AI is configured with YouTube API access.";
        } else if (errorMessage.includes("API") || errorMessage.includes("quota")) {
          helpMessage = "YouTube API error: Please check your YouTube API configuration in Fabric AI setup.";
        } else if (errorMessage.includes("transcript")) {
          helpMessage = "No transcript available: This video might not have captions or might be private.";
        }
      }

      await showToast({
        style: Toast.Style.Failure,
        title: "Extraction Failed",
        message: helpMessage,
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
          message: "No text found in clipboard",
        });
        return;
      }

      // Determine content type
      let contentType: 'youtube' | 'url' | 'clipboard' = 'clipboard';
      if (isYouTubeUrl(clipboardText.trim())) {
        contentType = 'youtube';
      } else if (isUrl(clipboardText.trim())) {
        contentType = 'url';
      }
      
      setSearchText(clipboardText);
      await extractWisdom(clipboardText, contentType);
    } catch (error: any) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to read clipboard: " + error.message,
      });
    }
  };

  // Show extracted wisdom
  if (extractedWisdom) {
    const contentTypeEmoji = {
      'text': '📝',
      'youtube': '🎥',
      'url': '🔗',
      'clipboard': '📋'
    };

    const contentTypeLabel = {
      'text': 'Text',
      'youtube': 'YouTube Video',
      'url': 'URL',
      'clipboard': 'Clipboard'
    };

    return (
      <Detail
        markdown={`# Extracted Wisdom ${contentTypeEmoji[extractedWisdom.contentType]}

${extractedWisdom.wisdom}

---

## Original Content
**Source:** ${contentTypeLabel[extractedWisdom.contentType]}  
**URL:** ${extractedWisdom.originalInput}

${extractedWisdom.contentType === 'youtube' ? '*Transcript extracted from YouTube video*' : ''}

---
*Extracted from ${extractedWisdom.contentType} at ${extractedWisdom.timestamp.toLocaleString()}*
`}
        actions={
          <ActionPanel>
            <Action
              title="Copy Wisdom"
              icon={Icon.Clipboard}
              onAction={() => {
                Clipboard.copy(extractedWisdom.wisdom);
                showToast({
                  style: Toast.Style.Success,
                  title: "Copied",
                  message: "Wisdom copied to clipboard",
                });
              }}
            />
            <Action
              title="Copy Original URL"
              icon={Icon.Link}
              onAction={() => {
                Clipboard.copy(extractedWisdom.originalInput);
                showToast({
                  style: Toast.Style.Success,
                  title: "Copied",
                  message: "Original URL copied",
                });
              }}
            />
            <Action
              title="Share Wisdom"
              icon={Icon.Forward}
              onAction={() => {
                const shareText = `# Wisdom from ${contentTypeLabel[extractedWisdom.contentType]}\n\n${extractedWisdom.wisdom}\n\n---\nSource: ${extractedWisdom.originalInput}`;
                Clipboard.copy(shareText);
                showToast({
                  style: Toast.Style.Success,
                  title: "Copied",
                  message: "Formatted wisdom copied for sharing",
                });
              }}
            />
            <Action
              title="Back to Input"
              icon={Icon.ArrowCounterClockwise}
              onAction={() => setExtractedWisdom(null)}
            />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <List
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Enter YouTube URL, text, or other content to extract wisdom from..."
      isLoading={isLoading}
    >
      {error && (
        <List.Item
          title="Error Occurred"
          subtitle={error}
          icon={{ source: Icon.ExclamationMark, tintColor: "red" }}
          actions={
            <ActionPanel>
              <Action
                title="Retry"
                icon={Icon.ArrowClockwise}
                onAction={() => {
                  setError(null);
                  if (searchText.trim()) {
                    extractWisdom(searchText);
                  }
                }}
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

      {searchText.trim() && (
        <List.Item
          title={
            isYouTubeUrl(searchText) 
              ? "Extract Wisdom from YouTube Video" 
              : isUrl(searchText) 
                ? "Extract Wisdom from URL" 
                : "Extract Wisdom from Text"
          }
          subtitle={`Ready to extract from: ${searchText.substring(0, 100)}${searchText.length > 100 ? "..." : ""}`}
          icon={{ 
            source: isYouTubeUrl(searchText) 
              ? Icon.Video 
              : isUrl(searchText) 
                ? Icon.Globe 
                : Icon.Stars, 
            tintColor: isYouTubeUrl(searchText) 
              ? "red" 
              : isUrl(searchText) 
                ? "orange" 
                : "blue" 
          }}
          actions={
            <ActionPanel>
              <Action
                title="Extract Wisdom"
                icon={Icon.Stars}
                onAction={() => extractWisdom(searchText)}
              />
              <Action
                title="Clear Input"
                icon={Icon.Trash}
                onAction={() => {
                  setSearchText("");
                  setError(null);
                }}
              />
            </ActionPanel>
          }
        />
      )}

      <List.Item
        title="Extract from Clipboard"
        subtitle={clipboardPreview ? `Preview: ${clipboardPreview}` : "Use content from your clipboard"}
        icon={{ source: Icon.Clipboard, tintColor: "green" }}
        actions={
          <ActionPanel>
            <Action
              title="Extract from Clipboard"
              icon={Icon.Clipboard}
              onAction={handleExtractFromClipboard}
            />
            <Action
              title="Preview Clipboard"
              icon={Icon.Eye}
              onAction={loadClipboardPreview}
            />
          </ActionPanel>
        }
      />

      {!searchText.trim() && !error && (
        <List.Item
          title="Getting Started"
          subtitle="Enter a YouTube URL, text, or other content above, or use clipboard extraction"
          icon={{ source: Icon.QuestionMark, tintColor: "blue" }}
          actions={
            <ActionPanel>
              <Action
                title="Extract from Clipboard"
                icon={Icon.Clipboard}
                onAction={handleExtractFromClipboard}
              />
              <Action
                title="Preview Clipboard"
                icon={Icon.Eye}
                onAction={loadClipboardPreview}
              />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}