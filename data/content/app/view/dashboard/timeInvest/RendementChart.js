Ext.define("SMgr.view.dashboard.timeInvest.RendementChart", {
	extend: "Ext.chart.Chart",
	alias: "widget.rendementChart",
	
	requires: ["Ext.chart.series.Bar", "Ext.chart.axis.Category", "Ext.chart.axis.Numeric"],
	
	uses: ["Ext.Template", "Ext.tip.ToolTip"],
	
	store: "Elements",
	
	animate: true,
	shadow: false,
	theme: 'SMgr:gradients',
	
	initComponent: function () {
		this.axes = [{
			type: "Numeric",
			position: "top",
			fields: ["rendement"],
			label: {
				renderer: function () {
					return "";	// to hide axis steps
				}
			},
			//title: "Rendement: % achevé / Heure",
			minimum: 0,
			dashSize: 0
		}, {
			type: "Category",
			//title: "Elements",
            position: "left",
			fields: ["name"],
			dashSize: 0,
			label: {
				renderer: function () {
					return "";	// to hide axis steps
				}
			}
			
		}];
		
		this.series = [{
			type: "bar",
			axis: "top",
			highlight: true,
			
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
											/*"- <span><b>{progress} % </b> Accomplie .<br/>" +
											"- <span><b>{nbSpentHours}</b> Heures investies .</span><br/>" +*/
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
			
			label: {
				display: 'insideEnd',
				field: 'rendement',
				orientation: 'horizontal',
				color: '#000',
				font: '16px Arial',
				'text-anchor': 'middle',
				contrast: false,
				renderer: function (v) {
					return v === 0 ? "" : v; //eliminate 0
				}
            },
			
			xField: "name",
			yField: "rendement",
			//color renderer
            renderer: function (sprite, record, attr, index, store) {
				var value = record.store.indexOf(record),
					color = SMgr.colors[value];
					
				return Ext.apply(attr, {
					fill: color
				});
			}
		}];
		
		this.callParent();	
	}
	
	
	
});