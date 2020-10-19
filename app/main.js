const {app, BrowserWindow, electron, ipcMain} = require('electron')
const { dialog } = require('electron')
const path = require('path')

const squirrelUrl = "https://github.com/Escartem/Frame/releases/latest/download/";

var appdata = app.getPath('userData')
//console.log(appdata)

const startAutoUpdater = (squirrelUrl) => {
  // The Squirrel application will watch the provided URL
  electron.autoUpdater.setFeedURL(`${squirrelUrl}/win64/`);

  // Display a success message on successful update
  electron.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName) => {
    electron.dialog.showMessageBox({"message": `The release ${releaseName} has been downloaded`});
  });

  // Display an error message on update error
  electron.autoUpdater.addListener("error", (error) => {
    electron.dialog.showMessageBox({"message": "Auto updater error: " + error});
  });

  // tell squirrel to check for updates
  electron.autoUpdater.checkForUpdates();
}

//const response = dialog.showMessageBox(null);
//console.log(response);

//require('update-electron-app')({
	//notifyUser: true,
	//repo: 'escartem/Frame'
//})

const handleSquirrelEvent = () => {
  if (process.argv.length === 1) {
    return false;
  }

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
    case '--squirrel-uninstall':
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      app.quit();
      return true;
  }
}

if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

let win
let loadingScreen;

const local = app.getLocale()

const createLoadingScreen = () => {
  loadingScreen = new BrowserWindow(Object.assign({
    width: 260,
    height: 100,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    transparent: true
  }));

  //console.log(app.getLocale())
  //if (app.getLocale() == 'fr') {
  	//loadingScreen.setSize(260, 130)
  	//loadingScreen.loadFile('loading.html')
  //} else {
  	//loadingScreen.loadFile('loading.html')
  //}
  loadingScreen.loadFile('app/html/loading.html');

  loadingScreen.on('closed', () => loadingScreen = null);
  loadingScreen.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      loadingScreen.show();
    }, 2000)
  });
  setTimeout(() => {
    createWindow();
  }, 4000);
}

function createWindow () {
	win = new BrowserWindow({
		width: 810,
		height: 600,
		minHeight: 490,
		minWidth: 490,
		frame: false,
		alwaysOnTop: true,
		transparent: true,
		resizable: true,
		enableLargerThanScreen: true,
		webPreferences: {
			nodeIntegration: true,
      enableRemoteModule: true
		},
		show: false
	})

	if (app.getLocale() == 'fr') {
		win.loadFile('app/html/index_fr.html')
	} else {
		win.loadFile('app/html/index_en.html')
	}
	//win.loadFile('index.html')

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
  //if (process.env.NODE_ENV !== "dev") startAutoUpdater(squirrelUrl)
  createLoadingScreen();
})

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
	if (win === null) createWindow()
})
