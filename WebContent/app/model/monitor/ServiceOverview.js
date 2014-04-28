Ext.define('Ecfa.model.monitor.ServiceOverview', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'hostStatus',
		type : 'string'
	}, {
		name : 'ok'
	}, {
		name : 'warning'
	}, {
		name : 'critical'
	}, {
		name : 'unknown'
	} ]
});
