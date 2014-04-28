Ext.define('Ecfa.controller.Monitor', {
	extend : 'Ext.app.Controller',
	stores : [ 'monitor.Host', 'monitor.Service', 'monitor.ServiceOverview', 'monitor.Notification', 'monitor.Cpu', 'monitor.Network' ],
	models : [ 'monitor.Host', 'monitor.Service', 'monitor.ServiceOverview', 'monitor.Notification', 'monitor.HostUsage' ],
	refs : [ {
		ref : 'usageGrid',
		selector : 'usageGrid'
	}, {
		ref : 'usagePanel',
		selector : 'usagePanel'
	}, {
		ref : 'monitorView',
		selector : 'monitorView'
	}, {
		ref : 'notificationTabs',
		selector : 'notificationTabs'
	}, {
		ref : 'serviceOverviewGrid',
		selector : 'serviceOverviewGrid'
	},{
		ref : 'serviceGrid',
		selector : 'serviceGrid'
	} ],
	init : function() {
		var me = this;

		me.control({
			'usageGrid' : {
				select : function(selectionRowModel, record, index, eOpts) {
					// Stop previous timer before new select
					me.getUsagePanel().down('#cpuChart').stopTimer();
					me.getUsagePanel().down('#networkChart').stopTimer();

					// show the charts on the right
					me.getUsagePanel().down('#cpuChart').load(record.getId(), record.get('name'));
					me.getUsagePanel().down('#cpuChart').setTimer();
					me.getUsagePanel().down('#networkChart').load(record.getId(), record.get('name'));
					me.getUsagePanel().down('#networkChart').setTimer();
				}			
			},
			'usagePanel' : {
				activate : function(panel, eOpts) {
					// Collapse notification tab
					if (Ecfa.Config.isOP() && !me.getNotificationTabs().collapsed) {
						me.getNotificationTabs().collapse();
					}
				},
				deactivate : function(panel, eOpts) {
					me.getUsagePanel().down('#cpuChart').stopTimer();
					me.getUsagePanel().down('#networkChart').stopTimer();

					// Enable notification tab and restore previous layout
					if (Ecfa.Config.isOP() && me.getNotificationTabs().collapsed) {
						if (me.getMonitorView().refreshActiveTab())
							me.getNotificationTabs().expand(false); // otherwise grid content will be wiped out
					}
				}
			},
			'monitorView' : {				
				deactivate : function() {
					me.getUsagePanel().down('#cpuChart').stopTimer();
					me.getUsagePanel().down('#networkChart').stopTimer();
				}
			},
			'serviceOverviewGrid' : {
				cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					me.getServiceGrid().load(record.get('oid'));
				}
			}
		});
	}
});
