Ext.define("SMgr.view.Settings", {
	extend: "Ext.panel.Panel",
	alias: "widget.settings",
	requires: "SMgr.view.settings.SubjectsEditor",
	
	layout: "fit",
	
	initComponent: function () {
		this.items = [{
			xtype: "subjectsEditor"
		}];
		
		this.callParent();	
	}
});