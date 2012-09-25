Ext.define("SMgr.view.achievement.TreeEditor", {
	extend: "Ext.tree.Panel",
	alias: "widget.treeEditor",
	
	store: "ElementsTree",
	
	requires: ["Ext.tree.Panel", "Ext.grid.column.Boolean", "Ext.grid.column.Number", "Ext.grid.plugin.RowEditing", "Ext.toolbar.Toolbar", "Ext.toolbar.Fill", "Ext.button.Button", "Ext.tree.Column"],
	
	uses: ["Ext.form.field.Checkbox", "Ext.form.field.Number"],
	
	
    useArrows: true,
    rootVisible: true,

    multiSelect: true,
    singleExpand: false,
			
	plugins: [
		Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToMoveEditor: 1,
			autoCancel: false,
			errorSummary: false
		})
	],
	
	
	initComponent: function () {
		this.dockedItems = [{
			xtype: "toolbar",
			dock: "top",	
			items: [{
				text: "Retour à la Liste des Elements",
				itemId: "elmsBack"
			}]
			
		}];
		
		this.fbar = [
			"->", {
				text: "Enregistrer les Changements",
				itemId: "saveBtn"
			}, {
				text: "Réinitialiser à 0",
				itemId: "resetBtn"
			}];
		
		this.columns = [{
			xtype: "treecolumn",
			text: "Elements",
			dataIndex: "name",
			flex: 1,
            sortable: true
			
		}, {
            xtype: 'booleancolumn',
			
			falseText: "Encore",
			trueText: "Terminée",
            header: 'Statut',
            dataIndex: 'done',
            flex: 2,
			stopSelection: false,
			editor: {
				xtype: 'checkbox',
				boxLabel: "Avez Vous Terminer Cela ?",
				labelAlign: 'left',
				labelWidth: 105,
				anchor: '100%',
				listeners: {
					change: function (field, newValue) {
					}
				}
			},
			
			align: "center"
		}, {
			text: "Temps Investi (en Minutes)",
			flex: 1,

			xtype: 'numbercolumn',
			dataIndex: 'spentTime',
			
			format: "0",
			
			align: "center",
			
			editor: {
				xtype: 'numberfield',
				fieldLabel: "Durée en Minutes",
				labelAlign: 'left',
				labelWidth: 105,
				anchor: '100%',
				
				minText: "Aww Vous Pouvez Réviser en 0 Minutes ? Le Temps Minimum Raisonnable est : 5 min",
				minValue: 5,
				
				maxValue: 1440,
				maxText: "Aww Vous avez pris Tout Ce Temps pour Révisez ! Le Temps Maximum est de 1 Jour soit : 1440 min"
			}
			
			
			
		}, {
			text: "Avancement (en %)",
			flex: 0.5,

			xtype: 'numbercolumn',
			dataIndex: 'progress',
			
			align: "center"
		}];
		
		this.callParent();
	}
	
});