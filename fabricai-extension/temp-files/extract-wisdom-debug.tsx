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
  debugInfo?: string;
}

export default function ExtractWisdomDebug() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [extractedWisdom, setExtractedWisdom] =
    useState<ExtractedWisdom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const preferences = getPreferenceValues<Preferences>();

  const testFabricInstallation = async () => {
    setIsLoading(true);
    setError(null);
    setDebugInfo("");

    try {
      const fabricPath = preferences.fabricInstallPath || "fabric";

      // Test 1: Check if fabric command exists
      setDebugInfo("Testing fabric installation...");
      await showToast({
        style: Toast.Style.Animated,
        title: "Testing",
        message: "Checking Fabric AI installation...",
      });

      const { stdout: versionOutput, stderr: versionError } = await execAsync(
        `${fabricPath} --version`,
        { timeout: 10000 },
      );

      setDebugInfo(
        `✅ Fabric version check passed\nOutput: ${versionOutput}\nError: ${
          versionError || "none"
        }`,
      );

      // Test 2: Check available patterns
      const { stdout: patternsOutput, stderr: patternsError } = await execAsync(
        `${fabricPath} --list`,
        { timeout: 10000 },
      );

      const finalDebugInfo = `✅ Fabric installation test completed
      
Version Check:
Output: ${versionOutput}
Error: ${versionError || "none"}

Patterns Check:
Output: ${patternsOutput}
Error: ${patternsError || "none"}

Fabric Path: ${fabricPath}
`;

      setDebugInfo(finalDebugInfo);

      await showToast({
        style: Toast.Style.Success,
        title: "Success",
        message: "Fabric AI is working!",
      });
    } catch (error: any) {
      const errorInfo = `❌ Fabric installation test failed
      
Error: ${error.message}
Command: ${preferences.fabricInstallPath || "fabric"} --version
Timeout: 10 seconds

Possible issues:
1. Fabric AI not installed: pip install fabric-ai
2. Fabric AI not in PATH
3. Custom path needed in preferences
4. Permission issues
`;

      setDebugInfo(errorInfo);
      setError(error.message);

      await showToast({
        style: Toast.Style.Failure,
        title: "Test Failed",
        message: error.message,
      });
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
    setDebugInfo("");

    try {
      const fabricPath = preferences.fabricInstallPath || "fabric";
      const maxLength = parseInt(preferences.maxContentLength || "1000"); // Smaller for testing
      const timeout = parseInt(preferences.timeoutSeconds || "30") * 1000;

      // Prepare content
      const processedContent =
        content.length > maxLength
          ? content.substring(0, maxLength) + "..."
          : content;

      setDebugInfo(`🔄 Starting extraction...
Content length: ${processedContent.length}
Fabric path: ${fabricPath}
Timeout: ${timeout}ms`);

      await showToast({
        style: Toast.Style.Animated,
        title: "Extracting",
        message: "Running Fabric AI...",
      });

      // Simple test command first
      const testCommand = `echo "test" | ${fabricPath} --pattern extract_wisdom`;

      setDebugInfo((prev) => prev + `\n\nTest command: ${testCommand}`);

      const { stdout, stderr } = await execAsync(testCommand, {
        timeout,
        maxBuffer: 1024 * 1024,
        encoding: "utf8",
      });

      setDebugInfo(
        (prev) =>
          prev +
          `\n\nTest result:
stdout: ${stdout}
stderr: ${stderr || "none"}`,
      );

      if (!stdout && stderr) {
        throw new Error(`Fabric AI error: ${stderr}`);
      }

      // If test works, try with actual content
      const actualCommand = `echo ${JSON.stringify(
        processedContent,
      )} | ${fabricPath} --pattern extract_wisdom`;

      const { stdout: actualOutput, stderr: actualError } = await execAsync(
        actualCommand,
        {
          timeout,
          maxBuffer: 1024 * 1024,
          encoding: "utf8",
        },
      );

      const wisdom = actualOutput.trim() || "No wisdom extracted";

      const extraction: ExtractedWisdom = {
        content: processedContent,
        wisdom,
        timestamp: new Date(),
        debugInfo: `Command: ${actualCommand}
Output: ${actualOutput}
Error: ${actualError || "none"}`,
      };

      setExtractedWisdom(extraction);

      await showToast({
        style: Toast.Style.Success,
        title: "Success",
        message: "Wisdom extracted!",
      });
    } catch (error: any) {
      const errorMessage = error.message || "Unknown error";
      setError(errorMessage);

      setDebugInfo((prev) => prev + `\n\n❌ Error occurred: ${errorMessage}`);

      await showToast({
        style: Toast.Style.Failure,
        title: "Extraction Failed",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
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

## Debug Information
\`\`\`
${extractedWisdom.debugInfo}
\`\`\`
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
              title="Back to Input"
              icon={Icon.ArrowLeft}
              onAction={() => setExtractedWisdom(null)}
            />
          </ActionPanel>
        }
      />
    );
  }

  // Show debug info if available
  if (debugInfo) {
    return (
      <Detail
        markdown={`# Debug Information

\`\`\`
${debugInfo}
\`\`\`

${error ? `## Error\n${error}` : ""}
`}
        actions={
          <ActionPanel>
            <Action
              title="Back to Input"
              icon={Icon.ArrowLeft}
              onAction={() => {
                setDebugInfo("");
                setError(null);
              }}
            />
            <Action
              title="Test Fabric Again"
              icon={Icon.ArrowClockwise}
              onAction={testFabricInstallation}
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
      searchBarPlaceholder="Enter text to extract wisdom from..."
      isLoading={isLoading}
    >
      <List.Item
        title="Test Fabric AI Installation"
        subtitle="Check if Fabric AI is properly installed and configured"
        icon={{ source: Icon.Checkmark, tintColor: "green" }}
        actions={
          <ActionPanel>
            <Action
              title="Test Installation"
              icon={Icon.Checkmark}
              onAction={testFabricInstallation}
            />
          </ActionPanel>
        }
      />

      {searchText.trim() && (
        <List.Item
          title="Extract Wisdom (Debug Mode)"
          subtitle={`Ready to extract from: ${searchText.substring(0, 100)}${
            searchText.length > 100 ? "..." : ""
          }`}
          icon={{ source: Icon.Sparkles, tintColor: "blue" }}
          actions={
            <ActionPanel>
              <Action
                title="Extract Wisdom"
                icon={Icon.Sparkles}
                onAction={() => extractWisdom(searchText)}
              />
            </ActionPanel>
          }
        />
      )}

      {!searchText.trim() && (
        <List.Item
          title="Getting Started"
          subtitle="First, test Fabric AI installation, then enter content above"
          icon={{ source: Icon.Info, tintColor: "blue" }}
          actions={
            <ActionPanel>
              <Action
                title="Test Installation"
                icon={Icon.Checkmark}
                onAction={testFabricInstallation}
              />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}
