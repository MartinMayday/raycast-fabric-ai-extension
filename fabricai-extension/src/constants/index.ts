// Constants for the Extract Wisdom extension

export const DEFAULT_CONFIG = {
  maxContentLength: 10000,
  timeoutSeconds: 30,
  historyLimit: 10,
  fabricPattern: "extract_wisdom",
} as const;

export const ERROR_MESSAGES = {
  NO_INPUT: "No input provided",
  INPUT_TOO_LONG:
    "Input too long. Please keep content under {limit} characters",
  FABRIC_NOT_FOUND: "FabricAI not found. Please install FabricAI first",
  CONFIGURATION_INVALID: "Invalid configuration. Please check your settings",
  EXTRACTION_FAILED: "Failed to extract wisdom. Please try again",
  NETWORK_ERROR: "Network error. Please check your connection",
  TIMEOUT_ERROR: "Request timed out. Please try again",
  UNKNOWN_ERROR: "An unknown error occurred",
} as const;

export const SUCCESS_MESSAGES = {
  WISDOM_EXTRACTED: "Wisdom extracted successfully!",
  CONFIGURATION_SAVED: "Configuration saved successfully",
  HISTORY_CLEARED: "History cleared successfully",
  HISTORY_EXPORTED: "History exported successfully",
} as const;

export const STORAGE_KEYS = {
  HISTORY: "extract_wisdom_history",
  CONFIG: "fabric_config",
} as const;
