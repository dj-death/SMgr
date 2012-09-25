Ext.define("SMgr.store.Elements", {
	extend: "Ext.data.Store",
	requires: "SMgr.model.Element",
	
	model: "SMgr.model.Element",

	groupField: 'module',
	
	sorters: [{
		property : '_id',
		direction: 'ASC'
	}],
	
	sortOnLoad: true

});