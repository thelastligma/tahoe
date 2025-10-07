const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const { execute, setting } = require('./main.js');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: 'hiddenInset',
        show: false,
        backgroundColor: '#111827'
    });

    mainWindow.loadFile('index.html');

    // Show window when ready to prevent visual flash
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });

    // Remove menu bar (optional)
    Menu.setApplicationMenu(null);

    // Open DevTools in development
    if (process.argv.includes('--dev')) {
        mainWindow.webContents.openDevTools();
    }
}

// IPC handlers for Opiumware API
ipcMain.handle('opiumware-execute', async (event, code, port = "ALL") => {
    try {
        const result = await execute(code, port);
        return { success: true, result };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('opiumware-setting', async (event, key, value) => {
    try {
        await setting(key, value);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

// ScriptHub API handlers using new API modules
ipcMain.handle('scripthub-search', async (event, query, category, mode) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const params = new URLSearchParams();
        params.set('q', query);
        params.set('max', '50');
        if (mode) params.set('mode', mode);
        
        const response = await fetch(`https://scriptblox.com/api/script/search?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { success: true, result: data.result }; // Return data.result instead of data
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('scripthub-fetch', async (event, scriptId) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(`https://scriptblox.com/api/script/fetch?id=${scriptId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { success: true, result: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle('scripthub-trending', async (event) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch('https://scriptblox.com/api/script/trending');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        return { success: true, result: data.result }; // Return data.result instead of data
    } catch (error) {
        return { success: false, error: error.message };
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
