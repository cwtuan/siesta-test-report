// for OP
Ext.define('Ecfa.view.monitor.MonitorProblemGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.monitorProblemGrid',
	header : false,
	viewConfig : {
		getRowClass : function(record) {
			if (record.get('status') === Ecfa.Const.MonitorStatus.DOWN || record.get('status') === Ecfa.Const.MonitorStatus.CRITICAL) {
				return 'host-status-down'; // Red
			} else if (record.get('status') === Ecfa.Const.MonitorStatus.UNREACHABLE || record.get('status') === Ecfa.Const.MonitorStatus.WARINING) {
				return 'host-status-unreachable'; // Yellow
			}  else if (record.get('status') === Ecfa.Const.MonitorStatus.UNKNOWN) {
				return 'service-status-unknown'; // Purple
			}
		}
	},

	initComponent : function() {
		var me = this;

		me.store = Ecfa.StoreUtil.getStore('monitorProblem');

		me.columns = [ {
			header : Locale.getMsg('view.monitor.host.name'),
			dataIndex : 'name',
			flex : 1.0
		}, {
			header : Locale.getMsg('view.monitor.service'),
			dataIndex : 'service',
			flex : 1.0

		}, {
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.monitor.lastcheck'),
			dataIndex : 'lastcheck',
			flex : 1.0
		}, {
			header : Locale.getMsg('view.monitor.duration'),
			dataIndex : 'duration',
			flex : 1.0
		}, {
			header : Locale.getMsg('view.monitor.attempt'),
			// dataIndex : 'attempt',
			flex : 0.5,
			renderer : function(value, meta, record) {
				return record.get('attempt') + ' / ' + record.get('attemptTotal');
			}
		}, {
			header : Locale.getMsg('view.monitor.statusInfo'),
			dataIndex : 'info',
			flex : 1.5
		},{
			header : Locale.getMsg('view.monitor.lastnotification'),
			dataIndex : 'lastnotification',
			flex : 1.0,
			xtype : 'componentcolumn',
			renderer : function(value, meta, record) {
				meta.tdAttr = 'data-qtip="' + Locale.getMsg('view.monitor.service.viewLastNotification') + '"';				
				return {
					xtype : 'container',
					items : [ {
						xtype : 'linkButton',
						columnWidth : 0.2,
						text : value,
						listeners : {
							click : function() {
								me.up('monitorView').getLastNotificationTabs(record);
							}
						}
					} ]
				};
			}
		} ];

		me.tbar = [ {
			text : Locale.getMsg('view.monitor.add.nagiosWeb'),
			icon : 'css/images/webAdd_16x16.png',
			handler : function() {
				window.open(me.up('monitorView').nagios);
			}
		}, {
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.store.load();
			}
		} ];

		me.callParent(arguments);

		//me.store.load();
		
		me.on({			
			activate : function(){			
				console.log('monitorProblemGrid activate');
				me.getStore().load();
			}
		});		

		Ecfa.event.MonitorProblem.on({
			destroyed : function() {
				me.getStore().load();
			},
			created : function(rec, op) {
				me.getStore().load();
			},
			updated : function(rec, op) {
				me.getStore().load();
			},
			fail : function(rec, op) {

			},
			running : function(isRunning) {
				me.setLoading(isRunning);
			}
		});
	}
});
