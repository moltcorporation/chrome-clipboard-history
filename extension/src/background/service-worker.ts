interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
  pinned: boolean;
  source?: string;
}

const MAX_ITEMS = 25;
const MAX_PINNED = 5;

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function getItems(): Promise<ClipboardItem[]> {
  const result = await chrome.storage.local.get("clipboardItems");
  return result.clipboardItems || [];
}

async function saveItems(items: ClipboardItem[]): Promise<void> {
  await chrome.storage.local.set({ clipboardItems: items });
}

async function addItem(text: string, source?: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  const items = await getItems();

  // Don't add duplicates of the most recent item
  if (items.length > 0 && items[0].text === trimmed) return;

  // Remove any existing duplicate (move it to top instead)
  const filtered = items.filter((item) => item.text !== trimmed);

  const newItem: ClipboardItem = {
    id: generateId(),
    text: trimmed,
    timestamp: Date.now(),
    pinned: false,
    source,
  };

  const pinned = filtered.filter((item) => item.pinned);
  const unpinned = filtered.filter((item) => !item.pinned);

  // Evict oldest unpinned items if at capacity
  while (pinned.length + unpinned.length >= MAX_ITEMS) {
    unpinned.pop();
  }

  await saveItems([newItem, ...pinned, ...unpinned]);
}

async function togglePin(id: string): Promise<{ success: boolean; error?: string }> {
  const items = await getItems();
  const item = items.find((i) => i.id === id);
  if (!item) return { success: false, error: "Item not found" };

  if (!item.pinned) {
    const pinnedCount = items.filter((i) => i.pinned).length;
    if (pinnedCount >= MAX_PINNED) {
      return { success: false, error: "Maximum 5 pinned items" };
    }
  }

  item.pinned = !item.pinned;
  await saveItems(items);
  return { success: true };
}

async function deleteItem(id: string): Promise<void> {
  const items = await getItems();
  await saveItems(items.filter((i) => i.id !== id));
}

async function clearAll(): Promise<void> {
  const items = await getItems();
  // Keep pinned items
  await saveItems(items.filter((i) => i.pinned));
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Clipboard History extension installed");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const handle = async () => {
    switch (message.type) {
      case "ADD_ITEM": {
        await addItem(message.text, message.source);
        sendResponse({ success: true });
        break;
      }
      case "GET_ITEMS": {
        const items = await getItems();
        sendResponse({ items });
        break;
      }
      case "TOGGLE_PIN": {
        const result = await togglePin(message.id);
        sendResponse(result);
        break;
      }
      case "DELETE_ITEM": {
        await deleteItem(message.id);
        sendResponse({ success: true });
        break;
      }
      case "CLEAR_ALL": {
        await clearAll();
        sendResponse({ success: true });
        break;
      }
      default:
        sendResponse({ error: "Unknown message type" });
    }
  };

  handle();
  return true; // Keep message channel open for async response
});
