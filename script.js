let button = null;

document.addEventListener("mouseup", () => {
  const word = window.getSelection().toString().trim();

  if (!word) return;

  showButton(word);
});

function showButton(word) {
  removeButton();

  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();

  button = document.createElement("button");
  button.textContent = "ReadMe";
  button.style.position = "absolute";
  button.style.left = rect.right + window.scrollX + "px";
  button.style.top = rect.top + window.scrollY + "px";
  button.style.zIndex = 9999;
  button.style.padding = "5px";
  button.style.cursor = "pointer";

  document.body.appendChild(button);

  button.onclick = () => lookup(word, rect);
}

function removeButton() {
  if (button) {
    button.remove();
    button = null;
  }
}

async function lookup(word, rect) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
  );

  const data = await res.json();

  const def = data[0].meanings[0].definitions[0];

  showPopup(word, def, rect);
}

function showPopup(word, def, rect) {
  removePopup();

  const popup = document.createElement("div");
  popup.id = "dictPopup";

  popup.style.position = "absolute";
  popup.style.left = rect.left + window.scrollX + "px";
  popup.style.top = rect.bottom + window.scrollY + 10 + "px";
  popup.style.zIndex = 9999;
  popup.style.background = "#222";
  popup.style.color = "white";
  popup.style.padding = "10px";
  popup.style.borderRadius = "8px";
  popup.style.maxWidth = "300px";

  popup.innerHTML = `
    <b>${word}</b><br>
    ${def.definition}<br><br>
    <i>${def.example || ""}</i>
  `;

  document.body.appendChild(popup);
}

document.addEventListener("mousedown", () => {
  removeButton();
  removePopup();
});

function removePopup() {
  const p = document.getElementById("dictPopup");
  if (p) p.remove();
}
