Ext.define('Ecfa.store.transfer.Folder', {
	extend : 'Ext.data.TreeStore',
	requires : [ 'Ecfa.reader.transfer.Folder' ],
	// model : 'Ecfa.model.transfer.Folder', // FIXME why it use ImplicitModel instead of the Folder model?
	// fields : [ 'id', 'text' ],
	autoload : false,
	proxy : {
		type : 'ajax', // dont use rest proxy or it will load by a appending root id
		url : 'rest/transfer/folders',
		reader : {
			type : 'folder'
		}
	},
	root : {
		id : Ecfa.Const.Ftp.PREFIX,
		text : Ecfa.Const.Ftp.PREFIX,
		expanded : false
	}
});
