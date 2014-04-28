Ext.define('Ecfa.store.license.BasicService', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.license.BasicService',	
	proxy : {
		type : 'rest',
		url : 'rest/op/license/basicService',
		reader : {
			type : 'json'
		}	
	}
	
});
