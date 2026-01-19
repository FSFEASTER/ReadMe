function getSelectedText() {
  const selection = window.getSelection();
  if (selection) {
    return selection.toString();
  } 
  else {
    return "";
  }
}
