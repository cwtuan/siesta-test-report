Ext.define('Ecfa.view.problem.action.DeleteProblemAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/delete_16x16.png',
	//text : Locale.getMsg('view.common.delete'),
	getDisabledTooltip : function() {
		var me = this;
		var authDisabledTooltip = me.callParent([]);
		if (authDisabledTooltip != null) { // 權限判斷
			return authDisabledTooltip;
		}		
		return null;
	},
	constructor : function(config) {
		var me = this;
		config.eventType = Ecfa.event.Problem;
		config.disabledTooltip = me.getDisabledTooltip();
		config.defaultTooltip = Locale.getMsg('view.common.delete');
		
		me.callParent([ config ]);
	},

	handler : function(config) {
		var me = this;
		console.log('id',config.record.get('oid'));

		Ext.Msg.confirm(Locale.getMsg('view.common.warning'), Locale.getMsg('view.problem.delete.confirm'), function(btn) {
			if (btn == 'yes') {
				// Ecfa.event.User.fireEvent('running', true);
				Ecfa.util.Restful.DELETE('rest/op/problems', config.record.get('oid'), {
				     success : function(jsonResp) {
						Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.problem.delete.success'), 5000);
						Ecfa.event.Problem.fireEvent('destroyed', jsonResp);								
					 },
					 failure : function(jsonResp) {
						 // TODO show message for failure subtask
						 console.log('delete problem failed',jsonResp);
						 Ext.getCmp('notifybar').showError(
						 Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.problem.delete.fail'), jsonResp));
					 },
					 callback : function() {
						 Ecfa.event.Problem.fireEvent('running', false);
					 }
			    });
			}	
	   });
    }
});
