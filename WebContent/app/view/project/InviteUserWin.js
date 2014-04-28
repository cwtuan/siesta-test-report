// TODO invite multiple users at the same time

Ext.define('Ecfa.view.project.InviteUserWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.inviteUserWin',
	requires : [ 'Ecfa.view.project.InvitationGrid' ],
	project : null,
	width : 550,
	height : 500,
	modal : true,
	layout : {
		type : 'border'
	},
	title : Locale.getMsg('view.project.user.invite'),
	// observers : [],
	initComponent : function() {
		var me = this;
		// me.defaultFocus = 'email';
		me.items = [
				{
					region : 'center', // center region is required, no width/height specified
					xtype : 'invitationGrid',
					itemId : 'invitationGrid',
					layout : 'fit',
					// margins : '5 5 0 0',
					project : me.project,
					height : 310
				},
				{
					region : 'north',
					itemId : 'msg',
					xtype : 'notifybar'
				// cls : 'x-form-invalid-under',
				// xtype : 'component'
				},
				{
					// itemId : 'form',
					region : 'south',
					split : true, // enable resizing
					// margins : '0 5 5 5',
					xtype : 'form',
					bodyPadding : 10,
					layout : 'anchor',
					defaults : {
						anchor : '100%',
						labelWidth : 110
					},
					defaultType : 'textfield',
					items : [
							{
								xtype : 'component',
								html : '<div style="font-weight:bold;">'
										+ Ext.String.format(Locale.getMsg('view.project.user.inviteUser'), me.project.get('name')) + '</div> ',
								padding : '0 0 10 0'
							}, {
								fieldLabel : Locale.getMsg('view.common.email'),
								name : 'email',
								itemId : 'email',
								vtype : 'email',
								maxLength : 50,
								allowBlank : false,
								validator : Ecfa.Validator.inviteEmail
							}, {// TODO use store
								xtype : 'radiogroup',
								fieldLabel : Locale.getMsg('view.auth.role'),
								columns : 2,
								allowBlank : false,
								tooltip : Locale.getMsg('view.project.user.role.tooltip'),
								items : [ {
									boxLabel : Ecfa.locale.Converter.getProjectRole(Ecfa.Const.Project.Role.MEMBER),
									name : 'projectRole',
									inputValue : Ecfa.Const.Project.Role.MEMBER,
									checked : true
								}, {
									boxLabel : Ecfa.locale.Converter.getProjectRole(Ecfa.Const.Project.Role.ADMIN),
									name : 'projectRole',
									inputValue : Ecfa.Const.Project.Role.ADMIN
								} ]
							} ],
					buttons : [ {
						text : Locale.getMsg('view.project.user.invite'),
						formBind : true,
						type : 'submit',
						handler : function() {

							var params = this.up('form').getValues();
							// console.log(params);
							// Ecfa.event.Invitation.fireEvent('running', true);

							Ecfa.Restful.request({
								url : 'rest/projects/' + me.project.get('oid'),
								record : params,
								params : {
									action : 'inviteUser'
								},
								method : 'PUT',
								notifyBar : me.down('notifybar'),
								failureSubject : Locale.getMsg('view.project.user.invite.error', params.email),
								eventType : Ecfa.event.Invitation
							});

							me.down('form').getForm().reset();

						}
					}, {
						text : Locale.getMsg('view.common.close'),
						handler : function() {
							me.close();
						}
					} ]
				} ];

		me.callParent();

		me.on({
			beforeclose : function() {
				if (me.down('#invitationGrid').loadMask != null) {
					me.down('#msg').showError(Locale.getMsg('view.project.user.invite.beforeCloseWin'));
					return false;
				}
			}
		});

		// me.setTitle(Ext.String.format(Locale.getMsg('view.project.user.inviteUser'), me.project.get('name')));

	}
});
