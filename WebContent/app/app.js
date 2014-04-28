/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
 */

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides
Ext.application({
	name : 'Ecfa',
	requires : [
	// loadext_dev requires is for localhost/ECFA/dev. App.js requires is for localhost/ECFA.
	'Ecfa.event.App', 'Ecfa.Const', 'Ecfa.Config', 'Ecfa.Spec', 'Ecfa.ExtFix', 'Ecfa.ExtOverride', 'Ecfa.ExtSetting', 'Ecfa.util.Restful', 'Ecfa.locale.Converter',
			'Ecfa.ux.proxy.NestedRest', 'Ecfa.reader.RestTaskGrid','Ecfa.reader.RestTaskPagingGrid', 'Ext.util.Cookies', 'Ecfa.util.Util' ],

	views : [ 'Viewport' ],
	controllers : [ 'Monitor', 'Problem', 'Enhance', 'Queue', 'Auth', 'Project', 'Transfer', 'License', 'Resource', 'Usage', 'Audit','Version' ],
	autoCreateViewport : false,
	onReady : function(fn) {
		this.readyFn = fn;
		this.on('loaded', this.readyFn, this);
	},
	launch : function() {
		var me = this;
		console.log('Ext.application launch');
		Ecfa.event.App.fireEvent('created');
	}
});
