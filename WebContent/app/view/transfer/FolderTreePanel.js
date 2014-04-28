// TODO qtip for proejct folder
// TODO check tree for mutilple delete
// TODO D&D
// TODO rename

// It will show folders depends me.onWin value.
// If me.onWin==true, we just show virtual path in me.afterrender 
// Otherwise, expand and load folders in transfer.js controller

Ext.define('Ecfa.view.transfer.FolderTreePanel', {
	extend : 'Ecfa.ux.tree.EnhancedTreePanel',
	alias : 'widget.folderTreePanel',
	requires : [ 'Ecfa.view.transfer.FolderMenu' ],
	viewConfig : {
		// FIXME workaround: just disable it for the bug: expanding node on DblClick make appending children twice
		toggleOnDblClick : false,
		preserveScrollOnRefresh : true,
		preserveSelectionOnRefresh : false
	},
	// useArrows : true,
	containerId : null,
	onWin : false, // on selectSceneFileWin
	projectOid : null, // projectOid for selecting scene file
	workspacePath : null, // workspace for maya
	folder : null, // current selected folder
	// rootVisible : true,

	// requires : [ 'Ecfa.model.transfer.Folder' ], // this will make proxy url null
	requires : [ 'Ecfa.store.transfer.Folder' ],
	title : Locale.getMsg('view.transfer.folders'),
	initComponent : function() {

		var me = this;
		me.store = Ext.create('Ecfa.store.transfer.Folder');

		// me.tools = [ {
		// // type : 'expand',
		// // tooltip : Locale.getMsg('view.common.expand'),
		// // handler : function() {
		// // me.expandAll();
		// // }
		// // }, {
		// // type : 'collapse',
		// // tooltip : Locale.getMsg('view.common.collapse'),
		// // handler : function() {
		// // me.collapseRootChildren();
		// // }
		// // }, {
		// type : 'refresh',
		// tooltip : Locale.getMsg('view.common.refresh'),
		// handler : function() {
		// me.store.reload();
		// }
		// } ];

		me.dockedItems = me.dockedItems || [];

		me.callParent(arguments);

		me.on({

			afterrender : function() {
				// show default path on selecting scene file
				if (me.onWin) {

					// TODO move this code to win container
					if (me.containerId !== 'moveFileWin') {

						// For selecting workspace
						if (me.workspacePath) {
							// create folder: /project1/resource/scenes/part1/xxx
							me.createPath(me.workspacePath);
						} else {
							// create folder: /project1/resource
							var projectLocalFolderPath = Ecfa.StoreUtil.getStore('detailProjects').getById(me.projectOid).get('localFolderPath');
							me.createPath(Ext.String.filenameAppend(projectLocalFolderPath, Ecfa.Const.Folder.Name.RESOURCE));
						}
					}

				}
			},

			// fire folder selection event to fileGrid. fileGrid will load files in the folder.
			select : function(selectionRowModel, folder) {
				// treepanel will select root at first load even it's invisible
				// if (folder.getId() != ".") {
				me.folder = folder;
				Ecfa.event.Folder.fireEvent('selected', {
					'record' : folder,
					'containerId' : me.containerId
				});
				// }
			},
			// viewready : function() {
			// // expand and load
			// me.getRootNode().expand();
			// },
			load : function(tree, node, records, successful) {
				me.setLoading(false);

				if (successful) {
					// select resource(or workspacePath for maya) folder when selecting scene file on "first load"
					if (me.onWin && tree.getRootNode().getId() === node.getId()) {

						var toSelectNode = null;
						// on SelectSceneFileWin if user set workspacePath at previous step, select that folder.
						if (me.workspacePath) {
							toSelectNode = me.getRootNode().findChild('id', me.workspacePath, true);
						}
						// on SelectSceneFileWin: if user don't set workspacePath at previous step, select 'resource' folder
						// on SelectProjectWorkspaceWin: just select 'resource' folder
						else {
							toSelectNode = me.getRootNode().findChild('text', Ecfa.Const.Folder.Name.RESOURCE, true);
						}

						console.log('toSelectNode', toSelectNode);

						if (toSelectNode && toSelectNode.parentNode) {
							toSelectNode.parentNode.expand();
							Ecfa.event.Folder.fireEvent('selected', {
								'record' : toSelectNode,
								'containerId' : me.containerId
							});
						}

					}
				}

			},
			beforeload : function() {
				// console.log('beforeload me.onWin', me.onWin);
				me.setLoading(true);

			},
			// right-click menu
			itemcontextmenu : function(view, record, node, index, event) {
				// console.log('itemcontextmenu', record, node);
				if (record != null) {
					event.stopEvent();

					Ext.create('Ecfa.view.transfer.FolderMenu', {
						parentFolder : record
					}).showAt(event.getXY());
				}
			},
			beforedestroy : function() {
				Ecfa.event.Folder.un('created', me.onFolderCreate, me);
				Ecfa.event.Folder.un('show', me.onFolderShow, me);
				Ecfa.event.Folder.un('selected', me.onFolderSelect, me);
				Ecfa.event.Project.un('destroyed', me.onProjectDestroy, me);
				Ecfa.event.Project.un('created', me.onProjectCreate, me);
				Ecfa.event.Project.un('selected', me.onProjectSelect, me);
				Ecfa.event.Project.un('updated', me.onProjectUpdate, me);
				Ecfa.event.Project.un('refresh', me.onProjectRefresh, me);
			}
		});

		Ecfa.event.Folder.on({
			scope : me,
			created : me.onFolderCreate,
			show : me.onFolderShow,
			selected : me.onFolderSelect
		});

		Ecfa.event.Project.on({
			scope : me,
			destroyed : me.onProjectDestroy,
			created : me.onProjectCreate,
			selected : me.onProjectSelect,
			updated : me.onProjectUpdate,
			refresh : me.onProjectRefresh
		});

	},
	onProjectRefresh : function(projectsData) {
		var me = this;
		var projectFolderNodes;
		var i = 0, j = 0;
		var toRemove;
		// console.log('projectsData', projectsData);
		// check if the project folder has not been removed in tree
		// For example, there 3 records in project grid and 4 folders in tree. We need to remove it.
		projectFolderNodes = me.getRootNode().childNodes;
		for (i = 0; i < projectFolderNodes.length; ++i) {
			toRemove = true;
			// console.log('folder id', projectFolderNodes[i].getId());
			for (j = 0; j < projectsData.length; ++j) {
				// console.log('projectsData localFolderPath', projectsData[j].localFolderPath);
				if (projectFolderNodes[i].getId() === projectsData[j].localFolderPath) {
					// console.log('toRemove false');
					toRemove = false;
					break;
				}
			}
			if (toRemove) {
				// console.log('remove', projectFolderNodes[i]);
				projectFolderNodes[i].remove();
				--i;
			}
		}

	},
	onProjectDestroy : function(projectData) {
		var me = this;
		me.destroyNode({
			id : projectData.localFolderPath
		});
	},
	onProjectCreate : function(projectData) {
		var me = this;
		var projectFolder = me.createNode({
			id : projectData.localFolderPath,
			// parentId : Ext.String.filenameFolder(projectData.localFolderPath),
			name : projectData.folderName,
			qtip : Locale.getMsg('view.project.name') + ': ' + projectData.name
		});
		// console.log('onProjectCreate select projectFolder', projectFolder);
		if (projectFolder) {
			// filegird will load folders and append them to folderTree, so we need to set this folder loaded to prevent it from loading again when node expand
			projectFolder.set('loaded', true);
			me.getSelectionModel().select(projectFolder);
		}

	},
	onProjectUpdate : function(projectData) {
		var me = this;
		// console.log('findNode', me.findNode(projectData.localFolderPath));
		me.findNode(projectData.localFolderPath).set('qtip', Locale.getMsg('view.project.name') + ': ' + projectData.name);

	},
	onProjectSelect : function(projectRecord) {
		var me = this;
		// console.log('onProjectSelect', projectRecord);
		me.selectByProject(projectRecord);
	},

	onFolderCreate : function(data) {
		var me = this;
		var newNode = me.createPath(data.id);
	},
	onFolderShow : function(args) {
		// args={containerId:'xx', foldersData:[...]}
		// fire when file grid load
		// append folder when loadingfile gird
		var me = this;

		if (args.containerId === me.containerId /* && me.folder && record.getId() != me.folder.getId() */) {

			// args.parentFolderData
			// Remove folder on tree if it doesn't exist in the file grid
			var parentNode = me.findNode(args.parentFolderData);
			var shouldDeleted;
			for ( var i = 0; i < parentNode.childNodes.length; ++i) {
				shouldDeleted = true;
				for ( var j = 0; j < args.foldersData.length; ++j) {
					if (parentNode.childNodes[i].getId() == args.foldersData[j].id) {
						shouldDeleted = false;
						break;
					}

				}
				if (shouldDeleted) {
					console.log('remove', parentNode.childNodes[i].getId());
					parentNode.childNodes[i].remove();
					--i;
				}

			}

			// Add folder on tree if it exist in the file grid
			for ( var i = 0, len = args.foldersData.length; i < len; ++i) {
				// console.log('onFolderShow to create node', foldersData[i]);
				var newNode = me.createNode({
					id : args.foldersData[i].id,
					parentId : args.foldersData[i].folder,
					name : args.foldersData[i].name
				});
			}

		}

	},
	onFolderSelect : function(args) {
		var me = this;
		// console.log('tree selected args', args, 'me.containerId', me.containerId);
		// console.log('args.containerId === me.containerId && args.record && me.folder', args.containerId === me.containerId && args.record && me.folder);

		// console.log('1onFolderSelect');

		if (args.containerId === me.containerId && args.record /* && me.folder && record.getId() != me.folder.getId() */) {

			// console.log('2onFolderSelect');

			var node = me.findNode(args.record.getId());
			// console.log('onFolderSelect node && node.parentNode', node, node.parentNode);
			if (node && node.parentNode) {
				node.parentNode.bubble(function() {
					// console.log('onFolderSelect event @ tree: expand', this.getId());
					this.expand();
				});

				// if ('/1' === node.getId()) {
				// throw 'ddd';
				// }
				// console.log('onFolderSelect event @ tree: select', node.getId());
				me.getSelectionModel().select(node);
				me.getView().refresh();
			} else {
				console.warn('cant find node @ tree', args.record.getId());
			}
		}
	},

	// showPathBy : function() {
	// var me = this;
	// if (me.workspacePath) {
	// // create folder: /project1/resource/scenes/part1/xxx
	// me.createPath(me.workspacePath);
	// } else {
	// // create folder: /project1/resource
	// var projectLocalFolderPath = Ecfa.StoreUtil.getStore('detailProjects').getById(me.projectOid).get('localFolderPath');
	// me.createPath(Ext.String.filenameAppend(projectLocalFolderPath, Ecfa.Const.Folder.Name.RESOURCE));
	// }
	// },

	// load : function() {
	// var me = this;
	//
	// if (me.onWin) {
	// console.log('on win loading');
	// // only load the corresponding project's sub-folder when selecting scene file
	//
	// if (me.workspacePath) {
	// console.log('workspacePath', me.workspacePath);
	// // create folder: /project1/resource/scenes/part1/xxx
	// me.createPath(me.workspacePath);
	// }
	//
	// else {
	// // create folder: /project1/resource
	// var projectLocalFolderPath = Ecfa.StoreUtil.getStore('detailProjects').getById(me.projectOid).get('localFolderPath');
	// console.log('localpath', projectLocalFolderPath);
	// me.createPath(Ext.String.filenameAppend(projectLocalFolderPath, Ecfa.Const.Folder.Name.RESOURCE));
	//
	// }
	//
	// } else {
	// console.log('me.store.load folders');
	// // me.store.load({
	// // params : {
	// // node : '/',
	// // // isRoot : true,
	// // depth : 2
	// // }
	// // });
	// }
	//
	// },
	selectByProject : function(project) {
		if (project) {
			var me = this;
			// console.log('selectByProject localFolderPath', project.get('localFolderPath'));
			var node = me.findNode(project.get('localFolderPath'));

			if (node) {
				// console.log('selectByProject node (select and expand) loaded?', node.getId(), node.get('loaded'));
				// select the node
				Ecfa.event.Folder.fireEvent('selected', {
					'record' : node,
					'containerId' : me.containerId
				});
				node.expand();
			}
		}
	}
});
