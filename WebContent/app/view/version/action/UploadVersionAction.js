Ext.define('Ecfa.view.version.action.UploadVersionAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/addnode_16x16.png',
	text : Locale.getMsg('view.version.upload.title'),
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
		console.log('uploadVerison action');
		Ext.widget('uploadVersionWin', {
		}).show();
	}
});
