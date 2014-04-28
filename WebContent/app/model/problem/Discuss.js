Ext.define('Ecfa.model.problem.Discuss', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'problemId',
		type : 'string'
	}, {
		name : 'msg',
		type : 'string'
	}, {
		name : 'createTime',
		type : 'long'
	}, {
		name : 'author',
		type : 'string'
	}],
	proxy : {
		type : 'rest',
		url : 'rest/problems/discuss',
		reader : {
			//type : 'json'
			type : 'restTaskGrid'
		}
	}
});
