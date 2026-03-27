interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
  pinned: boolean;
  source?: string;
}

const searchInput = document.getElementById("search") as HTMLInputElement;
const itemsList = document.getElementById("items-list") as HTMLDivElement;
const emptyState = document.getElementById("empty-state") as HTMLDivElement;
const itemCount = document.getElementById("item-count") as HTMLSpanElement;
const clearAllBtn = document.getElementById("clear-all") as HTMLButtonElement;

let allItems: ClipboardItem[] = [];

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

function renderItems(items: ClipboardItem[]): void {
  // Separate pinned and unpinned
  const pinned = items.filter((i) => i.pinned);
  const unpinned = items.filter((i) => !i.pinned);
  const sorted = [...pinned, ...unpinned];

  if (sorted.length === 0) {
    emptyState.classList.remove("hidden");
    // Clear any existing items but keep empty state
    const existingItems = itemsList.querySelectorAll(".clip-item");
    existingItems.forEach((el) => el.remove());
    itemCount.textContent = "0 items";
    return;
  }

  emptyState.classList.add("hidden");

  const fragment = document.createDocumentFragment();
  for (const item of sorted) {
    const el = document.createElement("div");
    el.className = `clip-item${item.pinned ? " pinned" : ""}`;
    el.dataset.id = item.id;

    el.innerHTML = `
      <div class="clip-text">${escapeHtml(truncateText(item.text))}</div>
      <div class="clip-meta">
        <span class="clip-time">${timeAgo(item.timestamp)}</span>
        <div class="clip-actions">
          <button class="btn-pin${item.pinned ? " pin-active" : ""}" title="${item.pinned ? "Unpin" : "Pin"}" data-action="pin" data-id="${item.id}">&#9733;</button>
          <button class="btn-delete" title="Delete" data-action="delete" data-id="${item.id}">&times;</button>
        </div>
      </div>
    `;

    // Click on the item text to copy
    el.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.closest(".clip-actions")) return;
      copyToClipboard(item.text, el);
    });

    fragment.appendChild(el);
  }

  // Clear and re-render
  const existingItems = itemsList.querySelectorAll(".clip-item");
  existingItems.forEach((el) => el.remove());
  itemsList.appendChild(fragment);

  itemCount.textContent = `${items.length} item${items.length !== 1 ? "s" : ""}`;
}

async function copyToClipboard(text: string, el: HTMLElement): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    el.classList.add("copied");
    setTimeout(() => el.classList.remove("copied"), 600);
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    el.classList.add("copied");
    setTimeout(() => el.classList.remove("copied"), 600);
  }
}

async function loadItems(): Promise<void> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_ITEMS" }, (response) => {
      allItems = response?.items || [];
      renderItems(allItems);
      resolve();
    });
  });
}

function filterItems(query: string): void {
  if (!query) {
    renderItems(allItems);
    return;
  }
  const lower = query.toLowerCase();
  const filtered = allItems.filter((item) => item.text.toLowerCase().includes(lower));
  renderItems(filtered);
}

// Event: search
searchInput.addEventListener("input", () => {
  filterItems(searchInput.value);
});

// Event: pin/delete buttons via delegation
itemsList.addEventListener("click", async (e) => {
  const target = e.target as HTMLElement;
  const button = target.closest("[data-action]") as HTMLElement | null;
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;
  if (!id) return;

  if (action === "pin") {
    const response = await new Promise<{ success: boolean; error?: string }>((resolve) => {
      chrome.runtime.sendMessage({ type: "TOGGLE_PIN", id }, resolve);
    });
    if (!response.success && response.error) {
      // Brief flash to indicate failure — could be max pins
      button.style.color = "#e55";
      setTimeout(() => (button.style.color = ""), 500);
    }
    await loadItems();
    filterItems(searchInput.value);
  } else if (action === "delete") {
    await new Promise<void>((resolve) => {
      chrome.runtime.sendMessage({ type: "DELETE_ITEM", id }, () => resolve());
    });
    await loadItems();
    filterItems(searchInput.value);
  }
});

// Event: clear all
clearAllBtn.addEventListener("click", async () => {
  await new Promise<void>((resolve) => {
    chrome.runtime.sendMessage({ type: "CLEAR_ALL" }, () => resolve());
  });
  await loadItems();
  filterItems(searchInput.value);
});

// Load on open
document.addEventListener("DOMContentLoaded", () => {
  loadItems();
  searchInput.focus();
});
