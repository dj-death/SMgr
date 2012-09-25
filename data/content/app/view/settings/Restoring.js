Ext.define("SMgr.view.settings.Restoring", {
	extend: "Ext.window.Window",
	alias: "widget.restoring",
	
	requires: ["Ext.grid.RowNumberer", "Ext.grid.column.Date", "Ext.grid.Panel"],
	
	title: "Restaurer les Données à Partir d' une Sauvegarde",
	
	height: 300,
    width: 400,
    layout: 'fit',
    
	initComponent: function () {
		this.items = [{  // Let's put an empty grid in just to illustrate fit layout
			xtype: 'grid',
			border: false,
			columns: [
				{xtype: 'rownumberer'},
				{text: 'Période de Sauvegarde', dataIndex: "date", xtype: 'datecolumn',   format: "m/d/Y H:i:s", flex: 1, sortable: true}
			],
			store: "Sauvegardes"
		}];
		
		this.callParent();
	}
	
});