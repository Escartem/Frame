// maximize utils
let isMaximized = false;

function toggleMaximize() {
	if (isMaximized) {
		Neutralino.window.unmaximize();
	} else {
		Neutralino.window.maximize();
	}

	isMaximized = !isMaximized;
}

// double click shortcut
document.addEventListener("dblclick", (e) => {
	if (document.getElementById("buttons").contains(e.target)) {
		return
	}

	if (!isMaximized) {
		toggleMaximize();
	}
})

// dragging utils
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

document.addEventListener("mousedown", (e) => {
	if (document.getElementById("buttons").contains(e.target)) {
		return;
	}

	if (isMaximized) {
		offsetX = e.screenX / window.innerWidth;
		offsetY = e.screenY / window.innerHeight;

		toggleMaximize();

		Neutralino.window.getSize().then((size) => {
			const newX = e.screenX - (size.width * offsetX);
			const newY = e.screenY - (size.height * offsetY);

			Neutralino.window.move(parseInt(newX), parseInt(newY));

			Neutralino.window.getPosition().then((position) => {
				offsetX = e.screenX - position.x;
				offsetY = e.screenY - position.y;
				isDragging = true;
			})
		})
	} else {
		Neutralino.window.getPosition().then((position) => {
			offsetX = e.screenX - position.x;
			offsetY = e.screenY - position.y;
			isDragging = true;
		})
	}
})

document.addEventListener("mousemove", (e) => {
	if (isDragging) {
		Neutralino.window.move(e.screenX - offsetX, e.screenY - offsetY);
	}
})

document.addEventListener("mouseup", (e) => {
	isDragging = false;
})

// handle closing
function closeApp() {
	document.body.style.opacity = 0;

	setTimeout(() => {
		Neutralino.app.exit();
	}, 125)
}

function onWindowClose() {
	Neutralino.app.exit();
}

// init
Neutralino.init();
Neutralino.events.on("windowClose", onWindowClose);

// resize workaround
window.Neutralino.window.setSize(window.Neutralino.window.getSize());

// no more right click
window.addEventListener("contextmenu", (event) => event.preventDefault());

const textData = {
	"fr": {
		"close": "Fermer",
		"max": "Plein écran",
		"min": "Minimiser",
		"update": "Une mise à jour est disponible, l'installer ?",
		"yes": "Oui",
		"no": "Non"
	},
	"en": {
		"close": "Close",
		"max": "Fullscreen",
		"min": "Minimize",
		"update": "An update is available, install it ?",
		"yes": "Yes",
		"no": "No"
	}
}

// update for lang
let lang;

Neutralino.app.getConfig().then(async (config) => {
	let appVersion = config["version"];
	var navlang = navigator.language || navigator.userLanguage;

	lang = navlang === "fr" ? "fr" : "en";

	vex.dialog.buttons.YES.text = textData[lang]["yes"];
	vex.dialog.buttons.NO.text = textData[lang]["no"];
	vex.defaultOptions.escapeButtonCloses = false;
	vex.defaultOptions.overlayClosesOnClick = false;

	// await checkUpdates();

	document.getElementById("closeBtn").title = textData[lang]["close"]
	document.getElementById("maxBtn").title = textData[lang]["max"]
	document.getElementById("minBtn").title = textData[lang]["min"]
	
	document.getElementById("iframe").src = `https://ena.escartem.moe/projects/frame?version=${appVersion}&lang=${lang}`;
})

// update app
// doesn't work well yet, to fix later
async function checkUpdates() {
	try {
		let url = "https://ena.escartem.moe/projects/frame/updates/manifest.json";
		let manifest = await Neutralino.updater.checkForUpdates(url);

		if (manifest.version != NL_APPVERSION) {
			vex.dialog.confirm({
				message: textData[lang]["update"],
				callback: async (value) => {
					if (value) {
						await Neutralino.updater.install();
						await Neutralino.app.restartProcess();
					} else {
						console.log("Cancelled update");
					}
				}
			})
		}
	} catch(err) {
		console.error(err);
	}
}
