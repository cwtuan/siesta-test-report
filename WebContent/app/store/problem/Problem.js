Ext.define('Ecfa.store.problem.Problem', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.problem.Problem',
	sorters : [ {
		property : 'status',
		direction : 'DESC'
	}, {
		property : 'occurTime',
		direction : 'DESC'
	}]
});
