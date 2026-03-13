// fetches history array from chrome storage
chrome.storage.local.get("history", ({ history = [] }) => {
  const list = document.getElementById("historyList");
  // show placeholder if no words have been looked up yet
  if (history.length === 0) {
    list.innerHTML = '<li class="empty">Noch keine Wörter nachgeschlagen.</li>';
    return;
  }
  // create list item for each word and append it
  history.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    list.appendChild(li);
  });
});