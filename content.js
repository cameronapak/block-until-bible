let breakEndTime = null;
let hasReadBible = false;
let isEnabled = true;

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
  <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
    <path d="M19 4v16H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h12z"/>
    <path d="M19 16H7a2 2 0 0 0-2 2m7-11v6m-2-4h4"/>
  </g>
</svg>
`.trim();

function createBanner() {
  const bannerHTML = `
      <div id="breakBanner" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        text-align: center;
        padding: 12px;
        display: flex;
        gap: 12px;
        font-family: 'Arial', sans-serif !important;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
        z-index: 9999;
      ">
        <div id="iconContainer" style="cursor: pointer;">
          ${iconSvg}
        </div>
        <span id="bannerText"></span>
      </div>
    `;
  document.body.insertAdjacentHTML('beforeend', bannerHTML);
  
  // Add click event listener to the icon
  document.getElementById('iconContainer').addEventListener('click', handleIconClick);
}

function handleIconClick() {
  chrome.runtime.sendMessage({ action: "openBlockPage" });
}

function updateBanner() {
  const banner = document.getElementById('breakBanner');
  const bannerText = document.getElementById('bannerText');
  if (banner && bannerText) {
    if (!isEnabled || hasReadBible) {
      banner.style.display = 'none';
    } else {
      banner.style.display = 'flex';
      if (breakEndTime) {
        const remainingTime = Math.max(0, breakEndTime - new Date().getTime());
        if (remainingTime > 0) {
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);
          bannerText.textContent = `Break: ${minutes}m ${seconds}s remaining`;
        } else {
          bannerText.textContent = "Break: Time's up!";
          // Clear breakEndTime
          chrome.storage.local.set({ breakEndTime: null });
          // Redirect to the break page
          const originalUrl = window.location.href;
          chrome.runtime.sendMessage({ action: "openBlockPage", originalUrl });
        }
      } else {
        bannerText.textContent = "Focus: Read the Bible";
      }
    }
  }
}

function init() {
  chrome.storage.local.get(['isEnabled', 'breakEndTime', 'hasReadBible'], function (result) {
    isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
    breakEndTime = result.breakEndTime !== undefined ? result.breakEndTime : null;
    hasReadBible = result.hasReadBible !== undefined ? result.hasReadBible : false;

    createBanner();
    updateBanner();

    // Use setInterval instead of chrome.alarms
    setInterval(updateBanner, 1000); // Run every second

    // Add storage change listener
    chrome.storage.onChanged.addListener((changes, namespace) => {
      if (namespace === 'local') {
        if ('isEnabled' in changes) {
          isEnabled = Boolean(changes.isEnabled.newValue || false);
        }
        if ('breakEndTime' in changes) {
          breakEndTime = changes.breakEndTime.newValue;
        }
        if ('hasReadBible' in changes) {
          hasReadBible = changes.hasReadBible.newValue;
        }

        updateBanner();
      }
    });
  });
}

init();
