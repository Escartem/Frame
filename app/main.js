const { app, BrowserWindow, electron, ipcMain } = require("electron");
const { dialog } = require("electron");
const path = require("path");

const squirrelUrl = "https://github.com/Escartem/Frame/releases/latest/download/";

var appdata = app.getPath("userData");
//console.log(appdata)

const startAutoUpdater = (squirrelUrl) => {
    // The Squirrel application will watch the provided URL
    electron.autoUpdater.setFeedURL(`${squirrelUrl}/win64/`);

    // Display a success message on successful update
    electron.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName) => {
        electron.dialog.showMessageBox({ "message": `The release ${releaseName} has been downloaded` });
    });

    // Display an error message on update error
    electron.autoUpdater.addListener("error", (error) => {
        electron.dialog.showMessageBox({ "message": "Auto updater error: " + error });
    });

    // tell squirrel to check for updates
    electron.autoUpdater.checkForUpdates();
}

//const response = dialog.showMessageBox(null);
//console.log(response);

//require("update-electron-app")({
//notifyUser: true,
//repo: "escartem/Frame"
//})

const handleSquirrelEvent = () => {
    if (process.argv.length === 1) {
        return false;
    }

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case "--squirrel-install":
        case "--squirrel-updated":
        case "--squirrel-uninstall":
            setTimeout(app.quit, 1000);
            return true;

        case "--squirrel-obsolete":
            app.quit();
            return true;
    }
}

if (handleSquirrelEvent()) {
    // squirrel event handled and app will exit in 1000ms, so don"t do anything else
    return;
}

let win;
let loadingScreen;
let updateLogs;


const local = app.getLocale();

const createLoadingScreen = () => {
    loadingScreen = new BrowserWindow(Object.assign({
        width: 270,
        height: 100,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        transparent: true,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    }));
    // 550
    // 475
    updateLogs = new BrowserWindow({
        width: 600,
        height: 475,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        transparent: true,
        parent: loadingScreen,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    //console.log(app.getLocale())
    //if (app.getLocale() == "fr") {
    //loadingScreen.setSize(260, 130)
    //loadingScreen.loadFile("loading.html")
    //} else {
    //loadingScreen.loadFile("loading.html")
    //}

    var hide = false;

    loadingScreen.loadFile("app/html/loading.html");
    if (app.getLocale() == "fr") {
        updateLogs.loadFile("app/html/changelogs/fr_FR/251/changelog.html");
    } else {
        updateLogs.loadFile("app/html/changelogs/en_US/251/changelog.html");
    }

    loadingScreen.on("closed", () => loadingScreen = null);

    loadingScreen.webContents.on("did-finish-load", () => {
        setTimeout(() => {
            if (hide == false) {
                loadingScreen.show();
            } else {
                loadingScreen.hide();
            }
        }, 2000)
    });

    ipcMain.on("update-logs", (evt, arg) => {
        setTimeout(() => {
            var hide = true
            loadingScreen.hide()
            updateLogs.show()
        }, 2000)
    });

    ipcMain.on("start-app", (evt, arg) => {
        updateLogs.hide()
        createWindow()
    });
}

function createWindow() {
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
    });

    updateLogsApp = new BrowserWindow({
        width: 600,
        height: 475,
        frame: false,
        resizable: false,
        alwaysOnTop: true,
        transparent: true,
        parent: win,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });


    if (app.getLocale() == "fr") {
        updateLogsApp.loadFile("app/html/changelogs/fr_FR/251/app-changelog.html");
    } else {
        updateLogsApp.loadFile("app/html/changelogs/en_US/251/app-changelog.html");
    }

    if (app.getLocale() == "fr") {
        win.loadFile("app/html/index_fr.html");
    } else {
        win.loadFile("app/html/index_en.html");
    }
    //win.loadFile("index.html")

    ipcMain.on("close-me", (evt, arg) => {
        app.quit();
    })

    ipcMain.on("minimize", (evt, arg) => {
        win.minimize();
    })

    ipcMain.on("MinMax", (evt, arg) => {
        // TODO fix this
        console.log(win.isMaximized())
        if (win.isMaximized == true){
            win.unmaximize();
        } else {
            win.maximize();
        }
        //win.isMaximized() ? win.unmaximize() : win.maximize();
    })

    ipcMain.on("open-logs", (evt, arg) => {
        //win.hide()
        updateLogsApp.show();
    })

    ipcMain.on("close-logs", (evt, arg) => {
        //win.show()
        updateLogsApp.hide();
    })

    win.on("closed", function() {
        app.quit();
    })
    win.webContents.on("did-finish-load", () => {
        if (loadingScreen) {
            loadingScreen.close();
        }
        win.show();
        //dialog.showMessageBox(null);
    });
}

app.on("ready", () => {
    //if (process.env.NODE_ENV !== "dev") startAutoUpdater(squirrelUrl)
    createLoadingScreen();
})

app.on("window-all-closed", function() {
    if (process.platform !== "darwin") app.quit();
})

app.on("activate", function() {
    if (win === null) createWindow();
})