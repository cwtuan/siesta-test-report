Ext.define('Ecfa.model.project.Project', {
	extend : 'Ext.data.Model',
	idProperty : 'oid', // used for building REST request
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'createTime',
		type : 'int'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'ownerId',
		type : 'string'
	}, {
		name : 'maximumPriority',
		type : 'string'
	}, {
		name : 'projectRole', // the current user's role for this project
		type : 'string'
	}, {
		name : 'folderName',
		type : 'string'
	}, {
		// @decrepated
		name : 'uniquePath',
		type : 'string'
	}, {
		name : 'localFolderPath',
		type : 'string'
	}, 'adminIds', // To get this field, request with params: {detail:'adminIds'},
	{
		name : 'coreHours',
		type : 'float',
		mapping : 'uproject.coreHours'
	}, {
		name : 'cost',
		type : 'float',
		mapping : 'uproject.cost'
	}, {
		name : 'periodInfo',
		mapping : 'uproject.periodInfo'
	}, {
		name : 'uprojectOid',
		type : 'string',
		mapping : 'uproject.oid'
	} ],

	proxy : {
		type : 'rest',
		url : 'rest/projects',
		reader : {
			type : 'restTaskGrid'
		}
	}
});
