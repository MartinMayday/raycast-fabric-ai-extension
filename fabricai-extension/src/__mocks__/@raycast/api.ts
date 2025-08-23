// Mock implementation of @raycast/api for testing

export const LocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  allItems: jest.fn(),
  clear: jest.fn(),
};

export const showToast = jest.fn();
export const showHUD = jest.fn();
export const popToRoot = jest.fn();
export const closeMainWindow = jest.fn();

// Mock other commonly used Raycast API components
export const List = {
  Item: jest.fn(),
  Section: jest.fn(),
  Dropdown: jest.fn(),
};

export const ActionPanel = jest.fn();
export const Action = jest.fn();
export const Form = jest.fn();
export const Detail = jest.fn();

// Mock Toast enum
export const Toast = {
  Style: {
    Success: "success",
    Failure: "failure",
    Animated: "animated",
  },
};

// Mock Icon enum
export const Icon = {
  Checkmark: "checkmark",
  XMarkCircle: "xmark.circle",
  Clock: "clock",
  Document: "document",
  Folder: "folder",
  Trash: "trash",
  Download: "download",
  Upload: "upload",
  MagnifyingGlass: "magnifyingglass",
  Plus: "plus",
  Minus: "minus",
  Pencil: "pencil",
  Copy: "copy",
  ExternalLink: "arrow.up.right.square",
};

// Mock Color enum
export const Color = {
  PrimaryText: "#000000",
  SecondaryText: "#666666",
  Red: "#FF0000",
  Green: "#00FF00",
  Blue: "#0000FF",
  Yellow: "#FFFF00",
  Orange: "#FFA500",
  Purple: "#800080",
};

// Mock Keyboard enum
export const Keyboard = {
  Shortcut: {
    Common: {
      Copy: { modifiers: ["cmd"], key: "c" },
      Paste: { modifiers: ["cmd"], key: "v" },
      Remove: { modifiers: ["cmd"], key: "backspace" },
      Refresh: { modifiers: ["cmd"], key: "r" },
    },
  },
};

// Mock environment
export const environment = {
  isDevelopment: false,
  raycastVersion: "1.30.0",
  extensionName: "test-extension",
  commandName: "test-command",
  supportPath: "/tmp/test-support",
  assetsPath: "/tmp/test-assets",
};

// Mock preferences
export const getPreferenceValues = jest.fn(() => ({}));

// Mock clipboard
export const Clipboard = {
  readText: jest.fn(),
  read: jest.fn(),
  paste: jest.fn(),
  copy: jest.fn(),
  clear: jest.fn(),
};

// Mock AI
export const AI = {
  ask: jest.fn(),
  chat: jest.fn(),
};

export default {
  LocalStorage,
  showToast,
  showHUD,
  popToRoot,
  closeMainWindow,
  List,
  ActionPanel,
  Action,
  Form,
  Detail,
  Toast,
  Icon,
  Color,
  Keyboard,
  environment,
  getPreferenceValues,
  Clipboard,
  AI,
};
