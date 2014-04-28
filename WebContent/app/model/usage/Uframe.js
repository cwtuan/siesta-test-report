Ext.define('Ecfa.model.usage.Uframe', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'retryCount',
		type : 'int'
	}, {
		name : 'timeUsed',
		type : 'int'
	}, {
		name : 'cost',
		type : 'float'
	},{
		name : 'frameSeq',
		mapping : 'frame.frameSeq'
	},{
		name : 'poolOid',
		type : 'string'
	},{
		name : 'renderMode'
	} ]
});
