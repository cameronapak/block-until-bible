let hasReadBible = false;

chrome.storage.local.get(["hasReadBible", "lastReadDate"], function (data) {
  const today = new Date().toISOString().split('T')[0];
  if (data.lastReadDate !== today) {
    hasReadBible = false;
    chrome.storage.local.set({ hasReadBible: false });
  } else {
    hasReadBible = data.hasReadBible || false;
  }
});

const allowedWebsites = [
  "www.bible.com",
  "bible.com",
  "my.bible.com",
  "www.jointhejourney.com",
  "biblebot.dev",
  "soulrest.melos.church",
  "huggingface.co/chat",
  "faith.tools",
];

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
  const url = new URL(details.url);
  const currentTime = new Date().getTime();

  chrome.storage.local.get("breakEndTime", function (data) {
    console.log(data);
    if (data.breakEndTime && currentTime < data.breakEndTime) {
      return; // Allow navigation during the break period
    }

    if (!hasReadBible && details.frameId === 0 && !allowedWebsites.includes(url.hostname)) {
      chrome.storage.local.set({ originalUrl: details.url }, function () {
        chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL("block.html") });
      });
    }
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case "confirmBibleReading":
      hasReadBible = true;
      const today = new Date().toISOString().split('T')[0];
      chrome.storage.local.set({ hasReadBible: true, lastReadDate: today });
      chrome.storage.local.get("originalUrl", function (data) {
        if (data.originalUrl) {
          chrome.tabs.update(sender.tab.id, { url: data.originalUrl });
        }
      });
      break;
    case "startBreak":
      const breakEndTime = new Date().getTime() + 5 * 60 * 1000; // 5 minutes from now
      if (request.originalUrl) {
        chrome.tabs.update(sender.tab.id, { url: request.originalUrl });
      }
      chrome.tabs.query({}, function (tabs) {
        for (let tab of tabs) {
          chrome.tabs.sendMessage(tab.id, { action: "initiateBreak", duration: 5 * 60 * 1000 });
        }
      });
      chrome.storage.local.set({ breakEndTime: breakEndTime });
      break;
    case "getStorageData":
      chrome.storage.local.get(["breakEndTime", "hasReadBible"], function (data) {
        sendResponse({ breakEndTime: data.breakEndTime, hasReadBible: hasReadBible });
      });
      return true; // Indicate that the response will be sent asynchronously
  }
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.remove("hasReadBible", function () {
    console.log("hasReadBible has been cleared.");
  });
});
