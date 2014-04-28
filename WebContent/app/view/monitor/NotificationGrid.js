// for OP
Ext.define('Ecfa.view.monitor.NotificationGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.notificationGrid',
	title : Locale.getMsg('view.monitor.notification'),
	//scroll : 'vertical',
	viewConfig : {
		getRowClass : function(record) {
			if (record.get('type') === Ecfa.Const.MonitorStatus.DOWN || record.get('type') === Ecfa.Const.MonitorStatus.CRITICAL) {
				return 'host-status-down'; // Red
			} else if (record.get('type') === Ecfa.Const.MonitorStatus.UNREACHABLE || record.get('type') === Ecfa.Const.MonitorStatus.WARINING) {
				return 'host-status-unreachable'; // Yellow
			}  else if (record.get('type') === Ecfa.Const.MonitorStatus.UNKNOWN) {
				return 'service-status-unknown'; // Fuchsia
			}
		}
	},
	
	initComponent : function() {
		var me = this;
		
		me.columns = [{
			header : Locale.getMsg('view.monitor.notification.type'),
			dataIndex : 'type',
			flex : 0.5
		},{
			header : Locale.getMsg('view.monitor.notification.time'),
			dataIndex : 'time',
			flex : 1.0
		}, {
			header : Locale.getMsg('view.monitor.notification.contact'),
			dataIndex : 'contact',
			flex : 1.0
		}, {
			header : Locale.getMsg('view.monitor.notification.method'),
			dataIndex : 'method',
			hidden : true
		},{
			header : Locale.getMsg('view.common.information'),
			dataIndex : 'info',
			flex : 1.0
		}];

		me.callParent(arguments);
		
		Ecfa.event.Notification.on({
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
	},
	
	load : function(oid) {
		var me = this;
        
		me.store.load({ // Store define and bind with adding tab panels
			id : oid
		});
		
	}
});
