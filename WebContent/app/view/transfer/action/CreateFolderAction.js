Ext.define('Ecfa.view.transfer.action.CreateFolderAction', {
	extend : 'Ecfa.action.Action',
	requires : [ 'Ecfa.view.transfer.action.CreateFolderWin' ],
	text : Locale.getMsg('view.transfer.folder.create'),
	icon : 'css/images/add_16x16.png',
	parentFolder : null,
	handler : function() {
		var me = this;
		Ext.widget('createFolderWin', {
			parentFolder : me.parentFolder
		}).show();
	},
	// for button in menu
	getDisabledTooltip : function(folder) {
		return Ecfa.Validator.resourceFolder(folder) == true ? null : Locale.getMsg('view.transfer.folder.create.disabled');
	},
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = me.getDisabledTooltip(config.parentFolder);
		me.callParent([ config ]);
	},
	// for button in grid
	switchStatus : function(folder) {
		var me = this;

		// TODO mv to Ecfa action
		var disabledTooltip = me.getDisabledTooltip(folder);
		me.setDisabled(disabledTooltip);
		me.setTooltip(disabledTooltip);
		me.parentFolder = folder;

	}

});
