Ext.define('Ecfa.store.queue.Asset', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Asset',
	/*sorters : [ {
		property : 'frameSeq',
		direction : 'ASC'
	} ],*/
	proxy : {
		type : 'rest',
		url : 'rest/queue/tracking',
		timeout: Ecfa.Config.AJAX_TIMEOUT,
		param : {
			sceneFileName : '',
			productOid : '',			
			workspace : '',
			projectOid : ''
		},
		reader : {
			//type : 'json'
			type : 'restTaskGrid'
		}

	}
});
