Ext.define('Ecfa.view.Viewport', {
	extend : 'Ext.container.Viewport',
	renderTo : Ext.getBody(),
	requires : [

	// view
	'Ecfa.view.TestCaseGrid', 'Ecfa.view.AssertionGrid',

	// util
	'Ecfa.util.Format'

	],
	id : 'viewport',
	layout : 'border',
	items : [ {
		region : 'north',
		html : '<h1 class="x-panel-header">Test Results</h1>',
		border : false,
		margins : '0 0 5 0'
	}, {
		region : 'east',
		xtype : 'assertionGrid',
		flex : 0.8
	}, {
		region : 'center',
		xtype : 'testCaseGrid'

	} ]
});
