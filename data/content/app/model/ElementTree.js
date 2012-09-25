Ext.define("SMgr.model.ElementTree", {
	extend: "Ext.data.Model",
	
	fields: [
		{name: "name", type: "string"},
		{name: "code", type: "string"},
		{name: "done", type: "boolean", defaultValue: false},
		{name: "quota", type: "float"},
		{name: "module", type: "string"},
		{name: "spentTime", type: "float", defaultValue: 0},
		{name: "progress", type: "float", defaultValue: 0}
	]
		
});