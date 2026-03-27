interface ClipboardItem {
  id: string;
  text: string;
  timestamp: number;
  pinned: boolean;
  source?: string;
  category?: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
}

interface ProStatus {
  isProActive: boolean;
  proLicense?: string;
  lastChecked?: number;
}

const MAX_ITEMS = 25;
const MAX_PINNED = 5;
const LICENSE_CHECK_INTERVAL = 60 * 60 * 1000; // 1 hour
const API_BASE_URL = "https://chrome-clipboard-history-moltcorporation.vercel.app";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function getProStatus(): Promise<ProStatus> {
  const result = await chrome.storage.local.get(["proStatus"]);
  return result.proStatus || { isProActive: false };
}

async function setProStatus(status: ProStatus): Promise<void> {
  await chrome.storage.local.set({ proStatus: status });
}

async function validateLicense(proLicense: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/license/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proLicense }),
    });

    if (!response.ok) return false;

    const data = await response.json();
    return data.isValid === true;
  } catch (error) {
    console.error("License validation error:", error);
    return false;
  }
}

async function checkProLicense(): Promise<void> {
  const proStatus = await getProStatus();

  if (!proStatus.proLicense) return;

  // Only check periodically to avoid excessive API calls
  const now = Date.now();
  if (proStatus.lastChecked && now - proStatus.lastChecked < LICENSE_CHECK_INTERVAL) {
    return;
  }

  const isValid = await validateLicense(proStatus.proLicense);
  await setProStatus({
    ...proStatus,
    isProActive: isValid,
    lastChecked: now,
  });
}

async function getItems(): Promise<ClipboardItem[]> {
  const result = await chrome.storage.local.get("clipboardItems");
  return result.clipboardItems || [];
}

async function saveItems(items: ClipboardItem[]): Promise<void> {
  await chrome.storage.local.set({ clipboardItems: items });
}

async function addItem(text: string, source?: string, category?: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return;

  const items = await getItems();
  const proStatus = await getProStatus();

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
    category: category || undefined,
  };

  const pinned = filtered.filter((item) => item.pinned);
  const unpinned = filtered.filter((item) => !item.pinned);

  // For free users, enforce max items limit. Pro users get unlimited.
  const maxItemsLimit = proStatus.isProActive ? Infinity : MAX_ITEMS;
  while (pinned.length + unpinned.length >= maxItemsLimit) {
    unpinned.pop();
  }

  const newItems = [newItem, ...pinned, ...unpinned];
  await saveItems(newItems);

  // If Pro, sync to server
  if (proStatus.isProActive && proStatus.proLicense) {
    try {
      await fetch(`${API_BASE_URL}/api/user/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proLicense: proStatus.proLicense,
          clipboardItems: newItems,
        }),
      });
    } catch (error) {
      console.error("Sync error:", error);
      // Continue even if sync fails
    }
  }
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

async function getTemplates(): Promise<Template[]> {
  const result = await chrome.storage.local.get("templates");
  return result.templates || [];
}

async function saveTemplates(templates: Template[]): Promise<void> {
  await chrome.storage.local.set({ templates });
}

async function addTemplate(name: string, content: string): Promise<{ success: boolean; error?: string }> {
  const proStatus = await getProStatus();

  if (!proStatus.isProActive) {
    return { success: false, error: "Templates require Pro subscription" };
  }

  const templates = await getTemplates();
  const newTemplate: Template = {
    id: generateId(),
    name,
    content,
  };

  templates.push(newTemplate);
  await saveTemplates(templates);

  // Sync to server
  if (proStatus.proLicense) {
    try {
      await fetch(`${API_BASE_URL}/api/user/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proLicense: proStatus.proLicense,
          templates,
        }),
      });
    } catch (error) {
      console.error("Sync error:", error);
    }
  }

  return { success: true };
}

async function deleteTemplate(id: string): Promise<void> {
  const templates = await getTemplates();
  const filtered = templates.filter((t) => t.id !== id);
  await saveTemplates(filtered);
}

chrome.runtime.onInstalled.addListener(() => {
  console.log("Clipboard History extension installed");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const handle = async () => {
    switch (message.type) {
      case "ADD_ITEM": {
        await addItem(message.text, message.source, message.category);
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
      case "CHECK_PRO_LICENSE": {
        await checkProLicense();
        const proStatus = await getProStatus();
        sendResponse({ isPro: proStatus.isProActive });
        break;
      }
      case "SET_PRO_LICENSE": {
        if (message.proLicense) {
          const isValid = await validateLicense(message.proLicense);
          if (isValid) {
            await setProStatus({
              isProActive: true,
              proLicense: message.proLicense,
              lastChecked: Date.now(),
            });
            sendResponse({ success: true });
          } else {
            sendResponse({ success: false, error: "Invalid license" });
          }
        } else {
          sendResponse({ success: false, error: "License required" });
        }
        break;
      }
      case "GET_PRO_STATUS": {
        const proStatus = await getProStatus();
        sendResponse(proStatus);
        break;
      }
      case "ADD_TEMPLATE": {
        const result = await addTemplate(message.name, message.content);
        sendResponse(result);
        break;
      }
      case "GET_TEMPLATES": {
        const templates = await getTemplates();
        sendResponse({ templates });
        break;
      }
      case "DELETE_TEMPLATE": {
        await deleteTemplate(message.id);
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
