Ext.define('Ecfa.view.queue.action.MissionAlertAction', {
	extend : 'Ecfa.action.Action',
	alias : 'widget.missionAlertAction',
	icon : null,
	record : null,
	action : null,	
	admins : null,	
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = null;
		 // TODO defaultTooltip 在create action應為text
		config.eventType = Ecfa.event.Mission;

//		console.log(config.admins);
//		console.log('Session id: ');
//		console.log(Ecfa.Session.getUser().id);
//		
//		console.log('isProjectAuth?');
//		console.log(Ecfa.AuthValidator.isProjectAuth(config.admins));
//		console.log('isMissionOwner?');
//		console.log(Ecfa.AuthValidator.isMissionOwner(config.record));
		
		//user view皆可操作不需要透過project.admins來判定
		if(config.admins!=null){
			if(!Ecfa.AuthValidator.isProjectAuth(config.admins)&& !Ecfa.AuthValidator.isMissionOwner(config.record)){
				config.disabled = true;
				config.tooltip = Locale.getMsg('view.mission.msg.action.noAuth');
				//config.disabledTooltip = '您非專案的【擁有人】或【管理者】，亦不是【任務建立者】，無法對此任務進行操作';
			}			
		}
		
		me.callParent([ config ]);		
	},
	
	/*initComponent : function(){
		var me = this;
		console.log(me.admins);
		console.log('Session id: ');
		console.log(Ecfa.Session.getUser().id);
		if(!me.isProjectAuth()&& !me.isMissionOwner()){			
			me.disabled = false;
			me.disabledTooltip = '您非專案的【擁有人】或【管理者】，亦不是【任務建立者】，無法對此任務進行操作';
		}
		
		me.callParent(arguments);
	},*/
	handler : function(){
		var me = this;
		console.log(me.record);
		
		//*check cookies*//
		var pauseAlert = Ext.util.Cookies.get('pauseAlert');
		console.log(pauseAlert);
		
		if(pauseAlert=='false'){
			console.log('show alert before action');
			//*show alert before action*//
			Ext.Msg.show({
				title : Locale.getMsg('view.common.information'),
				icon : Ext.Msg.QUESTION,
				msg : Locale.getMsg('view.msg.pause.confirm')+
				'<br/><input type="checkbox" id="noalter" />'+Locale.getMsg('view.msg.noalert'),
				buttonText : {
	                yes : Locale.getMsg('view.common.yes'), // do action							
					no : Locale.getMsg('view.common.no')                
	            },
	            buttons: Ext.Msg.YESNO,
	            
	            fn : function(btn){
	            	console.log(btn);
	            	
	            	if(btn == 'yes'){
	            		console.log('yes, PAUSE!');
	            		//console.log(Ext.get('noalter').getValue());
	            		//if (Ext.get('noalter').getValue() == 'on'){
	            		
	            		//http://www.sencha.com/forum/showthread.php?120934-MessageBox-with-a-checkbox
	            		if(Ext.fly('noalter').dom.checked === true){
	            			console.log('!!!!!check');
	            			Ext.util.Cookies.set('pauseAlert',true); //don't ask me again
	            			                                         //set false when signin 
	            													 //(other user login from same browser) 
	        			} else {
	        				console.log('!!!!uncheck');
	        			}	            		
	            		
	            		//me.doAction();
	            		Ecfa.event.Mission.fireEvent('switch2Resume',me);
	            		
	            		//var submissionId = me.record.get('submissionOid');
	        			//console.log(submissionId);
	        			console.log(me.action);
	        			
	        			//console.log(me.record.raw['submission']['num']);
	        			var action = (me.action==null)?'':me.action;
	        			
	        			var num = me.record.get('num');
	        			//var param = {"missionOid" : me.record.get('oid'), "action" : action };
	        			var missionId = me.record.get('oid');
	    				
	        			Ecfa.Restful.request({
	        				url : 'rest/queue/action',
	        				method : 'PUT',
	        				params: {
	        					missionOid: missionId,
	        					action : action
	        				}, 
	        				success : function(jsonResp) {
	        					
	        					Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.job.action.msg.success.'+action, num),3000); 
	        					
	        				},
	        				callback : function(){
	        					Ecfa.event.Mission.fireEvent('reload', true);
	        				},
	        				failure : function(jsonResp) {				
	        					Ext.getCmp('notifybar').showError(
	        							Ecfa.locale.Converter.getErrorMsg(
	        									Locale.getMsg('view.job.action.msg.fail.'+action, num), jsonResp));
	        							
	        				}
	        			});
	            	
	            	}else{
	            		console.log('no, don\'t');	
	            		
	            	}						
				}
			});
		}else{
			console.log('no alert, act directly');
			// no alert, act directly
			//console.log(me);
			//me.doAction();
		
			
			console.log(me.action);			
			var action = (me.action==null)?'':me.action;
			var num = me.record.get('num');
			var missionId = me.record.get('oid');
				
			Ecfa.Restful.request({
				url : 'rest/queue/action',
				method : 'PUT',
				params: {
					missionOid: missionId,
					action : action
				}, 
				success : function(jsonResp) {
					
					Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.job.action.msg.success.'+action, num),3000); 
					
				},
				callback : function(){
					Ecfa.event.Mission.fireEvent('reload', true);
				},
				failure : function(jsonResp) {				
					Ext.getCmp('notifybar').showError(
							Ecfa.locale.Converter.getErrorMsg(
									Locale.getMsg('view.job.action.msg.fail.'+action, num), jsonResp));
							
				}
			});
		}
		
	},
	
	doAction : function(){
		var me = this;
	
		var action = (me.action==null)?'':me.action;
		var num = me.record.get('num');
		//var param = {"missionOid" : me.record.get('oid'), "action" : action };
		var missionId = me.record.get('oid');
		Ecfa.Restful.request({
			url : 'rest/queue/action',
			method : 'PUT',
			params: {
				missionOid: missionId,
				action : action
			}, 
			success : function(jsonResp) {
				
				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.job.action.msg.success.'+action, num),3000); 
				
			},
			callback : function(){
				Ecfa.event.Mission.fireEvent('reload', true);
			},
			failure : function(jsonResp) {				
				Ext.getCmp('notifybar').showError(
						Ecfa.locale.Converter.getErrorMsg(
								Locale.getMsg('view.job.action.msg.fail.'+action, num), jsonResp));
						
			}
		});
	}
	
	

});
