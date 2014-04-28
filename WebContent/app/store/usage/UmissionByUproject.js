Ext.define('Ecfa.store.usage.UmissionByUproject', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.usage.Umission',
	groupField: 'userName',
	sorters: ['userName','num'],	
	proxy : {
		type : 'rest',
		url : 'rest/usage/umissions',
		params : {			
			uprojectOid : ''
		},
		reader : {
			type : 'restTaskGrid'
		}

	}
});
