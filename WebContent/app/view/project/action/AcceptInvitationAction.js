
Ext.define('Ecfa.view.project.action.AcceptInvitationAction', {
	extend : 'Ecfa.action.Action',
	alias : 'widget.acceptInvitationAction',
	// // set by grid:
	record : null,
	panel : null, // TODO 要顯示notification bar 的panel
	constructor : function(config) {
		var me = this;
	
		// console.log('edit pro record, panel', config.record, config.panel);

		config.eventType = Ecfa.event.Invitation;
		config.disabledTooltip = null;

		// config.defaultTooltip = 'set your own tooltip here';
		// config.success = function() {console.log('you can override success callback here')};
		// config.failure = function() {console.log('you can override failure callback here')};
		// config.failureMsg = 'set your message for notification bar here';

		me.callParent([ config ]);
	}

});
