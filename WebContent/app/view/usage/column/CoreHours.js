Ext.define('Ecfa.view.usage.column.CoreHours', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.coreHours',
	header : Locale.getMsg('view.usage.coreHours'),
	dataIndex : 'coreHours',
	align : 'right',
	renderer : function(value, metadata, record) {
		//return Ecfa.Format.floatRound(value, Ecfa.Const.DOLLAR_ROUND+1);
		return parseFloat(value).toFixed(Ecfa.Const.DOLLAR_ROUND);
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}

});
