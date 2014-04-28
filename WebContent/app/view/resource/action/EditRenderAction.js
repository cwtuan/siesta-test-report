Ext.define('Ecfa.view.resource.action.EditRenderAction', {
	extend : 'Ecfa.action.RowEditAction',
	alias : 'widget.editRenderAction',
	record : null,
	panel : null,
	getDisabledTooltip : function(render) {
		var opAct = Ext.create('Ecfa.action.OpAction',{});
		var authDisabledTooltip = opAct.getDisabledTooltip([]); //OpAction getDisabledTooltip
		if(authDisabledTooltip != null) { //權限判斷
			return authDisabledTooltip;
		}
		return null;
	},
	getErrorMsg : function(jsonResp, originalRecord) {
		return Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.render.edit.fail'), jsonResp);
	},

	constructor : function(config) {
		var me = this;

		config.eventType = Ecfa.event.Render;
		config.disabledTooltip = me.getDisabledTooltip(config.record);
		config.defaultTooltip = Locale.getMsg('view.common.edit');
		me.callParent([ config ]);
	}

});
