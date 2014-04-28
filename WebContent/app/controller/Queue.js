Ext.define('Ecfa.controller.Queue',
		{
			extend : 'Ext.app.Controller',
			stores : [ 'queue.Mission', 'queue.MissionByProject', 'queue.Frame', 'queue.MissionHistoryByProject', 'queue.MissionByUser','queue.MissionHistoryByUser', 'queue.MissionByClassify',
			           'queue.Output', 'queue.Asset','usage.Uframe', 'queue.Image' ],
			models : [ 'queue.Mission', 'queue.Frame', 'queue.Asset','usage.Uframe','queue.Image' ],
			views : [ 'queue.trigger.MissionWin', 'queue.SubmitSettingAdv', 'queue.trigger.SelectProjectWorkspaceWin' ],
			refs : [ {
				ref : 'submitSettingAdv',
				selector : 'submitSettingAdv'
			}, {
				ref : 'selectProjectWorkspaceWin',
				selector : 'selectProjectWorkspaceWin'
			} ],
			init : function() {
				var me = this;
				me.control({
					'missionWin button[action=add]' : {
						click : me.onMissionDependency

					},
					'selectSceneFileWin button[type=submit]' : {
						click : me.onSelectSceneFile
					},
					'selectProjectWorkspaceWin folderTreePanel' : {
						select : me.onSelectProjectWorkspace
					},
					'selectProjectWorkspaceWin button[type=submit]' : {
						click : me.onSelectedProjectWorkspace
					}
				});
			},

			onMissionDependency : function(button, e, eOpts) {
				var win = button.up('window');
				var displayData = win.displayData;
				var inputData = win.inputData;
				win.close();

				var form = this.getSubmitSettingAdv();
				form.down('#dependencyTrigger').setValue(displayData);
				form.down('#submissionOidKeeper').setValue(inputData);
			},

			onSelectSceneFile : function(button) {
				this.getSubmitSettingAdv().down('#sceneFile').setValue(button.up('window').down('#sceneFileField').getValue());
			},

			onSelectProjectWorkspace : function(selectionRowModel, node) {
				// set win's workspaceField from selected folder
				this.getSelectProjectWorkspaceWin().down('#workspaceField').setValue(node.getId());
			},
			onSelectedProjectWorkspace : function(button) {
				var me = this;
				var win = me.getSelectProjectWorkspaceWin();
				var workspacePath = button.up('window').down('#workspaceField').getValue();

				// check if workspace.mel exist
				win.down('notifybar').showWarning(Locale.getMsg('view.job.project.workspace.checking', 'workspace.mel', workspacePath));
				Ecfa.Restful.request({
					url : 'rest/transfer/files',
					method : 'GET',
					params : {
						path : workspacePath + '/workspace.mel', // TODO support other render engine
						checkExist : true
					},
					success : function() {
						// set workspacePath to submitSetting
						me.getSubmitSettingAdv().down('#projectWorkspace').setValue(workspacePath);
						win.close();
					},

					// if there's no project file, ask user to upload
					failure : function(jsonResp) {
						if (jsonResp && jsonResp.error === 'MISSING') {
							win.down('notifybar').showError(Locale.getMsg('view.job.project.workspace.error.missingFile', 'workspace.mel', workspacePath));

							// TODO dont listen twice
							// workspace-upload-link is file field wrapper
							Ext.get('workspace-upload-link').on('click', function() {
								// filefield contains iframe, text field, button, etc., so we need to find the actual button
								win.down('filefield').el.down('input[type=file]', true).click();
							});

							// set workspacePath to submitSetting
							Ext.get('use-workspace-anyway-link').on('click', function() {
								me.getSubmitSettingAdv().down('#projectWorkspace').setValue(workspacePath);
								win.close();
							});

						} else {
							// internal error
							win.down('notifybar').showError(Locale.getMsg('view.job.project.workspace.error.internal', 'workspace.mel', workspacePath));
						}

					}
				});

			}
		});
