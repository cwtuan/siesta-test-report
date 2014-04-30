/**
 * To switch view, use Ext.getCmp('mainToolbar').press('#opMonitor');
 */

Ext.define('Ecfa.view.TestCaseGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.testCaseGrid',
	title : 'Test Cases',
	viewConfig : {
		getRowClass : function(record) {
			if (record.get('passed') === false) {
				return 'host-status-down'; // Red

//				return 'cursorPointer';//TODO
			}

		}
	},
	initComponent : function() {
		var me = this;

		me.store = Ext.create('Ecfa.store.TestCase');

		me.columns = [ {
			text : 'url',
			dataIndex : 'url',
			flex : 1
		}, {
			text : 'startDate',
			dataIndex : 'startDate',
			width : 150,
			renderer : Ecfa.Format.dateTime
		}, {
			text : 'endDate',
			dataIndex : 'endDate',
			width : 150,
			renderer : Ecfa.Format.dateTime
		}, {
			text : 'passed',
			width : 150,
			dataIndex : 'passed'
		} ];

		me.callParent(arguments);

	}
});
