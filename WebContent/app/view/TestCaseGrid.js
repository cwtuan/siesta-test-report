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
		var i;

		me.store = Ext.create('MyApp.store.TestCase');

		me.testSuites = {};
		Ext.Array.each(MyApp.Config.test_result_files, function(file) {

			MyApp.Restful.request({
				url : 'app/data/' + file.fileName,
				method : 'GET',
				async : false,
				success : function(data) {

					var testSuite = data;
					var assertionTotalNum, assertionPassedNum;
					var testCaseTotalNum = 0, testCasePassedNum = 0;

					var testCases = testSuite.testCases;
					for (var i = 0; i < testCases.length; ++i) {
						var assertions = testCases[i].assertions;
						assertionPassedNum = assertionTotalNum = 0;

						for (var j = 0; j < assertions.length; ++j) {
							var passed = assertions[j].passed;
							if (passed != null) {
								if (passed) {
									++assertionPassedNum;
								}
								++assertionTotalNum;
							}
						}
						Ext.apply(testSuite.testCases[i], {
							passedNum : assertionPassedNum,
							totalNum : assertionTotalNum
						});
						testCasePassedNum += assertionPassedNum;
						testCaseTotalNum += assertionTotalNum;

					}
					Ext.apply(testSuite, {
						passedNum : testCasePassedNum,
						totalNum : testCaseTotalNum
					});

					me.testSuites[file.fileName] = testSuite;

					// console.log(' me.testSuites[file.fileName] ', me.testSuites[file.fileName]);

				}
			});

			// me.load();
		});

		// me.store = Ext.create('MyApp.store.TestCase');

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
			text : 'Passed',
			width : 110,
			dataIndex : 'passed',
			renderer : function(value, meta, record) {
				// console.log('record', record);
				var passedNum = record.get('passedNum');
				var totalNum = record.get('totalNum');
				var passed = passedNum === totalNum;
				// Siesta may mis-judge the result so don't use the "passed" value directly.
				meta.innerCls = passed ? ' label label-success' : ' label label-important';
				return (passed ? 'Success' : 'Failure') + Ext.String.format(' ({0}/{1})', passedNum, totalNum);
			}
		}, {
			text : 'Start',
			dataIndex : 'startDate',
			width : 140,
			renderer : MyApp.Format.dateTime
		}, {
			text : 'End',
			dataIndex : 'endDate',
			width : 140,
			// TODO tooltip for duration
			renderer : MyApp.Format.dateTime
		} ];

		me.store.on({
			datachanged : function(store) {
				if (store.getCount() > 0) {
					me.getSelectionModel().select(0);
				}
			}
		});

		me.tbar = [];

		// TODO tabscrollermenu

		i = -1;
		Ext.Array.each(MyApp.Config.test_result_files, function(file) {
			i++;
			me.tbar.push(

			Ext.create('Ext.button.Split', {
				text : (file.display ? file.display : file.fileName)
						+ Ext.String.format(' ({0}/{1})', me.testSuites[file.fileName].passedNum, me.testSuites[file.fileName].totalNum),
				icon : 'css/images/book.png',
				scale : 'medium',
				toggleGroup : 'mainbar',
				allowDepress : false,
				toggleHandler : function(button, state) {
					if (state) {
						// console.log('loadRawData', me.testSuites[file.fileName]);
						me.store.loadRawData(me.testSuites[file.fileName]);
						// me.load('app/data/' + file.fileName);
					}
				},
				menu : new Ext.menu.Menu({
					items : [ {
						text : 'Siesta Test Page',
						handler : function() {
							window.open(file.testURL);
							window.focus();
						}
					}, {
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
				me.down('button').toggle(true);
			}
		});

	}
// ,
// load : function(url) {
// var me = this;
// me.store.proxy.url = url;
// me.store.load();
// }
});
