Ext.define('Ecfa.view.queue.column.Product', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.missionProduct',
	header : Locale.getMsg('view.job.renderEngine'),
	dataIndex : 'product',	
	renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
		metadata.tdAttr = 'data-qtip="' + value + '"';
		return value;
	},
	
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
		
	}

});
