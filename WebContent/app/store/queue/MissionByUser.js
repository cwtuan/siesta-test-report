Ext.define('Ecfa.store.queue.MissionByUser', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Mission',
	sorters : [ {
		property : 'projectName',
		direction : 'ASC'
	},{
		property : 'num',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/queue/missions',
		params : {
			filter : '',
			userId : ''
		},
		reader : {
			type : 'restTaskGrid'
		}

	}
});
