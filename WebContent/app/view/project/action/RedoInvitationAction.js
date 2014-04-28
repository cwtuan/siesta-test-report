/*
 * Resend invitation
 */
Ext.define('Ecfa.view.project.action.RedoInvitationAction', {
	extend : 'Ecfa.action.Action',
	alias : 'widget.redoInvitationAction',
	record : null,
	icon : 'css/images/email_16.png',
	panel : null,
	constructor : function(config) {
		var me = this;
		config.defaultTooltip = Locale.getMsg('view.project.user.invite.redoInvitation');
		config.disabledTooltip = null;
		me.callParent([ config ]);
	},
	handler : function() {
		var me = this;

		Ecfa.Restful.request({
			record : me.record,
			method : 'PUT',
			action : 'redoInvitation',
			success : function(jsonResp) {
				Ecfa.event.Invitation.fireEvent('updated', jsonResp);
				me.panel.up('window').down('notifybar').showSuccess(Locale.getMsg('view.project.user.invite.redoInvitation.success', me.record.get('email')));
			},
			failure : function(jsonResp) {
				me.panel.up('window').down('notifybar').showError(
						Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.project.user.invite.redoInvitation.error', me.record.get('email')), jsonResp));
			}
		});
	}

});
