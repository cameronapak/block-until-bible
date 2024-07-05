let breakEndTime = null;
let hasReadBible = false;
const allowedWebsites = [
  "bible.com",
  "www.jointhejourney.com",
  "biblebot.dev",
  "soulrest.melos.church",
  "huggingface.co/chat",
  "faith.tools",
];

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  const url = new URL(details.url);
  const currentTime = new Date().getTime();

  if (breakEndTime && currentTime < breakEndTime) {
    return; // Allow navigation during the break period
  }

  if (!hasReadBible && details.frameId === 0 && !allowedWebsites.includes(url.hostname)) {
    chrome.storage.local.set({ originalUrl: details.url }, function () {
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("block.html") });
    });
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "confirmBibleReading":
      hasReadBible = true;
      chrome.storage.local.get("originalUrl", function (data) {
        chrome.tabs.update(sender.tab.id, { url: data.originalUrl });
      });
      break;
    case "startBreak":
      breakEndTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
      chrome.tabs.update(sender.tab.id, { url: sender.tab.url });
      break;
  }
});