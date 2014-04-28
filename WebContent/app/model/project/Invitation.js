Ext.define('Ecfa.model.project.Invitation', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'createUserId',
		type : 'string'
	}, {
		name : 'email',
		type : 'string'
	}, {
		name : 'projectOid',
		type : 'string'
	}, {
		name : 'projectName',
		type : 'string'
	}, {
		name : 'projectRole',
		type : 'string'
	}, {
		name : 'expiredTime',
		type : 'int'
	}, {
		name : 'status',
		type : 'string'
	} ],
	proxy : {
		type : 'nestedRest',
		url : 'rest/projects/{0}/invitations',
		reader : {
			type : 'restTaskGrid'
		}
	}
});
