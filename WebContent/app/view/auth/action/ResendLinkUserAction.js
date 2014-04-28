// For resen UP user's activate Link
Ext.define('Ecfa.view.auth.action.ResendLinkUserAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/submit.png',
	text : Locale.getMsg('view.auth.user.resendLink'),
	getDisabledTooltip : function(recordCount) {
		var me = this;
		var authDisabledTooltip = me.callParent([]);
		if (authDisabledTooltip != null) { // 權限判斷
			return authDisabledTooltip;
		}
		if (recordCount == 0 || isNaN(recordCount)) { // Prevent recordCount = undefined
			return Locale.getMsg('view.auth.user.select');
		}
		return null;
	},
	constructor : function(config) {
		var me = this;
		config.eventType = Ecfa.event.User;
		// console.log('disabledTooltip', config.panel.getSelectionModel().getCount());
		config.disabledTooltip = me.getDisabledTooltip(config.panel.getSelectionModel().getCount());
		config.validate = function(recordCount) { // For outside usage
			var disabledTooltip = me.getDisabledTooltip(recordCount);
			this.setDisabled(disabledTooltip != null);
			this.setTooltip(disabledTooltip ? disabledTooltip : '');
		};
		me.callParent([ config ]);
	},

	handler : function(config) {
		var me = this;
		var flag = true;

		var ids = Ext.Array.map(config.panel.getSelectionModel().getSelection(), function(record) {
			if (record.get('status') != Ecfa.Const.User.Status.INACTIVE)
				flag = false;
			return record.get('id');
		});

		if (flag) {
			Ecfa.util.Restful.DELETE('op/resendActivateLink', ids, { // Only util.Restful.DELETE can append ids array
				success : function(jsonResp) {
					console.log('jsonResp', jsonResp);
					Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.auth.user.resendLink.success'), 5000);
					Ecfa.event.User.fireEvent('destroyed', jsonResp);
				},
				failure : function(jsonResp) {
					// TODO show message for failure subtask
					console.log('resendLink failed :', jsonResp);
					Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.auth.user.resendLink.failure'), jsonResp));
				},
				callback : function() {
					Ecfa.event.User.fireEvent('running', false);
				}
			});
		}else{
			Ext.getCmp('notifybar').showError(Locale.getMsg('view.auth.user.resendLink.prevent'));
		}
	}
});
