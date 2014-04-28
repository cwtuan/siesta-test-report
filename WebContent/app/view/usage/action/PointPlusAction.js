Ext.define('Ecfa.view.usage.action.PointPlusAction', {
	extend : 'Ecfa.action.Action',
	alias : 'widget.pointPlusAction',
	icon : 'css/images/money/pointplus_16.png',
	tooltip : Locale.getMsg('view.billing.pointplus'),	
	
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = null;
		
		
		me.callParent([ config ]);
	},
	initComponent : function(){
		var me = this;
		
		me.callParent(arguments);
	},

	handler : function(){
		var me = this;
		console.log('plus');		
		
			
		Ecfa.Restful.request( {
			url : 'rest/billing/link', 
            method : 'GET',
			success : function(jsonResp) {
				console.log(jsonResp.target) ;
				window.open(jsonResp.target);
				
			},
			callback : function(){
								
			},
			failure : function(jsonResp) {				
				
						
			}
		});
	}
	
	

});
