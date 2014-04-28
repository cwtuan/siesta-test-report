// for OP
Ext.define('Ecfa.view.resource.CreateRenderWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.createRenderWin',
	width : 400,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.resource.render.add'),
	initComponent : function() {
		var me = this;
		var check_space = /^([ ]?[\w-]*[ ]+[\w-]*)+$/;
		var check_id = /^[A-Za-z0-9_-]{1,20}$/;

		var submitOptions = {
			url : 'rest/op/resource/renders',
			method : 'POST',
			success : function(form, action) {
				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.render.add.success'), 5000);
				me.close();
				Ecfa.event.Render.fireEvent('updated', true);
			},
			failure : function(form, action) {
				console.log("create render failed", action.result);
				Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.render.add.fail'), action.result));
				me.close();
				Ecfa.event.Render.fireEvent('updated', true);
			}
		};

		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			layout : 'anchor',
			defaults : {
				anchor : '100%',
				labelWidth : 100,
				labelAlign : 'right'
			},
			defaultType : 'textfield',
			items : [ /*{
				name : 'id',
				value : 1
			},*/{
				fieldLabel : Locale.getMsg('view.common.name'),
				name : 'hostName',
				maxLength : 50,
				allowBlank : false
			/*
			 * ,validator : function(value) { if (value === '') { return true; } else if(check_space.test(value)){ return
			 * Locale.getMsg('view.auth.id.invalid_space'); } else if(!check_id.test(value)) { return Locale.getMsg('view.auth.id.invalid_char'); } //
			 * duplicated rener name else if (Ext.getStore('resource.Pool').findExact('name', value) !== -1) { return
			 * Locale.getMsg('view.auth.user.create.failure.duplicated'); } return true; }
			 */
			}, {
				name : 'ipAddress',
				fieldLabel : Locale.getMsg('view.resource.render.ip'),
				maxLength : 50,
				allowBlank : false
				//value : '10.144.149.152'
			}, {
				name : 'sshAccount',
				fieldLabel : Locale.getMsg('view.resource.render.sshAccount'),
				maxLength : 50,
				allowBlank : false
				//value : 'berlin'
			}, {
				name : 'sshMima',
				fieldLabel : Locale.getMsg('view.resource.render.sshPassword'),
				maxLength : 50,
				allowBlank : false,
				//value : 'Pa$$w0rd',
				inputType : 'password'
			}, {
				name : 'cpuCores',
				fieldLabel : Locale.getMsg('view.resource.render.cpuCores'),
				xtype : 'numberfield',
				allowBlank : false
				//value : '4'
			}, {
				name : 'cpuMhz',
				fieldLabel : Locale.getMsg('view.resource.render.cpuMhz') + '(Mhz)',
				maxLength : 50,
				allowBlank : false
				//value : '2400' // 單位Ghz -> 後端轉成Mhz
			}, {
				name : 'memory',
				fieldLabel : Locale.getMsg('view.resource.render.memory') + '(MB)',
				allowBlank : false
		        //value : '8' 
			}, {
				name : 'os',
				fieldLabel : Locale.getMsg('view.resource.render.os'),
				xtype : 'combobox',
				store : Ext.create('Ecfa.store.resource.RenderOS'),
				queryMode : 'local',
				displayField : 'display',
				valueField : 'value',
				allowBlank : false,
				editable: false,
				forceSelection : true
			}, {
				name : 'level',
				fieldLabel : Locale.getMsg('view.resource.render.level'),
				xtype : 'combobox',
				store : Ext.create('Ecfa.store.resource.RenderLevel'),
				queryMode : 'local',
				displayField : 'display',
				valueField : 'value',
				allowBlank : false,
				editable: false,
				forceSelection : true
			}, {
				name : 'priority',
				fieldLabel : Locale.getMsg('view.resource.render.priority'),
				itemId : 'priorityCombo',
				xtype : 'combobox',
				store : Ext.create('Ecfa.store.resource.RenderPriority'),
				queryMode : 'local',
				editable : false,
				displayField : 'display',
				valueField : 'value',
				allowBlank : false,
				editable: false,
				forceSelection : true
			} ],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				formBind : true,
				type : 'submit',
				margin : '0 0 10 0',
				handler : function() {

					me.setLoading(true);

					var params = this.up('form').getValues();
					console.log('params', params);
					this.up('form').getForm().submit(submitOptions);

					/*
					 * if(params.userType === Ecfa.Const.User.USER){ this.up('form').getForm().submit(submitOptions); } else if(params.userType ===
					 * Ecfa.Const.User.OPERATOR || params.userType === Ecfa.Const.User.VIEWER){ this.up('form').getForm().submit(submitOptionsOP); }
					 */
					/*
					 * Ecfa.event.User.fireEvent('running', true);
					 * 
					 * Ecfa.util.Restful('rest/auth/user', params, {
					 * 
					 * success : function(jsonResp) { Vpdc.event.User.fireEvent('created', jsonResp); }, failure : function() {
					 * Ext.create('Ext.ux.window.Notification', { title : 'Notification', position : 't', iconCls : 'ux-notification-icon-error ',
					 * autoCloseDelay : 5000, spacing : 20, html : Locale.getMsg('view.auth.user.create.failure') }).show(); }, callback : function() {
					 * Vpdc.event.User.fireEvent('running', false); } });
					 */
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
