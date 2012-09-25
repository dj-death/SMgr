Ext.define("SMgr.view.Dashboard", {
	extend: "Ext.container.Container",
	alias: "widget.dashboard",
	
	requires: [
		"SMgr.view.dashboard.Progress",
		"SMgr.view.dashboard.Report",
		"SMgr.view.dashboard.ProgressView",
		"SMgr.view.dashboard.TimeInvest",
		"SMgr.view.dashboard.QuoteView"
	],
	
	layout: "border",
	
	border: false,
	
	initComponent: function () {
		this.items = [{
			region: "north",
			xtype: "container",
			flex: 1,
			layout: {
				type: "hbox",
				align: "stretch"
			},
			items: [{
				xtype: "reportPanel",
				flex: 0.8
			}, {
				xtype: "progress",
				flex: 3.5
			}]
			
		}, {
			region: "center",
			xtype: "progressView",
			flex: 2
		}, {
			region: "east",
			flex: 1.5,
			xtype: "timeInvest"
		}, {
			region: "west",
			xtype: "quoteView",
			flex: 0.8
		}];
		
    
		this.callParent();
	}
	
});