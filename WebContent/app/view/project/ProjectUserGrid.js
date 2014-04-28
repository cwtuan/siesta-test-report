// TODO admin不可修改owner. admin不可把admin修改成member

Ext.define('Ecfa.view.project.ProjectUserGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.projectUserGrid',
	// store : 'auth.User',
	store : Ecfa.StoreUtil.getStore('projectUsers'),
	project : null,
	requires : [ 'Ecfa.view.project.InviteUserWin', 'Ext.grid.plugin.RowEditing', 'Ecfa.view.project.action.DeleteProjectUserAction',
			'Ecfa.view.project.action.EditProjectUserAction' ],
	title : Locale.getMsg('view.project.user.members'),
	icon : 'css/images/user_16x16.png',
	selType : 'rowmodel',
	plugins : [ {
		ptype : 'rowediting'
	} ],
	border : false,

	initComponent : function() {
		var me = this;

		me.columns = [ {
			header : Locale.getMsg('view.common.action'),
			xtype : 'componentcolumn',
			width : 50,
			renderer : function(value, m, record) {
				return {
					xtype : 'container',
					items : [ new Ext.button.Button(Ext.widget('deleteProjectUserAction', {
						record : record,
						project : me.project,
						panel : me
					})), new Ext.button.Button(Ext.widget('editProjectUserAction', {
						record : record,
						project : me.project,
						panel : me
					})) ]
				};
			}
		}, {
			header : Locale.getMsg('view.auth.user.id'),
			dataIndex : 'id',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.common.email'),
			dataIndex : 'email',
			flex : 1
		}, {
			header : Locale.getMsg('view.project.user.role'),
			dataIndex : 'projectRole',
			flex : 0.5,
			editor : {
				xtype : 'combobox',
				// TODO use Ecfa.storeUtil.getStore
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
			header : Locale.getMsg('view.common.phoneNumber'),
			dataIndex : 'phoneNumber',
			flex : 0.5,
			hidden : true
		} ];

		// console.log('user store', me.getStore());

		// me.on('edit', function(editor, e) {
		// e.record.save({
		// success : function(record, operation) {
		// Ecfa.event.User.fireEvent('updated');
		// },
		// failure : function(record, operation) {
		// me.store.rejectChanges();
		// }
		// });
		// });

		me.tbar = [ {
			icon : 'css/images/email_16.png',
			text : Locale.getMsg('view.project.user.invite.management'),
			disabled : true,
			itemId : 'inviteBtn',
			handler : function() {
				Ext.widget('inviteUserWin', {
					project : me.project
				}).show();
			}
		}, {
			itemId : 'refreshBtn',
			disabled : true,
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.store.reload();
			}
		} ];

		me.callParent(arguments);

		// show users in selected project
		Ecfa.event.Project.on({
			selected : function(project) {
				me.load(project);
			}
		});

		Ecfa.event.User.on({
			destroyed : function() {
				me.getStore().reload();
			},
			created : function() {
				me.getStore().reload();
			},
			updated : function() {
				me.getStore().reload();
			}
		});
	},

	load : function(project) {

		var me = this;

		if (project == null) {
			me.reset();
			return;
		}

		// 1. set title
		me.setTitle(Locale.getMsg('view.project.user.members') + ' (' + project.get('name') + ')');

		// 2. load users
		me.store.load({
			ids : [ project.getId() ]
		});
		me.project = project;
		// console.log('load load', project);

		// 3. determine button disability
		var disabledBtnTip = me.getDisabledTooltip(me.project);
		me.down('#inviteBtn').setDisabled(disabledBtnTip !== null);
		me.down('#inviteBtn').setTooltip(disabledBtnTip ? disabledBtnTip : '');
		me.down('#refreshBtn').enable();
	},
	reset : function() {
		// console.log('reset user');
		var me = this;
		me.setTitle(Locale.getMsg('view.project.user.members'));
		me.store.removeAll();
		me.project = null;
		me.down('#inviteBtn').setDisabled(true);
		me.down('#inviteBtn').setTooltip('');
		me.down('#refreshBtn').setDisabled(true);
	},
	getDisabledTooltip : function(project) {

		if (project.get('projectRole') !== Ecfa.Const.Project.Role.ADMIN && project.get('projectRole') !== Ecfa.Const.Project.Role.OWNER) {
			return Locale.getMsg('view.project.user.disabledBtnTip.role.owner_admin');
		}
		return null;
	}
});
