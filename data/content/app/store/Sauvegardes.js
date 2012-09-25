Ext.define("SMgr.store.Sauvegardes", {
	extend: "Ext.data.Store",
	requires: "SMgr.model.Sauvegarde",
	model: "SMgr.model.Sauvegarde",
	
	autoLoad: true,
	autoDestroy: false
	
});