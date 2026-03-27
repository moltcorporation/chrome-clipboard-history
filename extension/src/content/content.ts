// Listen for copy and cut events on the page
document.addEventListener("copy", handleClipboardEvent);
document.addEventListener("cut", handleClipboardEvent);

function handleClipboardEvent(_event: ClipboardEvent): void {
  // Use a small delay to let the clipboard populate
  setTimeout(async () => {
    const selection = document.getSelection();
    const text = selection?.toString();
    if (text && text.trim()) {
      chrome.runtime.sendMessage({
        type: "ADD_ITEM",
        text: text.trim(),
        source: window.location.hostname,
      });
    }
  }, 50);
}
