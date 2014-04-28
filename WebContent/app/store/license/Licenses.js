Ext.define('Ecfa.store.license.Licenses', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.license.License',
	sorters : [ {
		property : 'name',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/op/license/licenses',
		reader : {
			type : 'json',
			root : ''
		}

	}//,
	//autoLoad : true
	
});
