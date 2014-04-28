Ext.define('Ecfa.view.project.WaitingInvitationWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.waitingInvitationWin',
	requires : [ 'Ecfa.view.project.WaitingInvitationGrid' ],
	user : null,
	width : 550,
	height : 300,
	modal : true,
	layout : {
		type : 'border'
	},
	title : Locale.getMsg('view.project.user.invite.waitingInvitations'),
	// observers : [],
	initComponent : function() {
		var me = this;
		// me.defaultFocus = 'email';
		me.items = [ {
			region : 'center', // center region is required, no width/height specified
			xtype : 'waitingInvitationGrid',
			layout : 'fit',
			margins : '5 5 0 0',
			user : me.user
		} ];

		// TODO close button
		me.callParent();

		// me.setTitle(Ext.String.format(Locale.getMsg('view.project.user.inviteUser'), me.project.get('name')));

	}
});
