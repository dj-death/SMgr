Ext.define("SMgr.store.ProgressHistory", {
	extend: "Ext.data.Store",
	
	requires: "SMgr.model.ProgressHistory",
	model: "SMgr.model.ProgressHistory",
	
	autoLoad: false,
	
	sortOnLoad: true,
	sorters: [{
        sorterFn: function (record1, record2) {
			var date1 = record1.data.date,
				date2 = record2.data.date;
            if (date1 === date2) {
                return 0;
            }

            return date1 < date2 ? -1 : 1;
        },
		
		direction: 'ASC'
    }]
	
});