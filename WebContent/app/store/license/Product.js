Ext.define('Ecfa.store.license.Product', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.license.Product',
	sorters : [ {
		property : 'name',
		direction : 'ASC'
	} ],
	
	
	proxy : {
		type : 'rest',
		url : 'rest/license/products',
		reader : {
			type : 'json'
		}	

	}/*,
	
	autoLoad : true*/
	
});
