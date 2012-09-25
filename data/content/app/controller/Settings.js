Ext.define("SMgr.controller.Settings", {
	extend: "Ext.app.Controller",
	
	requires: ["SMgr.view.settings.Restoring"],
	uses: ["Ext.window.MessageBox", "SMgr.view.settings.ReportBug"],
	
	stores: ["Sauvegardes"],
	
	init: function () {
		this.control({
			"viewport #mainPanel #exportData": {
				click: this.onExport
			},
			
			"viewport #mainPanel #importData": {
				click: this.onImport
			},
			
			"viewport #mainPanel #restoreData": {
				click: this.showRestoreDialog	
			},
			
			"viewport #mainPanel #dropAll": {
				click: this.dropAll	
			},
			
			"restoring grid": {
				itemdblclick: this.restoreTo
			},
			
			"viewport #mainPanel #reportBug": {
				click: this.showReportBugForm
			},
			
			"viewport #mainPanel #aboutMe": {
				click: this.showAboutMe	
			}
			
		});
	},
	
	onLaunch: function () {
		
	},
	
	onExport: function () {
		window.launchExport();
	},
	
	
	onImport: function () {
		var msg = "Vous Devez Choisir Une Resource à Partir duquelle Vous Allez Importer Les Données !",
			handler = function (buttonId) {
				if (buttonId === "yes") {
					window.launchImport();
				}
				
			};
		
		this.askUserPermission(msg, handler);
	},
	
	showRestoreDialog: function () {
		Ext.createWidget("restoring").show();
	},
	
	restoreTo: function (grid, record) {
		var msg = "Voulez Vous Restaurez vos Données à cette Période là ?<br/><br/>Vous Pouvez à tout Moment Annuler la Restauration en Choisissant une Autre Période !",
			handler = function (buttonId) {
				if (buttonId === "yes") {
					window.restoreTo(record.get('id'));
				}
			};
		
		this.askUserPermission(msg, handler);
	},
	
	dropAll: function (btn) {
		var msg = "Si Vous Continuer Vous Perdriez Tous Vos Données et Retourner à l' Etat Usine!<br/>Mais Vous Pouvez Restaurer Vos Données à Cette Periode et Retrouver Vos Données Supprimées Une Autre Fois ! ",
			handler = function (buttonId) {
				if (buttonId === "yes") {
					window.dropAll();
				}
				
			};
			
		
		this.askUserPermission(msg, handler);
	},
	
	
	showReportBugForm: function () {
		var reportBugForm = Ext.create("SMgr.view.settings.ReportBug");
		
		reportBugForm.show();
	},
	
	
	showAboutMe: function () {
		var info = "<h1>Studies Intelligence </h1>" +
					"Version " + appVersion +
					"<hr/>" +
					"<br/>" +
					"<b>Développeur : </b>" + "DIDI Mohamed" + "<br/>" +
					"<p> &nbsp;Un Etudiant en Faculté des Sciences Juridiques et Sociales De Meknès" +
					" en 2<sup>.5 éme</sup> Année Economie et Gestion .Un Passioné De l' Univers" +
					" de Programmation et en meme temps de l' Entrepreunariat et Projets .</p>" +
					"<br/>" +
					"http://www.facebook.com/CEO.DIDI" + "<br/>" +
					"<br/>" +
					"<b>Studies Intelligence</b> est Un Logiciel Conçu Par un Etudiant Pour les Etudiants !" +
					"Qui a Pour Objectif d' Optimiser les Révisions et les Etudes !" +
					" Nous Sommes en Siécle de Données !Tous Doit être calculé et analysé" +
					"  pour Mieux Faire.";

		Ext.Msg.show({
			title: 'A Propos du Studies Intelligence',
			msg: info, 
			width: 400,
			buttons: Ext.MessageBox.OK,
			icon: Ext.MessageBox.INFO
		});	
	},
	
	askUserPermission: function (msg, handler, scope, args, appendArgs) {
		Ext.Msg.show({
			title: 'Avertissement',
			msg: msg, 
			width: 400,
			buttons: Ext.MessageBox.YESNO,
			icon: Ext.MessageBox.QUESTION,
			fn: Ext.bind(handler, scope, args, appendArgs)
		});	
	}
	
});
	