document.getElementById('confirmButton').addEventListener('click', function () {
  if (window.confirm("Are you sure you have read the Bible today?")) {
    chrome.runtime.sendMessage({ action: "confirmBibleReading" });
  }
});

document.getElementById('breakButton').addEventListener('click', function () {
  if (window.confirm("Are you sure you want to take a 5 minute break?")) {
    chrome.runtime.sendMessage({ action: "startBreak" });
  }
});
