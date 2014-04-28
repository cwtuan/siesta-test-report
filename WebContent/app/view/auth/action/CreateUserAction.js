Ext.define('Ecfa.view.auth.action.CreateUserAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/add_16x16.png',
	text :  Locale.getMsg('view.common.add'),
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
		me.callParent([ config ]);
	},	
	handler : function(config) {
		var me = this;
		
		Ext.widget('createUserWin',{
			type : config.panel.getId()
		}).show();
	}

});
