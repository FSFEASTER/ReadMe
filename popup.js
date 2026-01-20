chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, "GET_SELECTION", (response) => {
    const output = document.getElementById("output");
    if (response) {
      output.textContent = response;
    } else {
      output.textContent = "Kein Text markiert";
    }
  });
});
async function fetchword(word) {
  //wort fetchen
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/${word}";
  const response = await fetch(url);
  const data = await response.json();
}
