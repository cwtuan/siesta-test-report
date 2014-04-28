Ext.define('Ecfa.view.version.VersionView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.versionView',
	border : false,
	layout :  'border',
	requires : [ 'Ecfa.view.version.AppGrid', 'Ecfa.view.version.PluginGrid', 'Ecfa.view.version.action.UploadVersionAction','Ecfa.view.version.UploadVersionWin' ],
	initComponent : function() {
		var me = this;

		me.items = [ {
			itemId : 'appGrid',
			xtype : 'appGrid',
			region : 'west',
			split : true,
			collapsible : false,
			hideCollapseTool : true	,
			border : false,
			flex:1.0
		}, {
			itemId : 'pluginGrid',
			xtype : 'pluginGrid',
			region : 'center',
			border : false,
			flex:1.0
		} ];		

		me.tbar = [ new Ext.button.Button(new Ecfa.view.version.action.UploadVersionAction({
						panel : me,
						itemId : 'uploadVersionButton'
					})), {
						itemId : 'refreshBtn',
						icon : 'css/images/refresh.png',
						text : Locale.getMsg('view.common.refresh'),
						handler : function() {
							me.refreshVersionGrids();
						}
		} ];
		
		me.callParent(arguments);		

		me.on({
			activate : function(comp, eOpts) {
				//console.log('versionView activate');
				me.refreshVersionGrids();
			}
		});
		
		Ecfa.event.Version.on({
			destroyed : function(tasks) {
				me.refreshVersionGrids();
			},
			created : function(tasks) {
				me.refreshVersionGrids();
			},
			updated : function(tasks) {
				me.refreshVersionGrids();
			},
			running : function(isRunning) {
				me.setLoading(isRunning);
			}
		});
	},
	refreshVersionGrids : function(){
		var me = this;
		
		me.down('#appGrid').getStore().load();
		me.down('#pluginGrid').getStore().load();
	}
});
