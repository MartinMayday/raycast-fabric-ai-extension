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

interface CompetitiveAnalysis {
  content: string;
  analysis: string;
  timestamp: Date;
  contentType: "text" | "url" | "clipboard";
  originalInput: string;
  strengths?: string[];
  weaknesses?: string[];
  opportunities?: string[];
  threats?: string[];
  competitiveScore?: number;
  recommendations?: string[];
}

export default function CreateCompetitiveAudit() {
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [competitiveAnalysis, setCompetitiveAnalysis] =
    useState<CompetitiveAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const preferences = getPreferenceValues<Preferences>();

  React.useEffect(() => {
    addDebugLog("Competitive Audit Analysis extension initialized");
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

      const logFile = join(logsDir, "competitive-analysis.log");
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
        `Running fabric command with pattern: create_competitive_audit`,
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
        ["--pattern", "create_competitive_audit"],
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
  ): CompetitiveAnalysis => {
    addDebugLog("Parsing competitive analysis output");

    // Extract SWOT elements
    const strengthsMatch = analysis.match(
      /strengths:?\s*([\s\S]*?)(?:\n\n|\nweaknesses|\nopportunities|\nthreats|$)/i,
    );
    const weaknessesMatch = analysis.match(
      /weaknesses:?\s*([\s\S]*?)(?:\n\n|\nstrengths|\nopportunities|\nthreats|$)/i,
    );
    const opportunitiesMatch = analysis.match(
      /opportunities:?\s*([\s\S]*?)(?:\n\n|\nstrengths|\nweaknesses|\nthreats|$)/i,
    );
    const threatsMatch = analysis.match(
      /threats:?\s*([\s\S]*?)(?:\n\n|\nstrengths|\nweaknesses|\nopportunities|$)/i,
    );

    const strengths = strengthsMatch
      ? strengthsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.substring(1).trim())
      : [];
    const weaknesses = weaknessesMatch
      ? weaknessesMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.substring(1).trim())
      : [];
    const opportunities = opportunitiesMatch
      ? opportunitiesMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.substring(1).trim())
      : [];
    const threats = threatsMatch
      ? threatsMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("-"))
          .map((line) => line.substring(1).trim())
      : [];

    // Extract competitive score
    const scoreMatch = analysis.match(/competitive.*?(\d+)\/10/i);

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
      strengths,
      weaknesses,
      opportunities,
      threats,
      competitiveScore: scoreMatch ? parseInt(scoreMatch[1]) : undefined,
      recommendations,
    };
  };

  const exportToSpreadsheet = async (data: CompetitiveAnalysis) => {
    try {
      addDebugLog("Starting CSV export for competitive analysis");
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
        "Competitive Score",
        "Strengths",
        "Weaknesses",
        "Opportunities",
        "Threats",
        "Recommendations",
        "Full Analysis",
        "Original Content",
      ];

      const csvRow = [
        data.timestamp.toISOString(),
        data.contentType,
        "create_competitive_audit",
        data.competitiveScore?.toString() || "",
        `"${data.strengths?.join("; ").replace(/"/g, '""') || ""}"`,
        `"${data.weaknesses?.join("; ").replace(/"/g, '""') || ""}"`,
        `"${data.opportunities?.join("; ").replace(/"/g, '""') || ""}"`,
        `"${data.threats?.join("; ").replace(/"/g, '""') || ""}"`,
        `"${data.recommendations?.join("; ").replace(/"/g, '""') || ""}"`,
        `"${data.analysis.replace(/"/g, '""')}"`,
        `"${data.originalInput.replace(/"/g, '""')}"`,
      ];

      const filename = `competitive-analysis-${
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
        message: "Please enter competitive content to analyze",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    addDebugLog(
      `Starting competitive analysis for input: ${searchText.substring(
        0,
        100,
      )}...`,
    );

    try {
      const analysis = await runFabricCommand(searchText);
      const parsedAnalysis = parseAnalysisOutput(analysis, searchText, "text");
      setCompetitiveAnalysis(parsedAnalysis);

      await showToast({
        style: Toast.Style.Success,
        title: "Analysis Complete",
        message: "Competitive audit completed successfully",
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

  if (competitiveAnalysis) {
    return (
      <Detail
        markdown={`# Competitive Audit Analysis Results

${competitiveAnalysis.analysis}

---

**Analysis completed at:** ${competitiveAnalysis.timestamp.toLocaleString()}
**Content type:** ${competitiveAnalysis.contentType}
**Pattern:** create_competitive_audit

${
  competitiveAnalysis.competitiveScore
    ? `**Competitive Score:** ${competitiveAnalysis.competitiveScore}/10`
    : ""
}

## SWOT Analysis:
${
  competitiveAnalysis.strengths?.length
    ? `**Strengths:** ${competitiveAnalysis.strengths.join(", ")}`
    : ""
}
${
  competitiveAnalysis.weaknesses?.length
    ? `**Weaknesses:** ${competitiveAnalysis.weaknesses.join(", ")}`
    : ""
}
${
  competitiveAnalysis.opportunities?.length
    ? `**Opportunities:** ${competitiveAnalysis.opportunities.join(", ")}`
    : ""
}
${
  competitiveAnalysis.threats?.length
    ? `**Threats:** ${competitiveAnalysis.threats.join(", ")}`
    : ""
}
`}
        actions={
          <ActionPanel>
            <Action
              title="Copy Analysis"
              icon={Icon.Clipboard}
              onAction={() => Clipboard.copy(competitiveAnalysis.analysis)}
            />
            <Action
              title="Export to Csv"
              icon={Icon.Document}
              onAction={() => exportToSpreadsheet(competitiveAnalysis)}
            />
            <Action
              title="Analyze New Content"
              icon={Icon.ArrowClockwise}
              onAction={() => {
                setCompetitiveAnalysis(null);
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
      searchBarPlaceholder="Enter competitive landing page content to analyze with SWOT framework..."
      throttle
    >
      <List.Item
        title="Create Competitive Audit"
        subtitle="Perform SWOT analysis and competitive intelligence on landing pages"
        icon={Icon.ArrowClockwise}
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
