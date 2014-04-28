Ext.define('Ecfa.view.queue.action.MissionAction', {
	extend : 'Ecfa.action.Action',
	alias : 'widget.missionAction',
	icon : null,
	record : null,
	action : null,
	//panel : null, // TODO 要顯示notification bar 的panel
	admins : null,	
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = null;
		 // TODO defaultTooltip 在create action應為text
		config.eventType = Ecfa.event.Mission;

		/*console.log(config.admins);
		console.log('Session id: ');
		console.log(Ecfa.Session.getUser().id);
		
		console.log('isProjectAuth?');
		console.log(me.isProjectAuth(config.admins));
		console.log('isMissionOwner?');
		console.log(me.isMissionOwner(config.record));*/
		
		//user view皆可操作不需要透過project.admins來判定
		//console.log(config.admins);
		//if(config.admins!=null && !me.isProjectAuth(config.admins)&& !me.isMissionOwner(config.record)){			
		if(config.admins!=null){
			//console.log('is project owner' ,Ecfa.AuthValidator.isProjectAuth(config.admins));
			//console.log('is mission owner' ,Ecfa.AuthValidator.isMissionOwner(config.record));
			if(!Ecfa.AuthValidator.isProjectAuth(config.admins)&& !Ecfa.AuthValidator.isMissionOwner(config.record)){			
				config.disabled = true;
				config.tooltip = Locale.getMsg('view.mission.msg.action.noAuth');			
			}
		}
		
		me.callParent([ config ]);
	},	
	handler : function(){
		var me = this;
		console.log(me.record);		
		//var submissionId = this.record.get('submissionOid');
		//console.log(submissionId);
		
		
		//console.log(me.record.raw['submission']['num']);
		var action = (this.action==null)?'':me.action;
		/*if(action==Ecfa.Const.Mission.Action.RESUME){
			Ecfa.event.Mission.fireEvent('switch2Hold');
		}*/
		
		var missionId = me.record.get('oid');
		var num = me.record.get('num');
		
		
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
