Ext.define('Ecfa.view.transfer.action.MoveFileWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.moveFileWin',
	requires : [ 'Ecfa.view.transfer.TransferPanel', 'Ecfa.ux.toolbar.NotifyBar' ],
	files : null, // files (model) to be moved
	folder : null, // folder path (string) for these files currently
	width : 600,
	height : 400,
	modal : true,
	layout : 'border',
	title : Locale.getMsg('view.transfer.file.move.selectFolder'),
	initComponent : function() {
		var me = this;

		me.items = [ {
			xtype : 'folderTreePanel',
			projectOid : me.projectOid,
			onWin : true,
			containerId : 'moveFileWin',
			region : 'center',
			margins : '0 0 0 0',
			flex : 1,
			split : true,
			collapsible : true,
			animCollapse : true
		}, {
			xtype : 'notifybar',
			region : 'south'
		} ];

		me.dockedItems = [ {
			xtype : 'toolbar',
			dock : 'bottom',
			ui : 'footer',
			// padding : '0 15 10 20',
			items : [ '->', {
				xtype : 'textfield',
				itemId : 'newPath',
				labelWidth : 70,
				width : 380,
				fieldLabel : Locale.getMsg('view.transfer.move.files.newFolder'),
				listeners : {
					change : function(textfield, newValue, oldValue) {
						if (newValue !== '') {
							me.down('#submitBtn').enable();
						}
					}
				}
			}, {
				xtype : 'button',
				itemId : 'submitBtn',
				type : 'submit',
				text : Locale.getMsg('view.common.ok'),
				disabled : true,
				handler : function() {
					var newPath = me.down('#newPath').getValue();
					Ecfa.Restful.request({
						method : 'PUT',
						records : me.files,
						params : {
							newPath : newPath,
							action : 'move'
						},
						failureSubject : Locale.getMsg('view.transfer.move.files.failure', newPath),
						successSubject : Locale.getMsg('view.transfer.move.files.success', newPath),
						eventType : Ecfa.event.File
					});
					me.close();

				}
			}, {
				xtype : 'button',
				text : Locale.getMsg('view.common.cancel'),
				handler : function() {
					me.close();
				}
			} ]
		} ];

		me.callParent();

		me.down('folderTreePanel').on({
			afterrender : function() {
				var tree = this;
				// show resource folders in all projects
				var projects = Ecfa.StoreUtil.getStore('detailProjects').getRange();
				Ext.Array.each(projects, function(project) {
					var projectLocalFolderPath = project.get('localFolderPath');
					tree.createPath(Ext.String.filenameAppend(projectLocalFolderPath, Ecfa.Const.Folder.Name.RESOURCE), false);
				});
			},
			select : function(selectionRowModel, node) {
				var newPath = node.getId();
				var isResourceFolder;
				// verify if the new target path is valid
				if (newPath === me.folder) {
					// should not be the same folder as original one
					me.setEnabled(false, Locale.getMsg('view.transfer.move.files.selectFolder.error.sameFolder'));
					return;
				} else if ((isResourceFolder = Ecfa.Validator.resourceFolder(newPath)) !== true) {
					// should be resource folder
					me.setEnabled(false, isResourceFolder);
					return;
				}

				// TODO 驗證
				
				for ( var i = 0; i < me.files.length; ++i) {
					// folder should not move to its sub folders
					if (me.files[i].get('type') === Ecfa.Const.File.Type.IS_FOLDER && newPath.startsWith(me.files[i].get('path'))) {

						// newPath = /1/2/3/4
						// file (folder) path = /1/2/3/4/5

						me.setEnabled(false, Locale.getMsg('view.transfer.move.files.selectFolder.error.subfolders'));
						return;
					}
				}

				me.setEnabled(true);

			}
		});
	},
	setEnabled : function(enabled, msg) {
		var me = this;
		if (enabled) {
			me.down('#newPath').setValue(node.getId());
			me.down('#submitBtn').enable();
			me.down('notifybar').hideBar();
		} else {
			me.down('#newPath').setValue('');
			me.down('#submitBtn').disable();
			me.down('notifybar').showError(msg, 5000);
		}
	}
});
