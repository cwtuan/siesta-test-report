Ext.define('Ecfa.store.resource.Pool', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.resource.Pool',
	sorters : [ {
		property : 'name',
		direction : 'ASC'
	} ]
//   ,proxy : {
//		type : 'rest',
//		url : 'rest/resource/pools',
//		reader : {
//			type : 'json'
//		}
//	}
	//,autoLoad : true

});
