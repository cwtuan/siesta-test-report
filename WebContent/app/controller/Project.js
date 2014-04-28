Ext.define('Ecfa.controller.Project', {
	extend : 'Ext.app.Controller',
	stores : [ 'project.Project', 'project.Invitation'// , 'project.WaitingInvitation'
	],
	models : [ 'project.Project', 'project.Invitation' ],
	refs : [ {
		ref : 'assetPanel',
		selector : 'assetPanel'
	}, {
		ref : 'projectUserGrid',
		selector : 'projectUserGrid'
	}, {
		ref : 'projectGrid',
		selector : 'projectGrid'
	}, {
		ref : 'downloadPanel',
		selector : 'downloadPanel'
	}, {
		ref : 'downloadFileSelectionGrid',
		selector : 'downloadFileSelectionGrid'
	}, {
		ref : 'folderTreePanel',
		selector : 'folderTreePanel'
	}, {
		ref : 'doDownloadPanel',
		selector : 'doDownloadPanel'
	}, {
		ref : 'viewport',
		selector : '#viewport'
	}, {
		ref : 'transferMenu',
		selector : '#viewport #transferMenu'
	}, {
		ref : 'mainToolbar',
		selector : '#viewport #mainToolbar'
	} ],
	init : function() {
		var me = this;
		me.control({
			'projectGrid' : {

				// tony: mv this code to projectGrid
//				cellclick : function(panel, td, cellIndex, record, tr, rowIndex, e, eOpts) {
//					console.log('cellclick');
//					if (cellIndex === 1) {
//						me.getProjectUserGrid().load(record);
//						me.getAssetPanel().load(record);
//					}
//				},
//				itemclick: function( ) {
//					console.log('itemclick');
//				},
//				select : function(){
//					console.log('select');
//					
//				}
			}
		});
	}
});
