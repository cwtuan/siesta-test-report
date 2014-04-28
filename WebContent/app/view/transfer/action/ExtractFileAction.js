Ext.define('Ecfa.view.transfer.action.ExtractFileAction', {
	extend : 'Ecfa.action.Action',
	requires : [ 'Ecfa.view.transfer.ExtractFileWin' ],
	icon : 'css/images/compress_16.png',
	text : Locale.getMsg('view.transfer.extract'),
	panel : null,
	handler : function() {
		var me = this;
		Ext.widget('extractFileWin', {
			files : me.panel.getSelectionModel().getSelection()
//			,
//			panel : me.panel
		}).show();

	},
	// constructor : function(config) {
	// config = config || {};
	// var me = this;
	// me.callParent([ config ]);
	// },
	switchStatus : function() {
		var me = this;
		if (me.disableIfNoSelection()) {
			return;
		}

		// Extra only for extension with .rar or .zip
		var files = me.panel.getSelectionModel().getSelection();
		for ( var i in files) {
			var name = files[i].get('name');
			if (files[i].get('type') !== Ecfa.Const.File.Type.IS_FILE || !(/* name.endsWith('.rar') || */name.endsWith('.zip'))) {
				me.disable();
				me.setTooltip(Locale.getMsg('view.transfer.extract.tooltip.disabled.extension', '.zip'));
				return;
			}
		}

	}
});
