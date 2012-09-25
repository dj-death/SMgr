Ext.define('SMgr.view.settings.subjects.ElementsEditor', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.elementsEditor',
	
	requires: ["Ext.grid.plugin.RowEditing", "Ext.grid.column.Action"],
	
	uses: "Ext.form.field.Text",
	
    store: 'Elements',
	
    initComponent: function () {
		var me = this;
		this.rowEditor = Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToMoveEditor: 1,
			autoCancel: false
		});

		this.plugins = [
			this.rowEditor
		];
		
        this.columns = [
            {
                header: 'Intitulé',
                dataIndex: 'name',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                },
                flex: 1
            },
            {
                header: 'Code',
                dataIndex: 'code',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                },
                width: 100
            },
			{
                header: 'Module',
                dataIndex: 'module',
                editor: {
                    xtype: 'textfield',
                    allowBlank: false
                },
                flex: 1
            },
			/*{
                header: 'Coefficient',
                dataIndex: 'quota',
                editor: {
                    xtype: 'numberfield',
                    allowBlank: true,
					value: 1,
                },
                width: 100
            },*/
            {
                xtype: 'actioncolumn', 
                width: 60,
                items: [{
                    icon: 'resources/images/edit.png',
                    tooltip: 'Editer le Contenu de Cet Element',
                    handler: function (grid, rowIndex, colIndex) {
                        me.fireEvent('elmContentEdit', {
                            rowIndex: rowIndex,
                            colIndex: colIndex,
							record: grid.getStore().getAt(rowIndex)
                        });
                    }
					
                }, {
                    icon: 'resources/images/delete.png',
                    tooltip: 'Supprimer Cet Element',
                    handler: function (grid, rowIndex, colIndex) {
                        me.fireEvent('elmDelete', {
                            rowIndex: rowIndex,
                            colIndex: colIndex,
							record: grid.getStore().getAt(rowIndex)
                        });
                    }                
                }]
            }
        ];
		
        this.dockedItems = [{
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    text: 'Ajouter un Element',
					itemId: "addElement"
                }
            ]
        }];
        this.callParent(arguments);
    }
});
