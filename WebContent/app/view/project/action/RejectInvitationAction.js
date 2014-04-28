
Ext.define('Ecfa.view.project.action.RejectInvitationAction', {
	extend : 'Ecfa.action.Action',
	alias : 'widget.rejectInvitationAction',
	record : null,
	panel : null, // TODO 要顯示notification bar 的panel
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = null;

		// console.log('edit pro record, panel', config.record, config.panel);

		config.eventType = Ecfa.event.Invitation;
		config.disabledTooltip = null;

		config.icon = 'css/images/delete_16x16.png';
		config.handler = function() {
			console.log('record', config.record);

			config.record.save(
//					{
//				params : {
//					action : 'reject'
//				}
//			}
					);

		};
		config.defaultTooltip = Locale.getMsg('view.project.user.invite.reject');

		// config.defaultTooltip = 'set your own tooltip here';
		// config.success = function() {console.log('you can override success callback here')};
		// config.failure = function() {console.log('you can override failure callback here')};
		// config.failureMsg = 'set your message for notification bar here';

		me.callParent([ config ]);
	}

});
