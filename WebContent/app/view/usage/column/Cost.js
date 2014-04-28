Ext.define('Ecfa.view.usage.column.Cost', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.cost',
	header : Locale.getMsg('view.usage.cost')+Locale.getMsg('view.usage.cost.'+Ecfa.Config.CURRENCY),
	dataIndex : 'cost',
	align : 'right',
	renderer : function(value, metadata, record) {
		//return Ecfa.Const.DOLLAR_PREFIX + Ecfa.Format.floatRound(value, Ecfa.Const.DOLLAR_ROUND);
		//return Ecfa.Format.currency(value);
		return parseFloat(value).toFixed(Ecfa.Const.DOLLAR_ROUND);
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}

});
