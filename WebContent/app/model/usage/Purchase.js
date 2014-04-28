Ext.define('Ecfa.model.usage.Purchase', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	},{
		name : 'orderId',
		type : 'string'
	} , {
		name : 'purchaseDate'		
	},{
		name : 'appTag',
		type : 'string'
	},{
		name : 'amount',
		type : 'int'
	}, {
		name : 'credit',
		type : 'float'
	}, {
		name : 'totalCost',
		type : 'int'
	}]



});
