Ext.define('Ecfa.view.queue.AnalysisAssetView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.analysisAssetView',
	layout : {
		type : 'vbox',
		align : 'stretch',
		pack : 'start'
	},
	border : false,
	initComponent : function() {
		var me = this;

		me.items = [ {
			itemId : 'text',
			xtype : 'component',
			html : '',
			padding : '10 10 10 10',
			style : {
				color : '#740404',
				backgroundColor : '#FFFFD4'
			},
			flex : 1
		}, {
			xtype : 'assetGrid',
			flex : 3
		} ];

		me.callParent(arguments);

		Ecfa.event.Track.on({
			analysis : function(result) {

				var msg = me.up('submitCheck').analysisParser(result);
				me.down('#text').update(msg);
			}
		});
	}

});
