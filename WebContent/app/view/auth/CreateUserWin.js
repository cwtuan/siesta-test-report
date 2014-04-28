// for OP
Ext.define('Ecfa.view.auth.CreateUserWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.createUserWin',
	requires : [ 'Ecfa.view.auth.NotificationTimeGrid' ],
	width : 450,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.auth.user.add'),
	itemId : 'createUserWin',
	initComponent : function() {
		var me = this;
		var check_space = /^([ ]?[\w-]*[ ]+[\w-]*)+$/;
		var check_id = /^[a-z0-9_-]{1,50}$/;
		var check_first = /^[a-z]{1}$/;

		me.defaultFocus = 'idField';

		var notificationType = [];
		var checkboxAll = {
			boxLabel : Locale.getMsg('view.notification.eventId.all'),
			inputValue : null,
			itemId : 'all',
			handler : function() {
				var me = this;
				// console.log(me.up('checkboxgroup').id,me.up('checkboxgroup').id);
				if (me.up('checkboxgroup').id.indexOf('Event') > 0)
					me.name = me.up('checkboxgroup').id + 'Id';
				else
					me.name = 'type';
				// console.log('type',me.name);

				if (me.checked) {
					Ext.each(me.up('checkboxgroup').items.items, function(c) {
						if (c.inputValue != me.inputValue) {
							c.setValue(false);
						}
					}, me.up('checkboxgroup'));
				}
			}
		};

		notificationType.push(checkboxAll, {
			boxLabel : Locale.getMsg('view.notification.type.email'),
			inputValue : Ecfa.Const.NotifyType.EMAIL,
			itemId : Ecfa.Const.NotifyType.EMAIL,
			name : 'type',
			checked : true,
			handler : function() {
				var me = this;
				if (me.checked) {
					// single select checkbox
					me.up('checkboxgroup').items.each(function(it) {
						if (it.getItemId( ) != me.getItemId()) {
							it.setValue(0);
						}
					});
				}
			}
		}, {
			boxLabel : Locale.getMsg('view.notification.type.sms'),
			inputValue : Ecfa.Const.NotifyType.SMS,
			itemId : Ecfa.Const.NotifyType.SMS,
			name : 'type',
			handler : function() {
				var me = this;
				if (me.checked) {
					// single select checkbox
					me.up('checkboxgroup').items.each(function(it) {
						if (it.getItemId( ) != me.getItemId( )) {
							it.setValue(0);
						}
					});
				}
			}
		});

		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			layout : 'anchor',
			defaults : {
				anchor : '100%'
			},
			defaultType : 'textfield',
			enableKeyEvents : true,
			listeners : {
				beforeRender : function(thisForm, options) {
					if (me.type === Ecfa.Const.User.Type.UP) {
						// Ext.getCmp('upUserGroup').setVisible(true);
						Ext.getCmp('opUserGroup').setDisabled(true);
						Ext.getCmp('notificationGroup').setDisabled(true);
					} else if (me.type === Ecfa.Const.User.Type.OP) {
						Ext.getCmp('opUserGroup').setVisible(true);
						Ext.getCmp('upUserGroup').setDisabled(true);
						Ext.getCmp('notificationGroup').setVisible(true);
					}
				}
			},
			items : [ {
				fieldLabel : Locale.getMsg('view.auth.user.id'),
				name : 'id',
				itemId : 'idField',
				// vtype : 'checkUserId',
				// value : 'test_user',
				maxLength : 50,
				allowBlank : false,
				maskRe : /^[A-Za-z0-9-_]*$/, // Restrict input characters
				validator : function(value) {
					if (value === '') {
						return true;
					} else if (!check_first.test(value.charAt(0))) {
						return Locale.getMsg('view.auth.id.invalid_firstChar');
					} else if (check_space.test(value)) {
						return Locale.getMsg('view.auth.id.invalid_space');
					} else if (!check_id.test(value) || value != value.toLowerCase()) {
						return Locale.getMsg('view.auth.id.invalid_char');
					} else if (Ext.getStore('auth.User').findExact('id', value) !== -1) {
						return Locale.getMsg('view.auth.user.create.failure.duplicated');
					}
					return true;
				}
			}, {
				name : 'password',
				inputType : 'password',
				itemId : 'password',
				maxLength : 50,
				fieldLabel : Locale.getMsg('view.auth.password'),
				allowBlank : false,
				validator : function(value) {
					if (value.length < 6) {
						return Locale.getMsg('view.auth.password.min.error');
					}
					return true;
				}
			}, {
				name : 'repeatPassword',
				fieldLabel : Locale.getMsg('view.auth.password.repeat'),
				inputType : 'password',
				itemId : 'repeatPassword',
				maxLength : 50,
				allowBlank : false,
				validator : function(value) {
					if (value != '' && value.length < 6) {
						return Locale.getMsg('view.auth.password.min.error');
					} else if (me.down('#repeatPassword').getValue() != me.down('#password').getValue()) {
						return Locale.getMsg('view.auth.user.password.repeat.error');
					}
					return true;
				}
			}, {
				name : 'email',
				fieldLabel : Locale.getMsg('view.common.email'),
				itemId : 'email',
				vtype : 'email',
				maxLength : 50,
				allowBlank : false
			}, { // for create OP user
				fieldLabel : Locale.getMsg('view.auth.user.type.op'),
				xtype : 'radiogroup',
				itemId : 'opUserGroup',
				id : 'opUserGroup',
				hidden : true,
				defaults : {
					xtype : 'radio',
					name : 'role'
				},
				items : [ {
					boxLabel : Locale.getMsg('view.auth.user.type.op.admin'),
					inputValue : Ecfa.Const.User.Role.ADMIN,
					checked : 'true',
					handler : function() {
						if (this.checked) {
							Ext.getCmp('notificationGroup').setVisible(true);
						}
					}
				}, {
					boxLabel : Locale.getMsg('view.auth.user.type.op.viewer'),
					inputValue : Ecfa.Const.User.Role.VIEWER,
					handler : function() {
						if (this.checked) {
							Ext.getCmp('notificationGroup').setVisible(false);
						}
					}
				} ]
			}, {
				name : 'ipAddress',
				fieldLabel : Locale.getMsg('view.resource.render.ip'),
				maxLength : 50
			}, {
				name : 'phoneNumber',
				fieldLabel : Locale.getMsg('view.common.phoneNumber'),
				maxLength : 50
			}, {// Select Notification Event Type and Event Id
				xtype : 'fieldset',
				title : Locale.getMsg('view.notification.eventSelect'),
				id : 'notificationGroup',
				layout : 'anchor',
				defaults : {
					anchor : '100%',
					labelStyle : 'padding-left:4px;',
					xtype : 'checkboxgroup',
					columns : 2
				},
				collapsible : true,
				collapsed : false,
				hidden : true,
				items : [ {
					fieldLabel : Locale.getMsg('view.notification.eventType.problem'),
					id : Ecfa.Const.NotificationType.PROBLEM.toLowerCase() + 'Event',
					cls : 'x-check-group-alt',
					defaults : {
						xtype : 'checkbox',
						name : Ecfa.Const.NotificationType.PROBLEM.toLowerCase() + 'EventId'
					},
					items : [ {
						boxLabel : Locale.getMsg('view.notification.eventId.problem'),
						inputValue : Ecfa.Const.NotificationId.PROBLEM
					} ]
				}, {
					fieldLabel : Locale.getMsg('view.notification.eventType.system'),
					id : Ecfa.Const.NotificationType.SYSTEM.toLowerCase() + 'Event',
					defaults : {
						xtype : 'checkbox',
						name : Ecfa.Const.NotificationType.SYSTEM.toLowerCase() + 'EventId'
					},
					items : [ {
						boxLabel : Locale.getMsg('view.notification.eventId.systemError'),
						inputValue : Ecfa.Const.NotificationId.SYSTEM_ERROR
					} ]
				}, {
					fieldLabel : Locale.getMsg('view.notification.eventType.service'),
					id : Ecfa.Const.NotificationType.SERVICE.toLowerCase() + 'Event',
					cls : 'x-check-group-alt',
					defaults : {
						xtype : 'checkbox',
						name : Ecfa.Const.NotificationType.SERVICE.toLowerCase() + 'EventId'
					},
					items : [ checkboxAll, {
						boxLabel : Locale.getMsg('view.notification.eventId.nagiosError'),
						inputValue : Ecfa.Const.NotificationId.NAGIOS_ERROR,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.dbError'),
						inputValue : Ecfa.Const.NotificationId.DB_ERROR,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.upError'),
						inputValue : Ecfa.Const.NotificationId.UP_ERROR,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.dbRecovery'),
						inputValue : Ecfa.Const.NotificationId.DB_RECOVERY,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.renderNodeProblem'),
						inputValue : Ecfa.Const.NotificationId.RENDER_NODE_PROBLEM,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.renderNodeRecovery'),
						inputValue : Ecfa.Const.NotificationId.RENDER_NODE_RECOVERY,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					} ]
				}, {
					fieldLabel : Locale.getMsg('view.notification.eventType.pool_expiration'),
					id : Ecfa.Const.NotificationType.POOL_EXPIRATION.toLowerCase() + 'Event',
					defaults : {
						xtype : 'checkbox',
						name : Ecfa.Const.NotificationType.POOL_EXPIRATION.toLowerCase() + 'EventId'
					},
					items : [ checkboxAll, {
						boxLabel : Locale.getMsg('view.notification.eventId.poolExpiration'),
						inputValue : Ecfa.Const.NotificationId.POOL_EXPIRATION,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.poolExpiration2'),
						inputValue : Ecfa.Const.NotificationId.POOL_EXPIRATION_2,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.poolExpiration3'),
						inputValue : Ecfa.Const.NotificationId.POOL_EXPIRATION_3,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					} ]
				}, {
					fieldLabel : Locale.getMsg('view.notification.eventType.render_fail'),
					id : Ecfa.Const.NotificationType.RENDER_FAIL.toLowerCase() + 'Event',
					cls : 'x-check-group-alt',
					defaults : {
						xtype : 'checkbox',
						name : Ecfa.Const.NotificationType.RENDER_FAIL.toLowerCase() + 'EventId'
					},
					items : [ checkboxAll, {
						boxLabel : Locale.getMsg('view.notification.eventId.renderError'),
						inputValue : Ecfa.Const.NotificationId.RENDER_ERROR,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.renderError2'),
						inputValue : Ecfa.Const.NotificationId.RENDER_ERROR_2,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					} ]
				} ]
			}, {// Select Notification Method Type
				xtype : 'fieldset',
				title : Locale.getMsg('view.notification.type.select'),
				layout : 'anchor',
				defaults : {
					anchor : '100%',
					labelStyle : 'padding-left:4px;',
					xtype : 'checkboxgroup',
					columns : 3,
				},
				collapsible : true,
				collapsed : false,
				items : [ {
					fieldLabel : Locale.getMsg('view.notification.eventType.problem'),
					id : Ecfa.Const.NotificationType.PROBLEM.toLowerCase() + 'Type',
					cls : 'x-check-group-alt',
					items : notificationType
				}, {
					fieldLabel : Locale.getMsg('view.notification.eventType.system'),
					id : Ecfa.Const.NotificationType.SYSTEM.toLowerCase() + 'Type',
					items : notificationType
				}, {
					fieldLabel : Locale.getMsg('view.notification.eventType.service'),
					id : Ecfa.Const.NotificationType.SERVICE.toLowerCase() + 'Type',
					cls : 'x-check-group-alt',
					items : notificationType
				}, {
					fieldLabel : Locale.getMsg('view.notification.eventType.pool_expiration'),
					id : Ecfa.Const.NotificationType.POOL_EXPIRATION.toLowerCase() + 'Type',
					items : notificationType
				}, {
					fieldLabel : Locale.getMsg('view.notification.eventType.render_fail'),
					id : Ecfa.Const.NotificationType.RENDER_FAIL.toLowerCase() + 'Type',
					cls : 'x-check-group-alt',
					items : notificationType
				} ]
			}, {
				xtype : 'fieldset',
				checkboxToggle : true,
				title : Locale.getMsg('view.notification.time.select'),
				defaultType : 'textfield',
				itemId : 'notificationTimeFieldset',
				collapsed : true,
				layout : 'anchor',
				bodyPadding : '5 5 5 5',
				items : [ {
					xtype : 'notificationTimeGrid',
					itemId : 'notificationTimeGrid'
				} ]
			}, { // for create UP user
				fieldLabel : Locale.getMsg('view.auth.user.type'),
				xtype : 'radiogroup',
				itemId : 'upUserGroup',
				id : 'upUserGroup',
				hidden : true,
				defaults : {
					xtype : 'radio',
					name : 'role'
				},
				items : [ {
					boxLabel : Locale.getMsg('view.auth.user.type.up.user'),
					inputValue : Ecfa.Const.User.Role.USER,
					checked : 'true'
				} ]
			} ],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				formBind : true,
				type : 'submit',
				margin : '0 0 10 0',
				handler : function() {
					var params = this.up('form').getValues();
					delete params['repeatPassword']; // not necessary parameter
					// this.up('form').getForm().submit(submitOptionsOP);

					/* Nested params */
					var data = new Array();
					var temp = null;
					var eventTypeList = Ext.create('Ecfa.store.notification.EventType');
					var eventType = null;
					var eventId = null;
					var type = null;
					var eventTypeContent = null;
					var eventIdLength = 0;
					for ( var i = 0; i < eventTypeList.data.items.length; i++) {
						eventType = eventTypeList.data.items[i].data.value;
						eventId = eventType.toLowerCase() + 'EventId';

						eventTypeContent = me.down('#' + eventType.toLowerCase() + 'Event').getValue();
						typeContent = me.down('#' + eventType.toLowerCase() + 'Type').getValue();
						console.log('eventTypeContent', eventTypeContent);
						console.log('typeContent', typeContent);
						if (eventTypeContent.hasOwnProperty(eventId)) {
							if (Ext.isArray(eventTypeContent[eventId]))
								eventIdLength = eventTypeContent[eventId].length;
							else
								eventIdLength = 1;
						} else
							eventIdLength = 0;
						// console.log('enventIdLength', i, eventIdLength);

						// Notification Method Type
						if (typeContent.hasOwnProperty('type')) {
							if (Ext.isArray(typeContent['type'])) { // console.log('isArray',typeContent['type']);
								type = null;
							} else {
								// console.log('notArray',typeContent['type']);
								type = typeContent['type'];
							}
						}
						console.log('~~type', type);

						for ( var j = 0; j < eventIdLength; j++) {
							if (eventIdLength === 1)
								eventIdValue = eventTypeContent[eventId];
							else
								eventIdValue = eventTypeContent[eventId][j];
							// console.log('eventType', eventType, 'eventIdValue', eventIdValue);

							data.push({
								eventType : eventType,
								eventId : eventIdValue,
								notificationType : type
							});
						}
					}
					// console.log('data', data);
					// console.log('notificationTime',me.down('#notificationTimeGrid').getStore().getData());

					var submit = Ext.create('Ecfa.model.auth.User', {
						id : params.id,
						password : params.password,
						email : params.email,
						role : params.role,
						ipAddress : params.ipAddress,
						phoneNumber : params.phoneNumber,
						notification : data,
						notificationTime : me.down('#notificationTimeGrid').getStore().getData()
					});
					delete submit.data['projectRole'];
					delete submit.data['status'];
					console.log('submit', submit, params.ipAddress);

					me.down('form').setLoading(true);

					var url = 'rest/op/auth/user';
					if (!Ecfa.Config.isOP()) {
						url = 'rest/auth/user?action=create';
					}

					Ecfa.Restful.request({
						record : submit,
						method : 'POST',
						url : url,// 'rest/op/auth/user',
						success : function(rec, op) {
							// console.log('sucess', rec, op);
							me.close();
							Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.auth.user.create.success'), 5000);
							Ecfa.event.User.fireEvent('updated', true);
						},

						failure : function(rec, op) {
							// console.log('fail', rec.error, op);// op.request.scope.reader.jsonData
							me.close();
							Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.auth.user.create.failure'), rec));
						}
					});
				}
			}, {
				text : Locale.getMsg('view.common.cancel'),
				handler : function() {
					me.close();
				}
			} ]
		} ];

		me.callParent();

		me.down('#password').on('change', me.repeatPasswordValidate, this);
	},
	repeatPasswordValidate : function() {
		if (this.down('#repeatPassword').getValue() || this.down('#password').getValue() == '')
			this.down('#repeatPassword').validate();
	}
});
