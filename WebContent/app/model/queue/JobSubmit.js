Ext.define('Ecfa.model.queue.JobSubmit', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'num',
		type : 'int'
	}, {
		name : 'oid',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'userName',
		type : 'string'
	}, {
		name : 'timeWait',
		defaultValue : 0
	}, {
		name : 'priority'
	}, {
		name : 'dependency', // Job Global Depend Mask
		type : 'string'
	}, {
		name : 'dependencyName',
		type : 'string'
	}, {
		name : 'characteristics',
		defaultValue : []
	} ]
});
