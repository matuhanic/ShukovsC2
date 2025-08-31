// common.js
// Scripts in this file are included in both the IDE and runtime.

// Utility for safe JSON parsing
function safeParseJSON(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    return null;
  }
}