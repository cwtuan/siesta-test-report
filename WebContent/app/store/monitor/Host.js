Ext.define('Ecfa.store.monitor.Host', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.monitor.Host',
	pageSize : 100,
	proxy : {
		type : 'ajax',
		url : 'rest/op/monitor/hosts',
		reader : 'restTaskPagingGrid'
	}
});
