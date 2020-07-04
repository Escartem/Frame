const {app, BrowserWindow, electron, ipcMain} = require('electron')
const path = require('path')

const { dialog } = require('electron')

const options = {
	message: 'Mise à jour disponible !',
	buttons: ['Ok']
}

//const response = dialog.showMessageBox(null);
//console.log(response);

//require('update-electron-app')({
	//notifyUser: true,
	//repo: 'escartem/Frame'
//})


let win
let loadingScreen;

const createLoadingScreen = () => {
  loadingScreen = new BrowserWindow(Object.assign({
    width: 240,
    height: 80,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    transparent: true
  }));
  loadingScreen.loadFile('loading.html');
  loadingScreen.on('closed', () => loadingScreen = null);
  loadingScreen.webContents.on('did-finish-load', () => {
    loadingScreen.show();
  });
  dialog.showMessageBox(null);
  setTimeout(() => {
    createWindow();
  }, 2000);
}

function createWindow () {
	win = new BrowserWindow({
		width: 810,
		height: 600,
		minHeight: 490,
		minWidth: 150,
		frame: false,
		alwaysOnTop: true,
		transparent: true,
		resizable: true,
		webPreferences: {
			nodeIntegration: true
		},
		show: false
	})

	win.loadFile('index.html')

	ipcMain.on('close-me', (evt, arg) => {
		app.quit()
	})

	ipcMain.on('minimize', (evt, arg) => {
		win.minimize();
	})
    
    ipcMain.on('MinMax', (evt, arg) => {
        win.isMaximized() ? win.unmaximize() : win.maximize();
    })

	win.on('closed', function () {
		win = null
	})
	win.webContents.on('did-finish-load', () => {
    if (loadingScreen) {
      loadingScreen.close();
    }
    win.show();
    //dialog.showMessageBox(null);
  });
}

app.on('ready', () => {
  createLoadingScreen();
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	if (win === null) createWindow()
})
