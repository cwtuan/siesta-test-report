Ext.define('Ecfa.view.usage.PurchaseGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.purchaseGrid',
	store : 'usage.Purchase',
	border : true,	
	layout : 'fit',	
	//title : Locale.getMsg('view.usage.uframe.simpletitle'),	
	
	initComponent : function() {
		var me = this;
		
		me.columns = [ {
			header : Locale.getMsg('view.billing.orderid'),
			dataIndex : 'orderId',
			flex : 1
		}, {
			header : Locale.getMsg('view.billing.date.purchase'),
			dataIndex : 'purchaseDate',
			flex : 1.8,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
				if (value != 0) {
					return Ext.util.Format.date(new Date(value), Ecfa.Config.DATETIME_FORMAT);
				}
				return '';
			}
		},{
			header : Locale.getMsg('view.billing.appTag'),
			dataIndex : 'appTag',//產品包
			flex : 1
		},{
			header : Locale.getMsg('view.billing.quantity'),
			dataIndex : 'amount',//數量
			flex : 0.5,
			align : 'right'	
		}, {
			header : Locale.getMsg('view.billing.credit'),
			dataIndex : 'credit',//總點數
			flex : 1.5,
			align : 'right'	
		}];
//		},{
//			header : Locale.getMsg('view.billing.totalcost'),
//			dataIndex : 'totalCost',//總價
//			flex : 0.5,
//			align : 'right'			
//		}];	

		me.callParent(arguments);
		
		me.load();
		
		me.on({
			
		});

	},
	
	load : function(){
		this.getStore().load({
			params:{
				userId : Ecfa.Session.getUser().id
			}			
		});
	}
});
