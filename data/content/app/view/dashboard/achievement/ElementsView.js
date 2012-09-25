Ext.define("SMgr.view.dashboard.achievement.ElementsView", {
	extend: "Ext.grid.Panel",
	alias: "widget.elementsView",
	
	requires: ['Ext.ux.grid.column.ProgressBar', "Ext.grid.feature.GroupingSummary"],
	
	title: "Avancement dans les Elements",
	
	store: "Elements",
	
	forceFit: true,
	
	features: [{
		ftype: "groupingsummary",
		groupHeaderTpl: "Module: {name}",
		groupByText: "Grouper par  Module",
		showGroupsText: "Afficher par Module"
	}],
	
	
	//bodyPadding: 3,
	
	hideHeaders: true,
		
	initComponent: function () {		
		this.columns = [{
			dataIndex: 'name', 
			sortable: true,
			width: 220
		}, {
			dataIndex: 'progress', 
			sortable: true, 
			xtype: "progressbarcolumn",
			
			summaryType: "average",
			summaryRenderer: function (value) {
				value = Math.round(value * 100) / 100;
				
				return "<b>" + value + " %" + "</b>";
			}
		}];
		
		
		this.callParent();
	}
	
});