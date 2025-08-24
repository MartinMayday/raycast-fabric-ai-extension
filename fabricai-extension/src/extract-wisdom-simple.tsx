import { useState, useCallback } from "react";
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
  LocalStorage,
} from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const execAsync = promisify(exec);

interface Preferences {
  fabricInstallPath?: string;
  maxContentLength?: string;
  timeoutSeconds?: string;
}

interface ExtractedWisdom {
  id: string;
  content: string;
  wisdom: string;
  timestamp: Date;
  sourceType?: string;
  sourceUrl?: string;
}

// Debug logging functions
const addDebugLog = async (message: string) => {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    
    const existingLogs = await LocalStorage.getItem<string>("debug_logs") || "";
    const newLogs = existingLogs ? `${existingLogs}\n${logEntry}` : logEntry;
    
    await LocalStorage.setItem("debug_logs", newLogs);
  } catch (error) {
    console.error("Failed to add debug log:", error);
  }
};

export default function ExtractWisdomSimple() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedWisdom, setExtractedWisdom] = useState<ExtractedWisdom | null>(null);
  const [error, setError] = useState<string | null>(null);

  const preferences = getPreferenceValues<Preferences>();

  const checkFabricInstallation = useCallback(async (): Promise<boolean> => {
    try {
      const fabricPath = preferences.fabricInstallPath || "fabric";
      await execAsync(`${fabricPath} --version`);
      return true;
    } catch {
      return false;
    }
  }, [preferences.fabricInstallPath]);

  const extractWisdom = useCallback(async (content: string) => {
    if (!content.trim()) {
      setError("Please enter some content to extract wisdom from.");
      return;
    }

    const maxLength = parseInt(preferences.maxContentLength || "50000");
    if (content.length > maxLength) {
      setError(`Content is too long. Maximum length is ${maxLength} characters.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Check if Fabric AI is installed
      const isInstalled = await checkFabricInstallation();
      if (!isInstalled) {
        throw new Error("Fabric AI is not installed or not accessible. Please install Fabric AI first.");
      }

      // Execute Fabric AI
      const fabricPath = preferences.fabricInstallPath || "fabric";
      const timeout = parseInt(preferences.timeoutSeconds || "30") * 1000;
      
      const command = `echo ${JSON.stringify(content)} | ${fabricPath} --pattern extract_wisdom`;
      const { stdout } = await execAsync(command, { timeout });

      if (!stdout.trim()) {
        throw new Error("No wisdom was extracted. Please try with different content.");
      }

      const extraction: ExtractedWisdom = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content,
        wisdom: stdout.trim(),
        timestamp: new Date(),
      };

      setExtractedWisdom(extraction);
      showToast({
        style: Toast.Style.Success,
        title: "Wisdom Extracted",
        message: "Successfully extracted wisdom from your content",
      });
    } catch (error: any) {
      const errorMessage = error.message || "An unexpected error occurred";
      setError(errorMessage);
      showToast({
        style: Toast.Style.Failure,
        title: "Extraction Failed",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [preferences, checkFabricInstallation]);

  const handleExtractFromClipboard = useCallback(async () => {
    try {
      const clipboardText = await Clipboard.readText();
      if (!clipboardText) {
        setError("No text found in clipboard");
        return;
      }
      setSearchText(clipboardText);
      await extractWisdom(clipboardText);
    } catch (error: any) {
      setError(error.message || "Failed to extract from clipboard");
    }
  }, [extractWisdom]);

  // Show extracted wisdom
  if (extractedWisdom) {
    const wisdomMarkdown = `# Extracted Wisdom

${extractedWisdom.wisdom}

---

**Original Content Preview:**
${extractedWisdom.content.substring(0, 200)}${extractedWisdom.content.length > 200 ? "..." : ""}

**Extracted:** ${extractedWisdom.timestamp.toLocaleString()}`;

    return (
      <Detail
        markdown={wisdomMarkdown}
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
              title="Back to Input"
              icon={Icon.ArrowRight}
              onAction={() => {
                setExtractedWisdom(null);
                setError(null);
              }}
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
      searchBarPlaceholder="Enter content to extract wisdom from..."
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
                title="Clear Error"
                icon={Icon.XmarkCircle}
                onAction={() => setError(null)}
              />
            </ActionPanel>
          }
        />
      )}

      <List.Item
        title="Extract Wisdom"
        subtitle={searchText ? `Ready to extract from: ${searchText.substring(0, 50)}...` : "Enter content above"}
        icon={{ source: Icon.Star, tintColor: "blue" }}
        actions={
          <ActionPanel>
            <Action
              title="Extract Wisdom"
              icon={Icon.Star}
              onAction={() => extractWisdom(searchText)}
            />
            <Action
              title="Extract from Clipboard"
              icon={Icon.Clipboard}
              onAction={handleExtractFromClipboard}
            />
            <Action
              title="Clear Content"
              icon={Icon.Trash}
              onAction={() => {
                setSearchText("");
                setError(null);
              }}
            />
          </ActionPanel>
        }
      />
    </List>
  );
}