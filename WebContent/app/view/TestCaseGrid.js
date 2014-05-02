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

				// return 'cursorPointer';//TODO
			}

		}
	},
	initComponent : function() {
		var me = this;

		me.store = Ext.create('Ecfa.store.TestCase');

		me.columns = [ {
			xtype : 'rownumberer'
		}, {
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
			dataIndex : 'passed',
			renderer : function(value, meta, record) {
				var assertions = record.get('assertions');
				var total = 0;
				var passNum = 0;
				Ext.Array.each(assertions, function(a) {
					total += (a.passed != null) ? 1 : 0;
					passNum += a.passed ? 1 : 0;
				});
				return value + Ext.String.format(' ({0}/{1})', passNum, total);

			}
		} ];

		me.store.on({
			load : function(store, records, successful) {
				if (successful && records.length > 0) {
					me.getSelectionModel().select(records[0]);
				}
			}
		});

		me.tbar = [];

		// TODO tabscrollermenu
		Ext.Array.each(Ecfa.Config.test_result_files, function(file) {
			me.tbar.push({
				text : file,
				icon : 'css/images/book.png',
				scale : 'medium',
				toggleGroup : 'mainbar',
				allowDepress : false,
				toggleHandler : function() {
					me.load('app/data/' + file + '.json');
				}
			});
		});

		me.callParent(arguments);

		me.on({
			afterrender : function(toolbar, eOpts) {
				// me.down('button').btn.el.dom.click();
				// setTimeout(3000, function() {
				var button = me.down('button');
				button.toggle(true);
				// });

			}
		});

	},

	load : function(url) {
		var me = this;
		me.store.proxy.url = url;
		me.store.load();
	}
});
