Ext.define("SMgr.model.Element", {
	extend: "Ext.data.Model",
	
	idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
		{name: "name", type: "string"},
		{name: "code", type: "string"},
		{name: "done", type: "boolean"},
		{name: "expanded", type: "boolean", defaultValue: false}, // rememberin the last element viewed
		{name: "quota", type: "float"},
		{name: "progress", type: "float", defaultValue: 0},
		{name: "spentTime", type: "float", defaultValue: 0},
		{name: "timeInvestPart", type: "float", defaultValue: 0},
		{name: "rendement", type: "float", defaultValue: 0},
		{name: "module", type: "string"},
		{name: "children", type: "auto"}
	],
	
	proxy: {
		type: 'rest',
        url: '/elements',
		
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }

});