Ext.define('Ecfa.store.queue.Mission', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Mission',
	sorters : [ {
		property : 'num',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/queue/missions',
		reader : {
			type : 'json',
			root : 'jobs'
		}

	}
});
