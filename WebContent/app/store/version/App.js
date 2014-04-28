Ext.define('Ecfa.store.version.App', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.version.Version',
	sorters : [ {
		property : 'updateTime',
		direction : 'DESC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/version/apps',
		reader : {
			type : 'restTaskGrid'
		}
	}
});
