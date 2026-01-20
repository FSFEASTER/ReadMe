let button = null;

document.addEventListener("mouseup", (e) => {
  // SHIELD: If the user is clicking the "ReadMe" button, stop here.
  // This prevents the button from "resetting" itself during a click.
  if (button && button.contains(e.target)) return;

  const word = window.getSelection().toString().trim();

  if (!word) {
    // If user clicks empty space, remove existing UI
    removeButton();
    return;
  }

  showButton(word);
});

function showButton(word) {
  removeButton();

  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  button = document.createElement("button");
  button.textContent = "ReadMe";

  // (Keep your existing styles here)
  Object.assign(button.style, {
    position: "absolute",
    left: `${rect.right + window.scrollX}px`,
    top: `${rect.top + window.scrollY}px`,
    zIndex: "9999",
  });

  document.body.appendChild(button);

  // --- THE IMPORTANT PART ---
  button.addEventListener("click", (e) => {
    e.stopPropagation();

    // 1. Remove the "ReadMe" button immediately
    removeButton();

    // 2. Clear the blue text highlight
    window.getSelection().removeAllRanges();

    // 3. Proceed to show the dictionary popup
    lookup(word, rect);
  });
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

  // Only close things if the user clicks OUTSIDE the button and popup
  if (button && button.contains(e.target)) return;
  if (popup && popup.contains(e.target)) return;

  removeButton();
  removePopup();
});

function removePopup() {
  const p = document.getElementById("dictPopup");
  if (p) p.remove();
}
