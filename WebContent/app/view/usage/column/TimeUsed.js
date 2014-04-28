Ext.define('Ecfa.view.usage.column.TimeUsed', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.timeUsed',
	header : Locale.getMsg('view.usage.uframe.timeUsed'),
	dataIndex : 'timeUsed',
	align : 'right',
	renderer : function(value, metadata, record) {		
		return Ecfa.Format.secondsToTime(value);
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}

});
