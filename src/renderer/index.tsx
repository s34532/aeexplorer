import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import App from './App';
import React from 'react';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(

    <HashRouter>
    <App />
    </HashRouter>

);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
//window.electron.ipcRenderer.sendMessage('ipc-example', ['changes']);
