Ext.define('Ecfa.model.queue.Frame', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'frameSeq',
		type : 'int'
	}, {
		name : 'state',
		type : 'string'
	}, {
		name : 'startTime',
		convert : function(value) {
			if (value==0) {
				return '';
			}
			return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
		}
	}, {
		name : 'endTime',
		convert : function(value) {
			if (value==0) {
				return '';
			}
			return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
		}
	},{
		name : 'startCount',
		type : 'int'
	},{
		name : 'totTimeUsed',
		type : 'int'
	},{
		name : 'totCost',
		type : 'float'
	},{
		name : 'poolOid',
		type : 'string'			
	},{
		name : 'renderMode',
		type : 'string'
	},{
		name : 'images'
	} ]
});
