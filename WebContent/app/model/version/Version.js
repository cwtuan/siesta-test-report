Ext.define('Ecfa.model.version.Version', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'version',
		type : 'string'
	}, {
		name : 'path',
		type : 'string'
	}, {
		name : 'versionType',
		type : 'string'
	}, {
		name : 'opUserId',
		type : 'string'
	}, {
		name : 'osType',
		type : 'string'
	},{
		name : 'updateTime',
		type : 'long'
	},{
		name : 'softVersion',
		type : 'string'
	},{
		name : 'softName',
		type : 'string'
	}]
});
