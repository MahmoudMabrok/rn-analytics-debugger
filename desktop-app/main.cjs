const { app, BrowserWindow } = require('electron');
const path = require('path');
const WebSocket = require('ws');

let mainWindow;
let wss;

function createWebSocketServer() {
    wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', function connection(ws) {
        console.log('Mobile app connected');
        if (mainWindow) {
            mainWindow.webContents.send('ws-status', 'connected');
        }

        ws.on('message', function incoming(message) {
            const data = message.toString();
            if (mainWindow) {
                mainWindow.webContents.send('analytics-event', data);
            }
        });

        ws.on('close', () => {
            console.log('Mobile app disconnected');
            if (mainWindow) {
                mainWindow.webContents.send('ws-status', 'disconnected');
            }
        });
    });

    console.log('WebSocket server listening on port 8080');
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1100,
        height: 750,
        titleBarStyle: 'hiddenInset',
        backgroundColor: '#0D1117',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
        // Wait for Vite to be ready, then try ports in order
        const tryLoad = (ports, index) => {
            if (index >= ports.length) return;
            const url = `http://localhost:${ports[index]}`;
            mainWindow.loadURL(url).catch(() => {
                setTimeout(() => tryLoad(ports, index + 1), 500);
            });
        };
        setTimeout(() => tryLoad([5173, 5174, 5175, 5176], 0), 1500);
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
