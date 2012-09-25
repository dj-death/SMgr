Ext.define("SMgr.view.dashboard.report.TimeGauge", {
	extend: "Ext.Component",
	alias: "widget.timeGauge",
	
	uses: ["Ext.Date", "Ext.Number", "Ext.DomHelper"],
	
	autoEl: {
        tag: 'canvas',
        cls: 'time-gauge'
    },
	
	gauge: null,
	
	style: {
		background: "white"
	},
	
	configOptions: {
		colorStart: "#6fadcf",
		colorStop: void 0,
		strokeColor: "#e0e0e0",
		pointer: {
			length: 0.8,
			strokeWidth: 0.035
		},
		angle: 0,
		lineWidth: 0.44,
		fontSize: 40
	},
	
	 // Add custom processing to the onRender phase.
    // Add a ‘load’ listener to the element.
    onRender: function () {
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        this.callParent(arguments);
		
		var html = {
			tag: "div",
			cls: "time-gauge-text"
		}; 
		
		this.textField = Ext.DomHelper.insertBefore(this.el, html, true);
		
        this.gauge = new Gauge(this.el.dom).setOptions(this.configOptions); // create sexy gauge!
		
		//this.setTextField(this.textField);
		
		this.gauge.animationSpeed = 32; // set animation speed (32 is default value)
		this.setMaxValue(10000); // we want 100 but it seems it doesn't work weel with float value
    },

    setValue: function (newValue) {
		newValue = newValue || 1; // fix bug ( a not demi circle of 180 deg )
		
        this.gauge.set(newValue * 100);
    },

    setMaxValue: function (maxValue) {
        this.gauge.maxValue = maxValue;
    },
	
	setTextField: function (elm) {
		this.gauge.setTextField(elm.dom);
	}
	
	
	
});