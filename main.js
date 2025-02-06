const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false, // Disable Node.js in frontend for security
            contextIsolation: true, // Use preload scripts for Node.js
        },
    });

    mainWindow.loadURL('http://localhost:3000'); // React build for production
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
