Ext.define("SMgr.view.settings.SubjectsEditor", {
	extend: "Ext.panel.Panel",
	alias: "widget.subjectsEditor",
	
	title: "Réglage des Matières",
	
	requires: [
		"SMgr.view.settings.subjects.ElementsEditor",
		"SMgr.view.settings.subjects.ContentTree"
	],
	
	layout: "card",
	activeItem: 0,
	
	initComponent: function () {
		this.items = [{
			xtype: "elementsEditor"
		}, {
			xtype: "contentTree"
		}];
		
		this.callParent();	
	}
});