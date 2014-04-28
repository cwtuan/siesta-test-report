Ext.define('Ecfa.controller.Transfer', {
	extend : 'Ext.app.Controller',
	stores : [ 'transfer.File', 'transfer.Folder', 'Ecfa.ux.panel.upload.Store' ],
	models : [ 'transfer.File', 'Ecfa.ux.panel.upload.Model'
	// , 'transfer.Folder' // dont inlcude folder model, ow, the url will be null
	],
	refs : [ {
		ref : 'folderTreePanel',
		selector : 'projectView transferPanel folderTreePanel'
	}, {
		ref : 'projectGrid',
		selector : 'projectView projectGrid'
	}, {
		ref : 'transferPanel',
		selector : 'transferPanel'
	} ],

	init : function() {
		var me = this;

		me.control({
			'projectView transferPanel folderTreePanel' : {
				viewready : function() {
					// select default project in tree (when folderTreePanel's loading time is longer than projectGrid's)
					var tree = me.getFolderTreePanel();
					tree.getRootNode().expand(false, function() {
						var project = me.getProjectGrid().getSelectionModel().getSelection()[0];
						if (project) {
							tree.selectByProject(project);
						}
					});
				}
			}
		});
	}
});
