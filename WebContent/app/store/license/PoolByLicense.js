Ext.define('Ecfa.store.license.PoolByLicense', {
    extend : 'Ext.data.Store',    
    model : 'Ecfa.model.license.LicensePool',
	sorters : [ {
		property : 'name',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/op/license/poolByLicense',
		params : {
			oid : ''
		},
		reader : {
			type : 'json'
		}

	}
});
