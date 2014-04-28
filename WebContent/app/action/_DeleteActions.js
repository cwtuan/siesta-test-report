Ext.define('Ecfa.action.DeleteActions', {
	extend : 'Ecfa.action.Action',
	icon : 'css/images/delete_16x16.png',	
	constructor : function(config) {
		var me = this;
		config.defaultTooltip = Locale.getMsg('view.common.delete');
		me.callParent([ config ]);
	},
	handler : function() {
		var me = this;

		if (me.confirmMsg) {
			Ext.Msg.confirm(Locale.getMsg('view.common.warning'), me.confirmMsg, function(btn) {
				if (btn == 'yes') {
					me.record.destroy({
		
						success : me.success ? me.success : function(record, operation) {						
							me.eventType.fireEvent('destroyed', record);				 
						},
						failure : me.failure ? me.failure : function(record, operation) {
							// TODO default notification bar...
						}
					});
				}
			});
		} else {
			throw 'confirmMsg is undefined!!';
		}
	}

});
