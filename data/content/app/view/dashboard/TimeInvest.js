Ext.define("SMgr.view.dashboard.TimeInvest", {
	extend: "Ext.panel.Panel",
	alias: "widget.timeInvest",
	title: "Temps Investie",
	
	requires: [
		"SMgr.view.dashboard.timeInvest.Chart",
		"SMgr.view.dashboard.timeInvest.RendementChart",
		"Ext.toolbar.TextItem"
	],
	
	layout: {
		type: "hbox",
		align: "stretch"
	},
	
	initComponent: function () {
		this.dockedItems = [{
			xtype: "toolbar",
			dock: "bottom",
			items: [{
				itemId: "totalTimeText",
				xtype: "tbtext",
				
				style: {
					fontSize: "12px"	
				}
			}]
		}];
				
		this.items = [{
			xtype: "container",
			flex: 1,

			layout: {
				type: "vbox",
				align: "stretch"
			},
			
			items: [{
				xtype: "timeInvestChart",
				flex: 10
			}, {
				xtype: "box",
				html: "Distribution du Temps",
				style: {
					textAlign: "center",
					fontSize: "16px",
					fontFamily: "Segoe UI"
				},
				flex: 1
			}]
			
		}, {
			xtype: "container",
			flex: 1,

			layout: {
				type: "vbox",
				align: "stretch"
			},
			
			items: [{
				xtype: "rendementChart",
				flex: 10
			}, {
				xtype: "box",
				style: {
					textAlign: "center",
					fontSize: "16px",
					fontFamily: "Helvetica"
				},
				html: "Rendement: % achevé / Heure",
				flex: 1
			}]
		}];
	
		this.callParent();
	}
			
	
	
	
});