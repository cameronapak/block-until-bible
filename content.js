let breakEndTime = null;

function createBanner() {
  const banner = document.createElement('div');
  banner.id = 'breakBanner';
  banner.style.position = 'fixed';
  banner.style.top = '0';
  banner.style.left = '0';
  banner.style.width = '100%';
  banner.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  banner.style.color = 'white';
  banner.style.textAlign = 'center';
  banner.style.padding = '10px';
  banner.style.zIndex = '9999';
  banner.style.pointerEvents = 'none';
  document.body.appendChild(banner);
}

function updateBanner() {
  const banner = document.getElementById('breakBanner');
  if (banner) {
    if (breakEndTime) {
      const remainingTime = Math.max(0, breakEndTime - new Date().getTime());
      const minutes = Math.floor(remainingTime / 60000);
      const seconds = Math.floor((remainingTime % 60000) / 1000);
      banner.textContent = `Break Time: ${minutes}m ${seconds}s remaining`;
    } else {
      banner.textContent = "Focus: Read the Bible";
    }
  }
}

createBanner();
updateBanner();
setInterval(updateBanner, 1000);

// Get the breakEndTime from the background script
chrome.runtime.sendMessage({ action: 'getBreakEndTime' }, function(response) {
  if (response && response.breakEndTime) {
    breakEndTime = response.breakEndTime;
    updateBanner();
  } else {
    console.log("No breakEndTime found.");
    updateBanner();
  }
});
