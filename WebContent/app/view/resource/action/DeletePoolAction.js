Ext.define('Ecfa.view.resource.action.DeletePoolAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/delete_16x16.png',
	text :  Locale.getMsg('view.resource.pool.offlease'),
	getDisabledTooltip : function(recordCount) {
		var me = this;
		var authDisabledTooltip = me.callParent([]);
		if(authDisabledTooltip != null){ //權限判斷
		   return authDisabledTooltip;
		}
		if (recordCount == 0 || isNaN(recordCount)){
 		    return Locale.getMsg('view.resource.pool.select'); 
		}
		return null;
	},	
	constructor : function(config) {
		var me = this;
		config.eventType = Ecfa.event.User;
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
		//console.log('config',config.panel.up('poolView').down('#editPoolPanel'));
		//config.panel.setLoading(true);
		//Ecfa.event.Pool.fireEvent('running', true);
		
		Ext.Msg.confirm(Locale.getMsg('view.common.warning'), Locale.getMsg('view.resource.pool.offlease.confirm'), function(btn) {
			if (btn == 'yes') {
				Ecfa.event.Pool.fireEvent('running',true);
				// Disable bottom poolLicense and poolRender Grid in case of operations at the same time
				config.panel.up('poolView').disableButtomPanel();
				
				var ids = Ext.Array.map(config.panel.getSelectionModel().getSelection(), function(record) {
					//console.log('delete Ids=',record.get('oid'));
					return record.get('oid');
				});
				
				Ecfa.util.Restful.DELETE('rest/op/resource/pools', ids, {
					success : function(jsonResp) {
						Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.pool.offlease.success'), 5000); 
						Ecfa.event.Pool.fireEvent('destroyed', jsonResp);
					},
					failure : function(jsonResp) {
						Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.pool.offlease.fail'), jsonResp)); 
					},
					callback : function(){
						//config.panel.setLoading(false);
						Ecfa.event.Pool.fireEvent('running', false);
						config.panel.up('poolView').enableButtomPanel();
					}
				});		
			}
		});
		config.panel.setLoading(false);
	}

});
