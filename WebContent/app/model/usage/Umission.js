Ext.define('Ecfa.model.usage.Umission', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'period',
		type : 'string'
	}, {
		name : 'averageFrameTime',
		type : 'float'
	}, {
		name : 'coreHours',
		type : 'float'
	}, {
		name : 'cost',
		type : 'float'
	},{
		name : 'userName',
		mapping : 'mission.userName'
	},{
		name : 'num',
		mapping : 'mission.num'
	},{
		name : 'name',
		mapping : 'mission.name'
	},{
		name : 'numTotal',
		mapping : 'mission.numTotal'
	},{
		name : 'state',
		mapping : 'mission.state'
	},{
		name : 'mission'
	} ]
});
