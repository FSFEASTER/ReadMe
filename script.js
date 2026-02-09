console.log("Extension geladen")

// Creates the button variable as a reference for future actions, prevents accidental creation of buttons down the road
let button = null;

document.addEventListener("mouseup", (e) => {
  if (button && button.contains(e.target)) return;

  // Variable "word" is created by taking the selected text in the current tab, which is then converted to a string and any spaces get removed
  const word = window.getSelection().toString().trim();

  if (!word) {
    removeButton();
    return;
  }
  // Calls the function that determines if the button shows up and how it does
  showButton(word);
});

function showButton(word) {
  // Any old buttons are removed
  removeButton();

  // Creates variable that contains the selected text
  const selection = window.getSelection();
  // If nothing is selected, don't show a button
  if (selection.rangeCount === 0) return;

  // Gets the exact position of the word on the tab so that the button and pop-up show up near it
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Creates HTML button object
  button = document.createElement("button");
  button.textContent = "ReadMe";

  Object.assign(button.style, {
    // Lets the button have specific X and Y coordinates
    position: "absolute",
    // Position of the button, accounts for having scrolled horizontally. Turns the math result into a string
    left: `${rect.right + window.scrollX}px`,
    // Same for the height
    top: `${rect.top + window.scrollY}px`,
    // Makes the button show up at the very front of the page so nothing gets layered on top.
    zIndex: "9999",
  });
  // Makes the button visible in the tab
  document.body.appendChild(button);

  button.addEventListener("click", (e) => {
    // Prevents the click from triggering any other things such as mousedown etc.
    e.stopPropagation();

    // Remove the "ReadMe" button
    removeButton();

    // Clear the text highlight
    window.getSelection().removeAllRanges();

    // Show the dictionary popup
    lookup(word, rect);
  });
}

// Guess what this function does
function removeButton() {
  if (button) {
    button.remove();
    button = null;
  }
}

async function lookup(word, rect) {
  // Sends message to background.js, passing the highlighted word
  chrome.runtime.sendMessage(
    { action: "fetchDefinition", word: word },
    (response) => {
      // If response is error message or no data gets transfered
      if (response.error || !response.data || response.data.title) {
        showPopup(word, { definition: "Definition not found." }, rect);
      } else {
        // Takes the first entries from the API's transfered arrays
        const defOne = response.data[0].meanings[0].definitions[0];
        const defTwo = response.data[0].meanings[1].definitions[0];
        const defThree = response.data[0].meanings[2].definitions[0];
        showPopup(word, def, rect);
      }
    },
  );
}

function showPopup(word, defOne, rect) {
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
    ${defOne.definition}<br><br>
    <i>${defOne.example || ""}</i>
    ${defTwo.definition || ""}<br><br>
    <i>${defTwo.example || ""}</i>
    ${defThree.definition || ""}<br><br>
    <i>${defThree.example || ""}</i>
  `;

  document.body.appendChild(popup);
}

// Function to close the pop-up if user clicks outside of it
document.addEventListener("mousedown", (e) => {
  // Makes referencing the pop-up simpler by having a variable
  const popup = document.getElementById("dictPopup");

  // Only close things if the user clicks outside the button and popup
  if (button && button.contains(e.target)) return;
  if (popup && popup.contains(e.target)) return;

  removeButton();
  removePopup();
});

// Guess what this function does
function removePopup() {
  const p = document.getElementById("dictPopup");
  if (p) p.remove();
}
