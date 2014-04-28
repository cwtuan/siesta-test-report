// TODO D&D

Ext.define('Ecfa.view.transfer.action.MoveFileAction', {
	extend : 'Ecfa.action.Action',
	text : Locale.getMsg('view.transfer.move.files'),
	icon : 'css/images/move_file_16.png',
	requires : [ 'Ecfa.view.transfer.action.MoveFileWin' ],
	panel : null,
	handler : function() {
		var me = this;
		var records = me.panel.getSelectionModel().getSelection();
		Ext.widget('moveFileWin', {
			files : me.panel.getSelectionModel().getSelection(),
			folder : me.panel.folder.getId() // the current folder path
		}).show();

	},
	switchStatus : function() {
		var me = this;

		if (this.disableIfNoSelection()) {
			return;
		}

		var records = me.panel.getSelectionModel().getSelection();
		var ln = records.length;
		var i = 0;
		for (; i < ln; ++i) {
			if ((Ecfa.Validator.resourceFolder(records[i])) !== true) {
				me.setDisabled(true);
				me.setTooltip(Locale.getMsg('view.transfer.folder.path.invalid.shouldResourceFolder.forMove'));
				return;
			}
		}

	}
});
