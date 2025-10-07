const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    opiumware: {
        execute: (code, port) => ipcRenderer.invoke('opiumware-execute', code, port),
        setting: (key, value) => ipcRenderer.invoke('opiumware-setting', key, value)
    },
    scripthub: {
        search: (query, category, mode) => ipcRenderer.invoke('scripthub-search', query, category, mode),
        fetch: (scriptId) => ipcRenderer.invoke('scripthub-fetch', scriptId),
        trending: () => ipcRenderer.invoke('scripthub-trending')
    }
});
