/*
 * Use row editor to change role
 */
Ext.define('Ecfa.view.project.action.EditInvitationAction', {
	extend : 'Ecfa.action.RowEditAction',
	alias : 'widget.editInvitationAction',
	// // set by grid:
	record : null,
	panel : null,
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = null;
		config.eventType = Ecfa.event.Invitation;

		me.callParent([ config ]);
	}

});
