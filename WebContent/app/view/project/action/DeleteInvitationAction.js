Ext.define('Ecfa.view.project.action.DeleteInvitationAction', {
	extend : 'Ecfa.action.DeleteAction',
	alias : 'widget.deleteInvitationAction',
	record : null,
	getDisabledTooltip : function(record) {
		return null;
	},
	getErrorMsg : function(jsonResp, record) {
		return Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.project.delete.error', record.get('name')), jsonResp);
	},
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = me.getDisabledTooltip();
//		config.confirmMsg = Locale.getMsg('view.project.user.invite.delete.confirm', config.record.get('email'));
		config.eventType = Ecfa.event.Invitation;
		me.callParent([ config ]);
	}
});
