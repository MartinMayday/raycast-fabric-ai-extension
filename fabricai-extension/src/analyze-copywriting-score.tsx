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

interface CopywritingAnalysis {
  content: string;
  analysis: string;
  timestamp: Date;
  contentType: "text" | "url" | "clipboard";
  originalInput: string;
  headlineScore?: number;
  persuasionScore?: number;
  clarityScore?: number;
  overallScore?: number;
  improvements?: string[];
}

export default function AnalyzeCopywritingScore() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copywritingAnalysis, setCopywritingAnalysis] =
    useState<CopywritingAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const preferences = getPreferenceValues<Preferences>();

  React.useEffect(() => {
    addDebugLog("Copywriting Score Analysis extension initialized");
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

      const logFile = join(logsDir, "copywriting-analysis.log");
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
        `Running fabric command with pattern: analyze_copywriting_score`,
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
        ["--pattern", "analyze_copywriting_score"],
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
  ): CopywritingAnalysis => {
    addDebugLog("Parsing copywriting analysis output");

    // Extract scores from the analysis
    const headlineMatch = analysis.match(/headline.*?(\d+)\/10/i);
    const persuasionMatch = analysis.match(/persuasion.*?(\d+)\/10/i);
    const clarityMatch = analysis.match(/clarity.*?(\d+)\/10/i);
    const overallMatch = analysis.match(/overall.*?(\d+)\/10/i);

    // Extract improvements
    const improvementsMatch = analysis.match(
      /improvements?:?\s*([\s\S]*?)(?:\n\n|\n#|$)/i,
    );
    const improvements = improvementsMatch
      ? improvementsMatch[1]
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
      headlineScore: headlineMatch ? parseInt(headlineMatch[1]) : undefined,
      persuasionScore: persuasionMatch
        ? parseInt(persuasionMatch[1])
        : undefined,
      clarityScore: clarityMatch ? parseInt(clarityMatch[1]) : undefined,
      overallScore: overallMatch ? parseInt(overallMatch[1]) : undefined,
      improvements,
    };
  };

  const exportToSpreadsheet = async (data: CopywritingAnalysis) => {
    try {
      addDebugLog("Starting CSV export for copywriting analysis");
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
        "Headline Score",
        "Persuasion Score",
        "Clarity Score",
        "Overall Score",
        "Improvements",
        "Full Analysis",
        "Original Content",
      ];

      const csvRow = [
        data.timestamp.toISOString(),
        data.contentType,
        "analyze_copywriting_score",
        data.headlineScore?.toString() || "",
        data.persuasionScore?.toString() || "",
        data.clarityScore?.toString() || "",
        data.overallScore?.toString() || "",
        `"${data.improvements?.join("; ").replace(/"/g, '""') || ""}"`,
        `"${data.analysis.replace(/"/g, '""')}"`,
        `"${data.originalInput.replace(/"/g, '""')}"`,
      ];

      const filename = `copywriting-analysis-${
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
        message: "Please enter copywriting content to analyze",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    addDebugLog(
      `Starting copywriting analysis for input: ${searchText.substring(
        0,
        100,
      )}...`,
    );

    try {
      const analysis = await runFabricCommand(searchText);
      const parsedAnalysis = parseAnalysisOutput(analysis, searchText, "text");
      setCopywritingAnalysis(parsedAnalysis);

      await showToast({
        style: Toast.Style.Success,
        title: "Analysis Complete",
        message: "Copywriting analysis completed successfully",
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

  if (copywritingAnalysis) {
    return (
      <Detail
        markdown={`# Copywriting Score Analysis Results

${copywritingAnalysis.analysis}

---

**Analysis completed at:** ${copywritingAnalysis.timestamp.toLocaleString()}
**Content type:** ${copywritingAnalysis.contentType}
**Pattern:** analyze_copywriting_score

${
  copywritingAnalysis.headlineScore
    ? `**Headline Score:** ${copywritingAnalysis.headlineScore}/10`
    : ""
}
${
  copywritingAnalysis.persuasionScore
    ? `**Persuasion Score:** ${copywritingAnalysis.persuasionScore}/10`
    : ""
}
${
  copywritingAnalysis.clarityScore
    ? `**Clarity Score:** ${copywritingAnalysis.clarityScore}/10`
    : ""
}
${
  copywritingAnalysis.overallScore
    ? `**Overall Score:** ${copywritingAnalysis.overallScore}/10`
    : ""
}
`}
        actions={
          <ActionPanel>
            <Action
              title="Copy Analysis"
              icon={Icon.Clipboard}
              onAction={() => Clipboard.copy(copywritingAnalysis.analysis)}
            />
            <Action
              title="Export to Csv"
              icon={Icon.Document}
              onAction={() => exportToSpreadsheet(copywritingAnalysis)}
            />
            <Action
              title="Analyze New Content"
              icon={Icon.ArrowClockwise}
              onAction={() => {
                setCopywritingAnalysis(null);
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
      searchBarPlaceholder="Enter copywriting content, headlines, or sales copy to analyze..."
      throttle
    >
      <List.Item
        title="Analyze Copywriting Score"
        subtitle="Analyze copywriting effectiveness with persuasion scoring and improvement suggestions"
        icon={Icon.Pencil}
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
