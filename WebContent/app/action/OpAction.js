Ext.define('Ecfa.action.OpAction', {
	extend : 'Ecfa.action.Action',
	role : null,
	getDisabledTooltip : function() {
		//console.log('opppp disable');
		if (Ecfa.Session.getUser().role === Ecfa.Const.User.Role.VIEWER)
 		    return Locale.getMsg('view.auth.user.permissionDeny');
		return null;
	},
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = me.getDisabledTooltip();
		me.callParent([ config ]);
	}

});
