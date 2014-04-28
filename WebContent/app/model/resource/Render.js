Ext.define('Ecfa.model.resource.Render', {
	extend : 'Ext.data.Model',
	idProperty : 'oid', // Don't support e.record.save cause id will be appended onto url
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'hostName',
		type : 'string'
	}, {
		name : 'ipAddress',
		type : 'string'
	}, {
		name : 'capacity',
		type : 'string'
	}, {
		name : 'cpuCores',
		type : 'int'
	}, {
		name : 'cpuMhz',
		type : 'int'
	},{
		name : 'memory',
		type : 'string'
	}, {
		name : 'os',
		type : 'string'
	}, {
		name : 'status',
		type : 'string'
	}, {
		name : 'priority',
		type : 'string'
	},{
		name :'sshAccount',
		type : 'string'
	},{
		name :'sshPassword',
		type : 'string'
	},{
		name :'level',
		type : 'string'
	},{
		name :'poolOid',
		type :'string'
	},{
		name :'poolName',
		type :'string'
	},{
		name : 'afName', // Mapping nagios host name
		type : 'string'
	},{
		name : 'note',
		type : 'string'
	}],
	proxy : {
		type : 'rest',
		url : 'rest/op/resource/renders',
		reader : {
			//type : 'json'
			 type : 'restTaskGrid'
		}
	}
});
