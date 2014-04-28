Ext.define('Ecfa.store.usage.UframeByUmission', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Frame',
	// groupField: 'frameSeq',
	sorters : [ 'frameSeq' ],
	proxy : {
		type : 'rest',
		url : 'rest/usage/frames',
		params : {
			umissionOid : ''
		},
		reader : {
			type : 'restTaskGrid'
		}

	}
});
