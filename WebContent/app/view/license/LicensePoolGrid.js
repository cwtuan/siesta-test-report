Ext.define('Ecfa.view.license.LicensePoolGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.licensePoolGrid',
	store : 'license.PoolByLicense',
	title : Locale.getMsg('view.resource.poolGrid'),
	layout : 'fit',		
	//emptyText : Locale.getMsg('view.common.noRecords'),	
	
	columns : [ {
		header : Locale.getMsg('view.common.name'), 
		dataIndex : 'poolName',
		flex : 1.0
	}, {
		header : Locale.getMsg('view.resource.pool.subscriber'),
		dataIndex : 'poolSubscriber',
		flex : 1.0
	},{
		header : Locale.getMsg('view.common.status'),
		dataIndex : 'poolState',
		flex : 1.0
	},{
		header : Locale.getMsg('view.license.dedicatedNums')+Locale.getMsg('view.license.nums'),
		dataIndex : 'amount',
		flex : 0.5	
	}],
	    
	initComponent : function() {
		var me = this;		
		

		me.callParent(arguments);		
	}
});
