Ext.define('Ecfa.model.monitor.Host', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'ipAddress',
		type : 'string'
	}, {
		name : 'status',
		type : 'string'
	}, {
		name : 'lastcheck',
		convert : function(value) {
			if (value == 0 || value == null) {
				return '';
			}
			return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
		}
	}, {
		name : 'nextcheck',
		convert : function(value) {
			if (value == 0 || value == null) {
				return '';
			}
			return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
		}
	}, {
		name : 'interval',
		type : 'int',
		convert : function(value) {
			if (value == 0 || value == null) {
				return '';
			}
			return Ecfa.util.Format.seconds2Time(value);
		}
	}, {
		name : 'duration',
		type : 'string'
	}, {
		name : 'info',
		type : 'string'
	}, {
		name : 'lastnotification',
		convert : function(value) {
			if (value == 0 || value == null) {
				return '';
			}
			return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
		}
	} ]
});
