Ext.define('Ecfa.view.license.action.DeleteProductAction', {
	extend : 'Ecfa.action.OpAction',	
	icon : 'css/images/delete_16x16.png',
	text :  Locale.getMsg('view.common.delete'),	
	getDisabledTooltip : function(recordCount) {
		var me = this;
		var authDisabledTooltip = me.callParent([]);
		if(authDisabledTooltip != null){ //權限判斷		    
			return authDisabledTooltip;
		}
		
		if (recordCount== null || recordCount != 1){
 		    return Locale.getMsg('view.delete.select'); 
		}
		return null;
	},	
	constructor : function(config) {
		var me = this;
		config.eventType = Ecfa.event.License;
		config.disabledTooltip = me.getDisabledTooltip(config.panel.getSelectionModel().getCount());
		config.validate = function(recordCount) {  // For outside usage			
			var disabledTooltip = me.getDisabledTooltip(recordCount);
			this.setDisabled(disabledTooltip != null);
			this.setTooltip(disabledTooltip? disabledTooltip:'');
		};
		me.callParent([ config ]);
	},
	
	handler : function(config) {
		var me = this;
		console.log('type',config.panel.getId());
		Ext.Msg.confirm(Locale.getMsg('view.common.warning'), Locale.getMsg('view.auth.user.delete.confirm'), function(btn) {
			if (btn == 'yes') {
				

				var ids = Ext.Array.map(config.panel.getSelectionModel().getSelection(), function(record) {
					console.log('delete Ids=',record.get('id'));
					return record.get('id');
				});

				if(config.panel.getId() === Ecfa.Const.User.Type.OP)
				{
				   Ecfa.util.Restful.DELETE('rest/op/auth/user', ids, {
					   success : function(jsonResp) {
						Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.auth.user.delete.success'), 5000);
						Ecfa.event.User.fireEvent('destroyed', jsonResp);
						// TODO show message for failure subtask
					},
					failure : function() {
						Ext.getCmp('notifybar').showError(Locale.getMsg('view.auth.user.delete.fail'), 5000);
					},
					callback : function() {
						Ecfa.event.User.fireEvent('running', false);
					}
				});
				}
				if(config.panel.getId() === Ecfa.Const.User.Type.UP)
				{
					Ecfa.util.Restful.DELETE('rest/auth/user', ids, {
						success : function(jsonResp) {
							Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.auth.user.delete.success'), 5000);
							Ecfa.event.User.fireEvent('destroyed', jsonResp);
							// TODO show message for failure subtask
						},
						failure : function() {
							Ext.getCmp('notifybar').showError(Locale.getMsg('view.auth.user.delete.fail'), 5000);
						},
						callback : function() {
							Ecfa.event.License.fireEvent('running', false);
						}	
					});
				}
			}
		});
	}

});
