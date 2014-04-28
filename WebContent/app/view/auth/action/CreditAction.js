Ext.define('Ecfa.view.auth.action.CreditAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/money/credit_16.png',
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
		config.defaultTooltip = Locale.getMsg('view.auth.query.creditHistory');
		me.callParent([ config ]);
	},
	handler : function(config) {
		var me = this;
    	if (Ext.getCmp('#purchaseWin')) {
			Ext.getCmp('#purchaseWin').close();
		}
    	
    	var purchaseStore = null;
    	Ecfa.Restful.request({
			url : 'rest/op/billing/credit',
			method : 'GET',
			params : {
				userId : config.record.data.id
			},
			success : function(jsonResp) {
				//console.log('success',jsonResp,jsonResp.target.purchaseHistory);
				purchaseStore = Ext.create('Ecfa.store.usage.Purchase');
				purchaseStore.loadData(jsonResp.target.purchaseHistory);
				
				var grid = Ext.create('Ecfa.view.auth.QueryCreditGrid',{
					store : purchaseStore
				});		
				
				Ext.create('Ecfa.view.usage.PurchaseWin', {
					title : Locale.getMsg('view.billing.creditHistory',config.record.data.id),
					x : Ext.getCmp(Ecfa.Const.User.Type.UP).getWidth()/2 + 250,
					y : Ext.getCmp(Ecfa.Const.User.Type.UP).getHeight()/2 - 200,
					items : [  {
						xtype : 'label',
						html : '<div style="font-weight:bold;"><img src="css/images/money/money_32.png" width="16" height="16"> ' + Locale.getMsg('view.billing.balance') + ': ' +jsonResp.target.balance + '</div>',
						margin: '0 0 0 1'
					},grid ]
				}).show();
			},
			failure : function(jsonResp) {
				 Ext.getCmp('notifybar').showError(
				 Ecfa.locale.Converter.getErrorMsg(
				 Locale.getMsg('view.billing.error.balance'), jsonResp));
			}
		});
      
    	/*var grid = Ext.create('Ecfa.view.auth.QueryCreditGrid',{
			userId : config.record.data.id
		});		
		me.createCreditWin(grid);*/
	}
});
