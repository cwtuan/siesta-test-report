Ext.define('Ecfa.store.queue.Submission', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Submission'
//	sorters : [ {
//		property : 'name',
//		direction : 'ASC'
//	} ],
	/*proxy : {
		type : 'rest',
		url : 'rest/queue/jobSubmit',
		reader : {
			type : 'json',
			root : 'job'
		}

	}*/
});
