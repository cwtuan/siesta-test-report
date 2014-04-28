Ext.define('Ecfa.store.usage.Period', {
	extend : 'Ext.data.Store',
	autoLoad : true,
	// model : 'Ecfa.model.usage.Period',
	fields : [ 'period', 'interval' ],
	proxy : {
		type : 'rest',// 'nestedRest',
		url : 'rest/usage/periods',
		extraParams : {
			monthNum : Ecfa.Config.USAGE_PERIOD_MONTH_NUM
		},
		reader : {
			type : 'json'
		}
	}
});
