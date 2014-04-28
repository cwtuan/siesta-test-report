Ext.define('Ecfa.model.queue.Asset', { 
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'filename',
		type : 'string'
	},{
		name : 'type',
		type : 'string'
	}, {
		name : 'size',
		type : 'int'
	}, {
		name : 'modifyTime', 	
		convert : function(value) {
			if (value==0 || value==null) {
				return '';
			}
			return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
		}
	},{
		name : 'status',		
		type : 'sting'
	},{
		name : 'foundPath',
		type : 'string'
	},{
		name : 'pathType',
		type : 'string'
	}]/*,
	
	

	proxy : {
		type : 'rest',
		timeout: 120000,
		url : 'rest/queue/submission',
		writer : Ext.create('Ecfa.util.JsonWriter', {
			writeAllFields : true
		})
	}*/
});
