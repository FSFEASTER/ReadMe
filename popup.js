chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(
    tabs[0].id,
    "GET_SELECTION",
    (response) => {
      const output = document.getElementById("output");
      if (response) {
        output.textContent = response;
      } else {
        output.textContent = "Kein Text markiert";
      }
    }
  );
});
