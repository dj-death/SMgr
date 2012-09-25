Ext.define("SMgr.view.dashboard.report.Summary", {
	extend: "Ext.Component",
	alias: "widget.summaryPanel",
	
	requires: ["Ext.Template", "Ext.util.Format"],
	
	summaryTplMarkup: [
		'<b>{globalProgress} %</b> du Programme est <b>Achevé</b><br/>',
		'<b>{remains:timeCounter}</b><br/>',
		'<br/>',
		'<br/>',
		'<b>{timeElapsedPercent} %</b> du Temps est <b>Passé</b>'
	],
	
	style: {
		background: '#ffffff',
		textAlign: "center",
		fontSize: "14px",
		padding: "2px 3px 2px"
	},
			 
	initComponent: function () {
		Ext.apply(Ext.util.Format, {
			timeCounter: function (v) { // v in Ms
				var Format = Ext.util.Format,
					hourInMs = 3600000,
					
					remainsHours,
					remainsDays,
					
					hoursStr, 
					daysStr, 
					statusStr;
					
				remainsHours = v / hourInMs;
				// we want it integer
				remainsDays = Math.floor(remainsHours / 24);
				// reste du devision euclidien
				remainsHours = Math.floor(remainsHours % 24);//Math.floor(remainsHours * 10 % 24) / 10;
				
				daysStr = remainsDays === 0 ? "" : Format.plural(remainsDays, "Jour");
				hoursStr = remainsHours === 0 ? "" : Format.plural(remainsHours, "Heure");
				
				statusStr = (remainsDays === 0 && remainsHours === 0) ? "Temps Finie" : "Restant";
				
				if (remainsDays === 0 && remainsHours > 0) {
					statusStr += "e";
				}
				
				if (remainsDays > 1 || remainsHours > 1) {
					statusStr += "s";
				}

				return daysStr + " " + hoursStr + " " + statusStr;
			}
		});
		
		
		this.tpl = Ext.create('Ext.Template', this.summaryTplMarkup);
      
		this.callParent();
	},
   
	updateSummary: function (data) {
		this.tpl.overwrite(this.getEl(), data);
	}
	
});