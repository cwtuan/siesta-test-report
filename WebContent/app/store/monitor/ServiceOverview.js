Ext.define('Ecfa.store.monitor.ServiceOverview', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.monitor.ServiceOverview',
	pageSize : 100,
	proxy : {
		type : 'ajax',
		url : 'rest/op/monitor/servicesOverview',
		reader : 'restTaskPagingGrid'
	}
});
