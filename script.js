function getSelectedText() {
  const selection = window.getSelection();
  if (selection) {
    return selection.toString();
  } 
  else {
    return "";
  }
}

let lastSelection = "";

document.addEventListener("mouseup", () => {
    lastSelection = getSelectedText();
});

chrome.runtime.onMessage.addListener ((msg, sender, sendResponse) => {
    if (msg ===  "GET_SELECTION") {
        sendResponse(lastSelection);
    }
});