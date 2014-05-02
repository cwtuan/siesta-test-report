// TODO model reference 

Ext.define('MyApp.model.TestCase', {
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
		name : 'url',
		type : 'string'
	}, 'assertions'

	]
});
