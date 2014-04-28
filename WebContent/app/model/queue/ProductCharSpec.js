Ext.define('Ecfa.model.queue.ProductCharSpec', {
	extend : 'Ext.data.Model',
	fields : [ {
		name : 'charSpecId',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}
//	, {
//		name : 'analysis',
//		type : 'boolean'
//	}
	, {
		name : 'singleValue',
		type : 'boolean'
	}, {
		name : 'renderSettings',
		defaultValue : []
	} ]
});
