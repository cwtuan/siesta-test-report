Ext.define('Ecfa.view.monitor.MonitorPanel', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.monitorPanel',
	region : 'center',
	layout : 'border',
	border : false,
	requires : [ 'Ecfa.view.monitor.HostGrid', 'Ecfa.view.monitor.ServicePanel', 'Ecfa.view.monitor.MonitorProblemGrid', 'Ecfa.view.monitor.UsagePanel' ],

	initComponent : function() {
		var me = this;
		var items = [];

		if (Ecfa.Config.isOP()) {
			items.push({
				title : Locale.getMsg('view.monitor.host'),
				xtype : 'hostGrid',
				border : false
			}, {
				title : Locale.getMsg('view.monitor.service'),
				xtype : 'servicePanel',
				border : false
			}, {
				title : Locale.getMsg('view.monitor.problem'),
				xtype : 'monitorProblemGrid',
				border : false
			});
		}

		items.push({
			title : Locale.getMsg('view.monitor.hostUsage'),
			xtype : 'usagePanel',
			border : false
		});
		
		me.items = items;

		me.callParent(arguments);		
	}

});
