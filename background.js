// Listens for script.js to send a word to look up
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchDefinition") {
    (async () => {
      try {
        // Calls the API to get the desired data
        const response = await fetch(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${request.word}`,
        );

        // HTTP response gets turned into JS object
        const data = await response.json();
        // creating all the arrays we send back as response
        let phonetic = null;
        const definition1 = [];
        const definition2 = [];
        const synonyms1 = [];
        const synonyms2 = [];
        const antonyms1 = [];
        const antonyms2 = [];
        const entry = data[0] || []
        const meanings = entry.meanings || [];
        // locating phonetics in array and saving them
        if (entry.phonetic) {
          phonetic = entry.phonetic;
        } else if (entry.phonetics) {
          for (const p of entry.phonetics) {
            if (p.text) {
              phonetic = p.text;
              break;
            }
          }
        }
        // saving definitions & examples of first part of speech
        const firstMeaning = meanings[0] || {};
        const firstDefs = firstMeaning.definitions || [];
        definition1.push(
          firstDefs[0]?.definition ?? "Definition not found.",
          firstDefs[0]?.example ?? null,
          firstDefs[1]?.definition ?? null,
          firstDefs[1]?.example ?? null,
        );

        let secondMeaning = null;
        // finding location of definition & example of second part of speech in api
        if (meanings[1]) {
          secondMeaning = meanings[1];
        } else if (data[1]?.meanings?.[0]) {
          secondMeaning = data[1].meanings[0];
        }
        // saving definitions & examples of second part of speech
        if (secondMeaning && secondMeaning.definitions) {
          const defs = secondMeaning.definitions || [];
          definition2.push(
            defs[0]?.definition ?? null,
            defs[0]?.example ?? null,
            defs[1]?.definition ?? null,
            defs[1]?.example ?? null,
          );
        } else {
          definition2.push(null, null, null, null);
        }

        //Synonyms / Antonyms for meaning 1
        for (const s of firstMeaning.synonyms || []) {
          if (synonyms1.length < 3 && !synonyms1.includes(s)) {
            synonyms1.push(s);
          }
        }

        for (const a of firstMeaning.antonyms || []) {
          if (antonyms1.length < 3 && !antonyms1.includes(a)) {
            antonyms1.push(a);
          }
        }

        // Synonyms / Antonyms for meaning 2
        if (secondMeaning) {
          for (const s of secondMeaning.synonyms || []) {
            if (synonyms2.length < 3 && !synonyms2.includes(s)) {
              synonyms2.push(s);
            }
          }

          for (const a of secondMeaning.antonyms || []) {
            if (antonyms2.length < 3 && !antonyms2.includes(a)) {
              antonyms2.push(a);
            }
          }
        }

        // calls saveToHistory if the word exists in api
        if (definition1[0] !== "Definition not found.") {
          await saveToHistory(request.word);
        }
        

        // Sends the dictionary result back
        sendResponse({
          definition1,
          definition2,
          synonyms1,
          synonyms2,
          antonyms1,
          antonyms2,
          phonetic,
        });
        // catch error and send error message
      } catch (error) {
        sendResponse({ error: error.message });
      }
    })();
  }

  return true; // Keeps the port open
});

// saves current word to local chrome history
async function saveToHistory(word) {
  // gets the history from chrome local storage
  const { history = [] } = await chrome.storage.local.get("history");

  // makes sure word is unique
  const filtered = history.filter((w) => w.toLowerCase() !== word.toLowerCase());
  // limits array length to 10
  const updated = [word, ...filtered].slice(0, 10);

  //sets updated history
  await chrome.storage.local.set({ history: updated });
}
