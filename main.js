const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Cria a janela do navegador.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Carrega o arquivo index.html do seu app.
    mainWindow.loadFile('index.html');

    // Opcional: Abre o DevTools (Ferramentas do Desenvolvedor) para debug.
    // mainWindow.webContents.openDevTools();
}

// Este método será chamado quando o Electron terminar a inicialização
// e estiver pronto para criar janelas do navegador.
app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        // No macOS, é comum recriar uma janela no app quando o ícone do dock é clicado
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Encerra quando todas as janelas forem fechadas (exceto no macOS).
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});