const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow	= null;

app.on("ready", () => {

	mainWindow = new BrowserWindow({
		width: 800,
		height: 600
	});

	let url = require("url").format({
		protocol: "file",
		slashes: true,
		pathname: require("path").join(__dirname, "dist/index.html")
	});

	console.log(url);

	mainWindow.loadURL(url);
	mainWindow.setFullScreen(true);
	mainWindow.focus();

	mainWindow.on('closed', function() {
		mainWindow = null
	});

});