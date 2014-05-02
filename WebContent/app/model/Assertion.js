// TODO model reference 

Ext.define('MyApp.model.Assertion', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'type',
		type : 'string'
	}, {
		name : 'description',
		type : 'string'
	}, {
		name : 'passed', // optional. {true,false,null}
		type : 'string'
	}, {
		name : 'annotation', // optional
		type : 'string'
	}

	]
});
