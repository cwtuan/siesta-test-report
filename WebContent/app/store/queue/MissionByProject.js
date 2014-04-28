Ext.define('Ecfa.store.queue.MissionByProject', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Mission',
	sorters : [ {
		property : 'num',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'nestedRest',
		url : 'rest/queue/{0}/missions?filter=running',		
		reader : {
			type : 'restTaskGrid'
		}

	}
});
