import { showHUD, Clipboard, getSelectedText, showToast, Toast } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface Arguments {
  text?: string;
}

export default async function ExtractWisdomFromSelectionSimple(props: { arguments: Arguments }) {
  try {
    // Get text from selection or argument
    let text = props.arguments.text;
    
    if (!text) {
      try {
        text = await getSelectedText();
      } catch {
        // If no selection, try clipboard
        text = await Clipboard.readText();
      }
    }

    if (!text || !text.trim()) {
      await showHUD("❌ No text found to extract wisdom from");
      return;
    }

    if (text.length > 50000) {
      await showHUD("❌ Text too long (max 50,000 characters)");
      return;
    }

    await showHUD("🧠 Extracting wisdom...");

    // Check if Fabric AI is installed
    try {
      await execAsync("fabric --version");
    } catch {
      await showHUD("❌ Fabric AI not installed. Please install it first.");
      return;
    }

    // Execute Fabric AI
    const command = `echo ${JSON.stringify(text)} | fabric --pattern extract_wisdom`;
    const { stdout } = await execAsync(command, { timeout: 30000 });

    if (!stdout.trim()) {
      await showHUD("❌ No wisdom extracted. Try different content.");
      return;
    }

    // Copy wisdom to clipboard
    await Clipboard.copy(stdout.trim());
    await showHUD("✅ Wisdom extracted and copied to clipboard!");

  } catch (error: any) {
    console.error("Error extracting wisdom:", error);
    const errorMessage = error.message || "Unknown error occurred";
    
    if (errorMessage.includes("timeout")) {
      await showHUD("❌ Request timed out. Try with shorter content.");
    } else if (errorMessage.includes("fabric")) {
      await showHUD("❌ Fabric AI error. Check installation.");
    } else {
      await showHUD(`❌ Error: ${errorMessage.substring(0, 50)}`);
    }
  }
}