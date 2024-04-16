// Updates projecpts.json with projects in the AEP directory.
export function reloadProjects() {
  window.electron.ipcRenderer.sendMessage('update-projects', ['changes']);
}
