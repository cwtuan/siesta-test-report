Ext.define('Ecfa.view.transfer.FileGrid',
		{
			extend : 'Ext.grid.Panel',
			alias : 'widget.fileGrid',
			viewConfig : {
				preserveScrollOnRefresh : false,
				preserveSelectionOnRefresh : false
			},
			getRecordDisabledTooltip : function(record) {
				if (record.get('name') === '..') {
					return '';
					// return Locale.getMsg('view.transfer.folder.disabled.tip.previousFolder');
				}
				return null;				
			},
			containerId : null,// the parent container id
			folder : null,
			onWin : false,
			fileFilter : null,
			fileFilterArray : null, // will be initialized on render
			requires : [ 'Ecfa.ux.panel.upload.BrowseButton', 'Ecfa.view.transfer.action.DeleteFileAction', 'Ecfa.ux.button.LinkButton',
					'Ecfa.ux.button.ImgButton', 'Ecfa.view.transfer.action.CompressFileAction', 'Ecfa.view.transfer.action.ExtractFileAction' ],
			title : Locale.getMsg('view.transfer.files', 'Ecfa.view.transfer.action.MoveFileAction'),
			selType : 'checkboxmodel',

			initComponent : function() {
				var me = this;

				// don't declare store in class config, o.w., listener for store will not be removed
				me.store = Ext.create('Ecfa.store.transfer.File');

				if (me.onWin) {
					Ext.merge(me, {
						selModel : {
							mode : 'SINGLE',
							showHeaderCheckbox : false
						}
					});
				} else {
					Ext.merge(me, {
						selModel : {
							mode : 'MULTI'
						}
					});
				}

				me.columns = [
						{
							xtype : 'rownumberer',
							width : 40
						},
						{
							// xtype : 'componentcolumn',
							// autoWidthComponents : false,
							dataIndex : 'name',
							header : Locale.getMsg('view.transfer.file.name'),
							flex : 1,
							// no renderer: 1~1.7s
							renderer : function(value, metadata, record) {

								var domId = me.getFileDomId(record);

								if (record.get('type') === Ecfa.Const.File.Type.IS_FOLDER) {

									return '&nbsp;<img height="14" width="14" src="css/images/folder_16.gif" >&nbsp;<a id="' + domId
											+ '" href="javascript: void(0)">' + value + '</a>';
								} else { // file

									if (me.onWin) {

										/* highlight the candidate scene files which meet file filter */
										for ( var i = 0; i < me.fileFilterArray.length; ++i) {
											if (value.endsWith(me.fileFilterArray[i])) {
												metadata.style = 'background-color: #FFFF00 !important;cursor: pointer;';
												break;
											}
										}

										// select scene file in selectionchange

									}

									return '&nbsp;<img height="14" width="14" src="' + me.getFileIcon(record.get('name')) + '" >&nbsp;<a id="' + domId
											+ '" href="javascript: void(0)">' + value + '</a>';

									// Ext.getCmp('downloadIframe').load(Ext.String.format('rest/transfer/download/{0}?path={1}', value, record.get('path')));
								}

							}
						}, {
							dataIndex : 'size',
							header : Locale.getMsg('view.common.size'),
							width : 60,
							renderer : function(value, metaData, record) {
								return (record.get('type') === Ecfa.Const.File.Type.IS_FOLDER) ? '' : Ext.util.Format.fileSize(value);
							}
						}, {
							dataIndex : 'modifyTime',
							header : Locale.getMsg('view.transfer.file.modifyTime'),
							width : 140,
							renderer : Ecfa.Format.dateTime
						} ];

				me.tbar = [ Ext.create('Ecfa.ux.panel.upload.BrowseButton', {
					// name : 'file', // tony: for server side's fileUploadBean
					uploadFieldId : (me.onWin) ? 'upload-field-at-win' : 'upload-field-at-panel',
					itemId : 'browseButton'
				}), Ext.create('Ecfa.view.transfer.action.CreateFolderAction', {
					itemId : 'createFolderButton',
					panel : me,
					hidden : me.onWin
				}), Ext.create('Ecfa.view.transfer.action.CompressFileAction', {
					itemId : 'compressButton',
					panel : me,
					hidden : me.onWin
				}), Ext.create('Ecfa.view.transfer.action.ExtractFileAction', {
					itemId : 'extractButton',
					panel : me,
					hidden : me.onWin
				}), Ext.create('Ecfa.view.transfer.action.DeleteFileAction', {
					itemId : 'deleteButton',
					panel : me,
					hidden : me.onWin
				}), Ext.create('Ecfa.view.transfer.action.MoveFileAction', {
					itemId : 'moveButton',
					panel : me,
					hidden : me.onWin,
					hidden : true
				}), '-', {
					xtype : 'button',
					icon : 'css/images/refresh.png',
					text : Locale.getMsg('view.common.refresh'),
					handler : function() {
						me.store.reload();
					}
				}, '->', Locale.getMsg('view.transfer.ftp.address', Ecfa.Config.FTP_SERVER) ];

				me.callParent(arguments);

				// remove old data when selecting scene file
				me.store.removeAll();

				me.store.on({

					load : function(store, records, successful) {

						if (successful) {
							var foldersData = [];
							// FIXME just add the new file onFileClick listener. Why adding new file listener will remove other files'?
							records = store.getRange();
							var i = 0, len = records.length;

							for (; i < len; ++i) {

								// Add listeners to each file dom
								// Note: event listen will be removed automatically when element destroyed
								var fileEl = Ext.get(me.getFileDomId(records[i]));
								if (fileEl) {

									// console.log('bind ', fileEl);

									fileEl.on('click', Ext.bind(me.onFileClick, me, [ records[i] ]));
								} else {
									console.warn('cannot find fileEl of file', records[i]);
								}

								// add folders to folder tree panel
								if (records[i].get('type') === Ecfa.Const.File.Type.IS_FOLDER) {
									foldersData.push(records[i].data);
								}
							}

							// received by folder tree for appending nodes
							Ecfa.event.Folder.fireEvent('show', {
								containerId : me.containerId,
								foldersData : foldersData,
								parentFolderData : me.folder.getId()
							});

						}

						// console.log(me.id, 'loading time', (new Date()).getTime() - me.t);
					},
					beforeload : function() {
						me.t = (new Date()).getTime();
					}
				});

				me.on({

					render : function() {

						if (me.onWin) {
							me.fileFilterArray = me.fileFilter.split(',');
							// console.log('render me.fileFilterArray ', me.fileFilterArray);
						} else {
							me.down('#deleteButton').switchStatus();
							me.down('#extractButton').switchStatus();
							me.down('#compressButton').switchStatus();
							me.down('#moveButton').switchStatus();

						}
					},
					selectionchange : function(selectionModel, records, index) {
						if (!me.onWin) {
							me.down('#deleteButton').switchStatus();
							me.down('#extractButton').switchStatus();
							me.down('#compressButton').switchStatus();
							me.down('#moveButton').switchStatus();
						}

						/* Check if file selected scene file is valid and set it to text field. */
						if (me.onWin) {
							if (records.length > 0 && records[0].get('type') === Ecfa.Const.File.Type.IS_FILE) {

								/* fileFilterArray (file extension) meet */
								for ( var i = 0; i < me.fileFilterArray.length; ++i) {
									if (records[0].get('name').endsWith(me.fileFilterArray[i])) {
										// me.up('selectSceneFileWin').down('#notifybar')
										// .showSuccess(Locale.getMsg('view.job.sceneFile.selected', records[0].get('name')));
										me.up('selectSceneFileWin').down('#notifybar').hideBar();
										me.up('selectSceneFileWin').down('#sceneFileField').setValue(records[0].get('path'));
										return;
									}
								}
								/* fileFilterArray (file extension) doesn't meet */
								me.up('selectSceneFileWin').down('#notifybar').showError(
										Locale.getMsg('view.job.sceneFile.select.error.fileFilter', records[0].get('name'), me.fileFilter), 10000);
								me.up('selectSceneFileWin').down('#sceneFileField').setValue('');

							}
						}

					},
					beforedestroy : function() {
						Ecfa.event.Folder.un('created', me.onFolderCreate, me);
						Ecfa.event.Folder.un('selected', me.onFolderSelect, me);

						Ecfa.event.File.un('created', me.onFileCreate, me);
						Ecfa.event.File.un('updated', me.onFileUpdate, me);
						Ecfa.event.File.un('destroyed', me.onFileDestroy, me);
					}
				});

				Ecfa.event.Folder.on({
					scope : me,
					created : me.onFolderCreate,
					selected : me.onFolderSelect
				});

				Ecfa.event.File.on({
					scope : me,
					created : me.onFileCreate,
					updated : me.onFileUpdate,
					destroyed : me.onFileDestroy
				});

			},
			onFolderCreate : function(data) {
				// console.log('created folder@filegrid', data);
				var me = this;
				if (me.folder.get('folder') === data.folder) {
					me.store.loadData([ data ], true);
				}
			},
			onFolderSelect : function(args) {
				var me = this;
				// console.log('selected folder', args.containerId === me.containerId && (me.folder == null || args.record.getId() != me.folder.getId()));
				if (args.containerId === me.containerId && (me.folder == null || args.record.getId() != me.folder.getId())) {
					me.load(args.record);
				}
			},
			onFileCreate : function(fileData) {
				var me = this;
				// only update files locacted at folder "fileData.folder"
				if (me.folder && me.folder.getId() === fileData.folder) {

					var oldFile = me.store.getById(fileData.path);
					if (oldFile) {
						// overwrite file
						me.store.remove(oldFile);
					}
					me.store.loadRawData([ fileData ], true);

					// auto selection
					if (me.onWin) {
						for ( var i = 0; i < me.fileFilterArray.length; ++i) {
							// console.log('fileData.path', fileData.path);
							if (fileData.path.endsWith(me.fileFilterArray[i])) {
								me.getSelectionModel().select([ me.store.findRecord('path', fileData.path) ]);
								break;
							}
						}
					}
				}
			},
			onFileUpdate : function() {
				this.store.reload();
			},
			onFileDestroy : function() {
				this.store.reload();
			},
			getFileDomId : function(record) {
				return this.containerId + '-file-' + record.getId();
			},
			onFileClick : function(record) {
				// console.log('onFileClick record', record.get('name'));
				var me = this;

				if (record.get('type') === Ecfa.Const.File.Type.IS_FOLDER) {
					// console.log('Folder fireEvent selected', record);
					Ecfa.event.Folder.fireEvent('selected', {
						'record' : record,
						'containerId' : me.containerId
					});
				}
				/* file record */
				else if (record.get('type') === Ecfa.Const.File.Type.IS_FILE) {

					/* select file */
					if (me.onWin) {
						// select scene file in selectionchange
					}
					/* download file */
					else {
						// console.log('download', record.get('name'));
						Ext.getCmp('downloadIframe').load(Ext.String.format('rest/transfer/download/{0}?path={1}', record.get('name'), record.get('path')));
					}
				}

			},
			load : function(folder) {
				var me = this;

				// console.log('[fileGrid] load folder', folder.getId());

				if (folder) {

					// FIXME ExtJS 4.1.1a will auto select the root at first load
					// if (folder.getId() === Ecfa.Const.Ftp.PREFIX) {
					// return;
					// }

					if (me.folder && me.folder.getId() === folder.getId()) {
						return;
					}

					// if the grid is not rendered, btn.switchStatus makes no effect
					if (!me.rendered) {
						setTimeout(function() {
							me.load(folder);
						}, 1000);
						return;
					}

					me.folder = folder;
					me.store.load({
						params : {
							path : me.folder.getId()
						}
					});

					// console.log('!!setTitle rendered', me.folder.getId(), me.rendered);
					me.setTitle(Locale.getMsg('view.transfer.files') + ' (' + me.folder.getId() + ')');

					me.down('#browseButton').switchStatus(me.folder);
					me.down('#createFolderButton').switchStatus(me.folder);

				}

			},
			getFileIcon : function(filename) {
				filename = filename.toLowerCase();
				if (filename.endsWith('.rar')) {
					return 'css/images/rar_16.png';
				} else if (filename.endsWith('.zip')) {
					return 'css/images/compress_16.png';
				} else if (filename.endsWith('.jpg') || filename.endsWith('.jepg') || filename.endsWith('.bmp') || filename.endsWith('.tga')
						|| filename.endsWith('.tiff') || filename.endsWith('.exr')) {
					return 'css/images/image_16.png';
				} else if (filename.endsWith('.avi') || filename.endsWith('.wmv') || filename.endsWith('.mov') || filename.endsWith('.mov')
						|| filename.endsWith('.3g2') || filename.endsWith('.3gp') || filename.endsWith('.flv') || filename.endsWith('.m4v')
						|| filename.endsWith('.mp4') || filename.endsWith('.mpg') || filename.endsWith('.srt') || filename.endsWith('.rm')
						|| filename.endsWith('.swf')) {
					return 'css/images/video_16.png';
				} else {
					return 'css/images/file_16x16.png';
				}

			}

		});
