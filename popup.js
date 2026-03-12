chrome.storage.local.get("history", ({ history = [] }) => {
  const list = document.getElementById("historyList");
  if (history.length === 0) {
    list.innerHTML = '<li class="empty">Noch keine Wörter nachgeschlagen.</li>';
    return;
  }
  history.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    list.appendChild(li);
  });
});