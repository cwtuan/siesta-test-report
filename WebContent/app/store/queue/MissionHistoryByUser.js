Ext.define('Ecfa.store.queue.MissionHistoryByUser', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Mission',
	sorters : [ {
		property : 'num',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/queue/missions?filter=historical',
		params : {			
			userId : '',
			start : '',
			end : ''
		},
		reader : {
			type : 'restTaskGrid'
		}

	}
});
