Ext.define('Ecfa.view.resource.ResourceView', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.resourceView',
	region : 'center',	
	border : false,
	autoscroll : true,
	requires : ['Ecfa.util.StoreUtil','Ext.grid.plugin.RowEditing','Ecfa.view.resource.RenderView','Ecfa.view.resource.PoolView',
	            'Ecfa.view.resource.CreatePoolWin','Ecfa.view.resource.action.CreatePoolAction','Ecfa.view.resource.action.DeletePoolAction'	            
	           ],
	plain : false,
	initComponent : function() {
		var me = this;
		
		me.items = [ {
			xtype : 'renderView',
			title : Locale.getMsg('view.resource.renderView'),			
			flex : 1
		},{
			xtype : 'poolView',
			title : Locale.getMsg('view.resource.poolView'),
			flex : 1
		}];

		me.callParent(arguments);
		
		me.on({			
			activate : function(){				
				me.getActiveTab().fireEvent('activate');
			}
		});		
	}
});
