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
  contentType: 'text' | 'url' | 'clipboard';
  originalInput: string;
}

export default function ExtractWisdomEnhanced() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedWisdom, setExtractedWisdom] = useState<ExtractedWisdom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clipboardPreview, setClipboardPreview] = useState<string>("");

  const preferences = getPreferenceValues<Preferences>();

  const getFabricPath = () => {
    return preferences.fabricInstallPath || "/Volumes/askuss/cloudworkspace/.creatorworkspace/.add-ons/fabric-ai/fabric";
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

  const extractWisdom = async (content: string, contentType: 'text' | 'url' | 'clipboard' = 'text') => {
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
      const maxLength = parseInt(preferences.maxContentLength || "10000");
      const timeout = parseInt(preferences.timeoutSeconds || "60") * 1000;

      let processedContent = content;
      let toastMessage = "Running Fabric AI...";

      // Handle different content types
      if (isUrl(content)) {
        toastMessage = "Processing URL with Fabric AI...";
        contentType = 'url';
        
        // For URLs, we'll let Fabric AI handle the URL directly
        // Fabric AI has built-in URL processing capabilities
        processedContent = content;
      } else {
        // For text content, apply length limits
        processedContent = content.length > maxLength 
          ? content.substring(0, maxLength) + "..."
          : content;
      }

      await showToast({
        style: Toast.Style.Animated,
        title: "Extracting",
        message: toastMessage,
      });

      // Use different Fabric AI approaches based on content type
      let command: string;
      
      if (contentType === 'url') {
        // For URLs, pass the URL directly to Fabric AI
        // Fabric AI can handle URL processing if configured with web scraping
        command = `echo ${JSON.stringify(processedContent)} | "${fabricPath}" -p extract_wisdom`;
      } else {
        // For text content, use standard processing
        command = `echo ${JSON.stringify(processedContent)} | "${fabricPath}" -p extract_wisdom`;
      }
      
      const { stdout, stderr } = await execAsync(command, { 
        timeout,
        maxBuffer: 2 * 1024 * 1024, // 2MB buffer for large content
        encoding: 'utf8',
        env: { ...process.env, PATH: process.env.PATH }
      });

      if (stderr && !stdout) {
        throw new Error(`Fabric AI error: ${stderr}`);
      }

      const wisdom = stdout.trim();
      if (!wisdom) {
        throw new Error("No wisdom extracted. The content might be too short, the URL might be inaccessible, or the pattern might not be available.");
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

      // Provide specific guidance based on content type
      let helpMessage = errorMessage;
      if (isUrl(content)) {
        helpMessage = "URL processing failed. Make sure Fabric AI is configured for web scraping, or try copying the webpage text instead.";
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

      // Determine if clipboard content is a URL
      const contentType = isUrl(clipboardText.trim()) ? 'url' : 'clipboard';
      
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
      'url': '🔗',
      'clipboard': '📋'
    };

    return (
      <Detail
        markdown={`# Extracted Wisdom ${contentTypeEmoji[extractedWisdom.contentType]}

${extractedWisdom.wisdom}

---

## Original Content
${extractedWisdom.contentType === 'url' ? `**URL:** ${extractedWisdom.originalInput}` : ''}

${extractedWisdom.content}

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
              title="Copy Original Content"
              icon={Icon.Document}
              onAction={() => {
                Clipboard.copy(extractedWisdom.originalInput);
                showToast({
                  style: Toast.Style.Success,
                  title: "Copied",
                  message: "Original content copied",
                });
              }}
            />
            <Action
              title="Share Wisdom"
              icon={Icon.Forward}
              onAction={() => {
                const shareText = `# Wisdom Extracted\n\n${extractedWisdom.wisdom}\n\n---\nSource: ${extractedWisdom.originalInput}`;
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
      searchBarPlaceholder="Enter text, URL, or content to extract wisdom from..."
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
          title={isUrl(searchText) ? "Extract Wisdom from URL" : "Extract Wisdom"}
          subtitle={`Ready to extract from: ${searchText.substring(0, 100)}${searchText.length > 100 ? "..." : ""}`}
          icon={{ 
            source: isUrl(searchText) ? Icon.Globe : Icon.Stars, 
            tintColor: isUrl(searchText) ? "orange" : "blue" 
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
          subtitle="Enter text or URL above, or use clipboard extraction"
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