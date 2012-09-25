Ext.define("SMgr.model.ProgressHistory", {
	extend: "Ext.data.Model",
	uses: "Ext.util.Format",
	
	idProperty: '_id',
	
    fields: [
        {
            name: '_id',
            type: 'string'
        },
		{name: "Anglais", type: "float"},
		{name: "Info", type: "float"},
		{name: "Compta", type: "float"},
		{name: "Org", type: "float"},
		{name: "Money", type: "float"},
		{name: "Problems", type: "float"},
		{name: "Algebre", type: "float"},
		{name: "Probas", type: "float"},
		{name: "Ref", type: "float"},

		{name: "date", type: 'date', dateFormat: 'Y-m-d'},
		{
			name: "dateStr", 
			type: 'string', 
			convert: function (val, record) {
				var date = record.data.date;
				
				return Ext.util.Format.date(date, "Y-m-d");
			}
		}
	],
		
	proxy: {
		type: 'rest',
        url: '/history',
		
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
	}
	
});