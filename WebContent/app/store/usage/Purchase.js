Ext.define('Ecfa.store.usage.Purchase', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.usage.Purchase',
	sorters : [ {
		property : 'purchaseDate',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'ajax',
		url : 'rest/billing/purchase',
		method : 'GET',
		params: {
			userId : ''
		},  		
		reader : {
			type : 'restTaskGrid'
		}

	}
});
