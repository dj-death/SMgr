Ext.define("SMgr.model.Quote", {
	extend: "Ext.data.Model",
	
    fields: [
		{name: "author", type: "string"},
		{name: "content", type: "string"},
		{name: "ref", type: "string"},
		{name: "lang", type: "string"},
		{name: "image", type: "string"}
	],
	
	proxy: {
		type: 'ajax',
        url: '/quotes',
		
        reader: {
            type: 'json',
			root: "data"
        }
    }

});