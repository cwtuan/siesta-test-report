Ext.define('Ecfa.store.problem.Discuss', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.problem.Discuss',
	sorters : [
	{
		property : 'createTime',
		direction : 'DESC'//'ASC'
	} ]
});
