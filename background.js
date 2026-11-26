// Toolbar icon toggles Reels mode on the current X tab.
chrome.action.onClicked.addListener((tab) => {
  if (tab.id != null) chrome.tabs.sendMessage(tab.id, { type: 'xi-toggle' }).catch(() => {});
});
