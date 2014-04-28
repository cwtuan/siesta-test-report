Ext.define('Ecfa.model.problem.Problem', {
	extend : 'Ext.data.Model',
	//idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'status',
		type : 'string'
	}, {
		name : 'occurTime',
		type : 'long'
//		convert : function(value) {
//			if (value == 0 || value == null) {
//				return '';
//			}
//			return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
//		}
	}, {
		name : 'description',
		type : 'string'
	}, {
		name : 'userId',
		type : 'string'
	}, {
		name : 'email',
		type : 'string'
	},{
		name : 'repairTime',
		type : 'long'
	},{
		name : 'oldRepairTime',
		type : 'long'
	} ],
	proxy : {
		type : 'rest',
		url : 'rest/op/problems',
		reader : {
			//type : 'json'
			type : 'restTaskGrid'
		}
	}
});
