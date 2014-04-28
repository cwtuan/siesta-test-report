Ext.define('Ecfa.model.audit.Audit', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'category',
		type : 'string'
	}, {
		name : 'subject',
		type : 'string'
	}, {
		name : 'description',
		type : 'string'
	}, {
		name : 'loginUserId',
		type : 'string'
	}, {
		name : 'ip',
		type : 'string'
	}, {
		name : 'createTime',
		type : 'int'
	}, {
		name : 'op',
		type : 'boolean'
	} ]
});
