Ext.define('Ecfa.store.license.LicenseByType', {
    extend : 'Ext.data.Store',    
    model : 'Ecfa.model.license.License',
	sorters : [ {
		property : 'name',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/op/license/licenses',
		params : {
			type : ''
		},
		reader : {
			type : 'json'
		}

	}/*,
	autoLoad: true*/
});
