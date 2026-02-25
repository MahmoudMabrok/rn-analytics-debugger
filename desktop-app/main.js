const { app, BrowserWindow } = require('electron');
const path = require('path');
const WebSocket = require('ws');

let mainWindow;
let wss;
const wsClients = new Set();

function createWebSocketServer() {
    wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', function connection(ws) {
        console.log('Mobile app connected');
        wsClients.add(ws);

        ws.on('message', function incoming(message) {
            const data = message.toString();
            // Forward event to Electron renderer
            if (mainWindow) {
                mainWindow.webContents.send('analytics-event', data);
            }
        });

        ws.on('close', () => {
            console.log('Mobile app disconnected');
            wsClients.delete(ws);
        });
    });

    console.log('WebSocket server listening on port 8080');
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For simplicity in MVP, disable context isolation to use ipcRenderer
        },
    });

    // Check if we are in dev mode
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    }
}

app.whenReady().then(() => {
    createWebSocketServer();
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
