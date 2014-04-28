Ext.define('Ecfa.view.queue.MissionUserView', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.missionUserView',
	//store : 'queue.MissionByProject',
	region : 'center',	
	border : false,
	autoscroll : true,
	//requires : ['Ecfa.view.queue.UserMissionView','Ecfa.view.queue.UserMissionHistoryGrid'],
	plain : false,
	initComponent : function() {
		var me = this;
		//me.layout = 'border';
		
		me.items = [{
			itemId : 'userMissionView',
			xtype : 'missionView',				
			title : Locale.getMsg('view.queue.menu.runningMission'),
			type : Ecfa.Const.ViewType.Mission.USER.RUNNING
		},{
			itemId : 'userMissionHistoryView',
			xtype : 'missionView',				
			title : Locale.getMsg('view.queue.menu.historyMission'),
			type : Ecfa.Const.ViewType.Mission.USER.HISTORICAL
		}];
		
		/*me.items = [ {
			xtype : 'userMissionView',
			title : Locale.getMsg('view.queue.menu.runningMission'),			
			flex : 1
		},{
			xtype : 'userMissionHistoryGrid',
			title : Locale.getMsg('view.queue.menu.historyMission'),
			flex : 1
		} ];*/

		me.callParent(arguments);
				
		me.on({
			show : function(){
				//console.log('SHOOOWWWW');
				//me.down('userMissionView').down('grid').load();
				//if(me.getActiveIndex()==0){
					me.getActiveTab().down('grid').load();
				/*}else if(me.getActiveIndex()==1){
					//console.log(me.getActiveTab());				
					me.getActiveTab().load();
				}*/
			},
			tabchange : function(){
				//console.log(me.getActiveIndex());
				//if(me.getActiveIndex()==0){
					me.getActiveTab().down('grid').load();
				/*}else if(me.getActiveIndex()==1){
								
					me.getActiveTab().load();
				}*/
				
				
			},
			activate : function(){	//from mission view	
				
				me.down('grid').fireEvent('activate');
				
			},
			deactivate : function(){ //from mission view
				console.log('mission user view : deactivate');				
				me.down('grid').fireEvent('deactivate');
			}
		});
		

		
	}
});
