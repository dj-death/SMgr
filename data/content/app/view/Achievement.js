Ext.define("SMgr.view.Achievement", {
	extend: "Ext.container.Container",
	alias: "widget.achievement",
	
	requires: [
		"SMgr.view.achievement.Register"
	],
	
	layout: "fit",
	
	initComponent: function () {
		this.items = [{
			xtype: "register"
		}];
		
		this.callParent();
		
	}
	
});