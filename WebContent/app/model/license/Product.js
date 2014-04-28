Ext.define('Ecfa.model.license.Product', {
	extend : 'Ext.data.Model',
	idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	},{
		name : 'name',
		type : 'string'
	},{
		name : 'animationSoftware',
		type : 'string'
	},{
		name : 'animationSoftwareName',
		type : 'string'
	},{
		name : 'animationSoftwareVersion',
		type : 'string'
	}, {
		name : 'renderEngine',
		type : 'String'
	}, {
		name : 'renderEngineName',
		type : 'String'
	}, {
		name : 'renderEngineVersion',
		type : 'String'
	}, {
		name : 'state',
		type : 'string'
	},{
		name : 'extension',
		type : 'string'
	},{
		name : 'pluginSupport',
		type : 'string'
	}]
	
	
});
