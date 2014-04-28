Ext.define('Ecfa.model.auth.User', {
	extend : 'Ext.data.Model',
	// idProperty : 'id',
	fields : [ {
		name : 'id',
		type : 'string'
	}, {
		name : 'email',
		type : 'string'
	}, {
		name : 'password',
		type : 'string'
	}, {
		name : 'phoneNumber',
		type : 'string'
	}, {
		name : 'status',
		type : 'string'
	}, {
		name : 'projectRole',
		type : 'string'
	}, {
		name : 'role',
		type : 'string'
	}, {
		name : 'balance',
		type : 'int'
	}, {
		name : 'notification',
		defaultValue : null
	},{
		name : 'notificationTime',
		defaultValue : null
	},{
		name : 'ipAddress',
		type : 'string'
	} ],
	proxy : {
		type : 'nestedRest',
		url : 'rest/projects/{0}/users',
		reader : {
			type : 'restTaskGrid'
		}
	}
});
