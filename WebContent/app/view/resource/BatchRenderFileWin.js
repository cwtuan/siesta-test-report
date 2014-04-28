Ext.define('Ecfa.view.resource.BatchRenderFileWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.batchRenderFileWin',
	requires : [ 'Ext.form.field.File', 'Ext.window.MessageBox' ],
	width : 310,
	modal : true,
	user : null,
	layout : 'fit',
	title : Locale.getMsg('view.resource.render.importBatch'),
	initComponent : function() {
		var me = this;

		var submitOptions = {
			url : 'rest/op/resource/batchRenders',
			waitMsg : Locale.getMsg('view.transfer.upload.files') + '...',
			success : function(form, action) {
				console.log('success');
				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.render.importBatch.success'), 5000);
				Ecfa.event.Render.fireEvent('created', true);
				me.close();
			},
			failure : function(form, action) {
				console.log('fail', action.result);
				Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.render.importBatch.fail'), action.result));
				// Ecfa.event.Render.fireEvent('created', null);
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
				labelAlign : 'right'
			},
			defaultType : 'textfield',
			fileUpload : true,
			enctype : 'multipart/form-data',
			items : [ {
				xtype : 'filefield',
				name : 'file',
				id : 'batchFile',
				itemId : 'batchFile',
				emptyText : Locale.getMsg('view.transfer.upload.select'),
				fieldLabel : Locale.getMsg('view.transfer.files'),
				buttonText : '',
				buttonConfig : {
					icon : 'css/images/dialog_16x16.png'
				},
				readOnly : false,
				labelWidth : 70,
				allowBlank : false
			}, {
				xtype : 'linkButton',
				columnWidth : 0.2,
				text : Locale.getMsg('view.resource.render.importBatch.template'),
				margin :'10 0 0 0',
				style: {
	                textAlign: 'right'
	            },
				listeners : {
					click : function() {
						var body = Ext.getBody(), frame = body.createChild({
							tag : 'iframe',
							cls : 'x-hidden',
							id : 'hiddenform-iframe',
							name : 'iframe'
						}), form = body.createChild({
							tag : 'form',
							cls : 'x-hidden',
							id : 'hiddenform-form',
							action : 'rest/op/resource/batchRenders/template',
							target : 'iframe'
						});
						form.dom.submit();
					}
				}
			} ],
			
			buttons : [ {
				text : Locale.getMsg('view.transfer.upload'),
				margin : '0 0 10 0',
				handler : function() {				    
					var form = this.up('form').getForm();
					if (form.isValid()) {
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
	}
});
