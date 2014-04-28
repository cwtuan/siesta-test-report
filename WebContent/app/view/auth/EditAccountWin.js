// for UP
Ext.define('Ecfa.view.auth.EditAccountWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.editAccountWin',
	itemId : 'editAccountWin',
	width : 400,
	labelWidth : 200,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.account.editProperty'),
	observers : [],
	// store : 'auth.User',
	editEmail : false,
	initComponent : function() {
		var me = this;
		var now = new Date();
		var oneMinute = 60000;
		var oneHour = 3600000;

		me.defaultFocus = 'email';
		
		var submitOptions = {
			url : 'rest/auth/edituser',
			method : 'POST',
			success : function(form, action) {
				// console.log("Update session",Ecfa.Session.getSession());
				Ecfa.Session.getSession();
				var msg = Locale.getMsg('view.auth.user.edit.success');
				// console.log('editemial',me.editEmail);
				if (me.editEmail === true) {
					msg = msg + Locale.getMsg('view.account.editEmail.msg');
				}
				Ext.getCmp('notifybar').showSuccess(msg, 500000);
				me.close();
			},
			failure : function(form, action) {
				console.log('edituser fail', action.result);
				me.down('#formErrorState').setVisible(true);
				me.down('#formErrorState').setError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.auth.user.edit.failure'), action.result));
				// Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.render.delete.fail'), jsonResp));
				me.down('#edit_submit').setDisabled(false);
			},
			callback : function() {
				// console.log("callback");
				me.close();
			}
		};

		me.items = [ {
			xtype : 'form',
			bodyPadding : 15,
			layout : 'anchor',
			defaults : {
				anchor : '100%'
			},
			defaultType : 'textfield',
			itemId : 'editAccountform',
			// renderTo : Ext.getBody(),
			fieldDefaults : {
				msgTarget : 'under',
				labelWidth : 125
			},
			defaultType : 'textfield',
			items : [ {
				fieldLabel : Locale.getMsg('view.common.id'),
				name : 'id',
				readOnly : true,
				value : Ecfa.Session.getUser().id
			}, {
				fieldLabel : Locale.getMsg('view.common.email'),
				name : 'email',
				itemId : 'email',
				// readOnly : true,
				value : Ecfa.Session.getUser().email
			/*
			 * ,validator : function(value) { me.isModified(); return true; }
			 */
			}, {
				fieldLabel : Locale.getMsg('view.common.phoneNumber'),
				name : 'phoneNumber',
				itemId : 'phoneNumber',
				value : Ecfa.Session.getUser().phoneNumber,
				// restrict input character
				maskRe : /^[#+:0-9]*$/
			/*
			 * ,validator : function(value) { me.isModified(); return true; }
			 */
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
					itemId : 'oldPassword',
					fieldLabel : Locale.getMsg('view.auth.password.old'),
					name : 'oldPassword',
					inputType : 'password',
					validator : function(value) {
						if (value != '' && value.length < 6) {
							return Locale.getMsg('view.auth.password.min.error');
						}
						if (value === ''){
							if(me.down('#password').getValue() != '')
								return Locale.getMsg('view.auth.password.min.error');
							else if(me.down('#repeatPassword').getValue() === '')
								me.down('#edit_submit').setDisabled(false);
						}
						if (value != '' && value == me.down('#password').getValue()) {
							return Locale.getMsg('view.auth.password.same');
						}
						return true;
					}
				}, {
					itemId : 'password',
					id : 'password',
					fieldLabel : Locale.getMsg('view.auth.password.new'),
					name : 'password',
					inputType : 'password',
					validator : function(value) {
						if (value != '' && value.length < 6) {
							return Locale.getMsg('view.auth.password.min.error');
						}
						if (value != '' && value == me.down('#oldPassword').getValue()) {
							return Locale.getMsg('view.auth.password.same');
						}
						return true;
					}
				}, {
					itemId : 'repeatPassword',
					id : 'repeatPassword',
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
					layout : 'fit',
					hidden : true,
					setError : function(error) {
						var me = this, baseCls = me.baseCls;
						me.addCls(baseCls + '-invalid');
						me.update(error);
					},
					clearError : function() {
						var me = this, baseCls = me.baseCls;
						me.removeCls(baseCls + '-invalid');
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
			} ],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				type : 'submit',
				itemId : 'edit_submit',
				formBind : true,
				//disabled : true,
				handler : function() {
					if (me.down('#email').getValue() != Ecfa.Session.getUser().email) {
						me.editEmail = true;
					}
					me.down('form').getForm().submit(submitOptions);
				}
			}, {
				text : Locale.getMsg('view.common.cancel'),
				handler : function() {
					me.close();
				}
			} ]
		} ];

		me.callParent();

		me.down('form').getForm().on('validitychange', me.disableButton, this);
		me.down('#password').on('change', me.repeatPasswordValidate, this);
		//me.down('#email').on('change', me.isModified, this);
		//me.down('#phoneNumber').on('change', me.isModified, this);
	},
	disableButton : function() {
		if (this.down('#oldPassword').getValue() != '') {
			if (this.down('#password').getValue().length === 0 || this.down('#repeatPassword').getValue().length === 0) {
				this.down('#edit_submit').setDisabled(true);
			}
		}
	},

	repeatPasswordValidate : function() {
		if (this.down('#repeatPassword').getValue() || this.down('#password').getValue() == '')
			this.down('#repeatPassword').validate();		
	},

	isModified : function() {
		console.log('isModified', this.down('#oldPassword').getValue().length,this.down('#edit_submit'), this.down('#edit_submit').isDisabled());
		// If User don't edit email and phoneNumber
		if (this.down('#email').getValue() != Ecfa.Session.getUser().email || this.down('#phoneNumber').getValue() != Ecfa.Session.getUser().phoneNumber) {
			this.down('#edit_submit').setDisabled(false);
		} else{
			if(this.down('#oldPassword').getValue().length == 0 || this.down('#password').getValue().length == 0 || this.down('#repeatPassword').getValue().length ==0){
				console.log('--disable',this.down('#oldPassword').getValue().length);
			   this.down('#edit_submit').setDisabled(true);
			}
			else{
				console.log('--enable');
				this.down('#edit_submit').setDisabled(false);
			}
		}
	}
});
