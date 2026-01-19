let currentWord = "";

chrome.runtime.onMessage.addListener((msg) => {
  currentWord = msg.word;
  document.getElementById("word").textContent = currentWord;
  lookup(currentWord);
});

async function lookup(word) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  );

  const data = await res.json();

  const entry = data[0];
  const meaning = entry.meanings[0];
  const def = meaning.definitions[0];

  document.getElementById("word").textContent = entry.word;
  document.getElementById("definition").textContent =
    "Definition: " + def.definition;

  document.getElementById("example").textContent =
    "Example: " + (def.example || "None");

  // --- Synonyms ---
  const syn = def.synonyms.length ? def.synonyms.join(", ") : "None";
  document.getElementById("synonyms").textContent = "Synonyms: " + syn;

  // --- Antonyms ---
  const ant = def.antonyms.length ? def.antonyms.join(", ") : "None";
  document.getElementById("antonyms").textContent = "Antonyms: " + ant;

  // --- Audio ---
  const audio = entry.phonetics.find((p) => p.audio)?.audio;
  if (audio) {
    document.getElementById("audioBtn").onclick = () => {
      new Audio(audio).play();
    };
  }
}
