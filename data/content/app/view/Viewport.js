Ext.define('SMgr.view.Viewport', {
	extend: "Ext.container.Viewport",
	
	requires: [
		'Ext.layout.container.Fit',
		'Ext.panel.Panel',
		'Ext.tab.Panel',
		'Ext.menu.Menu',
		"Ext.toolbar.Toolbar",
		"Ext.toolbar.Separator",
		"Ext.button.Button",
		"SMgr.view.Dashboard",
		"SMgr.view.Achievement",
		"SMgr.view.Settings"
	],
	
	layout: "fit",
		
	initComponent: function () {
		this.items = [{
			xtype: "panel",
			layout: "fit",
			itemId: "mainPanel",
			
			dockedItems: [{
				dock: "top",
				xtype: "toolbar",
				items: [{
					text: "Données",
					menu: {
						items: [{
							itemId: "exportData",
							text: "Exporter..."
						}, {
							itemId: "importData",
							text: "Importer..."
						}, {
							itemId: "restoreData",
							text: "Restaurer"	
						}, "-", {
							itemId: "dropAll",
							text: "Formater et Initialiser à 0"
						}]
					
					}
				}, {
					text: "Aide",
					menu: {
						items: [{
							text: "Contacter le Développeur...",
							itemId: "reportBug"
						}, {
							text: "A Propos du Logiciel...",
							itemId: "aboutMe"	
						}]
					}
				}]
			
			}],
			
			/*items: [{
				xtype: "grouptabpanel",
				items: [{
					expanded: true,
					items: [{
						title: "Tableau de Bord",
						xtype: "dashboard"
					}]
				}, {
					items: [{
						title: "Avancement",
						xtype: "achievement"	
					}]
				}, {
					items: [{
						title: "Réglages",	
						xtype: "settings"	
					}]
				}]
			}]*/
			
			items: [{
				xtype: "tabpanel",
				tabPosition: "left",
				activeTab: 0,
				
				textAlign: "center",
				
				defaults: {
					padding: "0 0 0 5"
				},
							
				items: [{
					title: "Tableau de Bord",
					xtype: "dashboard",
					
					tabConfig: {
						activeCls: "active",
						height: 70,
						border: "0 0 1 0",
						
						width: 105,
						style: {
							borderStyle: 'solid',
						}
					}
				}, {
					title: "Avancement",
					xtype: "achievement",
					
					tabConfig: {
						activeCls: "active",
						height: 70,
						width: 105,
						border: "0 0 1 0",
						style: {
							borderStyle: 'solid',
						}
					}
				}, {
					title: "Réglages",	
					xtype: "settings",
					
					tabConfig: {
						activeCls: "active",
						height: 70,
						width: 105,
						border: "0 0 1 0",
						style: {
							borderStyle: 'solid',
						}
					}
				}]
			}]
		}];
		
		this.callParent();	
	}
});