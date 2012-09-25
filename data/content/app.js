Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', 'extjs/ux');
Ext.Loader.loadScript("third_party/bernii/gauge.min.js");

Ext.require(['Ext.chart.theme.*', 'Ext.chart.LegendItem', "Ext.grid.RowEditor"], function () {
	Ext.ns("SMgr");
	SMgr.colors = [
		'#4486C7',
		'#AED1E7',
		
		'#D9B5D5',
		'#D66091',
		
		'#BFB890',
		'#85C76D',
		
		'#FCE468',
		'#FFAA00',
		
		'#EE0000', // ref
		"#94ae0a", "#115fa6", "#a61120", "#ff8809", "#ffd13e", "#a61187", "#24ad9a", "#7c7474", "#a66111" // for + elms
	];
		
	Ext.override(Ext.chart.LegendItem, {
		/**
		 * Creates all the individual sprites for this legend item
		 */
		createLegend: function (config) {
			var me = this,
				index = config.yFieldIndex,
				series = me.series,
				seriesType = series.type,
				idx = me.yFieldIndex,
				legend = me.legend,
				surface = me.surface,
				bbox, 
				z = me.zIndex,
				markerConfig, 
				label, 
				mask,
				toggle = false;
	
			function getSeriesProp(name) {
				var val = series[name];
				return (Ext.isArray(val) ? val[idx] : val);
			}
			
			label = me.add('label', surface.add({
				type: 'text',
				x: 20,
				y: 0,
				zIndex: (z || 0) + 2,
				fill: legend.labelColor,
				font: legend.labelFont,
				text: getSeriesProp('title') || getSeriesProp('yField'),
				style: {
					'cursor': 'pointer'
				}
			}));
	
			// Line series - display as short line with optional marker in the middle
			if (seriesType === 'scatter') {
				if (series.showMarkers || seriesType === 'scatter') {
					markerConfig = Ext.apply(series.markerStyle, series.markerConfig || {}, {
						fill: series.getLegendColor(index)
					});
					me.add('marker', Ext.chart.Shape[markerConfig.type](surface, {
						fill: markerConfig.fill,
						x: 8.5,
						y: 0.5,
						zIndex: (z || 0) + 2,
						radius: markerConfig.radius || markerConfig.size,
						style: {
							cursor: 'pointer'
						}
					}));
				}
			} else { // All other series types - display as filled box
				me.add('box', surface.add({
					type: 'rect',
					zIndex: (z || 0) + 2,
					x: 0,
					y: 0,
					width: 12,
					height: 12,
					fill: series.getLegendColor(index),
					style: {
						cursor: 'pointer'
					}
				}));
			}
			
			me.setAttributes({
				hidden: false
			}, true);
			
			bbox = me.getBBox();
			
			mask = me.add('mask', surface.add({
				type: 'rect',
				x: bbox.x,
				y: bbox.y,
				width: bbox.width || 20,
				height: bbox.height || 20,
				zIndex: (z || 0) + 1,
				fill: me.legend.boxFill,
				style: {
					'cursor': 'pointer'
				}
			}));
	
			//add toggle listener
			me.on('mouseover', function () {
				label.setStyle({
					'font-weight': 'bold'
				});
				mask.setStyle({
					'cursor': 'pointer'
				});
				series._index = index;
				series.highlightItem();
			}, me);
	
			me.on('mouseout', function () {
				label.setStyle({
					'font-weight': legend.labelFont && me.boldRe.test(legend.labelFont) ? 'bold' : 'normal'
				});
				series._index = index;
				series.unHighlightItem();
			}, me);
			
			if (!series.visibleInLegend(index)) {
				toggle = true;
				label.setAttributes({
					opacity: 0.5
				}, true);
			}
	
			me.on('mousedown', function () {
				if (!toggle) {
					series.hideAll(index);
					label.setAttributes({
						opacity: 0.5
					}, true);
				} else {
					series.showAll(index);
					label.setAttributes({
						opacity: 1
					}, true);
				}
				toggle = !toggle;
				me.legend.chart.redraw();
			}, me);
			me.updatePosition({x: 0, y: 0}); //Relative to 0,0 at first so that the bbox is calculated correctly
		}
	});

	Ext.chart.theme.SMgr = Ext.extend(Ext.chart.theme.Base, {
		constructor: function (config) {
			Ext.chart.theme.Base.prototype.constructor.call(this, Ext.apply({
				colors: SMgr.colors,
				series: {
					"stroke-width": 2
				}
			}, config));
		}
	});
	
	Ext.override(Ext.grid.RowEditor, {
		saveBtnText  : 'Appliquer',
		cancelBtnText: 'Annuler',
		errorsText: 'Erreurs',
		dirtyText: 'Vous devez appliquer ou annuler vos modifications'
	});
});


Ext.application({
	name: "SMgr",
	appFolder: "app",
	
	autoCreateViewport: true,
	
	controllers: ["Settings", "Progress", "Achievement", "Content"],
	
	init: function () {
		document.title += " By DIDI Mohamed";
	},
	
	launch: function () {
		// hide native context menu		
		Ext.getBody().on('contextmenu', function (evt) {
			evt.preventDefault();
		});		
	}
});