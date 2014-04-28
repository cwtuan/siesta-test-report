
Ext.define('Ecfa.view.problem.CreateProblemWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.createProblemWin',
	width : 450,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.problem.add'),
	observers : [],
	initComponent : function() {
		var me = this;
		var now = new Date();

		var submitOptions = {
			url : 'rest/problems',
			method : 'POST',
			success : function(form, action) {
				me.close();
				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.problem.add.success'), 5000);
				Ecfa.event.Problem.fireEvent('created',action.result.target);
			},
			failure : function(form, action) {
				me.close();
				Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.problem.add.fail'), action.result));
			}
		};

		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			border : false,
			layout : 'anchor',
			fieldDefaults : {
				// msgTarget : 'under',
				labelWidth : 125
			},
			defaults : {
				anchor : '100%'
			},
			defaultType : 'textfield',
			items : [ {
				fieldLabel : Locale.getMsg('view.problem.name'),
				name : 'name',
				maxLength : 100,
				allowBlank : false
			}, {
				fieldLabel : Locale.getMsg('view.problem.description'),
				name : 'description',
				maxLength : 200,
				anchor : '100%',
				allowBlank : false,
				grow : true,
				xtype : 'textarea',
				enableKeyEvents : true,
				listeners: {
					keydown : function(text, e, eOpts ){
						if(e.getKey() === e.ENTER){
	                        this.setValue(this.getValue()+"\n");
						}
					}
				}
			}, {
				xtype : 'fieldset',
				title : Locale.getMsg('view.problem.problemOccurTime'),
				items : [ {
					xtype : 'datefield',
					anchor : '100%',
					fieldLabel : Locale.getMsg('view.problem.occurDate'),
					format : 'Y/m/d',
					value : new Date(),
					allowBlank : false,
					itemId : 'problemDate',
					name : 'problemDate'
				}, {
					xtype : 'timefield',
					anchor : '100%',
					fieldLabel : Locale.getMsg('view.problem.occurTime'),
					format : 'H:i:s',
					increment : 60,
					value : new Date(now.getTime()),
					allowBlank : false,
					itemId : 'problemTime',
					name : 'problemTime'
				} ]
			}, {
				name : 'occurTime',
				hidden : true,
				itemId : 'occurTime'
			}/*, {
				fieldLabel : Locale.getMsg('view.auth.user.id'),
				name : 'userId',
				maxLength : 60,
				allowBlank : false,
				value : Ecfa.Session.getUser().id,
				readOnly : true
			}, {
				fieldLabel : Locale.getMsg('view.common.email'),
				name : 'email',
				vtype : 'email',
				maxLength : 60,
				allowBlank : false,
				value : Ecfa.Session.getUser().email
			} */],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				formBind : true,
				type : 'submit',
				handler : function() {
					var params = this.up('form').getValues();
					console.log('params', params);

					if (this.up('form').getForm().isValid()) {
						var occurTime = params['problemDate'] + ' ' + params['problemTime'];						
						var date = new Date(occurTime);
						var milliseconds = date.getTime();
						//console.log('milliseconds', milliseconds);
						me.down('#occurTime').setValue(milliseconds);
					}
					me.down('#problemDate').disable(true);
					me.down('#problemTime').disable(true);
					
					this.up('form').getForm().submit(submitOptions);
					me.close();
				}
			}, {
				text : Locale.getMsg('view.common.cancel'),
				handler : function() {
					me.close();
				}
			} ]
		} ];

		me.callParent();
	}
});
