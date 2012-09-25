Ext.define("SMgr.view.dashboard.progress.ProgressChart", {
	extend: "Ext.chart.Chart",
	alias: "widget.progressChart",
	
	requires: ["Ext.chart.series.Line", "Ext.chart.axis.Numeric", "Ext.chart.axis.Time"],
		
	animate: true,
	shadow: false,
	theme: "SMgr:gradients",
	
	store: "ProgressHistory",
	
	seriesConfig: [],
	
	renderInfoTips: function (elmCode, elmName, storeItem, item) {
		var tpl = null, 
			values = {}, 
			ref, 
			done, 
			diff, 
			isLate,
			reportTplMarkup = "<h1>{name} :&nbsp;&nbsp;&nbsp;{date}</h1>" +
								  "<hr/>" +
								  "- <b>{progress} % </b> Accomplie à Cette Date.<br/>" +
								  "- Donc un {status} de <b>{diff} %</b> de ce qu'il fallait être .<br/>";/* +
								  "- Rendement : {productivity} % / Heure"; */
							
		tpl = Ext.create("Ext.Template", reportTplMarkup);
						
		ref = storeItem.get('Ref');
		done = storeItem.get(elmCode);
		diff = ref - done;
		isLate = diff > 0;
						
		values.name = elmName;
		values.date = storeItem.get('dateStr');
		values.progress = done;
		values.status = isLate ? "Retard" : "Avancement";
		values.diff = Math.abs(diff).toFixed(2);
		//values.productivity = storeItem.get("rendement");
						
		this.setTitle(tpl.apply(values));
	},
	
	createLineSerie: function (xField, yField, elmName) {
		var serie = {
				type: 'line',
				smooth: true,
				highlight: {
					size: 6,
					radius: 6
				},
				selectionTolerance: 5,
				axis: 'left',
				xField: xField,
				yField: yField,
				markerConfig: {
					type: 'circle',
					size: 2,
					radius: 2,
					'stroke-width': 2
				},
				tips: {
					trackMouse: true,
					width: 200,
					height: 100,
					renderer: Ext.pass(this.renderInfoTips, [yField, elmName])
				},
				style: {
					"stroke-width": 4
				}
			};
		
		return serie;
	},
	
	createRefSerie: function () {
		var serie = {
				type: 'line',
				smooth: true,
				highlight: {
					size: 6,
					radius: 6
				},
				selectionTolerance: 5,
				axis: 'left',
				xField: 'date',
				yField: 'Ref',
				markerConfig: {
					type: 'circle',
					size: 2,
					radius: 2,
					'stroke-width': 2
				},
				tips: {
					trackMouse: true,
					dismissDelay: 12000, // show for long time cuz it's too long
					width: 200,
					height: 250,
					renderer: function (storeItem, item) {
						var title = storeItem.get("Ref") + " % doit être déja fait " +
										"<hr/>" +
										"<b style=\"font-size: 11px\">ceci est une Ligne Réference</b> :" +
										"<br/><br/>" +
										"avec un Rythme Continue et Constant du Travail ( journalier pour tous elements ) " +
										"mais néanmoins avec Petits Pas vers la finition du Programme." +
										"<br/>" + 
										"Ainsi Elle  Permet de Faire la Comparaison avec l' avancement dans d'autres Eléments" +
										" et donc Constater Soit un Retard ou un Avancement par Rapport à ce Rythme ." +
										"<br/><br/>" +
										"Bref un Thermomètre de Votre Rythme du Révision.";
						
						this.setTitle(title);
					}
				},
				style: {
					"stroke-width": 4
				}
				
			};
			
		return serie;
	},
	
	createSeries: function (seriesConfig) {
		if (!seriesConfig) {
			return false;
		}
		var series = [],
			serie = null,
			i, 
			len = seriesConfig.length,
			serieCfg;
						
		if (len === 0) {
			seriesConfig = this.initialSeriesCfg;
			len = seriesConfig.length;	
		}	
			
		for (i = 0; i < len; i++) {
			serieCfg = seriesConfig[i];
			
			serie = this.createLineSerie(serieCfg.xField, serieCfg.yField, serieCfg.elmName);
			
			series.push(serie);
		}

		// for Ref
		serie = this.createRefSerie();
		series.push(serie);
		
		return series;
	},

	
	initComponent: function () {
		this.legend = {
			position: "top"
		};
		
		this.axes = [{
			type: 'Time',
			position: 'bottom',
			fields: ['date'],
			dateFormat: 'd M',
			dashSize: 0,
			constrain: true,
			
			label: {
				orientation: "vertical"
			}
        }, {
			type: 'Numeric',
			position: 'left',
			dashSize: 2,
			/*fields: [
				'Anglais', 'Info', 'Compta', 'Org',
				'Money', 'Problems', 'Algebre', 'Probas', 'Ref'
			],*/
			label: {
				renderer: Ext.util.Format.numberRenderer('0,0')
			},
			//title: 'Progression %',
			
			minimum: 0
		}];
		
		var chartSeriesSeriesConfig = window.localStorage.getItem("chartSeriesSeriesConfig"),
			seriesConfig = JSON.parse(chartSeriesSeriesConfig);
		
		this.series = this.createSeries(seriesConfig);
		
		this.callParent(arguments);	
		
	},
	
	initialSeriesCfg: [{
		xField: 'date',
		yField: 'Anglais',
		elmName: "Anglais"
	}, {
		xField: 'date',
		yField: 'Info',
		elmName: "Informatique"
	}, {
		xField: 'date',
		yField: 'Compta',
		elmName: "Comptabilité Analytique"
	}, {
		xField: 'date',
		yField: 'Org',
		elmName: "Théories des Organisations"
	}, {
		xField: 'date',
		yField: 'Money',
		elmName: "Economie Monétaire"
	}, {
		xField: 'date',
		yField: 'Problems',
		elmName: "Problèmes économiques et sociaux"
	}, {
		xField: 'date',
		yField: 'Algebre',
		elmName: "Algèbre I"
	}, {
		xField: 'date',
		yField: 'Probas',
		elmName: "Probabilités"
	}]
	
});