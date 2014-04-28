Ext.define('Ecfa.view.version.UploadVersionWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.uploadVersionWin',
	requires : [ 'Ext.form.field.File', 'Ext.window.MessageBox' ],
	width : 350,
	modal : true,
	user : null,
	layout : 'fit',
	title : Locale.getMsg('view.version.upload.title'),
	initComponent : function() {
		var me = this;
		var labelWidth = 90;

		var submitOptions = {
			url : 'rest/op/version/upload',
			waitMsg : Locale.getMsg('view.transfer.upload.files') + '...',
			success : function(form, action) {
				console.log('success');
				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.version.upload.success'), 5000);
				Ecfa.event.Version.fireEvent('created', true);
				me.close();
			},
			failure : function(form, action) {
				console.log('fail', action.result);
				Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.version.upload.fail'), action.result));
				me.close();
			}
		};

		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			border : false,
			layout : 'anchor',
			defaults : {
				anchor : '100%',
				labelAlign : 'right',
				labelWidth : labelWidth
			},
			defaultType : 'textfield',
			fileUpload : true,
			enctype : 'multipart/form-data',
			items : [ {
				name : 'name',
				itemId : 'versionName',
				fieldLabel : Locale.getMsg('view.common.name'),
				maxLength : 50,
				allowBlank : false
			}, {
				name : 'version',
				itemId : 'version',
				fieldLabel : Locale.getMsg('view.version.version'),
				maxLength : 50,
				allowBlank : false
			}, {
				xtype : 'combo',
				name : 'versionType',
				itemId : 'versionType',
				fieldLabel : Locale.getMsg('view.version.versionType'),
				allowBlank : false,
				queryMode : 'local',
				displayField : 'display',
				valueField : 'value',
				store : Ext.create('Ecfa.store.version.VersionType'),
				labelWidth : labelWidth,
				editable : false,
				forceSelection : true,
				value : Ecfa.Const.Version.TYPE.APP,
				listeners : {
					select : function(combo, records, eOpts) {
						// console.log('select versionType',records[0].data.value);
						if (records[0].data.value === Ecfa.Const.Version.TYPE.PLUGIN) {
							me.down('#softVersion').setDisabled(false);
							me.down('#softName').setDisabled(false);
							me.down('#osType').setDisabled(true);
							me.down('#softVersion').setVisible(true);
							me.down('#softName').setVisible(true);
							me.down('#osType').setVisible(false);
						} else if (records[0].data.value === Ecfa.Const.Version.TYPE.APP) {
							me.down('#softVersion').setDisabled(true);
							me.down('#softName').setDisabled(true);
							me.down('#osType').setDisabled(false);
							me.down('#softVersion').setVisible(false);
							me.down('#softName').setVisible(false);
							me.down('#osType').setVisible(true);
						}
					}
				}
			}, {
				xtype : 'combo',
				name : 'softName',
				itemId : 'softName',
				fieldLabel : Locale.getMsg('view.version.softName'),
				allowBlank : false,
				displayField : 'softName',
				editable : false,
				forceSelection : true,
				store : Ext.create('Ecfa.store.version.Plugin', {
					proxy : {
						type : 'rest',
						url : 'rest/op/version/softwareName',
						reader : {
							type : 'restTaskGrid'
						}
					}
				}),
				queryMode : 'remote',
				labelWidth : labelWidth,
				hidden : true,
				disabled : true,
				listeners : {
					select : function(){
						console.log('select');
						me.down('#softVersion').getStore().getProxy().extraParams = {'softName' : me.down('#softName').getValue()};
					}
				}
			}, {
				xtype : 'combo',
				name : 'softVersion',
				itemId : 'softVersion',
				fieldLabel : Locale.getMsg('view.version.softVersion'),
				allowBlank : false,
				displayField : 'softVersion',
				editable : false,
				forceSelection : true,
				store : Ext.create('Ecfa.store.version.Plugin', {
					proxy : {
						type : 'rest',
						url : 'rest/op/version/softwareVersion',
						reader : {
							type : 'restTaskGrid'
						}
						//extraParams : me.down('#softName').getValue()
					}
				}),
				queryMode : 'remote',
				labelWidth : labelWidth,
				hidden : true,
				disabled : true
			}, {
				xtype : 'combo',
				name : 'osType',
				itemId : 'osType',
				fieldLabel : Locale.getMsg('view.version.osType'),
				allowBlank : false,
				queryMode : 'local',
				displayField : 'display',
				valueField : 'value',
				editable : false,
				forceSelection : true,
				store : Ext.create('Ecfa.store.resource.RenderOS'),
				labelWidth : labelWidth
			}, /*
				 * { name : 'path', itemId : 'path', fieldLabel : Locale.getMsg('view.version.path'), maxLength : 50, allowBlank : false },
				 */{
				xtype : 'filefield',
				name : 'file',
				id : 'versionFile',
				emptyText : Locale.getMsg('view.transfer.upload.select'),
				fieldLabel : Locale.getMsg('view.transfer.files'),
				buttonText : '',
				buttonConfig : {
					icon : 'css/images/dialog_16x16.png'
				},
				readOnly : false,
				labelWidth : labelWidth
				//,allowBlank : false
			} ],

			buttons : [ {
				text : Locale.getMsg('view.transfer.upload'),
				margin : '0 0 10 0',
				handler : function() {
					var form = this.up('form').getForm();
					if (form.isValid()) {
						//console.log('submit',form.getValues(),form.isValid(),me.getInvalidFields());
						me.down('form').getForm().submit(submitOptions);
					}
				}
			}, {
				text : Locale.getMsg('view.common.clear'),
				margin : '0 0 10 0',
				handler : function() {
					this.up('form').getForm().reset();
				}
			}, {
				text : Locale.getMsg('view.common.cancel'),
				margin : '0 0 10 0',
				handler : function() {
					me.close();
				}
			} ]
		} ];

		me.callParent();
	},
	getInvalidFields: function() {
		console.log('getInvalidFields');
	    var invalidFields = [];
	    Ext.suspendLayouts();
	    this.down('form').getForm().getFields().filterBy(function(field) {
	        if (field.validate()) return;
	        invalidFields.push(field);
	    });
	    Ext.resumeLayouts(true);
	    return invalidFields;
	}
});
