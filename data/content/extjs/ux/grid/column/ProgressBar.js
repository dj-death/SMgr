Ext.define('Ext.ux.grid.column.ProgressBar', {
	extend: 'Ext.grid.column.Column',
	requires: 'Ext.ux.ProgressBar',
	alias: ['widget.progressbarcolumn'],

	header: '&#160;',

	/**
	 * @cfg {number} min
	 * The min of the progress bar, for normalization purpose. Defaults to <tt>0</tt>
	 */
	min: 0,

	/**
	 * @cfg {number} max
	 * The max of the progress bar, for normalization purpose. Defaults to <tt>100</tt>
	 */
	max: 100,

	constructor: function (config) {
		var me = this,
            cfg = Ext.apply({}, config),
            items = cfg.items || [me],
            hasGetClass,
            i,
            len;


        me.origRenderer = cfg.renderer || me.renderer;
        me.origScope = cfg.scope || me.scope;
        
        delete me.renderer;
        delete me.scope;
        delete cfg.renderer;
        delete cfg.scope;
        
        // This is a Container. Delete the items config to be reinstated after construction.
        delete cfg.items;
        me.callParent([cfg]);
		
		// Items is an array property of ActionColumns
       /* me.items = items;
        
        for (i = 0, len = items.length; i < len; ++i) {
            if (items[i].getClass) {
                hasGetClass = true;
                break;
            }
        }
        
        // Also need to check for getClass, since it changes how the cell renders
        if (me.origRenderer || hasGetClass) {
            me.hasCustomRenderer = true;
        }*/
		
		me.renderer = function (v, meta, rec, r, c, store, view) {
			
			setTimeout(function() {
				var row = view.getNode(rec);
				
				//v = Math.random()*100;
				
				var pb = Ext.create('Ext.ux.ProgressBar', {
					renderTo: Ext.fly(Ext.fly(row).query('.x-grid-cell')[c]).down('div'),
					value: v,
					min: me.min,
					max: me.max
				});
				
				me.on('resize', function(cp, w, h) {
					pb.resize(w, h);
				});
			}, 50);
		};
	},
	
	/**
	 * Destroy?
	 */
	destroy: function() {
		delete this.renderer;
		delete this.pb;
		delete this.items;
        return this.callParent(arguments);
	},
    
});