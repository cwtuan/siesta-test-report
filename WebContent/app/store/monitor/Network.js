Ext.define('Ecfa.store.monitor.Network', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.monitor.HostUsage',
	/*data : [ {
		amount : 0.38
	}, {
		amount : 0.53
	}, {
		amount : 0.12
	}, {
		amount : 0.23
	}, {
		amount : 0.71
	}, {
		amount : 0.72
	}, {
		amount : 0.83
	}, {
		amount : 0.11
	},{
		amount : 0.05
	} ],*/
	proxy : {
		type : 'rest',
		url : 'rest/monitor/network',
		reader : {
			//type : 'json'
			type : 'restTaskGrid'
		}
	}
});
