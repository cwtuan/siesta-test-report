Ext.define('Ecfa.store.queue.MissionHistoryByProject', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Mission',
	sorters : [ {
		property : 'num',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'nestedRest',		
		url : 'rest/queue/{0}/missions?filter=historical',
		params : {
			start : '',
			end : ''
		},
		reader : {
			type : 'restTaskGrid'			
		}

	}
});
