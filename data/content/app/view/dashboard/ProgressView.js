Ext.define("SMgr.view.dashboard.ProgressView", {
	extend: "Ext.container.Container",
	alias: "widget.progressView",
	
	requires: [
		"SMgr.view.dashboard.achievement.ElementsView",
		"SMgr.view.dashboard.achievement.ChaptersView"
	],
	
	layout: "card",
	activeItem: 0,

	initComponent: function () {
		this.items = [{
			itemId: 'elementsView',
			xtype: "elementsView"
		}, {
			itemId: 'chaptersView',
			xtype: "chaptersView"
		}];
		
		this.callParent();	
	}
});