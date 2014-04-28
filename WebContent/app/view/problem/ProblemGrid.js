Ext.define('Ecfa.view.problem.ProblemGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.problemGrid',
	requires : [ 'Ecfa.view.problem.CreateProblemWin' ],
	title : Locale.getMsg('view.problem.title'),
	icon : 'css/images/problem_report_16x16.png',
	viewConfig : {
		preserveScrollOnRefresh : true, // 官方 : grid refresh後保留scroll bar位置而不會回捲到最頂
		preserveSelectionOnRefresh : false, // 自定義: grid refresh後保留selection，預設就是打開
		getRowClass : function(record, index) {
			return 'cursorPointer';
		}
	},
	columns : [ {
		header : Locale.getMsg('view.problem.name'),
		dataIndex : 'name',
		flex : 1
	}, {
		header : Locale.getMsg('view.common.status'),
		dataIndex : 'status',
		renderer : function(value) {
			return Ecfa.locale.Converter.getProblemStatus(value);
		},
		flex : 0.5
	}, {
		header : Locale.getMsg('view.problem.occurTime'),
		dataIndex : 'occurTime',
		flex : 1,
		renderer : Ecfa.Format.dateTime
	} ],
	initComponent : function() {
		var me = this;

		// TODO tony: problem似乎沒有共用store的需求
		me.store = Ecfa.StoreUtil.getStore('problem');

		me.tbar = [ {
			icon : 'css/images/add_16x16.png',
			text : Locale.getMsg('view.common.add'),
			itemId : 'createBtn',
			handler : function() {
				Ext.widget('createProblemWin', {
					userId : Ecfa.Session.getUser().id
				}).show();
			}
		}, {
			itemId : 'refreshBtn',
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				// Ecfa.event.Problem.fireEvent('update');
				var lastSelect = me.getSelectionModel().getSelection()[0];
				me.store.load({
					scope : this,
					callback : function(records, operation, success) {
						if (me.store.getCount() != 0 && lastSelect != null) {
							// Select the same record after refresh
							var rec = me.store.findRecord("oid", lastSelect.get('oid'));
							me.getSelectionModel().select(rec);
						} else {
							// If no problem record in grid,clear discuss grid
							console.log('problemPropertyGrid', me.up('panel').down('problemPropertyGrid'));
							me.up('panel').down('problemPropertyGrid').store.loadData([], false);
							me.up('panel').down('discussGrid').store.loadData([], false);
						}
					}
				});
			}
		} ];

		me.callParent(arguments);

		//me.store.load();

		me.on({
			viewready : function() {
				if (me.store.getCount() != 0) {
					me.getSelectionModel().select(0);
				}
			}
		});

		Ecfa.event.Problem.on({
			destroyed : function(record) {
				me.getStore().load();
			},
			created : function(record) {
				console.log('up updated');
				me.getStore().load({
					scope : this,
					callback : function(records, operation, success) { // Select newly created record
						var rec = me.store.findRecord("oid", record.oid);
						me.getSelectionModel().select(rec);
					}
				});
			},
			updated : function(record) {
				me.getStore().load();
			},
			running : function(isRunning) {
				me.setLoading(isRunning);
			}
		});
	}
});
