// TODO model reference 

Ext.define('Ecfa.model.audit.TestSuite', {
	extend : 'Ext.data.Model',
	fields : [  {
		name : 'startDate',
		type : 'int'
	}, {
		name : 'endDate',
		type : 'int'
	},{
		name : 'passed',
		type : 'boolean'
	}]
});
