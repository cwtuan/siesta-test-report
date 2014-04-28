Ext.define('Ecfa.model.queue.Image', { 
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'name',
		type : 'string'
	},{
		name : 'url',
		type : 'string'
	}// ,{
//		name : 'modifyTime', 	
//		convert : function(value) {
//			if (value==0 || value==null) {
//				return '';
//			}
//			return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
//		}
//	}
	]
});
