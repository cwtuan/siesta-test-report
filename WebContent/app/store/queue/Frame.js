Ext.define('Ecfa.store.queue.Frame', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Frame',
	sorters : [ {
		property : 'frameSeq',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/queue/frames',
		param : {
			missionOid : ''
		},
		reader : {
			type : 'restTaskGrid'
		}

	}
});
