Ext.define('Ecfa.model.license.LicensePool', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'poolName',
		type : 'string'
	},{
		name : 'poolSubscriber',
		type : 'string'
	},{
		name : 'poolState',
		type : 'string'
	},{
		name : 'amount',
		type : 'int'
	}]

});
