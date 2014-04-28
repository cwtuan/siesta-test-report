Ext.define('Ecfa.model.auth.Account', {
	extend : 'Ext.data.Model',
	fields : [ 'id','status','name', 'email','password','phoneNumber', 'role'],
	proxy : {
		type : 'memory',
		reader : {
			type : 'array'
		}
	}
});
