const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const { execute, setting } = require('./main.js');
const https = require('https');
const { URL } = require('url');

let mainWindow;

// Helper function to make HTTPS requests
function makeHttpsRequest(url) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const options = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || 443,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Tahoe/1.0.0'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(data));
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                } catch (error) {
                    reject(new Error(`JSON parse error: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(new Error(`Request error: ${error.message}`));
        });

        req.end();
    });
}

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

// ScriptHub API handlers using native HTTPS
ipcMain.handle('scripthub-search', async (event, query, category, mode) => {
    try {
        const params = new URLSearchParams();
        params.set('q', query);
        params.set('max', '50');
        if (mode) params.set('mode', mode);
        
        const url = `https://scriptblox.com/api/script/search?${params}`;
        const data = await makeHttpsRequest(url);
        return { success: true, result: data.result };
    } catch (error) {
        console.error('ScriptHub search error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('scripthub-fetch', async (event, scriptId) => {
    try {
        const url = `https://scriptblox.com/api/script/fetch?id=${scriptId}`;
        const data = await makeHttpsRequest(url);
        return { success: true, result: data };
    } catch (error) {
        console.error('ScriptHub fetch error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('scripthub-trending', async (event) => {
    try {
        const url = 'https://scriptblox.com/api/script/trending';
        const data = await makeHttpsRequest(url);
        return { success: true, result: data.result };
    } catch (error) {
        console.error('ScriptHub trending error:', error);
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
