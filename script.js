console.log("ReadMe Extension Loaded!"); // This should appear when the page refreshes

document.addEventListener("mouseup", () => {
  const word = window.getSelection().toString().trim();
  console.log("Selection detected:", word); // Trace 1
  if (!word) return;
  showButton(word);
});

function showButton(word) {
  removeButton();
  const range = window.getSelection().getRangeAt(0);
  const rect = range.getBoundingClientRect();

  button = document.createElement("button");
  button.textContent = "ReadMe";
  // ... (keep your styles) ...

  document.body.appendChild(button);

  button.addEventListener("click", (e) => {
    console.log("Button actually clicked!"); // Trace 2
    e.stopPropagation();
    lookup(word, rect);
  });
}

let button = null;

document.addEventListener("mouseup", (e) => {
  // If we just clicked the "ReadMe" button, stop right here
  if (button && button.contains(e.target)) return;

  // ... rest of your selection logic
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

  button.onclick = (e) => {
    e.stopPropagation();
    lookup(word, rect);
  };
}

function removeButton() {
  if (button) {
    button.remove();
    button = null;
  }
}

async function lookup(word, rect) {
  chrome.runtime.sendMessage(
    { action: "fetchDefinition", word: word },
    (response) => {
      if (response.error || !response.data || response.data.title) {
        showPopup(word, { definition: "Definition not found." }, rect);
      } else {
        const def = response.data[0].meanings[0].definitions[0];
        showPopup(word, def, rect);
      }
    },
  );
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

document.addEventListener("mousedown", (e) => {
  const popup = document.getElementById("dictPopup");

  // Check if the click target is the button or inside the button
  const clickedButton = button && button.contains(e.target);

  // Check if the click target is the popup or inside the popup
  const clickedPopup = popup && popup.contains(e.target);

  // If the user clicked either of our elements, DO NOT remove them.
  if (clickedButton || clickedPopup) {
    return;
  }
  // Otherwise, the user clicked the background, so clean up.
  removeButton();
  removePopup();
});

function removePopup() {
  const p = document.getElementById("dictPopup");
  if (p) p.remove();
}
