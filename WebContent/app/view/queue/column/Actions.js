Ext.define('Ecfa.view.queue.column.Actions', {
	extend : 'Ecfa.ux.grid.column.ComponentColumn',
	alias : 'widget.missionActions',
	header : Locale.getMsg('view.common.action'),
	tdCls : 'nopadding',//overrid.css
	margins : '0 0 0 0',		
	width : 50,
	renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
		var state = record.get('state');
		var items = [];
		var admins = this.up('gridpanel').admins;
		//this.up('gridpanel').getProjectAdmin();
		if(state == Ecfa.Const.Mission.State.ERR){//RETRY & CANCEL	
			//empty array 
			//http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
			items.length = 0;
			//console.log(items);
			items.push(new Ext.button.Button(Ext.widget('missionAction', {
				action : Ecfa.Const.Mission.Action.RETRY,
				icon : 'css/images/retry.png',
				record : record,
				admins : this.up('gridpanel').admins,
				tooltip : Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.RETRY)			
			})));
			
			items.push(new Ext.button.Button(Ext.widget('missionAction', {
				action : Ecfa.Const.Mission.Action.CANCEL,
				icon : 'css/images/cancel_16x16.png',
				record : record,
				admins : this.up('gridpanel').admins,
				tooltip : Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.CANCEL)			
			})));
			
			
		}else{ // PAUSE(RESUME) & RERUN & CANCEL				

			items.length = 0;
			//console.log(items);

			items.push(new Ext.button.Button(Ext.widget('missionAlertAction', {
				itemId : 'holdAction',
				action : Ecfa.Const.Mission.Action.HOLD,
				icon : 'css/images/stop_16x16.png',
				record : record,
				admins : this.up('gridpanel').admins,
				tooltip : Ecfa.locale.Converter.getMissionAction(Ext.util.Format.lowercase(Ecfa.Const.Mission.Action.HOLD)),				
				listeners : {
					click : function(btn, e, eOpts) {
						//console.log('click me');
						//this.up('gridpanel').showResumeIcon();

					}
				}
			})));

			items.push(new Ext.button.Button(Ext.widget('missionAction', {
				itemId : 'resumeAction',
				action : Ecfa.Const.Mission.Action.RESUME,
				icon : 'css/images/start_16x16.png',				
				record : record,
				admins : this.up('gridpanel').admins,
				tooltip : Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.RESUME),
				listeners : {
					click : function(btn, e, eOpts) {
						console.log('click resumeAction');
						this.up('gridpanel').showHoldIcon(this);
					}
				}

			})));

//			items.push(new Ext.button.Button(Ext.widget('missionAction', {
//				action : Ecfa.Const.Mission.Action.RERUN,
//				icon : 'css/images/rerun.png',
//				record : record,
//				admins : this.up('gridpanel').admins,
//				tooltip :  Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.RERUN)			
//			})));

			items.push(new Ext.button.Button(Ext.widget('missionAction', {
				action : Ecfa.Const.Mission.Action.CANCEL,
				icon : 'css/images/cancel_16x16.png',
				record : record,
				admins : this.up('gridpanel').admins,
				tooltip : Ecfa.locale.Converter.getMissionAction(Ecfa.Const.Mission.Action.CANCEL)			
			})));
			
			
			/* according to state to initial action component, after resresh the panel */
			if (record.get('state') == Ecfa.Const.Mission.State.HOLDING || record.get('state') == Ecfa.Const.Mission.State.PAUSE
					|| record.get('state') == Ecfa.Const.Mission.State.SYS_HOLDING || record.get('state')==Ecfa.Const.Mission.State.SYS_PAUSE) {
				// console.log('show Resume la');
				Ext.Array.forEach(items, function(action) {
					// console.log(action);
					if (action['action'] == Ecfa.Const.Mission.Action.HOLD) {
						action.setVisible(false);
					}

					if (action['action'] == Ecfa.Const.Mission.Action.RESUME) {
						action.setVisible(true);
						/*cannot be pressed before pause*/
						if(Ecfa.AuthValidator.isProjectAuth(admins) || Ecfa.AuthValidator.isMissionOwner(record)){
							if(record.get('state') == Ecfa.Const.Mission.State.HOLDING || record.get('state') == Ecfa.Const.Mission.State.SYS_HOLDING){ //holding : disable Resume
								action.setDisabled(true);
							}else{ //pause enable //consider auth							
								action.setDisabled(false);							
							}
						}
						
					}
				});
			} else {
				Ext.Array.forEach(items, function(action) {
					// console.log(action);
					if (action['action'] == Ecfa.Const.Mission.Action.RESUME) {
						action.setVisible(false);
					}

					if (action['action'] == Ecfa.Const.Mission.Action.HOLD) {
						action.setVisible(true);
					}
				});
			}
		}
		
		return {
			xtype : 'container',				
			items : items
		};
	
	},
	
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
		
	}

});
