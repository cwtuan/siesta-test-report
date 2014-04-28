Ext.define('Ecfa.view.transfer.FolderMenu', {
	extend : 'Ext.menu.Menu',
	alias : 'widget.folderMenu',
	requires : [ 'Ecfa.view.transfer.action.CreateFolderAction' ],
	parentFolder : null,
	initComponent : function(config) {
		var me = this;

		me.items = [];
		
//		console.log(' me.parentFolder',  me.parentFolder);

		me.items.push(Ext.create('Ecfa.view.transfer.action.CreateFolderAction', {
			parentFolder : me.parentFolder
		}));

	
		me.callParent();

	}
});
