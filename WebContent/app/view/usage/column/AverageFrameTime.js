Ext.define('Ecfa.view.usage.column.AverageFrameTime', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.averageFrameTime',
	header : Locale.getMsg('view.usage.averageFrameTime'),
	dataIndex : 'averageFrameTime',
	align : 'right',
	renderer : function(value, metadata, record) {
		return Ecfa.Format.secondsToTime(Ecfa.Format.floatRound(value,2));
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}

});
