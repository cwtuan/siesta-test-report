Ext.define('Ecfa.view.version.AppGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.appGrid',
	border : false,
	title : Locale.getMsg('view.version.app.title'),
	store : 'version.App',
	autoScroll : true,
	
	initComponent : function() {
		var me = this;
		
		me.columns = [/* {
			xtype : 'rownumberer',
			width : 20
		},*/{
			header : Locale.getMsg('view.common.name'),
			dataIndex : 'name',
			flex : 1
		}, {
			header : Locale.getMsg('view.version.version'),
			dataIndex : 'version',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.version.versionType'),
			dataIndex : 'versionType',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.version.osType'),
			dataIndex : 'osType',
			flex : 1
		}, {
			header : Locale.getMsg('view.version.path'),
			dataIndex : 'path',
			flex : 2
		}, {
			header : Locale.getMsg('view.version.opUser'),
			dataIndex : 'opUserId',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.version.updateTime'),
			dataIndex : 'updateTime',
			flex : 1,
			renderer : Ecfa.Format.dateTime
		} ];
		
		me.callParent(arguments);		
	}
});
