Ext.define('Ecfa.store.audit.Audit', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.audit.Audit',
	pageSize : 200, // items per page
	proxy : {
		type : 'ajax',
		url : 'rest/op/audits',
		reader : 'restTaskPagingGrid'
	}
});
