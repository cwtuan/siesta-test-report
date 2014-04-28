Ext.define('Ecfa.model.monitor.Notification', {
	extend : 'Ext.data.Model',
	//idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'type',
		type : 'string'
	}, {
		name : 'time',
		type : 'long',
		convert : function(value) {
			if (value == 0 || value == null) {
				return '';
			}
			return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
		}
	}, {
		name : 'contact',
		type : 'string'
	}, {
		name : 'method',
		type : 'string'
	}, {
		name : 'info',
		type : 'string'
	}],
	
	proxy : {
		type : 'rest',
		url : 'rest/op/monitor/notifications',
		reader : {
			//type : 'json'
			type : 'restTaskGrid'
		}
	}
});
