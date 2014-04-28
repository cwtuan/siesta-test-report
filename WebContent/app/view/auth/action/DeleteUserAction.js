Ext.define('Ecfa.view.auth.action.DeleteUserAction', {
	extend : 'Ecfa.action.OpAction',
	// alias : 'widget.deleteUserAction',
	icon : 'css/images/delete_16x16.png',
	text : Locale.getMsg('view.common.delete'),
	itemId : 'deleteButton',
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
		//console.log('disabledTooltip', config.panel.getSelectionModel().getCount());
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
		var self_delete = false;

		var ids = Ext.Array.map(config.panel.getSelectionModel().getSelection(), function(record) {
			//console.log('delete Ids=', record.get('id'), ' id=', Ecfa.Session.getUser().id);
			if (record.get('id') == Ecfa.Session.getUser().id) {
				self_delete = true;
			} else
				return record.get('id');
		});

		if (self_delete == true) {
			Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getAccountFailure(Locale.getMsg('view.auth.user.deleteSelf.msg')));
		} else {
			Ext.Msg.confirm(Locale.getMsg('view.common.warning'), Locale.getMsg('view.auth.user.delete.confirm'), function(btn) {
				if (btn == 'yes') {
					// Ecfa.event.User.fireEvent('running', true);

					/*
					 * var ids = Ext.Array.map(config.panel.getSelectionModel().getSelection(), function(record) { console.log('delete Ids=',record.get('id'));
					 * return record.get('id'); });
					 */

					if (config.panel.getId() === Ecfa.Const.User.Type.OP) {
						Ecfa.util.Restful.DELETE('rest/op/auth/user', ids, {
							success : function(jsonResp) {
								Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.auth.user.delete.success'), 5000);
								Ecfa.event.User.fireEvent('destroyed', jsonResp);								
							},
							failure : function(jsonResp) {
								// TODO show message for failure subtask
								console.log('delete OP user failed',jsonResp);
								Ext.getCmp('notifybar').showError(
										Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.auth.user.delete.failure'), jsonResp));
							},
							callback : function() {
								Ecfa.event.User.fireEvent('running', false);
							}
						});
					}
					if (config.panel.getId() === Ecfa.Const.User.Type.UP) {
						Ecfa.util.Restful.DELETE('rest/auth/user', ids, {
							success : function(jsonResp) {
								Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.auth.user.delete.success'), 5000);
								Ecfa.event.User.fireEvent('destroyed', jsonResp);
							},
							failure : function(jsonResp) {
								// TODO show message for failure subtask
								console.log('delete UP user failed',jsonResp);
								Ext.getCmp('notifybar').showError(
										Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.auth.user.delete.failure'),jsonResp));
							},
							callback : function() {
								Ecfa.event.User.fireEvent('running', false);
							}
						});
					}
				}
			});
		}
	}

});
