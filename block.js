document.getElementById('confirmButton').addEventListener('click', function () {
  if (window.confirm("Are you sure you have read the Bible today?")) {
    chrome.runtime.sendMessage({ action: "confirmBibleReading" });
  }
});

document.getElementById('breakButton').addEventListener('click', function () {
  if (window.confirm("Are you sure you want to take a 5 minute break?")) {
    const originalUrl = document.getElementById('blockedUrl').href;
    chrome.runtime.sendMessage({ action: "startBreak", originalUrl: originalUrl });
  }
});

// Retrieve and display the original URL
chrome.storage.local.get("originalUrl", function (data) {
  if (data.originalUrl) {
    const url = new URL(data.originalUrl);
    document.getElementById('blockedUrl').href = data.originalUrl;
    document.getElementById('blockedUrl').textContent = url.hostname;
  }
});
