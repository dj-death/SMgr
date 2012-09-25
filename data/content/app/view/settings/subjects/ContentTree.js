Ext.define("SMgr.view.settings.subjects.ContentTree", {
	extend: "Ext.tree.Panel",
	alias: "widget.contentTree",
	
	requires: [
		"Ext.grid.plugin.RowEditing", "Ext.grid.plugin.RowEditing",
		"Ext.grid.column.Number",
		"Ext.toolbar.Toolbar", 
		"Ext.toolbar.Fill", 
		"Ext.button.Button", 
		"Ext.tree.Column"
	],
	
	store: "ElementsTree",
	
	border: 5,
	
    useArrows: true,
    rootVisible: true,

    multiSelect: true,
    singleExpand: false,
	
	initComponent: function () {
		this.dockedItems = [{
			xtype: "toolbar",
			dock: "top",	
			items: [{
				text: "Retour à la Liste des Elements",
				itemId: "elmsEditorBack"
			}]
			
		}];
		
		this.fbar = [
			"->", 
			{
				text: "Enregistrer les Changements",
				itemId: "saveBtn"
			}, {
				text: "Réinitialiser à 0",
				itemId: "resetBtn"
			}];
		
		this.plugins = [
			Ext.create('Ext.grid.plugin.RowEditing', {
				clicksToMoveEditor: 1,
				autoCancel: false
			})
		];
		
		this.columns = [{
			xtype: "treecolumn",
			text: "Titre",
			dataIndex: "name",
			flex: 1,
            sortable: true,
			editor: {
				xtype: "textfield"	
			}
		}, {
			text: "Quota (% part Approximative du Volume Total du Contenaire)",
			flex: 1,

			xtype: 'numbercolumn',
			dataIndex: 'quota',
			
			format: "0.00",
			
			align: "center",
			
			editor: {
				xtype: 'numberfield'
			}
		}];
		
		this.callParent();
	}
	
});