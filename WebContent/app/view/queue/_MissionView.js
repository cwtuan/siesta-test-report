Ext.define('Ecfa.view.queue._MissionView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget._missionView',
	store : 'queue.MissionByProject',
	region : 'center',
	border : false,
	autoscroll : true,
	requires : [ 'Ecfa.view.queue.MissionGrid', 'Ecfa.view.queue.FrameTabs', 
	             'Ecfa.view.queue.FrameGrid', 'Ecfa.view.queue.PreviewPanel' ], 

	initComponent : function() {
		var me = this;
		me.layout = 'border';

		me.items = [ {
			itemId : 'missionGrid',
			xtype : 'missionGrid',
			flex : 1
		}, {
			itemId : 'frameTabs',
			xtype : 'frameTabs',
			flex : 1
		} ];

		me.callParent(arguments);
		// me.on({
		// activate : function() {
		// me.down('missionGrid').reloadFilter();
		// },
		// show : function(){
		// me.down('missionGrid').reloadFilter();
		// }
		// });

		me.down('missionGrid').on({
			/* click 'name' cell to retrieve frame list */
			cellclick : function(grid, td, colIdx, record, tr, rowIndex, e, eOpts) {

				var fieldName = grid.getHeaderAtIndex(colIdx).dataIndex;
				// console.log(fieldName);
				if (fieldName == 'name') { // click 'name'; pass 'oid' for frame list
					// console.log('click oid');

					var tabs = me.down('frameTabs');
					var tabItemId = record.data['oid'];
					var frameTotal = record.data['numTotal'];
					
					var existTab = tabs.queryById(tabItemId);

					if (existTab) {// already exist,activate it
						tabs.setActiveTab(existTab);
					} else {// not exist, add it
						// FIXME : try to fix blank frame list (2013.9.5)
						var frameGrid = Ext.create('Ecfa.view.queue.FrameGrid', {
							store : Ecfa.StoreUtil.getStore('frameProject'),
							missionId : tabItemId,
							columnWidth : 0.7
						});

						var preview = Ext.create('Ecfa.view.queue.PreviewPanel', {
							// store : Ecfa.StoreUtil.getStore('frameProject'),
							missionId : tabItemId,
							frameTotal : frameTotal,
							columnWidth : 0.3
						});
						var items = [ frameGrid, preview ];

						tabs.add({
							title : record.get('name'), // record.get('oid') + "#" + record.get('name'),
							itemId : tabItemId,
							autoScroll : true,
							closable : true,
							border : false,							
							layout : 'column',
							items : items
						});

						/*
						 * tabs.add({ title : record.get('name'), // record.get('oid') + "#" + record.get('name'), itemId : tabItemId, autoScroll : true,
						 * closable : true, border : false, items : [ { xtype : 'frameGrid', store : Ecfa.StoreUtil.getStore('frameProject'), missionId :
						 * tabItemId } ] });
						 */

						tabs.setActiveTab(tabs.items.length - 1);
					}

					if (tabs.collapsed) {
						tabs.expand();
					}
				}
			}
		});

		/*
		 * Ecfa.event.Mission.on({ frames : function(record){ console.log(record); console.log(record.data['oid']); } });
		 */

	}
});
