Ext.define('Ecfa.view.monitor.ServicePanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.servicePanel',
	region : 'center',
	layout : 'border',
	border : false,
	itemId : 'servicePanel',
	requires : [ 'Ecfa.view.monitor.ServiceOverviewGrid', 'Ecfa.view.monitor.ServiceGrid'],

	initComponent : function() {
		var me = this;
		me.items = [ {
			itemId :'serviceOverviewGrid',
			xtype : 'serviceOverviewGrid',
			region : 'west',
			width : 580,
			split : true,
			collapsible : false,
			hideCollapseTool : true
			//,border : false
		}, {
			itemId : 'serviceGrid',
			xtype : 'serviceGrid',
			region : 'center'
			//,border : false
		} ];
		
		me.callParent(arguments);	
		
		me.on({
			activate : function() {
				console.log('ServicePanel activate');
				me.down('#serviceOverviewGrid').loadFilter();
			}
		});
	}
});
