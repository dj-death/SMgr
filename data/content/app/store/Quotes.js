Ext.define("SMgr.store.Quotes", {
	extend: "Ext.data.Store",
	requires: "SMgr.model.Quote",
	model: "SMgr.model.Quote",
	
	autoLoad: false,
	autoDestroy: false
	
});