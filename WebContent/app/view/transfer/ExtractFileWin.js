Ext.define('Ecfa.view.transfer.ExtractFileWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.extractFileWin',
	width : 450,
	modal : true,
	layout : {
		type : 'fit'
	},
	files : null, // zip files to be extracted
	title : Locale.getMsg('view.transfer.extract'),
	initComponent : function() {
		var me = this;

		me.defaultFocus = 'targetFolder';

		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			layout : 'anchor',
			defaults : {
				anchor : '100%',
				labelWidth : 150
			},
			defaultType : 'textfield',
			items : [ {
				fieldLabel : Locale.getMsg('view.transfer.extract.targetPath'),
				name : 'targetFolder',
				itemId : 'targetFolder',
				tooltip : Locale.getMsg('view.transfer.extract.targetPath.tip'),				
				allowBlank : false,
				validator : Ecfa.Validator.resourceFolder
			}, {
				xtype : 'component',
				// style : 'color: #FF3300',
				html : Locale.getMsg('view.transfer.extract.overwrite.tip')
			} ],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				formBind : true,
				type : 'submit',
				handler : function() {

					// console.log(params);
					// Ecfa.event.Project.fireEvent('running', true);
					var data = this.up('form').getValues();

					Ext.getCmp('notifybar').showWarning(Locale.getMsg('view.transfer.extract.ing'));

					Ecfa.Restful.request({
						records : me.files,
						method : 'PUT',
						params : Ext.apply(data, {
							action : 'extract'
						}),
						success : function(jsonResp) {
							Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.transfer.extract.success'));
							Ecfa.event.File.fireEvent('updated', jsonResp.target);
						},
						failure : function(jsonResp) {
							Ecfa.event.File.fireEvent('updated', jsonResp.target);
							Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.transfer.extract.error'), jsonResp));
						}
					});
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
			// set default value for targetFolder
			show : function() {
				if (me.files.length >= 2) {
					// targetFolder is {current folder}
					var targetFolder = me.changeToResourceFolder(me.files[0].get('folder'));
					me.down('#targetFolder').setValue(targetFolder);
				}
				// length==1
				else {
					// if filename if abc.zip, targetFolder is {current folder} + '/' + 'abc'
					var targetFolder = me.changeToResourceFolder(me.files[0].get('folder') + Ecfa.Const.Folder.SEPARATOR
							+ Ecfa.Format.fileName(me.files[0].get('name')));
					me.down('#targetFolder').setValue(targetFolder);
					me.down('#targetFolder').selectText(targetFolder.lastIndexOf(Ecfa.Const.Folder.SEPARATOR) + 1, targetFolder.length);
				}
			}
		});
	},
	changeToResourceFolder : function(path) {
		var splitFilename = path.split("/");
		splitFilename[2] = 'resource';
		return splitFilename.join(Ecfa.Const.Folder.SEPARATOR);
	}
});
