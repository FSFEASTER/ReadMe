chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, "GET_SELECTION", async (response) => {
    const output = document.getElementById("output");
    if (response) {
      output.textContent = "loading definition..."
      const definition = await fetchword(response);
      output.textContent = definition
    } else {
      output.textContent = "Kein Text markiert";
    }
  });
});

async function fetchword(word) {
  //wort fetchen
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  const response = await fetch(url);
  if(response.ok) {
    const data = await response.json();
    return data[0].meanings[0].definitions[0].definition;
  }
  
}
