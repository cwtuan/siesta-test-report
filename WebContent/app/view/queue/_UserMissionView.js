Ext.define('Ecfa.view.queue._UserMissionView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.userMissionView',	
	region : 'center',	
	border : false,
	autoscroll : true,
	requires : ['Ecfa.view.queue.UserMissionGrid','Ecfa.view.queue.FrameTabs', 'Ecfa.view.queue.FrameGrid'],
	initComponent : function() {
		var me = this;
		me.layout = 'border';
		
		me.items = [ {
			itemId : 'userMissionGrid',
			xtype : 'userMissionGrid',
			flex : 1
		},{
			itemId : 'frameTabs',
			xtype : 'frameTabs',
			flex : 1
		} ];

		me.callParent(arguments);		
		
		
		me.down('userMissionGrid').on({	
			
			/*click 'name' cell to retrieve frame list*/
			cellclick : function(grid, td, colIdx, record, tr, rowIndex, e, eOpts){
				
				var fieldName = grid.getHeaderAtIndex(colIdx).dataIndex;
				//console.log(fieldName);
				if(fieldName=='name'){ //click 'name'; pass 'oid' for frame list
					//console.log('click oid');					
					
					var tabs = me.down('frameTabs');				
					var tabItemId = record.data['oid'];
					var existTab = tabs.queryById(tabItemId);					
					
					if (existTab) {// already exist,activate it					
						tabs.setActiveTab(existTab);
					} else {// not exist, add it					
						tabs.add({
							title : record.get('name'), //record.get('oid') + "#" + record.get('name'),
							itemId : tabItemId,
							autoScroll : true,
							closable : true,	
							border : false,
							items : [ {
								xtype : 'frameGrid',
								store : Ecfa.StoreUtil.getStore('frameUser'), 
								missionId : tabItemId
							} ]
						});
						
						tabs.setActiveTab(tabs.items.length - 1);
					}
					
					if (tabs.collapsed) {
						tabs.expand();
					}
				}
			}
		});		
	}
});
