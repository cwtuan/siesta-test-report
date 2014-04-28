Ext.define('Ecfa.view.transfer.action.CreateFolderWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.createFolderWin',
	width : 400,
	parentFolder : null,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.transfer.folder.create'),
	initComponent : function() {
		var me = this;

		me.defaultFocus = 'path';

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
				fieldLabel : Locale.getMsg('view.project.path'),
				name : 'path',
				itemId : 'path',
				allowBlank : false,
				validator : Ecfa.Validator.resourceFolder
			} ],

			buttons : [
					{
						text : Locale.getMsg('view.common.ok'),
						formBind : true,
						type : 'submit',
						handler : function() {

							Ecfa.Restful.request({
								url : me.parentFolder.proxy.url,
								method : 'POST',
								record : Ext.apply(this.up('form').getValues(), {
									'folder' : me.parentFolder.getId()
								}),
								success : function(jsonResp) {
									Ecfa.event.Folder.fireEvent('created', jsonResp.target);
								},
								failure : function(jsonResp) {

									Ext.getCmp('notifybar').showError(
											Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.transfer.folder.create.error', jsonResp.target.path), jsonResp));

								}
							});

							// });

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
				// set default folder path
				var path = me.parentFolder.getId() + Ecfa.Const.Folder.SEPARATOR + 'NewFolder';
				me.down('#path').setValue(path);
				me.down('#path').selectText(path.lastIndexOf(Ecfa.Const.Folder.SEPARATOR) + 1, path.length);
			}
		});

	}
});
