/*
 * Invitations in a project
 */
Ext.define('Ecfa.view.project.InvitationGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.invitationGrid',
	project : null,
	requires : [ 'Ecfa.view.project.action.DeleteInvitationAction', 'Ecfa.view.project.action.EditInvitationAction',
			'Ecfa.view.project.action.RedoInvitationAction', 'Ext.grid.plugin.RowEditing' ],
	title : Locale.getMsg('view.project.user.invite.invitations'),
	selType : 'rowmodel',
	plugins : [ {
		itemId : 'invitationGrid-roweditor',
		ptype : 'rowediting'
	} ],
	icon : 'css/images/email_16.png',
	layout : 'border',
	// store : 'project.Invitation',

	initComponent : function() {
		var me = this;

		me.store = Ext.create('Ecfa.store.project.Invitation');

		me.columns = [ {
			header : Locale.getMsg('view.common.action'),
			xtype : 'componentcolumn',
			width : 70,
			dataIndex : 'action',
			renderer : function(value, m, record) {
				return {
					xtype : 'container',
					items : [ new Ext.button.Button(Ext.widget('deleteInvitationAction', {
						record : record,
						panel : me
					})), new Ext.button.Button(Ext.widget('editInvitationAction', {
						record : record,
						panel : me
					})), new Ext.button.Button(Ext.widget('redoInvitationAction', {
						record : record,
						panel : me
					})) ]
				};

			}
		}, {
			header : Locale.getMsg('view.common.email'),
			dataIndex : 'email',
			flex : 1.5
		}, {
			header : Locale.getMsg('view.project.user.role'),
			dataIndex : 'projectRole',
			flex : 0.5,
			editor : {
				xtype : 'combobox',
				// store : Ext.getStore('role', { // FIXME getStore not able to apply filters
				store : Ext.create('Ecfa.store.auth.ProjectRole', {
					filters : [ function(item) {
						return item.get('number') <= 2;
					} ]
				}),
				queryMode : 'local',
				editable : false,
				displayField : 'display',
				valueField : 'value',
				allowBlank : false
			},
			renderer : Ecfa.locale.Converter.getProjectRole
		}, {
			header : Locale.getMsg('view.project.user.invite.expiredTime'),
			dataIndex : 'expiredTime',
			flex : 1,
			renderer : Ecfa.Format.dateTime
		}, {
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 0.5,
			renderer : Ecfa.locale.Converter.getInvitationStatus
		} ];

		me.tbar = [ {
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.load();
			}
		} ];

		me.callParent(arguments);

		me.on({
			render : function() {
				me.load();
			},
			beforedestroy : function() {
				Ecfa.event.Invitation.un('destroyed', me.load, me);
				Ecfa.event.Invitation.un('created', me.load, me);
				Ecfa.event.Invitation.un('updated', me.load, me);

			}
		});

		Ecfa.event.Invitation.on({
			scope : me,
			destroyed : me.load,
			created : me.load,
			updated : me.load
		// ,running : function(isRunning) {
		// me.setLoading(isRunning);
		// }
		});
	},
	load : function() {
		var me = this;

		me.store.load({
			ids : [ me.project.getId() ],
			params : {
				status : 'NotAccpet'
			}
		});
	}
});
