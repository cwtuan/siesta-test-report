Ext.define('Ecfa.store.version.Plugin', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.version.Version',
	sorters : [ {
		property : 'updateTime',
		direction : 'DESC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/version/plugins',
		reader : {
			type : 'restTaskGrid'
		}
	}
});
