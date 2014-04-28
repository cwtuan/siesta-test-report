Ext.define('Ecfa.store.resource.PoolInfo', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.resource.Pool',
	sorters : [ {
		property : 'startTime',
		direction : 'DESC'
	} ],
    proxy : {
		type : 'rest',
		url : 'rest/resource/pools',
		params : {
			userId : ''
		},
		reader : {
			type : 'restTaskGrid'
		}
	}
	

});
