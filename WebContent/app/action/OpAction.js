Ext.define('MyApp.action.OpAction', {
	extend : 'MyApp.action.Action',
	role : null,
	getDisabledTooltip : function() {
		//console.log('opppp disable');
		if (MyApp.Session.getUser().role === MyApp.Const.User.Role.VIEWER)
 		    return Locale.getMsg('view.auth.user.permissionDeny');
		return null;
	},
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = me.getDisabledTooltip();
		me.callParent([ config ]);
	}

});
