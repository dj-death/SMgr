Ext.define("SMgr.view.dashboard.Report", {
	extend: "Ext.container.Container",
	alias: "widget.reportPanel",
	
	requires: [
		"SMgr.view.dashboard.report.TimeGauge",
		"SMgr.view.dashboard.report.Summary"
	],
	
	layout: {
		type: "vbox",
		align: "stretch"
	},
	
	initComponent: function () {
		this.items = [{
			xtype: "summaryPanel",
			flex: 1.5
		}, {
			xtype: "timeGauge",
			flex: 2		
		}];
		
		this.callParent();
	}
	
});