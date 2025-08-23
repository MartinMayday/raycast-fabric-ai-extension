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
}

export default function ExtractWisdom() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedWisdom, setExtractedWisdom] = useState<ExtractedWisdom | null>(null);
  const [error, setError] = useState<string | null>(null);

  const preferences = getPreferenceValues<Preferences>();

  const checkFabricInstallation = async (): Promise<boolean> => {
    try {
      const fabricPath = preferences.fabricInstallPath || "fabric";
      await execAsync(`${fabricPath} --version`);
      return true;
    } catch {
      return false;
    }
  };

  const extractWisdom = async (content: string) => {
    if (!content.trim()) {
      showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Please enter some content to extract wisdom from",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if Fabric AI is installed
      const isInstalled = await checkFabricInstallation();
      if (!isInstalled) {
        throw new Error("Fabric AI is not installed. Please install it first with: pip install fabric-ai");
      }

      // Prepare content for Fabric AI
      const maxLength = parseInt(preferences.maxContentLength || "10000");
      const processedContent = content.length > maxLength 
        ? content.substring(0, maxLength) + "..."
        : content;

      // Execute Fabric AI command
      const fabricPath = preferences.fabricInstallPath || "fabric";
      const timeout = parseInt(preferences.timeoutSeconds || "30") * 1000;
      
      const command = `echo ${JSON.stringify(processedContent)} | ${fabricPath} --pattern extract_wisdom`;
      
      const { stdout, stderr } = await execAsync(command, { 
        timeout,
        maxBuffer: 1024 * 1024 // 1MB buffer
      });

      if (stderr && !stdout) {
        throw new Error(`Fabric AI error: ${stderr}`);
      }

      const wisdom = stdout.trim();
      if (!wisdom) {
        throw new Error("No wisdom extracted. Please check your content and try again.");
      }

      const extraction: ExtractedWisdom = {
        content: processedContent,
        wisdom,
        timestamp: new Date(),
      };

      setExtractedWisdom(extraction);
      
      showToast({
        style: Toast.Style.Success,
        title: "Success",
        message: "Wisdom extracted successfully!",
      });

    } catch (error: any) {
      const errorMessage = error.message || "An unknown error occurred";
      setError(errorMessage);
      
      showToast({
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
        showToast({
          style: Toast.Style.Failure,
          title: "Error",
          message: "No text found in clipboard",
        });
        return;
      }
      setSearchText(clipboardText);
      await extractWisdom(clipboardText);
    } catch (error: any) {
      showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to read clipboard: " + error.message,
      });
    }
  };

  // Show extracted wisdom
  if (extractedWisdom) {
    return (
      <Detail
        markdown={`# Extracted Wisdom\n\n${extractedWisdom.wisdom}\n\n---\n\n**Original Content Preview:**\n\n${extractedWisdom.content.substring(0, 200)}${extractedWisdom.content.length > 200 ? "..." : ""}`}
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
                Clipboard.copy(extractedWisdom.content);
                showToast({
                  style: Toast.Style.Success,
                  title: "Copied",
                  message: "Original content copied to clipboard",
                });
              }}
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
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Enter text, URL, or paste content to extract wisdom from..."
      isLoading={isLoading}
    >
      {error && (
        <List.Item
          title="Error"
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

      {searchText.trim() && !isLoading && !error && (
        <List.Item
          title="Extract Wisdom"
          subtitle={`Ready to extract from: ${searchText.substring(0, 100)}${searchText.length > 100 ? "..." : ""}`}
          icon={{ source: Icon.Sparkles, tintColor: "blue" }}
          actions={
            <ActionPanel>
              <Action
                title="Extract Wisdom"
                icon={Icon.Sparkles}
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
        subtitle="Use content from your clipboard"
        icon={{ source: Icon.Clipboard, tintColor: "green" }}
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

      {!searchText.trim() && !isLoading && (
        <List.Item
          title="Getting Started"
          subtitle="Type or paste content above, or use clipboard extraction"
          icon={{ source: Icon.Info, tintColor: "blue" }}
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
      )}
    </List>
  );
}