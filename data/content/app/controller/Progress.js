Ext.define("SMgr.controller.Progress", {
	extend: "Ext.app.Controller",
	uses: ["Ext.util.Format", "Ext.Date", "Ext.window.MessageBox"],
	
	stores: ["Elements", "Chapters", "ProgressHistory", "Quotes"],
	
	refs: [{
		ref: "progressView",
		selector: "progressView"
	}, {
		ref: "elementsView",
		selector: "elementsView"
	}, {
		ref: "chaptersView",
		selector: "chaptersView"
	}, {
		ref: "chart",
		selector: "progressChart"
	}, {
		ref: "totalTimeText",
		selector: "timeInvest #totalTimeText"	
	}, {
		ref: "timeGauge",
		selector: "reportPanel timeGauge"	
	}, {
		ref: "summaryPanel",
		selector: "reportPanel summaryPanel"
	}, {
		ref: "monthsSelectTb",
		selector: "progress #monthsSelectTb"	
	}, {
		ref: "progressChartPanel",
		selector: "progress"	
	}, {
		ref: "quoteView",
		selector: "quoteView"	
	}],
	
	months: [
		"Septembre", "Octobre", "Novembre", "Decembre", "Janvier"
	],
	
	monthsConfigs: {
		"Septembre": {
			isActive: false,
			fromDate : new Date(2012, 8, 1),
			toDate : new Date(2012, 8, 30)
		},
		
		"Octobre": {
			isActive: false,
			fromDate : new Date(2012, 9, 1),
			toDate : new Date(2012, 9, 31)
		},
		
		"Novembre": {
			isActive: false,
			fromDate : new Date(2012, 10, 1),
			toDate : new Date(2012, 10, 30)
		},
		
		"Decembre" : {
			isActive: false,
			fromDate : new Date(2012, 11, 1),
			toDate : new Date(2012, 11, 31)
		},
		
		"Janvier": {
			isActive: false,
			fromDate : new Date(2013, 0, 1),
			toDate : new Date(2013, 0, 31)
		}
	},
		
	init: function () {
		this.control({
			"elementsView" : {
				itemdblclick: this.changeToChaptersView
			},
			
			"chaptersView #viewBackBtn" : {
				click: this.backToPrevView	
			},
			
			"progress #septembre" : {
				toggle: this.constrainToMonth
			},
			
			"progress #octobre" : {
				toggle: this.constrainToMonth
			},
			
			"progress #novembre" : {
				toggle: this.constrainToMonth
			},
			
			"progress #decembre" : {
				toggle: this.constrainToMonth
			},
			
			"progress #janvier" : {
				toggle: this.constrainToMonth
			}
		});
		
		// Listen for associated chapters store load
        this.on({
            chaptersLoaded: this.onChaptersLoad,
            scope: this
        });
		
		this.application.on({
			achievementChanged: this.updateElement,
			scope: this
		});
	},
	
	fromDate: 0,
	toDate: 0,
	
	calcRange: function (range) {
		// hhh o is always less than anything
		if (this.fromDate === 0) {
			this.fromDate = range.fromDate;	
		}
		if (range.fromDate < this.fromDate) {
			this.fromDate = range.fromDate;
		}
		
		if (range.toDate > this.toDate) {
			this.toDate = range.toDate;
		}
	},
	
	
	
	constrainToMonth: function (btn, isPressed) {
		this.fromDate = 0;
		this.toDate = 0;
		
		var grid = this.getChart(),
			axis = grid.axes.items[0],
			range = this.monthsConfigs[btn.text],
			
			months = this.months,
			len = months.length,
			month = "",
			monthConfig = null,
			i = 0;
			
		range.isActive = isPressed;
					
		// iterate over month configs	
		for (; i < len; i++) {
			month = months[i];
			monthConfig = this.monthsConfigs[month];
			
			if (monthConfig.isActive) {
				this.calcRange(monthConfig);	
			}
		}
		
		//if initial 0 persist such as no month is active so make the whole semestre time		
		axis.fromDate = this.fromDate || new Date(2012, 8, 1);
		axis.toDate = this.toDate || new Date(2013, 0, 31);
		
		grid.redraw();
	},
	
	onLaunch: function () {
		var elmsStore = this.getElementsStore(),
			quotes = this.getQuotesStore(),
			me = this,
			
			today = new Date(),
			months = Ext.Date.monthNames,
			month,
			currMonthBtn,
			Format = Ext.util.Format;
			
		elmsStore.load({
            callback: this.onElementsLoad,
			failure: function () {
				this.showWarning("Nous N' avons Pas Pu Recupérer les Données  !<br/>Veuillez SVP Redémarrer le Logiciel ou Seulement appuyer sur le Raccourcis \"F5\" pour Actualiser<br/><br/>Nb: Pour les Laptops Veuillez Clickez sur Button \"Fn\" avant Celle de \"F5\"", true);
			},
            scope: this
        });
		
		quotes.load({
            callback: this.onQuotesLoad,
			scope: this
		});
			
		
		this.cardLayout = this.getProgressView().getLayout();
		
		// update report especially time
		setInterval(function () {
			me.updateReport();
		}, 15000);
		
		// cuz local is fr	
		months[11] = "Decembre";
		
		month = Format.lowercase(months[today.getMonth()]);
		
		currMonthBtn = this.getMonthsSelectTb().child("#" + month);
		if (currMonthBtn) {
			currMonthBtn.toggle(true);
		}

	},
	
	
	onElementsLoad: function (records) {
		var totalTime = 0,
			i = 0,
			len = (records && records.length) || 0,
			elm,
			elmTime,
			elmProgress,
			totalProgress = 0,
			
			pgChartSeriesConfig = [],
			serieConfig = null,
			maxProgress = 0,
			
			elmsStore = this.getElementsStore(),
			historyStore = this.getProgressHistoryStore();

		if (len === 0) {
			if (window.localStorage.getItem("tryTimes") === undefined) {
				window.localStorage.setItem("tryTimes", 0);
			}
			
			if (window.localStorage.getItem("tryTimes") === 0) {
				console.log('yes');
				// try once
				setTimeout(function () {
					window.location.reload();
				}, 500);
			}
			
			window.localStorage.setItem("tryTimes", 1);
		}
		
		for (; i < len; i++) {
			elm = elmsStore.getAt(i);
			
			elmTime = elm.get('spentTime');
			elmProgress = elm.get('progress');
			
			totalTime += parseFloat(elmTime);
			totalProgress += parseFloat(elmProgress);
			
			// creation of progress chart series
			serieConfig = {
				xField : "date",
				yField : elm.get("code"),
				elmName : elm.get("name")
			};
			
			pgChartSeriesConfig.push(serieConfig);
		}
		
		this.updateTotalTimeInvest(totalTime);
		
		window.localStorage.removeItem("globalSpentTime");
		window.localStorage.setItem("globalSpentTime", totalTime);
				
		this.globalProgress = Math.round((totalProgress / len) * 100) / 100;
		this.updateReport();
		
		// for performance retards loading
		historyStore.load({
            failure: function () {
				var msg = "Nous N' avons Pas Pu Recupérer les Données  !" +
							"<br/>" +
							"Veuillez SVP Redémarrer le Logiciel ou Seulement appuyer sur le Raccourcis \"F5\" pour Actualiser" +
							"<br/><br/>" +
							"Nb: Pour les Laptops Veuillez Clickez sur Button \"Fn\" avant Celle de \"F5\"";
							
				this.showWarning(msg, true);
			},
			
            scope: this
        });
		
		window.localStorage.removeItem("chartSeriesSeriesConfig");
		window.localStorage.setItem("chartSeriesSeriesConfig", JSON.stringify(pgChartSeriesConfig));
	},
	
	
	getChaptersOf: function (elementRecord) {
		var chapters = elementRecord.data.children;
		
		if (chapters.length > 0) {	
			this.fireEvent("chaptersLoaded", chapters);
		}
		
		return chapters;
	},
	
	onChaptersLoad: function (chapters) {
		// updating our chapters store
		this.getChaptersStore().loadData(chapters);
	},
	
	updateElement: function (element_code, elmNewData, totalTime) {
		var store = this.getElementsStore(),
			elm = store.findRecord("code", element_code);
		
		elm.set(elmNewData);
		elm.save({
			success: function () {
				console.log(elm.get("name"), 'updated');
				this.getChart().redraw();
			},
			
			failure: function () {
				var msg = "Nous N' avons Pas Pu Enregistrer les Changements !" +
							"<br/>Veuillez SVP Réessayez en Cliquant sur \"Enregistrer les Changements \" une Autre Fois";
				
				this.showWarning(msg, true);	
			},
			
			scope: this
		});
		
		this.updateTotalTimeInvest();
		
		this.updateTimeInvestParts(store, element_code); // why change the current setted elm and he's already changed
	},
	
	updateTimeInvestParts: function (elmsStore, element_code) {
		var totalTime = parseFloat(window.localStorage.getItem("globalSpentTime")),
			part = 0,
			elmSpentTime = 0;
			
			
		elmsStore.each(function (elm) {
			if (elm.get("code") === element_code) {
				return false;
			}
			
			elmSpentTime = elm.get("spentTime");
			part = Math.round((elmSpentTime * 100 / totalTime) * 100) / 100;
			
			elm.set("timeInvestPart", part);
			elm.save({
				success: function () {
					console.log(elm.get("name"), 'updated');
				}
			});			
		});				
	},
	
	updateTotalTimeInvest: function () {
		var totalTime = window.localStorage.getItem("globalSpentTime"),
			hours = totalTime / 60,
			txt = "Total : ";
		hours = Math.round(hours * 100) / 100;
		
		txt += Ext.util.Format.plural(hours, "Heure");
		
		this.getTotalTimeText().setText(txt);
	},
	
	
	switchToView: function (viewItemId) {
		this.cardLayout.setActiveItem(viewItemId);  // prefered than next() for clarity
	},
	
	changeToChaptersView: function (grid, elementRecord) {
		this.switchToView("chaptersView");
		
		this.getChaptersOf(elementRecord);
		
		var newTitle = this.getElementsView().title;
		newTitle += "&nbsp; >> &nbsp;";
		newTitle += elementRecord.get("name");
		
		this.getChaptersView().setTitle(newTitle);	
	},
	
	backToPrevView: function (backBtn) {
		this.cardLayout.prev();
	},
	
	syncWithTime: function () {
		var fromDate = new Date(2012, 8, 15), 
			toDate = new Date(2013, 0, 6), 
			delay = 0, 
			timeElapsed = 0,
			timeElapsedPercent = 0,
			remains = 0;
			
					
		delay = Ext.Date.getElapsed(fromDate, toDate); // how long ? in miliseconds (int)
		
		// just if studies begin really
		if (Ext.Date.between(new Date(), fromDate, toDate)) {
			timeElapsed = Ext.Date.getElapsed(fromDate); // till now
		}
		
		remains = delay - timeElapsed; // in Ms

		// elapsed time relatif to delay
		timeElapsedPercent =  (timeElapsed * 100) / delay;
		timeElapsedPercent = Math.round(timeElapsedPercent * 100) / 100;
		
		if (timeElapsedPercent > 100) {
			timeElapsedPercent = 100;
		}
		
		
		return {timeElapsedPercent : timeElapsedPercent,   remains: remains};
	},
	
	
	updateReport: function () {
		var timeGauge = this.getTimeGauge(),
			summary = this.getSummaryPanel(),
			data = this.syncWithTime();
		
		// bind with references for Achievement Controller
		window.localStorage.setItem('elapsedTimePercent', data.timeElapsedPercent);
		
		data.globalProgress = isNaN(this.globalProgress) ? 0 : this.globalProgress;
		
		timeGauge.setValue(data.timeElapsedPercent);
		summary.updateSummary(data);
	},
	
	
	showWarning: function (msg, isError) {
		Ext.Msg.show({
			title: isError ? 'Erreur' : 'Avertissement',
			msg: msg, 
			width: 400,
			buttons: Ext.Msg.OK,
			icon: isError ? Ext.MessageBox.ERROR : Ext.MessageBox.WARNING
		});	
	},
	
	
	onQuotesLoad: function (quotes) {
		if (quotes && quotes.length > 0) {
			this.getQuoteView().updateQuote(quotes[0].data);
		}
	}
});