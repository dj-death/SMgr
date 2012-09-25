Ext.define("SMgr.view.dashboard.achievement.ChaptersView", {
	extend: "Ext.grid.Panel",
	alias: "widget.chaptersView",
	
	requires: ['Ext.ux.grid.column.ProgressBar'],
	
	title: 'Sélectionner un élément pour voir ses détails.',
	
	store: "Chapters",
	
	forceFit: true,
	
	hideHeaders: true,
		
	initComponent: function () {
		this.bodyStyle = {
			background: "#fff"
		};
		
		this.dockedItems = [{
			dock: "bottom",
			xtype: "toolbar",
			items: [{
				text: "Retour",
				itemId: "viewBackBtn"
			}]
		}];
		

		
		this.columns = [{
			dataIndex: "name",
			sortable: true,
			flex: 2
		}, {
			dataIndex: 'progress', 
			sortable: true, 
			xtype: "progressbarcolumn",
			flex: 1
		}];
		
		this.callParent();
	}
	
});