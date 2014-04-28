Ext.define('Ecfa.model.queue._JobSubmit', {//nested for submit
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'id'
	}, {
		name : 'name'
	}, {
		name : 'userName'
	}, {
		name : 'timeCreation'
	}, {
		name : 'timeWait'
	}, {
		name : 'tasks',
		defultValue : []
	}

	]
});
