/**
 * To switch view, use Ext.getCmp('mainToolbar').press('#opMonitor');
 */

Ext.define('MyApp.view.TestCaseGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.testCaseGrid',
	title : 'Test Cases',
	viewConfig : {
		getRowClass : function(record) {
			return 'cursorPointer';// TODO
		}
	},
	initComponent : function() {
		var me = this;

		me.store = Ext.create('MyApp.store.TestCase');

		me.columns = [ {
			xtype : 'rownumberer'
		}, {
			text : 'url',
			dataIndex : 'url',
			flex : 1,
			renderer : function(value, meta, record) {
				meta.style = 'font-weight:bold;';
				return value;
			}
		}, {
			text : 'passed',
			width : 110,
			dataIndex : 'passed',
			renderer : function(value, meta, record) {

				var assertions = record.get('assertions');
				var total = 0;
				var passNum = 0;
				Ext.Array.each(assertions, function(a) {
					total += (a.passed != null) ? 1 : 0;
					passNum += a.passed ? 1 : 0;
				});

				// Siesta may mis-judge the result so don't use the "passed" value directly.
				value = (total == passNum);

				if (!value) {
					console.log('meta', meta);
					meta.innerCls = ' label label-important';
				} else {
					meta.innerCls = ' label label-success';
				}

				return (value ? 'Success' : 'Failure') + Ext.String.format(' ({0}/{1})', passNum, total);
			}
		}, {
			text : 'startDate',
			dataIndex : 'startDate',
			width : 140,
			renderer : MyApp.Format.dateTime
		}, {
			text : 'endDate',
			dataIndex : 'endDate',
			width : 140,
			renderer : MyApp.Format.dateTime
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
		// TODO show (passed/total) in button
		Ext.Array.each(MyApp.Config.test_result_files, function(file) {
			me.tbar.push(

			Ext.create('Ext.button.Split', {
				text : file.display ? file.display : file.fileName,
				icon : 'css/images/book.png',
				scale : 'medium',
				toggleGroup : 'mainbar',
				allowDepress : false,
				toggleHandler : function(button, state) {
					if (state) {
						me.load('app/data/' + file.fileName);
					}
				},
				menu : new Ext.menu.Menu({
					items : [ {
						text : file.fileName,
						handler : function() {
							window.open('app/data/' + file.fileName);
							window.focus();
						}
					} ]
				})
			})

			);
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
		// FIXME sometimes it donest load new data
		me.store.load();
	}
});
