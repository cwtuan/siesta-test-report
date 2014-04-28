/**
 * For asset tracking
 */

Ext.define('Ecfa.view.transfer.SimpleUploaderWin', {
	extend : 'Ext.window.Window',
	requires : [ 'Ecfa.ux.toolbar.NotifyBar' ],
	alias : 'widget.simpleUploaderWin',
	// projectOid : null,
	folderPath : null, // destnation folder
	fileName : null, // the missing file to be uploaded
	foundPath : null, // the missing file's full path
	width : 647,
	height : 400,
	modal : true,
	layout : 'border',
	// title : Locale.getMsg('view.job.sceneFile.upload'),
	initComponent : function() {
		var me = this;
		console.log('foundPath', me.foundPath);
		console.log('folderPath',me.folderPath);
		console.log('filename',me.fileName);
		me.items = [ Ext.create('Ecfa.ux.panel.upload.FileUploadPanel', {
			itemId : 'fileUploadPanel',
			region : 'center',
			enableBrowse : true,
			remoteFolder : me.folderPath,
			title : '',
			broder : false
		// ,
		// margins : '5 5 5 5',
		// subFolder : 'resource',
		// projectOid : me.projectOid
		}), {
			region : 'north',
			xtype : 'notifybar'
		// ,
		// cls : 'x-form-invalid-under',
		// xtype : 'component'
		}, {
			region : 'south',
			hidden : true,
			xtype : 'component',
			html : '<input type="file" multiple id="upload-field-at-win"/>'
		} ];

		me.buttons = [ {
			itemId : 'closeBtn',
			text : Locale.getMsg('view.common.close'),
			handler : function() {
				me.close();
			}
		} ];

		me.callParent();

		// trigger asset taking again
		// TODO listen on file created event
		me.child('#fileUploadPanel').uploadManager.on('uploadcomplete', function() {
			Ecfa.event.Track.fireEvent('track');
		});

		me.on({
			// don't close win if files are still uploading
			beforeclose : function() {
				if (me.down('#fileUploadPanel').uploading) {
					me.down('notifybar').showError(Locale.getMsg('view.transfer.upload.beforeCloseWin'));
					return false;
				}
			},
			afterrender : function() {
				me.setTitle(Locale.getMsg('view.job.asset.uploaderTitle', me.foundPath));
				// disable the upload button first and check if folder path exist

				me.checkFolder();
			}
		});

	},
	enableBrowseBtn : function(enable) {
		var me = this;
		var browseButton = me.child('#fileUploadPanel').down('#browseButton');
		if (enable) {
			browseButton.enable();
			browseButton.setTooltip(Locale.getMsg('view.job.asset.enabledTip', me.fileName));
		} else {
			browseButton.disable();
			browseButton.setTooltip(Locale.getMsg('view.job.asset.disabledTip'));
		}
	},
	checkFolder : function() {
		var me = this;

		// if (enable) {
		// console.log('enable uploading');
		// me.enableBrowseBtn(true);
		// me.down('notifybar').showSuccess(Locale.getMsg('view.job.asset.folderExist', me.folderPath, me.fileName), 60000);
		// } else {
		// console.log('disable uploading');
		// me.enableBrowseBtn(false);

		me.enableBrowseBtn(false);
		me.down('notifybar').showWarning(Locale.getMsg('view.job.asset.folderCkecking', me.folderPath));

		// check if destination folder path exist
		Ecfa.Restful.request({
			url : 'rest/transfer/files',
			method : 'GET',
			params : {
				path : me.folderPath,
				checkExist : true
			},
			success : function() {
				me.down('notifybar').showSuccess(Locale.getMsg('view.job.asset.folderExist', me.folderPath, me.fileName), 60000);
				me.enableBrowseBtn(true);
			},
			// if folder don't exist, create it automatically
			failure : function(jsonResp) {

				me.down('notifybar').showWarning(Locale.getMsg('view.job.asset.folderCreating', me.folderPath));

				Ecfa.Restful.request({
					url : 'rest/transfer/folders', // use proxy's url
					method : 'POST',
					record : {
						path : me.folderPath
					},
					success : function(jsonResp) {
						console.log('folder created', me.folderPath);
						me.down('notifybar').showSuccess(Locale.getMsg('view.job.asset.folderCreated', me.folderPath, me.fileName), 60000);
						me.enableBrowseBtn(true);
					},
					failure : function(jsonResp) {
						console.log('folder created fail', me.folderPath);
						me.checkFolder();
					}
				});
			}
		});
		// }
	}
});
