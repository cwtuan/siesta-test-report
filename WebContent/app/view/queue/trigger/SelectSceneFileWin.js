Ext.define('Ecfa.view.queue.trigger.SelectSceneFileWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.selectSceneFileWin',
	requires : [ 'Ecfa.view.transfer.TransferPanel', 'Ecfa.ux.toolbar.NotifyBar' ],
	projectOid : null,
	fileFilter : null,
	workspacePath : null,
	width : 700,
	height : 500,
	modal : true,
	layout : 'border',
	title : Locale.getMsg('view.job.sceneFile.select'),
	initComponent : function() {
		var me = this;

		me.items = [ {
			xtype : 'folderTreePanel',
			containerId : 'selectSceneFileWin', // for folder selected event
			projectOid : me.projectOid,
			workspacePath : me.workspacePath,
			onWin : true,
			region : 'west',
			margins : '0 0 0 0',
			flex : 1,
			split : true,
			collapsible : true,
			animCollapse : true,
			layout : 'fit'
		}, {
			xtype : 'fileGrid',
			containerId : 'selectSceneFileWin', // for folder selected event
			fileFilter : me.fileFilter,
			onWin : true,
			region : 'center',
			layout : 'fit',
			flex : 2,
			margins : '5 5 0 0'
		}, {
			xtype : 'fileUploadPanel',
			itemId : 'fileUploadPanel',
			containerId : 'selectSceneFileWin', // for folder selected event
			icon : 'css/images/arrow_up_16x16.png',
			enableBrowse : false,
			region : 'south',
			layout : 'fit',
			// subFolder : 'resource',
			// projectOid : me.projectOid,
			flex : 1,
			margins : '5 5 0 0',
			collapsible : true,
			animCollapse : true
		}, {
			hidden : true,
			region : 'east',
			xtype : 'component',
			html : '<input type="file" multiple id="upload-field-at-win"/>'
		}, {
			xtype : 'notifybar',
			itemId : 'notifybar',
			region : 'north'
		} ];

		me.dockedItems = [ {
			xtype : 'toolbar',
			dock : 'bottom',
			ui : 'footer',
			// padding : '0 15 10 20',
			items : [ '->', {
				xtype : 'textfield',
				name : 'sceneFile',
				itemId : 'sceneFileField',
				// readOnly : true, // FIXME readOnly make lable grayed out. ExtJS 4.2.1 fixes it.
				labelWidth : 70,
				width : 400,
				fieldLabel : Locale.getMsg('view.job.sceneFile'),
				listeners : {
					change : function(textfield, newValue, oldValue) {
						console.log('change', newValue !== '', newValue);
						me.down('#submitBtn').setDisabled(newValue == '');
					}
				}
			}, {
				xtype : 'button',
				itemId : 'submitBtn',
				type : 'submit',
				text : Locale.getMsg('view.job.sceneFile.use'),
				disabled : true,
				handler : function() {
					me.close();
					// pass scene file path to sceneFile in submitSetting (Queue.js Controller)
				}
			}, {
				xtype : 'button',
				text : Locale.getMsg('view.common.cancel'),
				handler : function() {
					me.close();
				}
			} ]
		} ];

		// me.buttons = [ {
		// type : 'submit',
		// text : Locale.getMsg('view.common.ok')
		// }, {
		// text : Locale.getMsg('view.common.cancel'),
		// handler : me.close
		// } ];

		me.callParent();

		me.on({
			beforeclose : function() {
				// FIXME dont close when uploading even if selected
				// console.log('uploading', me.down('#fileUploadPanel').uploading);

				if (me.down('#fileUploadPanel').uploading) {
					// console.log('notifybar', me.down('#notifybar'));
					// alert(Locale.getMsg('view.transfer.upload.beforeCloseWin'));
					me.down('#notifybar').showError(Locale.getMsg('view.transfer.upload.beforeCloseWin'), 8000);
					return false;
				}
				return true;
			}
		});

	}
});
