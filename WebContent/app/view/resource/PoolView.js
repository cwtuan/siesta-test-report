Ext.define('Ecfa.view.resource.PoolView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.poolView',	
	region : 'center',	
	border : false,
	autoscroll : true,
	requires : ['Ecfa.view.resource.PoolGrid','Ecfa.view.resource.PoolLicenseForm','Ecfa.view.resource.PoolRenderForm'
	            ,'Ecfa.view.resource.action.CreatePoolAction','Ecfa.view.resource.action.DeletePoolAction','Ecfa.view.resource.action.EditPoolAction'
	            ,'Ecfa.view.resource.BatchRenderFileWin'],
	layout : 'border',
	icon : 'css/images/servers_16.png',
	//bodyPadding: 5,
	
	initComponent : function() {
		var me = this;
				
		me.items = [ {
			itemId : 'poolGrid',
			title : Locale.getMsg('view.resource.poolGrid'),		
			xtype : 'poolGrid',
			region : 'center',			
			flex : 1,
			border :false
		},{
			itemId : 'editPoolPanel',
			//title : Locale.getMsg('view.resource.pool.edit'),	
			region : 'south',
			split : true,
			collapsible : true,
			collapsed : true,
			height: 300,
			minSize: 70,
		    maxSize: 400,
			layout : 'border',
			border : false,
			//hideCollapseTool : false,
			header : false,
			items : [ {
				region : 'west',
				xtype : 'poolLicenseForm',
				itemId :'poolLicenseForm',
				title : Locale.getMsg('view.resource.pool.licenseEdit'),
				split : true,
				width : 350,
				collapsible : true,
				layout :'fit'
			}, {
				region : 'center',
				title : Locale.getMsg('view.resource.render'),
				xtype : 'poolRenderForm'
			} ]
		
		} ];

		me.callParent(arguments);
		
		me.on({			
			activate : function(){
				console.log('poolView activate');				
			    //me.down('#poolGrid').getStore().load();
			    me.down('#poolGrid').load(me.down('#poolGrid').poolStatus);
			}
		});	
	},
	disableButtomPanel : function(){
		var me = this;
		me.down('poolLicenseForm').setDisabled(true);
		me.down('poolRenderForm').setDisabled(true);
	},
	enableButtomPanel : function(){
		var me = this;
		me.down('poolLicenseForm').setDisabled(false);
		me.down('poolRenderForm').setDisabled(false);
	}
	
});
