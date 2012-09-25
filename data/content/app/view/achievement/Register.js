Ext.define("SMgr.view.achievement.Register", {
	extend: "Ext.container.Container",
	alias: "widget.register",
	
	requires: [
		"SMgr.view.achievement.ElementsList",
		"SMgr.view.achievement.TreeEditor"
	],
	
	layout: "card",
	activeItem: 0,
	
	initComponent: function () {
		this.items = [{
			xtype: "elementsList"
		}, {
			xtype: "treeEditor"
		}];
		
		this.callParent();	
	}
});