Ext.define('Ecfa.view.transfer.TransferPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.transferPanel',
	title : Locale.getMsg('view.transfer.remoteAssets'),
	requires : [ 'Ecfa.view.transfer.FolderTreePanel', 'Ecfa.view.transfer.FileGrid', 'Ecfa.ux.panel.upload.FileUploadPanel' ],
	layout : 'border',
	icon : 'css/images/file_16x16.png',
	initComponent : function() {
		var me = this;

		me.items = [ {
			xtype : 'folderTreePanel',
			containerId : 'transferPanel',// for folder selected event
			region : 'west',
			margins : '5 0 0 0',
			flex : 1,
			split : true,
			collapsible : true,
			animCollapse : true,
			layout : 'fit'
		}, {
			region : 'center',
			xtype : 'fileGrid',
			containerId : 'transferPanel',// for folder selected event
			layout : 'fit',
			flex : 3,
			margins : '5 5 0 0'
		}, Ext.create('Ecfa.ux.panel.upload.FileUploadPanel', {
			containerId : 'transferPanel', // for folder selected event
			icon : 'css/images/arrow_up_16x16.png',
			region : 'south',
			layout : 'fit',
			flex : 2,
			margins : '5 5 0 0',
			collapsible : true,
			animCollapse : true
		}), {
			hidden : true,
			region : 'north',
			xtype : 'component',
			html : '<input type="file" multiple id="upload-field-at-panel"/>'
		} ];

		me.callParent(arguments);
	},
	switchPage : function(pageName, button) {
		this.getLayout().setActiveItem(pageName);
	}
});
