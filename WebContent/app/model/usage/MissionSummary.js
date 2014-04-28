Ext.define('Ecfa.model.usage.MissionSummary', {
	extend : 'Ext.data.Model',
	// idProperty : 'oid',
	fields : [ {
		name : 'total',
		type : 'int'
	}, {
		name : 'running',
		type : 'int'
	}, {
		name : 'done',
		type : 'int'
	}, {
		name : 'fail',
		type : 'int'
	}, {
		name : 'cancel',
		type : 'int'
	}, {
		name : 'others',
		type : 'int'
	} ],
	// properties Grid should define proxy in model
	proxy : {
		type : 'nestedRest',
		url : 'rest/usage/projects/{0}/missionSummary',
		reader : {
			type : 'restTaskGrid'
		}
	}
});
