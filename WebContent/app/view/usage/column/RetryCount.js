Ext.define('Ecfa.view.usage.column.RetryCount', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.retryCount',
	//header : Locale.getMsg('view.usage.ufame.retryCount'),
	header : Locale.getMsg('view.frame.startCount'),
	dataIndex : 'retryCount',
	align : 'right',	
	renderer : function(value, m, record) {
		return value+ 1;					
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}

});
