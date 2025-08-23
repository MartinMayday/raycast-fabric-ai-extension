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

export default function ExtractWisdomFixed() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedWisdom, setExtractedWisdom] = useState<ExtractedWisdom | null>(null);
  const [error, setError] = useState<string | null>(null);

  const preferences = getPreferenceValues<Preferences>();

  // Use the correct fabric path based on your system
  const getFabricPath = () => {
    return preferences.fabricInstallPath || "/Volumes/askuss/cloudworkspace/.creatorworkspace/.add-ons/fabric-ai/fabric";
  };

  const testFabricInstallation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fabricPath = getFabricPath();
      
      await showToast({
        style: Toast.Style.Animated,
        title: "Testing",
        message: "Checking Fabric AI...",
      });

      // Test with the correct command format for your version
      const { stdout } = await execAsync(`"${fabricPath}" --help`, { 
        timeout: 10000,
        env: { ...process.env, PATH: process.env.PATH }
      });
      
      await showToast({
        style: Toast.Style.Success,
        title: "Success",
        message: "Fabric AI is accessible!",
      });

      return true;

    } catch (error: any) {
      setError(`Fabric test failed: ${error.message}`);
      
      await showToast({
        style: Toast.Style.Failure,
        title: "Test Failed",
        message: "Check Fabric AI path in preferences",
      });

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const extractWisdom = async (content: string) => {
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
      const maxLength = parseInt(preferences.maxContentLength || "5000");
      const timeout = parseInt(preferences.timeoutSeconds || "60") * 1000;

      // Prepare content
      const processedContent = content.length > maxLength 
        ? content.substring(0, maxLength) + "..."
        : content;

      await showToast({
        style: Toast.Style.Animated,
        title: "Extracting",
        message: "Running Fabric AI...",
      });

      // Use the correct command format: -p for pattern
      const command = `echo ${JSON.stringify(processedContent)} | "${fabricPath}" -p extract_wisdom`;
      
      const { stdout, stderr } = await execAsync(command, { 
        timeout,
        maxBuffer: 1024 * 1024,
        encoding: 'utf8',
        env: { ...process.env, PATH: process.env.PATH }
      });

      if (stderr && !stdout) {
        throw new Error(`Fabric AI error: ${stderr}`);
      }

      const wisdom = stdout.trim();
      if (!wisdom) {
        throw new Error("No wisdom extracted. The content might be too short or the pattern might not be available.");
      }

      const extraction: ExtractedWisdom = {
        content: processedContent,
        wisdom,
        timestamp: new Date(),
      };

      setExtractedWisdom(extraction);

      await showToast({
        style: Toast.Style.Success,
        title: "Success",
        message: "Wisdom extracted successfully!",
      });

    } catch (error: any) {
      const errorMessage = error.message || "Unknown error";
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
          message: "No text found in clipboard",
        });
        return;
      }
      setSearchText(clipboardText);
      await extractWisdom(clipboardText);
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
    return (
      <Detail
        markdown={`# Extracted Wisdom

${extractedWisdom.wisdom}

---

## Original Content
${extractedWisdom.content}

---
*Extracted at ${extractedWisdom.timestamp.toLocaleString()}*
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
                Clipboard.copy(extractedWisdom.content);
                showToast({
                  style: Toast.Style.Success,
                  title: "Copied",
                  message: "Original content copied",
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
                title="Test Fabric AI"
                icon={Icon.Checkmark}
                onAction={testFabricInstallation}
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

      <List.Item
        title="Test Fabric AI"
        subtitle={`Test connection to: ${getFabricPath()}`}
        icon={{ source: Icon.Checkmark, tintColor: "green" }}
        actions={
          <ActionPanel>
            <Action
              title="Test Fabric AI"
              icon={Icon.Checkmark}
              onAction={testFabricInstallation}
            />
          </ActionPanel>
        }
      />

      {searchText.trim() && (
        <List.Item
          title="Extract Wisdom"
          subtitle={`Ready to extract from: ${searchText.substring(0, 100)}${searchText.length > 100 ? "..." : ""}`}
          icon={{ source: Icon.Stars, tintColor: "blue" }}
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

      {!searchText.trim() && !error && (
        <List.Item
          title="Getting Started"
          subtitle="1. Test Fabric AI, 2. Enter content above, 3. Extract wisdom"
          icon={{ source: Icon.QuestionMark, tintColor: "blue" }}
          actions={
            <ActionPanel>
              <Action
                title="Test Fabric AI"
                icon={Icon.Checkmark}
                onAction={testFabricInstallation}
              />
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