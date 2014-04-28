Ext.define('Ecfa.view.problem.action.EditProblemAction', {
	extend : 'Ecfa.action.RowEditAction',
	alias : 'widget.editProblemAction',
	record : null,
	panel : null,
	getDisabledTooltip : function() {
		var opAct = Ext.create('Ecfa.action.OpAction',{});
		var authDisabledTooltip = opAct.getDisabledTooltip([]); //OpAction getDisabledTooltip
		if(authDisabledTooltip != null) { //權限判斷
			return authDisabledTooltip;
		}
		return null;
	},
	getErrorMsg : function(jsonResp, originalRecord) {
		return Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.problem.edit.status.fail'), jsonResp);
	},

	constructor : function(config) {
		var me = this;

		config.eventType = Ecfa.event.Render;
		config.disabledTooltip = me.getDisabledTooltip();
		config.defaultTooltip = Locale.getMsg('view.problem.edit.status');
		me.callParent([ config ]);
	}

});
