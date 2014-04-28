Ext.define('Ecfa.model.usage.UProject', {
	extend : 'Ext.data.Model',
	idProperty : 'oid', // used for building REST request
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'projectOid',
		type : 'string'
	}, {
		name : 'period',
		type : 'string',
		mapping : 'periodInfo.period'
	}, {
		name : 'interval',
		type : 'string',
		mapping : 'periodInfo.interval'
	}, {
		name : 'coreHours',
		type : 'float',
		mapping : 'coreHours'
	}, {
		name : 'cost',
		type : 'float',
		mapping : 'cost'
	} ],
	proxy : {
		type : 'nestedRest',
		url : 'rest/usage/projects/{0}/usage',
		reader : {
			type : 'restTaskGrid'
		}
	}
});
