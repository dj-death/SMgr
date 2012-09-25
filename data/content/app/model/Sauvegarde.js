Ext.define("SMgr.model.Sauvegarde", {
	extend: "Ext.data.Model",
	
	fields: [{
		name: "date",
		type: "date",
		format: "m/d/Y H:i:s"
	}, {
		name: "id",
		type: "int",
		convert: null	
	}],
	
	proxy: {
		type: 'ajax',
        url: '/sauvegardes',
		
        reader: {
            type: 'json',
			root: "data"
        }
    }
	
	
});