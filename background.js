// Listens for script.js to send a word to look up
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchDefinition") {
    
    (async () => {
      try {
        // Calls the API to get the desired data
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${request.word}`);

        // HTTP response gets turned into JS object
        const data = await response.json();

        const definition1 = [];
        const definition2 = [];
        const synonyms = [];
        const antonyms = [];
        const entry = data[0] || {};
        const meanings = entry.meanings || [];

        const firstMeaning = meanings[0] || {};
        const firstDefs = firstMeaning.definitions
        definition1.push(
          firstDefs[0]?.definition ?? null,
          firstDefs[0]?.example ?? null,
          firstDefs[1]?.definition == null,
          firstDefs[1]?.example ?? null
        );

        let secondMeaning = null;
        if (meanings[1]){
          secondMeaning = meanings[1];
        }
        else if (data[1]?.meanings?.[0]){
          secondMeaning = data[1].meanings
        }


        // Sends the dictionary result back
        sendResponse({data});
        // catch error and send error message
      }  catch (error) {
        sendResponse({error: error.message});
      }
    })();

  }
  
  return true; // Keeps the port open
});


/*zu übergeben:
2 defininitionen + beispielsätze (2 EINZELNE ARRAYS)
3 Synonyme
3 Antonyme
1 Audiotrack
1 phonetics
*/
