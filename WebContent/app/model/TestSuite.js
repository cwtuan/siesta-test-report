// TODO model reference

Ext.define('MyApp.model.audit.TestSuite', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'startDate',
		type : 'int'
	}, {
		name : 'endDate',
		type : 'int'
	}, {
		name : 'passed',
		type : 'boolean'
	}, {
		name : 'totalNum',
		type : 'int'
	}, {
		name : 'passedNum',
		type : 'int'
	} ]
});
