Ext.define("SMgr.view.dashboard.QuoteView", {
	extend: "Ext.Component",
	alias: "widget.quoteView",
	
	requires: "Ext.Template",
	
	quoteTplMarkup: [
		'<div class="mb-wrap mb-style-3">',
			'<blockquote cite="">',
				'<p>{content}</p>',
			'</blockquote>',
			'<div class="mb-attribution">',
				'<div class="mb-thumb"></div>',
				'<div class="quote-info">',
					'<p class="mb-author">{author}</p>',
					'<cite class="mb-cite">{ref}</cite>',
				'</div>',
				'<hr class="separation" />',
			'</div>',
		'</div>'
	],
	
	style: {
		overflow: "auto"
	},
			 
	initComponent: function () {
		this.tpl = Ext.create('Ext.Template', this.quoteTplMarkup);
		
		this.callParent();
	},
   
	updateQuote: function (data) {
		this.tpl.overwrite(this.getEl(), data);
		
		var thumb = this.getEl().down(".mb-thumb"),
			url = data.image || "unknown.png",
			p;
		
		thumb.setStyle("background", "url(../images/" + url + ") no-repeat center center white");
		
		if (data.lang === "ar") {
			p = this.getEl().down("p");
			p.setStyle("font-family", "arabswell_1");   
		}
	}
	
});