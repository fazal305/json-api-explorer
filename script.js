const requestForm = document.querySelector("#requestForm");
const apiUrlInput = document.querySelector("#apiUrl");
const fetchButton = document.querySelector("#fetchButton");
const searchInput = document.querySelector("#searchInput");
const copyButton = document.querySelector("#copyButton");
const downloadButton = document.querySelector("#downloadButton");
const clearButton = document.querySelector("#clearButton");
const statusMessage = document.querySelector("#statusMessage");
const jsonPanel = document.querySelector("#jsonPanel");
const treePanel = document.querySelector("#treePanel");
const matchCount = document.querySelector("#matchCount");
const responseSize = document.querySelector("#responseSize");

let currentJson = null;
let currentJsonText = "";

requestForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await fetchJson();
});

searchInput.addEventListener("input", renderResponse);
copyButton.addEventListener("click", copyJson);
downloadButton.addEventListener("click", downloadJson);
clearButton.addEventListener("click", resetExplorer);

async function fetchJson() {
  const apiUrl = apiUrlInput.value.trim();

  if (!isValidHttpUrl(apiUrl)) {
    showStatus("Enter a valid HTTP or HTTPS API URL.", "error");
    return;
  }

  setLoading(true);
  showStatus("Fetching JSON response...", "");

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      throw new Error("This endpoint responded, but it did not return JSON.");
    }

    currentJson = await response.json();
    currentJsonText = JSON.stringify(currentJson, null, 2);

    setResultControls(true);
    renderResponse();
    showStatus("JSON loaded successfully.", "success");
  } catch (error) {
    currentJson = null;
    currentJsonText = "";
    setResultControls(false);
    jsonPanel.textContent = "No JSON response available.";
    treePanel.innerHTML = '<p class="empty-state">Unable to build a tree view.</p>';
    matchCount.textContent = "0 matches";
    responseSize.textContent = "0 KB";
    showStatus(error.message || "Network error. Please try another API URL.", "error");
  } finally {
    setLoading(false);
  }
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function setLoading(isLoading) {
  fetchButton.disabled = isLoading;
  fetchButton.textContent = isLoading ? "Fetching..." : "Fetch JSON";
}

function setResultControls(isEnabled) {
  searchInput.disabled = !isEnabled;
  copyButton.disabled = !isEnabled;
  downloadButton.disabled = !isEnabled;
}

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = type ? `status-message ${type}` : "status-message";
}

function renderResponse() {
  if (currentJson === null) {
    return;
  }

  const searchTerm = searchInput.value.trim();
  jsonPanel.innerHTML = highlightMatches(escapeHtml(currentJsonText), searchTerm);
  treePanel.innerHTML = "";
  treePanel.appendChild(createTreeNode("response", currentJson, searchTerm, true));

  const totalMatches = countMatches(currentJson, searchTerm);
  matchCount.textContent = `${totalMatches} ${totalMatches === 1 ? "match" : "matches"}`;
  responseSize.textContent = formatBytes(new Blob([currentJsonText]).size);
}

function createTreeNode(key, value, searchTerm, isRoot = false) {
  const node = document.createElement("div");
  node.className = isRoot ? "tree-node root-node" : "tree-node";

  const row = document.createElement("div");
  row.className = "tree-row";

  const valueType = getValueType(value);
  const keyElement = document.createElement("span");
  keyElement.className = "tree-key";
  keyElement.innerHTML = highlightMatches(escapeHtml(`${key}:`), searchTerm);

  if (valueType === "object" || valueType === "array") {
    const toggleButton = document.createElement("button");
    toggleButton.className = "node-toggle";
    toggleButton.type = "button";
    toggleButton.setAttribute("aria-label", `Collapse ${key}`);
    toggleButton.textContent = "−";

    const summary = document.createElement("span");
    summary.className = "tree-summary";
    summary.textContent = getCollectionSummary(value, valueType);

    const children = document.createElement("div");
    children.className = "tree-children";

    Object.entries(value).forEach(([childKey, childValue]) => {
      children.appendChild(createTreeNode(childKey, childValue, searchTerm));
    });

    toggleButton.addEventListener("click", () => {
      const isCollapsed = children.classList.toggle("collapsed");
      toggleButton.textContent = isCollapsed ? "+" : "−";
      toggleButton.setAttribute("aria-label", `${isCollapsed ? "Expand" : "Collapse"} ${key}`);
    });

    row.append(toggleButton, keyElement, summary);
    node.append(row, children);
    return node;
  }

  const spacer = document.createElement("span");
  spacer.className = "node-toggle placeholder";

  const valueElement = document.createElement("span");
  valueElement.className = `tree-value ${valueType}`;
  valueElement.innerHTML = highlightMatches(escapeHtml(formatPrimitive(value)), searchTerm);

  row.append(spacer, keyElement, valueElement);
  node.appendChild(row);
  return node;
}

function getValueType(value) {
  if (Array.isArray(value)) {
    return "array";
  }

  if (value === null) {
    return "null";
  }

  return typeof value;
}

function getCollectionSummary(value, valueType) {
  const size = valueType === "array" ? value.length : Object.keys(value).length;
  const label = valueType === "array" ? "items" : "keys";
  return `${valueType === "array" ? "Array" : "Object"} • ${size} ${label}`;
}

function formatPrimitive(value) {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (value === null) {
    return "null";
  }

  return String(value);
}

function highlightMatches(text, searchTerm) {
  if (!searchTerm) {
    return text;
  }

  const safeSearchTerm = escapeRegExp(searchTerm);
  const matcher = new RegExp(`(${safeSearchTerm})`, "gi");
  return text.replace(matcher, "<mark>$1</mark>");
}

function countMatches(value, searchTerm) {
  if (!searchTerm) {
    return 0;
  }

  let total = 0;
  const normalizedSearch = searchTerm.toLowerCase();

  function walk(item, key = "") {
    if (key.toLowerCase().includes(normalizedSearch)) {
      total += 1;
    }

    if (Array.isArray(item)) {
      item.forEach((child, index) => walk(child, String(index)));
      return;
    }

    if (item !== null && typeof item === "object") {
      Object.entries(item).forEach(([childKey, childValue]) => walk(childValue, childKey));
      return;
    }

    if (String(item).toLowerCase().includes(normalizedSearch)) {
      total += 1;
    }
  }

  walk(value);
  return total;
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(currentJsonText);
    showStatus("Full JSON response copied to clipboard.", "success");
  } catch {
    showStatus("Copy failed. Clipboard access may require HTTPS or localhost.", "error");
  }
}

function downloadJson() {
  const blob = new Blob([currentJsonText], { type: "application/json" });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = "api-response.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(downloadUrl);

  showStatus("JSON file downloaded.", "success");
}

function resetExplorer() {
  currentJson = null;
  currentJsonText = "";
  apiUrlInput.value = "";
  searchInput.value = "";
  jsonPanel.textContent = "Enter an API URL and fetch JSON to begin.";
  treePanel.innerHTML = '<p class="empty-state">No JSON loaded yet.</p>';
  matchCount.textContent = "0 matches";
  responseSize.textContent = "0 KB";
  setResultControls(false);
  showStatus("", "");
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  return `${(bytes / 1024).toFixed(1)} KB`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
