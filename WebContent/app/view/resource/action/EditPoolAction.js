Ext.define('Ecfa.view.resource.action.EditPoolAction', {
	extend : 'Ecfa.action.RowEditAction',
	alias : 'widget.editPoolAction',
	record : null,
	panel : null,
	getDisabledTooltip : function(pool) {
		var opAct = Ext.create('Ecfa.action.OpAction',{});
		var authDisabledTooltip = opAct.getDisabledTooltip([]); //OpAction getDisabledTooltip
		if(authDisabledTooltip != null) { //權限判斷
			return authDisabledTooltip;
		}
		if(pool.get('status') == Ecfa.Const.Pool.STATUS.INACTIVE){ // 不可操作下線資源池
			return Locale.getMsg('view.resource.pool.operate.inactiveTooltip');
		}
		return null;
	},
	getErrorMsg : function(jsonResp, originalRecord) {
		return Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.pool.edit.fail'), jsonResp);
	},

	constructor : function(config) {
		var me = this;

		config.eventType = Ecfa.event.Pool;
		config.disabledTooltip = me.getDisabledTooltip(config.record);
		config.defaultTooltip = Locale.getMsg('view.common.edit');
		me.callParent([ config ]);
	}

});
