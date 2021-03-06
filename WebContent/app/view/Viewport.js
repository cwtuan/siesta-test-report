Ext.define('MyApp.view.Viewport', {
	extend : 'Ext.container.Viewport',
	renderTo : Ext.getBody(),
	requires : [

	// view
	'MyApp.view.TestCaseGrid', 'MyApp.view.AssertionGrid',

	// util
	'MyApp.util.Format'

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
		flex : 0.55,
		split : true,
		collapsible : true,
	}, {	
		region : 'center',
		flex : 0.45,
		xtype : 'testCaseGrid'
	} ]
});
