chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchDefinition") {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${request.word}`)
      .then((response) => response.json())
      .then((data) => sendResponse({ data }))
      .catch((error) => sendResponse({ error: error.message }));
  }
  return true;
});