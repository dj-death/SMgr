Ext.define("SMgr.view.dashboard.timeInvest.Chart", {
	extend: "Ext.chart.Chart",
	alias: "widget.timeInvestChart",
	
	requires: ["Ext.chart.series.Pie"],
	
	uses: ["Ext.Template"],
	
	store: "Elements",
	
	id: "timeInvestChart",
	
	animate: true,
	shadow: false,

    theme: 'SMgr:gradients',
	
	initComponent: function () {		
		
		this.series = [{
			type: 'pie',
			angleField: 'timeInvestPart',
			showInLegend: true,
			
			style: {
				"stroke-width": 0
			},
			
			tips: {
				trackMouse: true,
				width: 200,
				height: 100,
				renderer: function (storeItem, item) {
					var tpl = null, 
						values = {}, 
						nbSpentHours, 
						isInteger,
						reportTplMarkup = "<h1>{name} :</h1>" +
											"<hr/>" +
											"- <span><b>{progress} % </b> Accomplie .<br/>" +
											"- <span><b>{nbSpentHours}</b> Heures investies .</span><br/>" +
											"- Rendement : {productivity} % / Heure"; 
						
					tpl = Ext.create("Ext.Template", reportTplMarkup);
					
					values.name = storeItem.get('name');
					nbSpentHours = parseFloat((storeItem.get('spentTime') / 60).toFixed(2));
					
					isInteger = (nbSpentHours % 1) === 0;
					
					// 5.00 to 5					
					values.nbSpentHours = isInteger ? parseInt(nbSpentHours, 10) : nbSpentHours;
					 
					values.progress = storeItem.get('progress');
					values.productivity = storeItem.get("rendement");
					
					this.setTitle(tpl.apply(values));
				}
			},
			
			highlight: {
				segment: {
					margin: 20
				}
			},
			
			label: {
				field: 'name',
				display: 'rotate',
				contrast: false,
				color: '#000',
				font: '16px "Segoe UI"',
				'text-anchor': 'middle',
				
				renderer: function (v) {
					// this will change the text displayed on the pie
					var cmp = Ext.getCmp('timeInvestChart'), // id of the chart
						record = cmp.store.findRecord('name', v), // the field containing the current label
						newValue = record.data.timeInvestPart;
						
					if (newValue <= 0) {
						return "";
					}

					return newValue + " %"; // show it when none 0
				}
			}
		}];
		
		this.callParent();
	}	
});