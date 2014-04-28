Ext.define('Ecfa.store.auth.Account', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.auth.Account',
	sorters : [ {
		property : 'id',
		direction : 'ASC'
	}
//	, {
//		property : 'name',
//		direction : 'ASC'
//	}
	]
});
