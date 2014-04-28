Ext.define('Ecfa.view.queue.column.NumTotal', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.numTotal',	
	header : Locale.getMsg('view.queue.count.total'),
	dataIndex : 'numTotal',
	align : 'right',
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}

});
