Ext.define('Ecfa.store.transfer.File', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.transfer.File',
//	buffered : true,
//	pageSize : 20,
	// TODO test perf if no sorters
	sorters : [ {
		property : 'type',
		direction : 'DESC'
	}, {
		property : 'name',
		direction : 'ASC'
	} ]
});
