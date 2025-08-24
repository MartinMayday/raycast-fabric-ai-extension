import React, { useState } from "react";
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

interface StoryBrandAnalysis {
  content: string;
  analysis: string;
  timestamp: Date;
  contentType: "text" | "url" | "clipboard";
  originalInput: string;
  character?: string;
  problem?: string;
  guide?: string;
  plan?: string;
  callToAction?: string;
  success?: string;
  failure?: string;
  recommendations?: string[];
}

export default function CreateStoryBrandVariant() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [storyBrandAnalysis, setStoryBrandAnalysis] =
    useState<StoryBrandAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const preferences = getPreferenceValues<Preferences>();

  React.useEffect(() => {
    addDebugLog("StoryBrand Variant Analysis extension initialized");
    addDebugLog(`Fabric path: ${preferences.fabricInstallPath || "default"}`);
    addDebugLog(
      `Max content length: ${preferences.maxContentLength || "10000"}`,
    );
    addDebugLog(`Timeout: ${preferences.timeoutSeconds || "30"} seconds`);
    addDebugLog(`Export path: ${preferences.exportPath || "default"}`);
  }, []);

  const addDebugLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    setDebugLogs((prev) => [...prev, logEntry]);

    try {
      const logsDir = join(environment.supportPath, "logs");
      if (!existsSync(logsDir)) {
        mkdirSync(logsDir, { recursive: true });
      }

      const logFile = join(logsDir, "storybrand-analysis.log");
      appendFileSync(logFile, logEntry + "\n");
    } catch (error) {
      console.warn("Failed to write to log file:", error);
    }

    console.log(logEntry);
  };

  const getFabricPath = () => {
    return (
      preferences.fabricInstallPath ||
      "/Volumes/askuss/cloudworkspace/.creatorworkspace/.add-ons/fabric-ai/fabric"
    );
  };

  const runFabricCommand = (input: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fabricPath = getFabricPath();
      const maxLength = parseInt(preferences.maxContentLength || "15000");
      const timeout = parseInt(preferences.timeoutSeconds || "60") * 1000;

      addDebugLog(
        `Running fabric command with pattern: create_storybrand_variant`,
      );
      addDebugLog(`Input length: ${input.length} characters`);

      if (input.length > maxLength) {
        addDebugLog(
          `Input truncated from ${input.length} to ${maxLength} characters`,
        );
        input = input.substring(0, maxLength) + "...";
      }

      const fabricProcess = spawn(
        fabricPath,
        ["--pattern", "create_storybrand_variant"],
        {
          stdio: ["pipe", "pipe", "pipe"],
          env: {
            ...process.env,
            PATH: `${process.env.PATH}:/opt/homebrew/bin:/usr/local/bin`,
          },
        },
      );

      let output = "";
      let errorOutput = "";

      fabricProcess.stdout.on("data", (data) => {
        output += data.toString();
      });

      fabricProcess.stderr.on("data", (data) => {
        errorOutput += data.toString();
        addDebugLog(`Fabric stderr: ${data.toString()}`);
      });

      fabricProcess.on("close", (code) => {
        addDebugLog(`Fabric process exited with code: ${code}`);
        if (code === 0 && output.trim()) {
          addDebugLog(
            `Analysis completed successfully. Output length: ${output.length}`,
          );
          resolve(output.trim());
        } else {
          const error = errorOutput || `Process exited with code ${code}`;
          addDebugLog(`Fabric command failed: ${error}`);
          reject(new Error(error));
        }
      });

      fabricProcess.on("error", (error) => {
        addDebugLog(`Fabric process error: ${error.message}`);
        reject(error);
      });

      fabricProcess.stdin.write(input);
      fabricProcess.stdin.end();

      setTimeout(() => {
        fabricProcess.kill();
        addDebugLog("Fabric command timed out");
        reject(new Error("Fabric command timed out"));
      }, timeout);
    });
  };

  const parseAnalysisOutput = (
    analysis: string,
    originalInput: string,
    contentType: string,
  ): StoryBrandAnalysis => {
    addDebugLog("Parsing StoryBrand analysis output");

    // Extract SB7 framework elements
    const characterMatch = analysis.match(/character:?\s*(.*?)(?:\n|$)/i);
    const problemMatch = analysis.match(/problem:?\s*(.*?)(?:\n|$)/i);
    const guideMatch = analysis.match(/guide:?\s*(.*?)(?:\n|$)/i);
    const planMatch = analysis.match(/plan:?\s*(.*?)(?:\n|$)/i);
    const ctaMatch = analysis.match(/call.to.action:?\s*(.*?)(?:\n|$)/i);
    const successMatch = analysis.match(/success:?\s*(.*?)(?:\n|$)/i);
    const failureMatch = analysis.match(/failure:?\s*(.*?)(?:\n|$)/i);

    // Extract recommendations
    const recommendationsMatch = analysis.match(
      /recommendations?:?\s*([\s\S]*?)(?:\n\n|\n#|$)/i,
    );
    const recommendations = recommendationsMatch
      ? recommendationsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.substring(1).trim())
      : [];

    return {
      content: originalInput,
      analysis,
      timestamp: new Date(),
      contentType: contentType as any,
      originalInput,
      character: characterMatch ? characterMatch[1].trim() : undefined,
      problem: problemMatch ? problemMatch[1].trim() : undefined,
      guide: guideMatch ? guideMatch[1].trim() : undefined,
      plan: planMatch ? planMatch[1].trim() : undefined,
      callToAction: ctaMatch ? ctaMatch[1].trim() : undefined,
      success: successMatch ? successMatch[1].trim() : undefined,
      failure: failureMatch ? failureMatch[1].trim() : undefined,
      recommendations,
    };
  };

  const exportToSpreadsheet = async (data: StoryBrandAnalysis) => {
    try {
      addDebugLog("Starting CSV export for StoryBrand analysis");
      const exportPath =
        preferences.exportPath || join(environment.supportPath, "exports");

      if (!existsSync(exportPath)) {
        mkdirSync(exportPath, { recursive: true });
        addDebugLog(`Created export directory: ${exportPath}`);
      }

      const csvHeaders = [
        "Date",
        "Content Type",
        "Pattern Type",
        "Character",
        "Problem",
        "Guide",
        "Plan",
        "Call to Action",
        "Success",
        "Failure",
        "Recommendations",
        "Full Analysis",
        "Original Content",
      ];

      const csvRow = [
        data.timestamp.toISOString(),
        data.contentType,
        "create_storybrand_variant",
        `"${data.character?.replace(/"/g, '""') || ""}"`,
        `"${data.problem?.replace(/"/g, '""') || ""}"`,
        `"${data.guide?.replace(/"/g, '""') || ""}"`,
        `"${data.plan?.replace(/"/g, '""') || ""}"`,
        `"${data.callToAction?.replace(/"/g, '""') || ""}"`,
        `"${data.success?.replace(/"/g, '""') || ""}"`,
        `"${data.failure?.replace(/"/g, '""') || ""}"`,
        `"${data.recommendations?.join("; ").replace(/"/g, '""') || ""}"`,
        `"${data.analysis.replace(/"/g, '""')}"`,
        `"${data.originalInput.replace(/"/g, '""')}"`,
      ];

      const filename = `storybrand-analysis-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      const filepath = join(exportPath, filename);

      let csvContent = "";
      if (!existsSync(filepath)) {
        csvContent = csvHeaders.join(",") + "\n";
      }
      csvContent += csvRow.join(",") + "\n";

      writeFileSync(filepath, csvContent, { flag: "a" });
      addDebugLog(`CSV exported to: ${filepath}`);

      await showToast({
        style: Toast.Style.Success,
        title: "Export Successful",
        message: `Saved to ${filename}`,
      });
    } catch (error: any) {
      addDebugLog(`CSV export error: ${error.message}`);
      await showToast({
        style: Toast.Style.Failure,
        title: "Export Failed",
        message: error.message,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!searchText.trim()) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Please enter landing page content to analyze",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    addDebugLog(
      `Starting StoryBrand analysis for input: ${searchText.substring(
        0,
        100,
      )}...`,
    );

    try {
      const analysis = await runFabricCommand(searchText);
      const parsedAnalysis = parseAnalysisOutput(analysis, searchText, "text");
      setStoryBrandAnalysis(parsedAnalysis);

      await showToast({
        style: Toast.Style.Success,
        title: "Analysis Complete",
        message: "StoryBrand analysis completed successfully",
      });
    } catch (error: any) {
      addDebugLog(`Analysis failed: ${error.message}`);
      setError(error.message);
      await showToast({
        style: Toast.Style.Failure,
        title: "Analysis Failed",
        message: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClipboard = async () => {
    try {
      const clipboardText = await Clipboard.readText();
      if (clipboardText) {
        setSearchText(clipboardText);
        addDebugLog("Content loaded from clipboard");
      }
    } catch (error: any) {
      addDebugLog(`Clipboard read error: ${error.message}`);
      await showToast({
        style: Toast.Style.Failure,
        title: "Clipboard Error",
        message: error.message,
      });
    }
  };

  if (storyBrandAnalysis) {
    return (
      <Detail
        markdown={`# StoryBrand Framework Analysis Results

${storyBrandAnalysis.analysis}

---

**Analysis completed at:** ${storyBrandAnalysis.timestamp.toLocaleString()}
**Content type:** ${storyBrandAnalysis.contentType}
**Pattern:** create_storybrand_variant

## SB7 Framework Elements:
${
  storyBrandAnalysis.character
    ? `**Character:** ${storyBrandAnalysis.character}`
    : ""
}
${
  storyBrandAnalysis.problem ? `**Problem:** ${storyBrandAnalysis.problem}` : ""
}
${storyBrandAnalysis.guide ? `**Guide:** ${storyBrandAnalysis.guide}` : ""}
${storyBrandAnalysis.plan ? `**Plan:** ${storyBrandAnalysis.plan}` : ""}
${
  storyBrandAnalysis.callToAction
    ? `**Call to Action:** ${storyBrandAnalysis.callToAction}`
    : ""
}
${
  storyBrandAnalysis.success ? `**Success:** ${storyBrandAnalysis.success}` : ""
}
${
  storyBrandAnalysis.failure ? `**Failure:** ${storyBrandAnalysis.failure}` : ""
}
`}
        actions={
          <ActionPanel>
            <Action
              title="Copy Analysis"
              icon={Icon.Clipboard}
              onAction={() => Clipboard.copy(storyBrandAnalysis.analysis)}
            />
            <Action
              title="Export to Csv"
              icon={Icon.Document}
              onAction={() => exportToSpreadsheet(storyBrandAnalysis)}
            />
            <Action
              title="Analyze New Content"
              icon={Icon.ArrowClockwise}
              onAction={() => {
                setStoryBrandAnalysis(null);
                setSearchText("");
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
      isLoading={isLoading}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Enter landing page content to analyze with StoryBrand SB7 framework..."
      throttle
    >
      <List.Item
        title="Create StoryBrand Variant"
        subtitle="Apply StoryBrand SB7 framework to landing page content for conversion optimization"
        icon={Icon.Document}
        actions={
          <ActionPanel>
            <Action
              title="Analyze Content"
              icon={Icon.Checkmark}
              onAction={handleAnalyze}
            />
            <Action
              title="Paste from Clipboard"
              icon={Icon.Clipboard}
              onAction={handleClipboard}
              shortcut={{ modifiers: ["cmd"], key: "v" }}
            />
          </ActionPanel>
        }
      />

      {error && (
        <List.Item title="Error" subtitle={error} icon={Icon.ExclamationMark} />
      )}

      {debugLogs.length > 0 && (
        <List.Section title="Debug Logs">
          {debugLogs.slice(-5).map((log, index) => (
            <List.Item key={index} title={log} icon={Icon.Dot} />
          ))}
        </List.Section>
      )}
    </List>
  );
}
