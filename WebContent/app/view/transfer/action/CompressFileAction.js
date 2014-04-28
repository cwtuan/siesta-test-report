Ext.define('Ecfa.view.transfer.action.CompressFileAction', {
	extend : 'Ecfa.action.Action',
	requires : [ 'Ecfa.view.transfer.action.CompressFileWin' ],
	icon : 'css/images/compress_16.png',
	text : Locale.getMsg('view.transfer.compress'),
	panel : null,
	// files : null,
	handler : function() {
		var me = this;
		Ext.widget('compressFileWin', {
			files : me.panel.getSelectionModel().getSelection(),
			panel : me.panel
		}).show();
	},
	constructor : function(config) {
		config = config || {};
		var me = this;
		// config.disabledTooltip = null;
		me.callParent([ config ]);
	},
	switchStatus : function() {
		var me = this;
		if (me.disableIfNoSelection()) {
			return;
		}

		// don't archive 'zip' folder
		var files = me.panel.getSelectionModel().getSelection();
		for ( var i in files) {
			if (files[i].get('type') === Ecfa.Const.File.Type.IS_FOLDER && files[i].get('name') === Ecfa.Const.Folder.Name.ZIP) {
				me.disable();
				me.setTooltip(Locale.getMsg('view.transfer.compress.tooltip.disabled.zipFolder'));
				return;
			}
		}

	}
});
