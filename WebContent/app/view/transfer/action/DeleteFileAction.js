/**
 * Delete files and folders
 */

Ext.define('Ecfa.view.transfer.action.DeleteFileAction', {
	extend : 'Ecfa.action.Action',
	text : Locale.getMsg('view.common.delete'),
	icon : 'css/images/delete_16x16.png',
	panel : null,
	handler : function() {
		var me = this;
		var records = me.panel.getSelectionModel().getSelection();

		Ext.Msg.confirm(Locale.getMsg('view.common.warning'), Locale.getMsg('view.transfer.delete.confirm', records.length), function(btn) {
			if (btn == 'yes') {
				Ecfa.Restful.request({
					records : records,
					method : 'POST',
					params : {
						action : 'delete'
					},
					success : function(jsonResp) {
						Ecfa.event.File.fireEvent('destroyed', jsonResp.target);
					},
					failure : function(jsonResp) {
						Ecfa.event.File.fireEvent('destroyed', jsonResp.target);
						Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.transfer.file.delete.error'), jsonResp));
					}
				});
			}
		});
	},
	switchStatus : function() {
		var me = this;

		if (this.disableIfNoSelection()) {
			return;
		}

		var records = me.panel.getSelectionModel().getSelection();
		var ln = records.length;
		var i = 0;
		var result;
		for (; i < ln; ++i) {
			if (( Ecfa.Validator.resourceFolder(records[i])) !== true) {
				me.setDisabled(true);
				me.setTooltip(Locale.getMsg('view.transfer.folder.path.invalid.shouldResourceFolder.forDelete'));
				return;
			}
		}

	}
});
