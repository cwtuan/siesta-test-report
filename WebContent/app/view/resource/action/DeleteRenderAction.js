Ext.define('Ecfa.view.resource.action.DeleteRenderAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/delete_16x16.png',
	text : Locale.getMsg('view.common.delete'),
	getDisabledTooltip : function(recordCount) {
		var me = this;
		var authDisabledTooltip = me.callParent([]);
		if (authDisabledTooltip != null) { // 權限判斷
			return authDisabledTooltip;
		}
		if (recordCount == 0 || isNaN(recordCount)) {
			return Locale.getMsg('view.auth.user.delete.select');
		}
		return null;
	},
	constructor : function(config) {
		var me = this;
		config.eventType = Ecfa.event.User;
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

		var temp = config.panel.getSelectionModel().getSelection();
		// console.log('temp',temp,temp[0]);

		var warnMsg = '';
		for ( var i = 0; i < config.panel.getSelectionModel().getCount(); i++) {
			// console.log('poolName=',temp[i].get('poolName'),' , poolOid=',temp[i].get('poolOid'),', warnMsg',warnMsg);
			if (temp[i].get('poolName') != '' && temp[i].get('poolOid') != '') {
				warnMsg += Locale.getMsg('view.resource.render.delete.poolReminder', temp[i].get('poolName'), temp[i].get('hostName'));
				// '<br>The render['+temp[i].get('hostName')+'] that you want to delete is associated wiht pool['+temp[i].get('poolName')+']';
			}
		}
		warnMsg += Locale.getMsg('view.resource.render.delete.msg');

		Ext.Msg.confirm(Locale.getMsg('view.common.warning'), warnMsg, function(btn) {
			if (btn === 'yes') {
				Ext.widget('deleteRenderWin', {
					selection : config.panel.getSelectionModel().getSelection()
				}).show();
			}
		});

		/*
		 * Ext.Msg.confirm(Locale.getMsg('view.common.warning'), warnMsg, function(btn) { if (btn == 'yes') { var ids =
		 * Ext.Array.map(config.panel.getSelectionModel().getSelection(), function(record) { console.log('delete render Ids=',record.get('oid')); return
		 * record.get('oid'); }); //ids.push('sshAccount'); //ids.push('sshPassword'); Ext.Array.insert(ids,0,'sshAccount');
		 * Ext.Array.insert(ids,1,'sshPassword'); console.log('ids[]',ids);
		 * 
		 * Ecfa.util.Restful.DELETE('rest/resource/renders', ids, { success : function(jsonResp) { Ext.getCmp('notifybar').showSuccess('delete renders success',
		 * 5000); // TODO :i18n Ecfa.event.Render.fireEvent('destroyed', jsonResp); }, failure : function() { Ext.getCmp('notifybar').showError('delete renders
		 * fail', 5000); //TODO : i18n } } } });
		 */
	}
});
