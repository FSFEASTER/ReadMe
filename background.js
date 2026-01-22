// listens for script.js to send a word to look up
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchDefinition") {
    // Calls the API to get the desired data
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${request.word}`)
      // HTTP response gets turned into JS object
      .then((response) => response.json())
      // Sends the dictionary result back / catches errors and sends an error message
      .then((data) => sendResponse({ data }))
      .catch((error) => sendResponse({ error: error.message }));
  }
  return true;
});
