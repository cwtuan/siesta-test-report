// TODO default focus field

Ext.define('Ecfa.view.transfer.action.CompressFileWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.compressFileWin',
	width : 400,
	files : null,
	panel : null,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.transfer.compress.file'),
	initComponent : function() {
		var me = this;

		me.defaultFocus = 'filename';

		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			layout : 'anchor',
			defaults : {
				anchor : '100%',
				labelWidth : 110
			},
			defaultType : 'textfield',
			items : [ {
				fieldLabel : Locale.getMsg('view.transfer.compress.file.name'),
				name : 'filename',
				itemId : 'filename', // default filename
				allowBlank : false
			// ,
			// validator : Ecfa.Validator.folderName
			// TODO validator
			}
			// , {
			// // columnWidth : 0.2,
			//				
			// html : 'cccc'
			// }
			],

			buttons : [ {
				text : Locale.getMsg('view.transfer.compress'),
				formBind : true,
				type : 'submit',
				handler : function() {

					// console.log('me.parentFolder', me.parentFolder);

					var params = this.up('form').getValues();

					console.log('params.filename', params.filename);
					console.log('files', me.files);

					var url = me.files[0].proxy.url;
					// console.log('url', url);
					Ecfa.Restful.request({
						// url : url,
						method : 'POST',
						params : {
							action : 'compress',
							filename : params.filename
						},
						records : me.files,
						success : function(jsonResp) {
							// console.log('success', jsonResp);
							me.panel.store.reload(); // TODO use event
							Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.transfer.compress.success', jsonResp.target));
							// TODO 後端是否可以馬上回壓縮的檔名回來? 再開一個thread去壓
						},
						failure : function(jsonResp) {
							Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.transfer.compress.error'), jsonResp));
						}
					});
					me.panel.getSelectionModel().deselectAll();

					// console.log('file0', me.files[0]);
					Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.transfer.compress.processing', params.filename + '.zip'));

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

		me.on({
			show : function() {
				if (me.files.length > 0) {
					// targetFolder is {current folder}
					var filenameField = me.down('#filename');
					var folderName = me.files[0].get('folder').split(Ecfa.Const.Folder.SEPARATOR);
					folderName = folderName[folderName.length - 1];
					filenameField.setValue(folderName);
					filenameField.selectText(0, folderName.length);
				}
			}
		});

	}
});
