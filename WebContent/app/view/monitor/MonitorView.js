Ext.define('Ecfa.view.monitor.MonitorView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.monitorView',
	layout : 'border',
	border : false,
	requires : [ 'Ecfa.view.monitor.MonitorPanel', 'Ecfa.view.monitor.NotificationTabs' ],
	nagios : null,

	initComponent : function() {
		var me = this;
		var items = [];

		items.push({
			region : 'center',
			itemId : 'monitorPanel',
			xtype : 'monitorPanel', // Host/Service/Problem tabs
			border : false
		});
		
		if (Ecfa.Config.isOP()) {
			items.push({
				region : 'south',
				itemId : 'notificationTabs',
				xtype : 'notificationTabs', // Notification log grid in notificationTabs
				flex : 1,
				border : false
			});

			//TODO : Get nagios web page
			me.getNagiosPage();			
		}

		me.items = items;
	
		me.callParent(arguments);
		
		me.on({			
			activate : function(){			
				//console.log('monitorView activate',me.down('#monitorPanel').getActiveTab());
				me.down('#monitorPanel').getActiveTab().fireEvent('activate');
			}
		});		
	},
	refreshActiveTab : function() {
		var me = this;
		var activeTab = me.down('notificationTabs').getActiveTab();
		if (activeTab != null) {
			var oid = activeTab.itemId;
			activeTab.down('notificationGrid').load(oid);
			return true;
		}
		else return false;
	},

	getLastNotificationTabs : function(record) {
		var me = this;

		var tabName = record.data['name'];
		var tabs = me.down('notificationTabs');
		var tabItemId = record.data['oid'];
		var existTab = tabs.queryById(tabItemId);

		if (existTab) {// already exist,activate it
			tabs.setActiveTab(existTab);
		} else { // not exist, add it
			var name = record.get('name');
			if (record.data['service'] != null) {
				name = name + ':' + record.get('service');
			}

			var notificationGrid = Ext.create('Ecfa.view.monitor.NotificationGrid', {
				store : Ext.create('Ecfa.store.monitor.Notification'),
				id : tabItemId,
				columnWidth : 1.0,
				border : false
			});

			var items = [ notificationGrid ];

			tabs.add({
				title : name,// record.get('name'),
				itemId : tabItemId,
				autoScroll : true,
				closable : true,
				border : false,
				layout : 'column',
				items : items
			});
			tabs.setActiveTab(tabs.items.length - 1);
		}

		if (tabs.collapsed) {
			tabs.expand();
		}
	},
	getNagiosPage : function(){
		var me = this;
		
		Ecfa.Restful.request({
			url : 'rest/op/monitor/nagios',
			method : 'GET',
			success : function(jsonResp) {
				//console.log('getNagiosPage',jsonResp);	
				me.nagios = jsonResp.target;
			},
			failure : function(jsonResp) {

			}
		});
	}
});
