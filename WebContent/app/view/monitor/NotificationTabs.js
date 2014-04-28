Ext.define('Ecfa.view.monitor.NotificationTabs', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.notificationTabs',
	store : 'monitor.Notification',
	// region : 'south',
	// layout : 'border',
	layout : 'fit',
	border : false,
	header : false, // hide the title of the panel
	plain : true,
	split : true,
	collapsible : true,
	collapsed : true, // default collapsed

	initComponent : function() {
		var me = this;

		me.callParent(arguments);

		me.on({
			tabchange : function() {
				// when tabchange relaod the activate panel
				me.getActiveTab().down('panel').load(me.getActiveTab().itemId);
			},
			remove : function() {
				// When no tabs, collapse empty panel
				if (me.getActiveTab() === null)
					me.collapse();
			},
			activate : function() {
				console.log('notificationTab activate');
				//me.getActiveTab().fireEvent('activate');
			}
		});

	}
});
