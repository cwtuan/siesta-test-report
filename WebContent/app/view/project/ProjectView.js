Ext.define('Ecfa.view.project.ProjectView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.projectView',
	border : false,
	margins : '0 0 5 0',
	requires : [
	// 'Ecfa.view.transfer.DownloadFileSelectionGrid', 'Ecfa.view.transfer.DoDownloadPanel', 'Ecfa.view.transfer.FolderTreePanel'
	'Ecfa.view.project.ProjectGrid', 'Ecfa.view.project.ProjectUserGrid', 'Ecfa.view.transfer.TransferPanel' ],

	layout : 'border',

	initComponent : function() {
		var me = this;

		me.items = [ {
			title : Locale.getMsg('view.project.projects'),
			icon : 'css/images/clapperboard_16x16.png',
			region : 'west',
			flex : .3,
			split : true,
			collapsible : true,
			animCollapse : true,
			// margins : '0 0 5 5',
			layout : 'border',
			items : [ {
				region : 'center',
				xtype : 'projectGrid'
			}, {
				region : 'south',
				xtype : 'projectUserGrid',
				flex : .9,
				collapsible : true,
				split : true
			} ]
		}, {
			xtype : 'transferPanel',
			region : 'center'
		// ,
		// margins : '0 5 5 0'
		}

		];

		me.callParent(arguments);

//		me.on({
//			activate : function() {
//				// console.log('activate proj view');
//
//			}
//		});
	}
// ,
// switchPage : function(pageName, button) {
// this.getLayout().setActiveItem(pageName);
// }

});
