Ext.define("SMgr.view.achievement.ElementsList", {
	extend: "Ext.grid.Panel",
	alias: "widget.elementsList",
	
	requires: ["Ext.grid.feature.GroupingSummary", "Ext.grid.column.Boolean"],
	
	
	title: "Les Elements du Semestre",
	
	store: "Elements",
	
	forceFit: true,
	
	features: [{
		ftype: "groupingsummary",
		groupHeaderTpl: "Module: {name}",
		groupByText: "Grouper par  Module",
		showGroupsText: "Afficher par Module"
	}],
	
	hideHeaders: false,
		
	initComponent: function () {		
		this.columns = [{
			text: "Elements",
			dataIndex: "name",
			flex: 2,
            sortable: true
		}, {
            xtype: 'booleancolumn',
			
			falseText: "Encore",
			trueText: "Terminée",
            header: 'Statut',
            dataIndex: 'done',
            flex: 1
		}];
		
		
		
		this.callParent();	
	}
	
});