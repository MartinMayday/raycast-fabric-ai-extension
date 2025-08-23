import { ActionPanel, Action, List, Icon, showToast, Toast, Form, TextField } from "@raycast/api";
import { useState } from "react";
import { FabricClient } from "./lib/fabric-client";

export default function ExtractWisdom() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [fabricClient] = useState(() => new FabricClient());

  const handleExtractWisdom = async (input: string) => {
    if (!input.trim()) {
      showToast(Toast.Style.Failure, "No input provided");
      return;
    }

    // Check input length - Raycast has limits but we can handle longer text
    if (input.length > 10000) {
      showToast(Toast.Style.Failure, "Input too long", "Please keep input under 10,000 characters");
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if FabricAI is available
      const isInstalled = await fabricClient.checkInstallation();
      if (!isInstalled) {
        showToast(Toast.Style.Failure, "FabricAI not found", "Please install FabricAI first");
        return;
      }

      // Extract wisdom using FabricAI
      const result = await fabricClient.executePattern("extract_wisdom", input, {
        stream: false
      });
      
      setResults([result]);
      showToast(Toast.Style.Success, "Wisdom extracted successfully!");
    } catch (error) {
      showToast(Toast.Style.Failure, "Error", error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const processInput = (input: string) => {
    if (input.trim()) {
      handleExtractWisdom(input);
    }
  };

  const handleURLInput = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      showToast(Toast.Style.Info, "YouTube URL detected", "Transcript extraction coming soon!");
      // TODO: Implement YouTube transcript extraction
    } else if (url.startsWith('http')) {
      showToast(Toast.Style.Info, "Web URL detected", "Content scraping coming soon!");
      // TODO: Implement web content scraping
    }
    handleExtractWisdom(url);
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Enter text, paste URL, or type 'extract wisdom @url'..."
      onSearchTextChange={setQuery}
      actions={
        <ActionPanel>
          <Action
            title="Extract Wisdom"
            icon={Icon.Brain}
            onAction={() => processInput(query)}
          />
          <Action
            title="Process as URL"
            icon={Icon.Link}
            onAction={() => handleURLInput(query)}
          />
        </ActionPanel>
      }
    >
      {results.map((result, index) => (
        <List.Item
          key={index}
          title="Extracted Wisdom"
          subtitle={result.substring(0, 100) + "..."}
          actions={
            <ActionPanel>
              <Action.CopyToClipboard title="Copy Result" content={result} />
              <Action
                title="Extract More Wisdom"
                icon={Icon.Brain}
                onAction={() => processInput(query)}
              />
              <Action
                title="View Output Folder"
                icon={Icon.Folder}
                onAction={async () => {
                  try {
                    const outputDir = await fabricClient.getOutputDirectory("extract_wisdom");
                    showToast(Toast.Style.Success, "Output folder", outputDir);
                  } catch (error) {
                    showToast(Toast.Style.Failure, "Error", "Could not get output folder");
                  }
                }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}
