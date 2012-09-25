Ext.define("SMgr.view.dashboard.Progress", {
	extend: "Ext.panel.Panel",
	alias: "widget.progress",
	
	requires: [
		"SMgr.view.dashboard.progress.ProgressChart"
	],
	
	title: "Evolution",
	
	layout: "fit",
	
	initComponent: function () {
		this.dockedItems = [{
			xtype: 'toolbar',
			dock: "right",
			itemId: "monthsSelectTb",
			
			defaults: {
				enableToggle: true
			},
			
			items: [{
				itemId: "septembre",
				text: "Septembre"
			}, {
				itemId: "octobre",
				text: "Octobre"
			}, {
				itemId: "novembre",
				text: "Novembre"
			}, {
				itemId: "decembre",
				text: "Decembre"
			}, {
				itemId: "janvier",
				text: "Janvier"
			}]
					
		}];

		this.items = [{
			xtype: "progressChart"
		}];
		
		this.callParent();
	}
	

	
	
	
	
});