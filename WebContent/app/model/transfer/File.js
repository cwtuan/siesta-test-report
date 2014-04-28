Ext.define('Ecfa.model.transfer.File', {
	extend : 'Ext.data.Model',
	idProperty : 'path',
	fields : [ {
		/**
		 *  @decrepated	   
		 */
		name : 'id', // same as path
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'folder',
		type : 'string'
	}, {
		name : 'path',
		type : 'string'
	}, {
		name : 'type', // IS_FILE, IS_FOLDER
		type : 'string'
	}, {
		name : 'size',
		type : 'int'
	}, {
		// name : 'createTime',
		// type : 'int'
		// }, {
		name : 'modifyTime',
		type : 'int'
	} ],

	proxy : {
		type : 'rest',
		url : 'rest/transfer/files',
		reader : {
			type : 'restTaskGrid'
		}
	}
});
