// for OP
Ext.define('Ecfa.view.auth.EditUserWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.editUserWin',
	width : 450,
	labelWidth : 200,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.account.editProperty'),
	observers : [],
	initComponent : function() {
		var me = this;

		me.defaultFocus = 'ipAddress';
		
		var notificationType = [];
		var checkboxAll = {
			boxLabel : Locale.getMsg('view.notification.eventId.all'),
			inputValue : null,
			itemId : 'all',
			handler : function() {			    
				var me = this;
				// console.log(me.up('checkboxgroup').id,me.up('checkboxgroup').id);
				if(me.up('checkboxgroup').id.indexOf('Event') > 0)
				   me.name = me.up('checkboxgroup').id+'Id';
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
						if (it.getItemId( ) != me.getItemId()) {
							it.setValue(0);
						}
					});
				}
			}
		});

		me.items = [ {
			xtype : 'form',
			bodyPadding : 15,
			layout : 'anchor',
			defaults : {
				anchor : '100%'
			},
			defaultType : 'textfield',
			itemId : 'form',
			// renderTo : Ext.getBody(),
			fieldDefaults : {
				msgTarget : 'under',
				labelWidth : 125
			},
			defaultType : 'textfield',
			listeners : {
				beforeRender : function(thisForm, options) {
					/* Initial user role */
					if (me.user.role === Ecfa.Const.User.Role.USER) {
						Ext.getCmp('statusGroup').setVisible(true);
						if (me.user.status === Ecfa.Const.User.Status.ACTIVE)
							Ext.getCmp('statusGroup').items.items[0].setValue(true);
						if (me.user.status === Ecfa.Const.User.Status.INACTIVE)
							Ext.getCmp('statusGroup').items.items[1].setValue(true);
						if (me.user.status === Ecfa.Const.User.Status.DELETE)
							Ext.getCmp('statusGroup').items.items[2].setValue(true);
					} else { // if(me.user.id != Ecfa.Session.getUser().id)
						Ext.getCmp('notificationGroup').setVisible(true);
						me.down('#ipAddress').setVisible(false);						
						if (me.user.role === Ecfa.Const.User.Role.ADMIN) {
							Ext.getCmp('userTypeGroup').setVisible(true);
							Ext.getCmp('userTypeGroup').items.items[0].setValue(true);
							// Ext.getCmp('userTypeGroup').items.items[1].setVisible(false); // editable
						} else if (me.user.role === Ecfa.Const.User.Role.VIEWER) {
							Ext.getCmp('userTypeGroup').setVisible(true);
							Ext.getCmp('userTypeGroup').items.items[1].setValue(true);
							// Ext.getCmp('userTypeGroup').items.items[0].setVisible(false); // editable
						}

						/* Initial Notificaiton eventType and eventId */
						var notification = me.user.notification;
						console.log('notification',notification);
						for ( var i = 0; i < notification.length; i++) {
							console.log(notification[i].notificationType,notification[i].eventType, notification[i].eventId, notification[i].startTime, notification[i].endTime);
							if (notification[i].eventId) {
								me.down('#' + notification[i].eventId).setValue(true);								
							} else if (notification[i].eventType) {
								me.down('#' + notification[i].eventType.toLowerCase() + 'Event').getComponent('all').setValue(true);
							}
							if(notification[i].notificationType){
							   me.down('#' + notification[i].eventType.toLowerCase() + 'Type').down('#'+notification[i].notificationType).setValue(true);	
							}
							else me.down('#' + notification[i].eventType.toLowerCase() + 'Type').down('#all').setValue(true);							
						}
						
						/* Initial Notificaiton method type */

						/* Initial Notification Time Grid */
						console.log('notificationTime',me.user.notificationTime);
						if (me.user.notificationTime) {							
							me.down('#notificationTimeFieldset').expand();
							me.down('#notificationTimeGrid').store.loadData(me.user.notificationTime);
						}
					}
				}
			},

			items : [ {
				fieldLabel : Locale.getMsg('view.common.id'),
				name : 'id',
				readOnly : true,
				value : me.user.id
			}, {
				fieldLabel : Locale.getMsg('view.common.email'),
				name : 'email',
				readOnly : true,
				value : me.user.email
			}, {
				fieldLabel : Locale.getMsg('view.resource.render.ip'),
				itemId : 'ipAddress',
				name : 'ipAddress',
				maxLength : 50
			}, {
				fieldLabel : Locale.getMsg('view.common.phoneNumber'),
				itemId : 'phoneNumber',
				name : 'phoneNumber',
				value : me.user.phoneNumber
			}, { // for OP user switch userType
				fieldLabel : Locale.getMsg('view.auth.user.type.op'),
				xtype : 'radiogroup',
				itemId : 'userTypeGroup',
				id : 'userTypeGroup',
				hidden : true,
				defaults : {
					xtype : 'radio',
					name : 'role'
				},
				items : [ {
					boxLabel : Locale.getMsg('view.auth.user.type.op.admin'),
					inputValue : Ecfa.Const.User.Role.ADMIN,
					itemId : 'admin',
					handler : function() {
						if (this.checked) {
							Ext.getCmp('notificationGroup').setVisible(true);
						}
					}
				}, {
					boxLabel : Locale.getMsg('view.auth.user.type.op.viewer'),
					inputValue : Ecfa.Const.User.Role.VIEWER,
					itemId : 'viewer',
					handler : function() {
						if (this.checked) {
							Ext.getCmp('notificationGroup').setVisible(false);
						}
					}
				} ]
			}, {
				xtype : 'fieldset',
				title : Locale.getMsg('view.auth.user.password.leavingBlank'),
				columnWidth : 1,
				layout : 'anchor',
				defaultType : 'textfield',
				defaults : {
					anchor : '100%',
					labelWidth : 115,
					labelAlign : 'left'
				},
				items : [ {
					itemId : 'password',
					fieldLabel : Locale.getMsg('view.auth.password.new'),
					name : 'password',
					inputType : 'password',
					validator : function(value) {
						if (value != '') {
							if (value.length < 6) {
								return Locale.getMsg('view.auth.password.min.error');
							}
						}
						return true;
					}
				}, {
					itemId : 'repeatPassword',
					fieldLabel : Locale.getMsg('view.auth.password.new.repeat'),
					name : 'password_repeat',
					inputType : 'password',
					validator : function(value) {
						if (value != '' && value.length < 6) {
							return Locale.getMsg('view.auth.password.min.error');
						} else if (me.down('#repeatPassword').getValue() != me.down('#password').getValue()) {
							return Locale.getMsg('view.auth.user.password.repeat.error');
						}
						return true;
					}
				}, {
					xtype : 'component',
					itemId : 'formErrorState',
					baseCls : 'form-error-state',
					padding : '0 0 0 0',
					setError : function(error) {
						var me = this;
						me.update(error);
					},
					clearError : function() {
						var me = this;
						me.update('');
					},
					listeners : {
						afterrender : function(eOpts) {
							var me = this;
							var search = Ext.Object.fromQueryString(window.location.search);
							if (search.error) {
								me.setError(search.error);
							}
						}
					}
				} ]
			},{// Select Notification Event Type and Event Id
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
						inputValue : Ecfa.Const.NotificationId.PROBLEM,
						itemId : Ecfa.Const.NotificationId.PROBLEM
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
						inputValue : Ecfa.Const.NotificationId.SYSTEM_ERROR,
						itemId : Ecfa.Const.NotificationId.SYSTEM_ERROR
					} ]
				}, {
					fieldLabel : Locale.getMsg('view.notification.eventType.service'),
					id : Ecfa.Const.NotificationType.SERVICE.toLowerCase() + 'Event',
					cls : 'x-check-group-alt',
					defaults : {
						xtype : 'checkbox',
						name : Ecfa.Const.NotificationType.SERVICE.toLowerCase() + 'EventId'
					},
					items : [checkboxAll, {
						boxLabel : Locale.getMsg('view.notification.eventId.nagiosError'),
						inputValue : Ecfa.Const.NotificationId.NAGIOS_ERROR,
						itemId : Ecfa.Const.NotificationId.NAGIOS_ERROR,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.dbError'),
						inputValue : Ecfa.Const.NotificationId.DB_ERROR,
						itemId : Ecfa.Const.NotificationId.DB_ERROR,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.upError'),
						inputValue : Ecfa.Const.NotificationId.UP_ERROR,
						itemId : Ecfa.Const.NotificationId.UP_ERROR,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.dbRecovery'),
						inputValue : Ecfa.Const.NotificationId.DB_RECOVERY,
						itemId : Ecfa.Const.NotificationId.DB_RECOVERY,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.renderNodeProblem'),
						inputValue : Ecfa.Const.NotificationId.RENDER_NODE_PROBLEM,
						itemId :  Ecfa.Const.NotificationId.RENDER_NODE_PROBLEM,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.renderNodeRecovery'),
						inputValue : Ecfa.Const.NotificationId.RENDER_NODE_RECOVERY,
						itemId : Ecfa.Const.NotificationId.RENDER_NODE_RECOVERY,
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
					items : [checkboxAll, {
						boxLabel : Locale.getMsg('view.notification.eventId.poolExpiration'),
						inputValue : Ecfa.Const.NotificationId.POOL_EXPIRATION,
						itemId : Ecfa.Const.NotificationId.POOL_EXPIRATION,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.poolExpiration2'),
						inputValue : Ecfa.Const.NotificationId.POOL_EXPIRATION_2,
						itemId : Ecfa.Const.NotificationId.POOL_EXPIRATION_2,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.poolExpiration3'),
						inputValue : Ecfa.Const.NotificationId.POOL_EXPIRATION_3,
						itemId : Ecfa.Const.NotificationId.POOL_EXPIRATION_3,
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
						itemId : Ecfa.Const.NotificationId.RENDER_ERROR,
						handler : function() {
							var me = this;
							if (me.checked) {
								me.up('checkboxgroup').down('#all').setValue(false);
							}
						}
					}, {
						boxLabel : Locale.getMsg('view.notification.eventId.renderError2'),
						inputValue : Ecfa.Const.NotificationId.RENDER_ERROR_2,
						itemId : Ecfa.Const.NotificationId.RENDER_ERROR_2,
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
					collapsed : true,
					layout : 'anchor',
					itemId : 'notificationTimeFieldset',
					bodyPadding : '5 5 5 5',
					items : [ {
						xtype : 'notificationTimeGrid',
						itemId : 'notificationTimeGrid'
					} ]
			}, { // for UP user switch status
				fieldLabel : Locale.getMsg('view.common.status'),
				xtype : 'radiogroup',
				itemId : 'statusGroup',
				id : 'statusGroup', // TODO Tony: itemId
				hidden : true,
				defaults : {
					xtype : 'radio',
					name : 'status'
				},
				items : [ {
					boxLabel : Locale.getMsg('view.auth.user.status.active'),
					inputValue : Ecfa.Const.User.Status.ACTIVE,
					itemId : 'activeRadio'
				}, {
					boxLabel : Locale.getMsg('view.auth.user.status.inactive'),
					inputValue : Ecfa.Const.User.Status.INACTIVE,
					itemId : 'inactiveRadio'
				}, {
					boxLabel : Locale.getMsg('view.auth.user.status.delete'),
					inputValue : Ecfa.Const.User.Status.DELETE,
					itemId : 'deleteRadio'
				} ]
			} ],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				type : 'submit',
				itemId : 'edit_submit',
				margin : '0 0 10 0',
				// formBind : true,
				handler : function() {
					// me.down('#userTypeGroup').value = me.user.role;
					// me.down('form').getForm().submit(submitOptionsOP);
					var params = this.up('form').getValues();

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
						if (eventTypeContent.hasOwnProperty(eventId)) {
							if (Ext.isArray(eventTypeContent[eventId]))
								eventIdLength = eventTypeContent[eventId].length;
							else
								eventIdLength = 1;
						} else
							eventIdLength = 0;
							
						// Notification Method Type
						if (typeContent.hasOwnProperty('type')) {
						    if (Ext.isArray(typeContent['type']))    {   
						        type = null
						     }
						    else {
						       type = typeContent['type']
						    }
						}

						for ( var j = 0; j < eventIdLength; j++) {
							if (eventIdLength === 1) {
								eventIdValue = eventTypeContent[eventId];
							} else {
								eventIdValue = eventTypeContent[eventId][j];
							}
							// console.log('eventType:', eventType, 'eventIdValue', eventIdValue);
							data.push({
								eventType : eventType,
								eventId : eventIdValue,
								notificationType :　type
							});
						}
					}

					var submit = Ext.create('Ecfa.model.auth.User', {
						id : params.id,
						password : params.password,
						email : params.email,
						role : params.role,
						status : params.status,
						phoneNumber : params.phoneNumber,
						notification : data,
						notificationTime : me.down('#notificationTimeGrid').getStore().getData()
					});
					delete submit.data['projectRole'];
					if (me.user.role != Ecfa.Const.User.Role.USER) {
						delete submit.data['status'];
					} else
						submit.data['role'] = me.user.role;
					console.log('submit', submit);

					me.down('form').setLoading(true);
					
					var url = 'rest/op/auth/user';
					if (!Ecfa.Config.isOP()) {
						url = 'rest/auth/user?action=create';
					}
					console.log('Update user url',url);

					Ecfa.Restful.request({
						record : submit,
						method : 'PUT',
						url : url,// 'rest/op/auth/user',
						success : function(rec, op) {
							// console.log('sucess', rec, op);
							me.close();
							Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.account.editProperty.success'), 5000);
							if (me.user.id === Ecfa.Session.getUser().id) {
								Ecfa.Session.getSession();
								// console.log('update session', Ecfa.Session);
							}
							Ecfa.event.User.fireEvent('updated', true);
						},

						failure : function(rec, op) {
							// console.log('fail', rec.error, op);// op.request.scope.reader.jsonData
							me.close();
							Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.account.editProperty.fail'), rec));
							// me.down('#edit_submit').setDisabled(false);
							Ecfa.event.User.fireEvent('updated', true);
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

		// me.down('#password').on( 'validitychange', me.repeatPasswordValidate, this ); // 檢查repeatPassword validate
		me.down('#password').on('change', me.repeatPasswordValidate, this);
	},

	repeatPasswordValidate : function() {
		if (this.down('#repeatPassword').getValue() || this.down('#password').getValue() == '')
			this.down('#repeatPassword').validate();
	}
});
