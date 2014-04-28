Ext.define('Ecfa.view.resource.action.CreateBatchRenderAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/addnode_16x16.png',
	text : Locale.getMsg('view.resource.render.importBatch'),
	/*getDisabledTooltip : function() {
		// tony: getDisabledTooltip是否直接用OpAction，不用再複寫?
		var me = this;		
		var authDisabledTooltip = me.callParent([]); //OpAction getDisabledTooltip
		if(authDisabledTooltip != null) { //權限判斷
			return authDisabledTooltip;
		}
		return null;
	},	*/
		
	constructor : function(config) {
		var me = this;
		config.eventType = Ecfa.event.User;
		config.disabledTooltip = me.getDisabledTooltip();		
		me.callParent([ config ]);
	},
	
	handler : function(config) {
		var me = this;
		Ext.widget('batchRenderFileWin', {
		}).show();
	}

});
