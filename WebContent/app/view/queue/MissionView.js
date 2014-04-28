Ext.define('Ecfa.view.queue.MissionView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.missionView',
	//store : 'queue.MissionByProject',
	
	region : 'center',
	border : false,
	autoscroll : true,
	requires : [ 'Ecfa.view.queue.MissionGrid','Ecfa.view.queue.MissionHistoryGrid',
	             'Ecfa.view.queue.UserMissionGrid', 'Ecfa.view.queue.UserMissionHistoryGrid',
	             'Ecfa.view.queue.MissionClassifyGrid',
	             'Ecfa.view.queue.FrameTabs','Ecfa.view.queue.FrameGrid', 
	             'Ecfa.view.queue.PreviewPanel','Ecfa.view.usage.UframeWin' ], 
	type : null,
	expanding : false,
	
	initComponent : function() {
		//console.log('123456');
		var me = this;
		//console.log('me.type========');
		me.layout = 'border';
		
		var items = [];
		//console.log('me.type========');
		//console.log(me.type);
		if(me.type==Ecfa.Const.ViewType.Mission.RUNNING){
			items.push({
				itemId : 'missionGrid',
				xtype : 'missionGrid',
				flex : 1
			});
		}else if(me.type==Ecfa.Const.ViewType.Mission.HISTORICAL){
			items.push({
				itemId : 'missionHistoryGrid',
				xtype : 'missionHistoryGrid',
				flex : 1
			});
		}else if(me.type==Ecfa.Const.ViewType.Mission.USER.RUNNING){
			items.push({
				itemId : 'userMissionGrid',
				xtype : 'userMissionGrid',
				flex : 1
			});
			
		}else if(me.type==Ecfa.Const.ViewType.Mission.USER.HISTORICAL){
			items.push({
				itemId : 'userMissionHistoryGrid',
				xtype : 'userMissionHistoryGrid',
				flex : 1
			});
		}else if(me.type==Ecfa.Const.ViewType.Mission.PEND){
			items.push({
				itemId : 'missionClassifyGrid',
				xtype : 'missionClassifyGrid',
				flex : 1
			});
		}
		
		items.push({
			itemId : 'frameTabs',
			xtype : 'frameTabs',
			flex : 1
		});
		
		me.items = items;
		
		

		me.callParent(arguments);
			
		
		me.on({
			activate : function(view){		
				//console.log('activate', view);
				//console.log('load', me.down('grid'));
				me.down('grid').fireEvent('activate');
				me.down('grid').load();
			},
			deactivate : function(view){
				//console.log('deactivate');				
				me.down('grid').fireEvent('deactivate');
			}
		}),
		
		me.down('frameTabs').on({
			tabchange : function( tabs, newCard, oldCard, eOpts ) {
				if (tabs.collapsed && !me.expanding) {
//					console.log('go expanddddd');
					tabs.expand();
				}
			},
			beforeexpand : function(){
//				console.log('beforeexpand');
				me.expanding = true;
			},
			expand : function(){
//				console.log('expand');
				me.expanding = false;
			},
			collapse : function(){
//				console.log('collapse');
				me.expanding = false;
			}
		}),
		
		me.down('grid').on({		
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
						
						if(me.expanding){
							console.log('expanding', me.expanding);
							var task = new Ext.util.DelayedTask(function(){
								tabs.setActiveTab(existTab);
							});							
							task.delay(500);					
						}else{
							tabs.setActiveTab(existTab);
						}
					} else {// not exist, add it
						
						var softDel = Ecfa.Util.isDateEarlier(
										record.data['timeStart'],
										record.data['projectLastCleanTime']);
						//console.log(softDel);
						// FIXME : FrameGrid store load event to PreviewPanel
						// FIXME : try to fix blank frame list (2013.9.5)
						var frameGrid = Ext.create('Ecfa.view.queue.FrameGrid', {
							//store : Ecfa.StoreUtil.getStore('frameProject'),
							store : Ext.create('Ecfa.store.queue.Frame'),
							missionId : tabItemId,
							softDel : softDel,
							projectLastCleanTime : record.data['projectLastCleanTime'],
							region : 'center',
							flex : 1
							//columnWidth : 0.7
						});						
						
						var preview	 = Ext.create('Ecfa.view.queue.PreviewPanel', {							
								missionId : tabItemId,
								frameTotal : frameTotal,
								softDel : softDel,
								region : 'east',
								width : 300
								//columnWidth : 0.3
							});
						
						
						
						
						frameGrid.getStore().on({
							load : function(store, records, successful, eOpts){
								var frameseqArr = [];
								var imagesPath = [];
								Ext.each(records, function(record){
									if(record.data && record.data.state=="DON"){
										frameseqArr.push(record.data.frameSeq);
										if(imagesPath.length==0 && record.data.images){											
											imagesPath = record.data.images;											
										}
										
									}else{
										frameseqArr.push(record.data.frameSeq*-1);
									}					
								});	
								//console.log('frameseqArr',frameseqArr);
								Ext.Array.sort(frameseqArr, function (a, b) {  
								    return Math.abs(a) - Math.abs(b);  //sort
								});  
								//console.log('frameseqArr',frameseqArr);
								preview.composeSource(frameseqArr, imagesPath);
								//console.log(preview.id);
							}
						});
						
						var items = [ frameGrid, preview ];

						if(me.expanding){
							console.log('expanding', me.expanding);
							var task = new Ext.util.DelayedTask(function(){
								tabs.add({
									title : record.get('name'), // record.get('oid') + "#" + record.get('name'),
									itemId : tabItemId,
									autoScroll : false,
									closable : true,
									border : false,							
									layout : 'border',
									items : items							
								});
								tabs.setActiveTab(tabs.items.length - 1);
							});
							
							task.delay(800);	
						
						}else{
							tabs.add({
								title : record.get('name'), // record.get('oid') + "#" + record.get('name'),
								itemId : tabItemId,
								autoScroll : false,
								closable : true,
								border : false,							
								layout : 'border',
								items : items							
							});
							tabs.setActiveTab(tabs.items.length - 1);
						}					
						

						
					}

					
				}
			}
		});		

	},
	reloadWholeParts : function(grid){
		//reload missionGrid */
		grid.load();
		// polling all frametabs as well (only activeTab)*/	
		if(this.down('#frameTabs').getActiveTab()!=null){//south part not open
			console.log('load Frame');
			//TODO??? make sure frame reload
			this.down('#frameTabs').getActiveTab().down('panel').load();
		}
	}
});
