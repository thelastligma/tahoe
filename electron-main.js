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
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 10000
        };

        console.log('Making request to:', url);

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log('Response status:', res.statusCode);
                console.log('Response data length:', data.length);
                
                try {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        const jsonData = JSON.parse(data);
                        console.log('Parsed JSON successfully');
                        resolve(jsonData);
                    } else {
                        console.error('HTTP error:', res.statusCode, res.statusMessage);
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                } catch (error) {
                    console.error('JSON parse error:', error.message);
                    console.error('Raw data:', data.substring(0, 200));
                    reject(new Error(`JSON parse error: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('Request error:', error.message);
            reject(new Error(`Request error: ${error.message}`));
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
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
    console.log('ScriptHub search called with:', { query, category, mode });
    try {
        const params = new URLSearchParams();
        params.set('q', query);
        params.set('max', '50');
        if (mode) params.set('mode', mode);
        
        const url = `https://scriptblox.com/api/script/search?${params}`;
        const data = await makeHttpsRequest(url);
        
        console.log('Search response:', data.result ? `${data.result.scripts?.length || 0} scripts` : 'No result field');
        return { success: true, result: data.result };
    } catch (error) {
        console.error('ScriptHub search error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('scripthub-fetch', async (event, scriptId) => {
    console.log('ScriptHub fetch called with ID:', scriptId);
    try {
        const url = `https://scriptblox.com/api/script/fetch?id=${scriptId}`;
        const data = await makeHttpsRequest(url);
        
        console.log('Fetch response:', data ? 'Success' : 'No data');
        return { success: true, result: data };
    } catch (error) {
        console.error('ScriptHub fetch error:', error);
        return { success: false, error: error.message };
    }
});

ipcMain.handle('scripthub-trending', async (event) => {
    console.log('ScriptHub trending called');
    try {
        const url = 'https://scriptblox.com/api/script/trending';
        const data = await makeHttpsRequest(url);
        
        console.log('Trending response:', data.result ? `${data.result.scripts?.length || 0} scripts` : 'No result field');
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
