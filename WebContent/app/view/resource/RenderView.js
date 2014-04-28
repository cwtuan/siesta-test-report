Ext.define('Ecfa.view.resource.RenderView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.renderView',	
	region : 'center',	
	border : false,
	autoscroll : true,
	requires : ['Ecfa.view.resource.RenderGrid','Ecfa.view.resource.CreateRenderWin'
	            ,'Ecfa.view.resource.action.CreateRenderAction','Ecfa.view.resource.action.DeleteRenderAction'
	            ,'Ecfa.view.resource.action.EditRenderAction','Ecfa.view.resource.action.CreateBatchRenderAction'],
	layout : 'fit',
	icon : 'css/images/server_16.png',
	
	initComponent : function() {
		var me = this;
				
		me.items = [ {
			itemId : 'renderGrid',
			title : Locale.getMsg('view.resource.renderGrid'),		
			xtype : 'renderGrid',
			border :false
		}];

		me.callParent(arguments);
		
		me.on({			
			activate : function(){		
				//console.log('renderView activate');
				me.down('#renderGrid').getStore().load();
			}
		});		
	}
	
});
