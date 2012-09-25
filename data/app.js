var app = require("appjs"),
	Express = require("express"),
	server = Express.createServer(),
	// our silent autoupdater
	update = require('./updater').update,
	// our defined action for routers
	routes = require('./routes'),
	// our data tools for restore / import / export data
	dataTools = require('./data_tools'),
	
	pkginfo = require('pkginfo')(module),
	
	window,
	showDialog;
	
process.title = "Studies Intelligence";

/**
 * Here is our app window application
 */
window = app.createWindow({
	width  : 1024,
	height : 700,
	icons  : __dirname + '/icons',
	url: "http://localhost:3000/"
});

function showInfo(msg, doReload) {
	window.alert(msg);
	
	if (doReload) {
		window.reload();	
	}
}	


function processDataTool(dialogOpts, operation) {
		
	function onFileSelected(err, files) {
		var filePath = files[0];
		
		if (err) {
			return false;
		}
			
		operation(filePath, showInfo);
	}
		
	window.frame.openDialog(dialogOpts, onFileSelected);	
}

window.on('create', function () {
	window.frame.show();
	window.frame.maximize();
});

window.on('ready', function () {
	window.document.title += module.exports.version;
	window.appVersion = module.exports.version;

	window.reload = function () {
		window.document.location.reload();
	};
	
	window.launchExport = function () {
		var dialogOpts = {
				type: "save",
				title: "Exporter sous...",
				acceptTypes: ["*.SMgr"]
			};
			
		processDataTool(dialogOpts, dataTools.exportData);
	};
	
	window.launchImport = function () {
		var dialogOpts = {
				type: "open",
				title: "Importer de...",
				acceptTypes: ["*.SMgr"]
			};
			
		processDataTool(dialogOpts, dataTools.importData);
	};		
	
	window.restoreTo = function (timeStamp) {
		dataTools.restoreData(timeStamp, showInfo);
		
	};
	
	window.dropAll = function () {
		// create a sauvegarde and after drop	
		dataTools.dump(function () {
			routes.DropAll();
			window.reload();
		});
	};
	
	window.addEventListener('keydown', function (e) {
		if (e.keyIdentifier === 'F12' || (e.keyCode === 74 && e.metaKey && e.altKey)) {
			window.frame.openDevTools();
		}
		
		if (e.keyIdentifier === 'F5') {
			window.reload();
		}
	});
  
});

window.on('close', function () {
});

// Express Js Configuration
server.configure(function () {
    server.use(Express.bodyParser());//parse JSON into objects
    server.use(Express.methodOverride());
    server.use(server.router);
    server.use(Express.static(__dirname + '/content'));
});

server.configure('development', function () {
    server.use(Express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

server.configure('production', function () {
    server.use(Express.errorHandler());
});

// Routes
routes.init(window);
// home page
server.get('/', routes.index);

server.get('/elements', routes.loadElements);
server.post('/elements', routes.newElement);
server.get('/elements/:id', routes.getElement);
server.put('/elements/:id', routes.updateElement);
server.del('/elements/:id', routes.destroyElement);

server.get('/history', routes.loadHistory);
server.post('/history', routes.newHistory);
server.get('/history/:id', routes.getHistory);
server.put('/history/:id', routes.updateHistory);
server.del('/history/:id', routes.destroyHistory);

server.get('/sauvegardes', routes.loadSauvegardes);

server.get('/quotes', routes.loadQuotes);

server.all('/report_bug', routes.reportBug);

app.router.handle = server.handle.bind(server);
server.listen(3000);

// fetch update
update(function () {
	showInfo("une Mise à Jour à été Installée ! Veuillez Fermer l' Application et la Lançer à Nouveau Pour que Les Changements soient Appliquées !");
}, function () {
	showInfo("une Nouvelle Version du Logicielle est Disponible ! Veuillez la Télécharger du Site!");
});