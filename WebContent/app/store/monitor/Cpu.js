Ext.define('Ecfa.store.monitor.Cpu', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.monitor.HostUsage',
	/*data : [ {
		amount : 10
	}, {
		amount : 40
	}, {
		amount : 10
	}, {
		amount : 40
	}, {
		amount : 10
	}, {
		amount : 40
	}, {
		amount : 10
	}, {
		amount : 50
	}],*/
	proxy : {
		type : 'rest',
		url : 'rest/monitor/cpu',
		reader : {
			//type : 'json'
			type : 'restTaskGrid'
		}
	}
});
