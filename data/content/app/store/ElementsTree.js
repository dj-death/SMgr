Ext.define("SMgr.store.ElementsTree", {
	extend: "Ext.data.TreeStore",
	requires: "SMgr.model.ElementTree",
	
	model: "SMgr.model.ElementTree",

	proxy: {
		type: "memory"
	}

});