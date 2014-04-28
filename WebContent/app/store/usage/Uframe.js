Ext.define('Ecfa.store.usage.Uframe', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.usage.Uframe',
	sorters : [ {
		property : 'retryCount',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'nestedRest',
		url : 'rest/usage/uframes/{0}/{1}',		
		reader : {
			type : 'restTaskGrid'
		}

	}
});
