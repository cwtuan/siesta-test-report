Ext.define('Ecfa.store.license.License', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.license.License',
	sorters : [ {
		property : 'name',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/op/license/license',
		reader : {
			type : 'json'
		}
		/*api: {
            create: 'rest/license/license',
            read: 'rest/license/licenses'
            update: 'rest/license/license'
        }*/

	}
	
});
