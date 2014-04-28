// TODO merge with File.js
// @deprecited 
Ext.define('Ecfa.model.transfer.Folder', {
	extend : 'Ext.data.Model',
	alternateClassName : [ 'Ecfa.Folder' ],
	fields : [ 'id', 'text', 'tag', 'disabled', 'displayed' ],
	destroy : function(options) {
		// FIXME: Removing tree node called destroy
	}
//,
//	compare : function(n2) {
//		var n1 = this;
//		return n1.get('text').localeCompare(n2.get('text'));
//	}
 
});
