// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'update-projects'
  | 'create-aep'
  | 'open-aep'
  | 'get-projects'
  | 'create-aep-response'
  | 'set-priority'
  | 'get-priorities'
  | 'delete-project'
  | 'add-recent-aep'
  | 'get-recent-projects'
  | 'get-pinned'
  | 'add-pinned'
  | 'rename-project'
  | 'show-directory-select'
  | 'get-directory'
  | 'recover-aep'
  | 'get-project-count'
  | 'window-functions'
  | 'ctrl-click-project';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
