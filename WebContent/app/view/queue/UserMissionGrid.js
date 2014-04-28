Ext.define('Ecfa.view.queue.UserMissionGrid', {
	extend : 'Ecfa.view.common.ColumnsGrid',
	alias : 'widget.userMissionGrid',
	store : 'queue.MissionByUser',
	admins : null,
	border : false,
	region : 'center',
	layout : 'fit',
	
	viewConfig : {
		preserveScrollOnRefresh : true,
		getRowClass : function(record, rowIndex, rowParams, store) {
			// var s = record.get('state');
			// return 'state-' + s;
			return 'state';
		}
	},
//	requires : [ 'Ecfa.view.queue.trigger.DependencyTrigger', 
//	             'Ecfa.view.queue.action.MissionAction',
//	             'Ecfa.view.queue.action.MissionAlertAction'],

	columns : [ {
		header : Locale.getMsg('view.queue.project.title'),
		dataIndex : 'projectName',
		flex : 1.5
	},{
		header : Locale.getMsg('view.common.id'),
		dataIndex : 'num',
		flex : 0.5		
	},{
		xtype : 'missionName',
		flex : 1.5
	},{ 
		xtype : 'missionProduct'
	}, {
		xtype : 'missionScene',
		flex : 2

	}, {
		header : Locale.getMsg('view.job.frameRange'),
		dataIndex : 'frameFirst',// frameFirst+'-'+frameLast
		flex : 1.5,
		renderer : function(val, metadata, record) {
			val = record.get('frameFirst') + '-' + record.get('frameLast');
			return val;
		}
	}, {
		header : Locale.getMsg('view.job.isconvertanimate'),
		flex : 1,
		dataIndex : 'convertVideo', 
		renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {				
			return Ecfa.locale.Converter.getTrueFalse(value);
		}
	}, {
		header : Locale.getMsg('view.job.timeCreate'),
		flex : 1.5,
		dataIndex : 'timeCreation',
		renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
			if (value != 0) {
				return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
			}
			return '';
		}
	}, {
		header : Locale.getMsg('view.job.timeStart'),
		flex : 1.5,
		dataIndex : 'timeStart',
		renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {
			
			if (value != 0) {
				return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
			}
			return '';
		}
	}, {
		xtype : 'missionState',
		flex : 1
	},{
		header : Locale.getMsg('view.job.dependency'),
		flex : 1.5,
		dataIndex : 'dependencyName'
	}, {
		header : Locale.getMsg('view.job.priority'),
		flex : 1.5,
		dataIndex : 'priority', 
		renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {				
			return Ecfa.locale.Converter.getJobPriority(value);
		}
	}, {
		header : Locale.getMsg('view.queue.count.pend'),
		dataIndex : 'numQueueing',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.run'),
		dataIndex : 'numRunning',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.fail'),
		dataIndex : 'numFail',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.done'),
		dataIndex : 'numDone',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.total'),
		dataIndex : 'numTotal',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.progress'),
		xtype : 'componentcolumn',
		dataIndex : 'progress',
		tdCls : 'narrow',
		flex : 1.5,
		renderer : function(value, meta, record) {

			var progress = record.get('progress');
			return {
				xtype : 'progressbar',
				height : 17,
				// margin : '0 0 0 0',
				value : progress,
				text : '(' + Math.floor(progress * 100) + ' % '+ Locale.getMsg('view.job.state.don')+')'
			};
		}

	},{
		xtype : 'missionActions',
		width : 50
	}
//	, {
//
//		header : Locale.getMsg('view.common.action'),
//		itemId : 'actionColumn',
//		xtype : 'componentcolumn',
//		tdCls : 'nopadding',//overrid.css
//		margins : '0 0 0 0',		
//		width : 50,
//		renderer : function(value, m, record) {
//
//			//this.up('gridpanel').getProjectAdmin();
//			//console.log(this.up('gridpanel').admins);
//			var state = record.get('state');
//			var items = [];
//			
//			
//			if(state == Ecfa.Const.Mission.State.ERR){//RETRY & CANCEL	
//				//empty array 
//				//http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
//				items.length = 0;
//				//console.log(items);
//				items.push(new Ext.button.Button(Ext.widget('missionAction', {
//					action : Ecfa.Const.Mission.Action.RETRY,
//					icon : 'css/images/retry.png',
//					record : record,
//					admins : this.up('gridpanel').admins,
//					tooltip : Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.RETRY)			
//				})));
//				
//				items.push(new Ext.button.Button(Ext.widget('missionAction', {
//					action : Ecfa.Const.Mission.Action.CANCEL,
//					icon : 'css/images/cancel_16x16.png',
//					record : record,
//					admins : this.up('gridpanel').admins,
//					tooltip : Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.CANCEL)			
//				})));
//				
//				
//			}else{ // PAUSE(RESUME) & RERUN & CANCEL	
//				items.length = 0;
//				items.push(new Ext.button.Button(Ext.widget('missionAlertAction', {
//					itemId : 'holdAction',
//					action : Ecfa.Const.Mission.Action.HOLD,
//					icon : 'css/images/stop_16x16.png',
//					record : record,
//					//admins : this.up('gridpanel').admins,
//					tooltip : Ecfa.locale.Converter.getMissionAction(Ext.util.Format.lowercase(Ecfa.Const.Mission.Action.HOLD)),				
//					listeners : {
//						click : function(btn, e, eOpts) {
//							console.log('click me');
//							this.up('gridpanel').showResumeIcon();
//
//						}
//					}
//				})));
//
//				items.push(new Ext.button.Button(Ext.widget('missionAction', {
//					itemId : 'resumeAction',
//					action : Ecfa.Const.Mission.Action.RESUME,
//					icon : 'css/images/start_16x16.png',				
//					record : record,
//					//admins : this.up('gridpanel').admins,
//					tooltip : Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.RESUME),
//					listeners : {
//						click : function(btn, e, eOpts) {
//							console.log('click me');
//							this.up('gridpanel').showHoldIcon();
//						}
//					}
//
//				})));
//
////				items.push(new Ext.button.Button(Ext.widget('missionAction', {
////					action : Ecfa.Const.Mission.Action.RERUN,
////					icon : 'css/images/rerun.png',
////					record : record,
////					//admins : this.up('gridpanel').admins,
////					tooltip :  Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.RERUN)			
////				})));
//
//				items.push(new Ext.button.Button(Ext.widget('missionAction', {
//					action : Ecfa.Const.Mission.Action.CANCEL,
//					icon : 'css/images/cancel_16x16.png',
//					record : record,
//					//admins : this.up('gridpanel').admins,
//					tooltip : Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.CANCEL)			
//				})));
//
//				
//				/* according to state to initial action component, after resresh the panel */
//				if (record.get('state') == Ecfa.Const.Mission.State.HOLDING || record.get('state') == Ecfa.Const.Mission.State.PAUSE) {
//					// console.log('show Resume la');
//					Ext.Array.forEach(items, function(action) {
//						// console.log(action);
//						if (action['action'] == Ecfa.Const.Mission.Action.HOLD) {
//							action.setVisible(false);
//						}
//
//						if (action['action'] == Ecfa.Const.Mission.Action.RESUME) {
//							action.setVisible(true);
//							/*cannot be pressed before pause*/
//							if(record.get('state') == Ecfa.Const.Mission.State.HOLDING){ //holding disable
//								action.setDisabled(true);
//							}else{ //pause enable
//								action.setDisabled(false);
//							}
//						}
//					});
//				} else {
//					Ext.Array.forEach(items, function(action) {
//						// console.log(action);
//						if (action['action'] == Ecfa.Const.Mission.Action.RESUME) {
//							action.setVisible(false);
//						}
//
//						if (action['action'] == Ecfa.Const.Mission.Action.HOLD) {
//							action.setVisible(true);
//						}
//					});
//				}
//			}
//			
//
//			return {
//				xtype : 'container',				
//				items : items
//			};
//		}
//	}
],

	initComponent : function() {
		var me = this;
		
		var updateTask = {
			run : function() {
				//me.reloadWholeParts();
				me.up('missionView').reloadWholeParts(me);
			},
			interval : Ecfa.Config.TASK_UPDATING_PERIOD
		};
			
 		me.dockedItems = [{
			 xtype: 'toolbar',
             dock: 'top',
             items: [{
     			itemId : 'refresh',
    			tooltip : Locale.getMsg('view.common.refresh'),
    			icon : 'css/images/refresh.png',
    			handler : function() {
    				//me.reloadWholeParts();
    				me.up('missionView').reloadWholeParts(me);
    			}
    		}, '-', {
    			itemId : 'polling',
    			text : Locale.getMsg('view.queue.menu.polling'),
    			enableToggle : true,
    			toggleHandler : function(me, pressed, eOpts) {
    				if (pressed) {    					
    					Ext.TaskManager.start(updateTask);
    				} else {    					
    					Ext.TaskManager.stop(updateTask);
    				}
    			}
    		}]
		}];	
 		
 		
		me.callParent(arguments);
		
		me.on({
			activate : function(){
				if(me.down('#polling').pressed){
					Ext.TaskManager.start(updateTask);
				}
			},
			deactivate : function(){
				console.log('user view : get deactivate delegate');
				Ext.TaskManager.stop(updateTask);
			}
		});
	
		

	},

	load : function() {
		
		this.getStore().load({
			params :  {
				userId : Ecfa.Session.getUser().id,
				filter : 'running'
			}
		});

	},
	showResumeIcon : function() {
		console.log('showResumeIcon');
		this.down('#resumeAction').setVisible(true);
		this.down('#holdAction').setVisible(false);
	},

	showHoldIcon : function() {
		console.log('showHoldIcon');
		this.down('#resumeAction').setVisible(false);
		this.down('#holdAction').setVisible(true);
	}/*,
	
	reloadWholeParts : function(){
		//reload userMissionGrid
		this.load();
		//polling all frametabs as well (only activeTab)	
		if(this.up('userMissionView').down('#frameTabs').getActiveTab()!=null){//south part not open
			this.up('userMissionView').down('#frameTabs').getActiveTab().down('panel').load();
		}
	}*/
});
