export function pinProject(name) {
  console.log(name);
  window.electron.ipcRenderer.sendMessage('add-pinned', [name]);
}

export function changePriority(name: String, priority: number) {
  window.electron.ipcRenderer.sendMessage('set-priority', [name, priority]);
}

export function deleteProject(name) {
  console.log(name);
}

export function renameProject(name) {
  console.log(name);
}
