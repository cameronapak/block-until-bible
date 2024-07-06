document.addEventListener('DOMContentLoaded', () => {
  const checkbox = document.getElementById('checkbox-on');
  let isEnabled = true;

  function updateStorage() {
    const updatedValue = !isEnabled;
    chrome.storage.local.set({ isEnabled: updatedValue });
    isEnabled = updatedValue;
    checkbox.checked = isEnabled;
  }

  function init() {
    // Get data from Chrome local storage
    chrome.storage.local.get(['isEnabled'], function (result) {
      isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
      checkbox.checked = isEnabled;
    });
  }

  checkbox.addEventListener('change', updateStorage);
  
  init();
});
