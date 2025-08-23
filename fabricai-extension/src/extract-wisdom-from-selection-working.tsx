import { showHUD, Clipboard, getPreferenceValues } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface Preferences {
  fabricInstallPath?: string;
  maxContentLength?: string;
  timeoutSeconds?: string;
}

interface Arguments {
  text?: string;
}

export default async function ExtractWisdomFromSelection(props: { arguments: Arguments }) {
  const { text } = props.arguments;
  const preferences = getPreferenceValues<Preferences>();

  try {
    // Get content from argument or clipboard
    let content = text;
    if (!content) {
      content = await Clipboard.readText();
    }

    if (!content || !content.trim()) {
      await showHUD("❌ No text found to extract wisdom from");
      return;
    }

    await showHUD("🔄 Extracting wisdom...");

    // Check if Fabric AI is installed
    const fabricPath = preferences.fabricInstallPath || "fabric";
    try {
      await execAsync(`${fabricPath} --version`);
    } catch {
      await showHUD("❌ Fabric AI not found. Install with: pip install fabric-ai");
      return;
    }

    // Prepare content
    const maxLength = parseInt(preferences.maxContentLength || "10000");
    const processedContent = content.length > maxLength 
      ? content.substring(0, maxLength) + "..."
      : content;

    // Execute Fabric AI
    const timeout = parseInt(preferences.timeoutSeconds || "30") * 1000;
    const command = `echo ${JSON.stringify(processedContent)} | ${fabricPath} --pattern extract_wisdom`;
    
    const { stdout, stderr } = await execAsync(command, { 
      timeout,
      maxBuffer: 1024 * 1024 // 1MB buffer
    });

    if (stderr && !stdout) {
      await showHUD(`❌ Fabric AI error: ${stderr.substring(0, 100)}`);
      return;
    }

    const wisdom = stdout.trim();
    if (!wisdom) {
      await showHUD("❌ No wisdom extracted from content");
      return;
    }

    // Copy wisdom to clipboard
    await Clipboard.copy(wisdom);
    await showHUD("✅ Wisdom extracted and copied to clipboard!");

  } catch (error: any) {
    const errorMessage = error.message || "Unknown error occurred";
    await showHUD(`❌ Error: ${errorMessage.substring(0, 100)}`);
  }
}