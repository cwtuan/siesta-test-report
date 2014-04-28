Ext.define('Ecfa.view.queue.SubmitView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.submitView',
	// store : 'queue.Job',
	requires : [ 'Ecfa.view.queue.SubmitWizard'],
	region : 'center',
	layout : 'fit',
	//layout : 'anchor',
	//anchor: '70% 80%',
	border : false,
	
	initComponent : function() {
		var me = this;
		me.items = [ {
			itemId : 'submitWizard',
			xtype : 'submitWizard'
		} ];
		
		me.callParent(arguments);

		Ecfa.event.Submission.on({
			created : function(rec, op) {
				console.log(op.response.responseText);
				var jsonResp = Ext.decode(op.response.responseText);
				console.log(jsonResp);				
				
				if (jsonResp['success']) {					
					
					Ext.Msg.show({
						title : Locale.getMsg('view.common.success'),
						icon : Ext.Msg.QUESTION,
						msg : Locale.getMsg('view.common.success.submitSuccess'),
						buttonText : {
			                yes : Locale.getMsg('view.common.yes'), // go to Mission viewer							
							no : Locale.getMsg('view.submit.create'),	//create new submission						
			                cancel : Locale.getMsg('view.submit.stayhere') // stay here			                
			            },
			            buttons: Ext.Msg.YESNOCANCEL,
			            
			            fn : function(btn){
			            	console.log(btn);
			            	
			            	if(btn == 'yes'){
			            		console.log('yes : go to Mission viewer!');	
			            		console.log(me.down('#submitSetting').getValues());
			            		Ecfa.event.Mission.fireEvent('passProjectOid', me.down('#submitSetting').getValues()['project']);
			            		
			            		me.up('viewport').down('#mission').toggle(1,0);//press button
			            		me.up('viewport').determineActivePage('missionView', false, this);// turn page
			            		me.down('submitWizard').firstReset();
			            	
			            	}else if(btn == 'no'){
			            		console.log('no : create new submission');
			            		//me.down('submitWizard').first();
			            		me.down('submitWizard').firstReset();
			            	}else{
			            		console.log('cancel : stay here');
			            		//this.close();
			            	}							
						}
						
					});

					
				} else {
					Ext.create('Ecfa.ux.window.Notification', {
						title : Locale.getMsg('view.common.msg'),
						position : 't',
						iconCls : 'ux-notification-icon-error',
						slideInDuration : 800,
						slideBackDuration : 1500,
						autoCloseDelay : 3000,
						slideInAnimation : 'elasticIn',
						slideBackAnimation : 'elasticIn',
						html : Locale.getMsg('view.common.fail.submitFail')					
					}).show();
					
				}
			
			},
			
			fail : function(rec, op){
				Ext.create('Ecfa.ux.window.Notification', {
					title : Locale.getMsg('view.common.msg'),
					position : 't',
					iconCls : 'ux-notification-icon-error',
					slideInDuration : 800,
					slideBackDuration : 1500,
					autoCloseDelay : 3000,
					slideInAnimation : 'elasticIn',
					slideBackAnimation : 'elasticIn',
					html : Locale.getMsg('view.common.error')
				}).show();
			}
		});
	}
});
