Ext.define('Ecfa.model.resource.PoolLicense', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'poolOid',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'basename',
		type : 'string'
	}, {
		name : 'number',
		type : 'int'
	} ],

	belongsTo : [ {
		name : 'pool',
		model : 'Ecfa.model.resource.Pool',
		associationKey : 'pool',
		getterName : 'getPool',
		setterName : 'setPool'
	} ],

	proxy : {
		type : 'rest',
		url : 'rest/op/resource/poolLicenses',
		reader : {
			// type : 'json'
			type : 'restTaskGrid'
		},
		writer : Ext.create('Ecfa.util.JsonWriter', {
			writeAllFields : true
		})
	}
});
