Ext.define('Ecfa.controller.Version', {
	extend : 'Ext.app.Controller',
	stores : [ 'version.App', 'version.Plugin'],
	models : [ 'version.Version'],
	init : function() {
		var me = this;

		//me.control({});
	}
});
