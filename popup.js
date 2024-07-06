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
    chrome.storage.local.get(['isEnabled', 'hasReadBible'], function (result) {
      isEnabled = result.isEnabled !== undefined ? result.isEnabled : true;
      checkbox.checked = isEnabled;
      hasReadBible = result.hasReadBible !== undefined ? result.hasReadBible : false;
      if (hasReadBible) {
        document.getElementById('has-read-bible').style.display = 'block';
      }
    });
  }

  checkbox.addEventListener('change', updateStorage);

  init();
});
