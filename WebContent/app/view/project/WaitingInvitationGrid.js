Ext.define('Ecfa.view.project.WaitingInvitationGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.waitingInvitationGrid',
	user : null,
	requires : [ 'Ecfa.view.project.action.RejectInvitationAction', 'Ecfa.view.project.action.AcceptInvitationAction', 'Ext.grid.plugin.RowEditing' ],
	// title : Locale.getMsg('view.project.user.invite.invitations'),
	selType : 'rowmodel',
	plugins : [ {
		ptype : 'rowediting'
	} ],
	// icon : 'css/images/email_16.png',
	layout : 'border',
	store : 'project.WaitingInvitation',

	initComponent : function() {
		var me = this;
//		me.store = Ext.create('Ecfa.store.project.WaitingInvitation');

		me.columns = [ {
			header : Locale.getMsg('view.project.user.invite.createUserId'),
			dataIndex : 'createUserId',
			flex : 1
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
			// TODO remove it
			header : Locale.getMsg('view.project.user.invite.expiredTime'),
			dataIndex : 'expiredTime',
			flex : 1,
			renderer : Ecfa.Format.dateTime
		}, {
			// TODO remove it
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 0.5,
			renderer : Ecfa.locale.Converter.getInvitationStatus
		}, {
			xtype : 'componentcolumn',
			padding : '0 0 0 0', // FIXME
			margins : '0 0 0 0',
			width : 50,
			// height : 16,
			dataIndex : 'action',
			renderer : function(value, m, record) {
				// console.log('user', user);

				var items = [];

				console.log('grid record', record);

				items.push(new Ext.button.Button(Ext.widget('acceptInvitationAction', {
					record : record
				})));

				items.push(new Ext.button.Button(Ext.widget('rejectInvitationAction', {
					record : record,
					panel : me
				})));

				//			
				// var disabledBtnTip = null;
				//
				// items.push({
				// tooltip : disabledBtnTip ? disabledBtnTip : Locale.getMsg('view.common.delete'),
				// xtype : 'button',
				// disabled : disabledBtnTip !== null,
				// icon : 'css/images/delete_16x16.png',
				// handler : function() {
				//
				// Ext.Msg.confirm(Locale.getMsg('view.common.warning'), Locale.getMsg('view.project.delete.confirm', record.get('name')), function(btn) {
				// if (btn == 'yes') {
				//
				// record.destroy({
				// success : function(record, operation) {
				// console.log();
				// Ecfa.event.Project.fireEvent('destroyed');
				// },
				// failure : function(record, operation) {
				// // TODO notification bar...
				// }
				// });
				// }
				// });
				// }
				// });
				//
				// items.push({
				// tooltip : disabledBtnTip ? disabledBtnTip : Locale.getMsg('view.common.edit'),
				// xtype : 'button',
				// disabled : disabledBtnTip !== null, // TODO 提出來
				// icon : 'css/images/edit_16x16.png',
				// handler : function() {
				//
				// me.plugins[0].startEdit(record, 0);
				//
				// }
				// });

				return {
					xtype : 'container',
					items : items
				};

			}
		} ];

		me.tbar = [ {
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.load();
			}
		} ];

		me.callParent(arguments);

		me.load();

		Ecfa.event.Invitation.on({
			destroyed : function(tasks) {
				me.load();
			},
			created : function(tasks) {
				me.load();
			},
			updated : function(tasks) {
				me.load();
			}
		});
	},
	load : function() {
		// TODO create dynamic proxy class
		var me = this;
//		me.getStore().setProxy({
//			type : 'rest',
//			url : 'rest/invitations',
//			reader : {
//				type : 'json'
//			}
//		});

//		me.getStore().load({
//			params : {
//				email : me.user.email,
//				status : Ecfa.Const.Invitation.Status.WAITING
//			}
//		});
		console.log('user', me.user);
	}
});
