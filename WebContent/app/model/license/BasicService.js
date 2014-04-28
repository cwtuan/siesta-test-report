Ext.define('Ecfa.model.license.BasicService', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'service',
		convert : function(value, record) {			
			return record.raw;
		}
	} ]
	

});
