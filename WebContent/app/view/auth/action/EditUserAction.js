Ext.define('Ecfa.view.auth.action.EditUserAction', {
	extend : 'Ecfa.action.OpAction',
	// alias : 'widget.editUserAction',
	icon : 'css/images/edit_16x16.png',
	getDisabledTooltip : function() {
		var me = this;
		var authDisabledTooltip = me.callParent([]); //OpAction getDisabledTooltip
		if(authDisabledTooltip != null) { //權限判斷
			return authDisabledTooltip;
		}
		return null;
	},	
	constructor : function(config) {
		var me = this;
		config.eventType = Ecfa.event.User;
		config.disabledTooltip = me.getDisabledTooltip();
		// setDisableTooltip for not editing defaultAdmin
		if (config.record.data.id === Ecfa.Const.User.DefaultAdmin) {
			config.defaultTooltip = Locale.getMsg('view.auth.user.defaultOpAdmin.edit.msg');
		} else
			config.defaultTooltip = Locale.getMsg('view.common.edit');

		config.validate = function(recordCount) { // For outside usage
			var disabledTooltip = me.getDisabledTooltip(recordCount);
			this.setDisabled(disabledTooltip != null);
			this.setTooltip(disabledTooltip ? disabledTooltip : '');
		};
		me.callParent([ config ]);
	},

	handler : function(config) {
		var me = this;
		// console.log('click edit',config.panel.getId());
		
		if (config.panel.getId() === Ecfa.Const.User.Type.UP) { 
			Ext.widget('editUserWin', {
				user : config.record.data,
				type : config.panel.getId()
			}).show();
		} else { // getOpUser with notification details
			Ecfa.Restful.request({
				params : {
					id : config.record.data.id
				},
				method : 'GET',
				url : 'rest/op/auth/user',
				success : function(rec, op) {
					// console.log('sucess', rec, op);
					if (config.record.data.id != Ecfa.Const.User.DefaultAdmin) { // disable editting default admin
						Ext.widget('editUserWin', {
							user : rec.target,// config.record.data,
							type : config.panel.getId()
						}).show();
					}
				},
				failure : function(rec, op) {
					// console.log('fail', rec.error, op);// op.request.scope.reader.jsonData
				}
			});
		}
	}

});
