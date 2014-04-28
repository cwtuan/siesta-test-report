Ext.define('Ecfa.model.queue.Submission', { // nested for submit
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'num',
		type : 'int'
	},{
		name : 'oid',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'userName',
		type : 'string'
	}, {
		name : 'timeCreation', defaultValue : 0
	}, {
		name : 'timeWait', defaultValue : 0
	}, {
		name : 'priority'
	},{
		name : 'dependency', //Job Global Depend Mask		
		type : 'string'
	},{
		name : 'dependencyName',		
		type : 'string'
	}
	/*,{
		name : 'missions'
	} */],

	associations : [ {
		type : 'hasMany',
		model : 'Ecfa.model.queue.Mission',
		name : 'missions'
	} ],

	proxy : {
		type : 'rest',
		timeout: 120000,
		url : 'rest/queue/submission',
		writer : Ext.create('Ecfa.util.JsonWriter', {
			writeAllFields : true
		})
	}
});
