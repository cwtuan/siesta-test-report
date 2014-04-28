Ext.define('Ecfa.view.usage.PurchaseWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.purchaseWin',
	id : 'purchaseWin',	
	border : false,
	closable : true,	
	draggable : true,
	modal : true,
	layout : 'fit',
	flex : 1,	
	overflowY : 'auto',
	title : Locale.getMsg('view.billing.history'),
	width : 500,
	height : 400,
	icon : 'css/images/money/credit_16.png',
	initComponent : function() {
		var me = this;		
		
		
		//click mask for close window
		me.mon(Ext.getBody(), 'click', function(el, e) {
			me.close(me.closeAction);
		}, me, {
			delegate : '.x-mask'
		});
		
		 
		me.callParent(arguments);
				
		Ext.create('Ext.fx.Anim', {
		    target: me,
		    duration: 500,
		    from: {
		        width: 0, 
		        height: 0,
		        opacity: 0,
		        left : me.x
		    },
		    to: {
		        width: me.width,
		        height: me.height,
		        opacity: 1,
		        left : me.x - me.width
		         
		    }
		});
		
		me.on({
			afterrender : function(me){
				
//				me.getEl().on('mouseout', function(){
//					if(me){
//						me.close();
//					}
//				});
				

			}
		});
	}
	
	
	
	
});
