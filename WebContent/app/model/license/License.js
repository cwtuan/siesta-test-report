Ext.define('Ecfa.model.license.License', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	},{
		name : 'name',
		type : 'string'
	},{
		name : 'type',
		type : 'string',
		defaultValue : 'SOFTWARE'
	}, {
		name : 'totalLicense',
		type : 'int'
	}, {
		name : 'openSource',
		type : 'boolean'
	},{
		name : 'basicService',
		type : 'string'
	}, {
		name : 'poolLicenseNums',
		defaultValue : []
	},{
		name : 'dedicatedNums',
		type : 'int'
	},{
		name : 'nonDedicatedNums',
		type : 'int'			
	},{
		name : 'extension',
		type : 'string'
	},{
		name : 'version',
		type : 'string'
	},{
		name : 'limitedType',
		type : 'string'
	}],
	
	proxy : {
		type : 'rest',
		url : 'rest/op/license/license',
		reader : {
			type : 'json',
			root : 'tasks'
		}
	}	
});
