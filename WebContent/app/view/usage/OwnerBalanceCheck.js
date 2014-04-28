Ext.define('Ecfa.view.usage.OwnerBalanceCheck', {
	extend : 'Ext.container.Container',
	alias : 'widget.ownerBalanceCheck',	
	layout : {
		type : 'hbox',
		pack : 'end'
	},
	style : '{color:#557FFF;}',
	owner : null,
	initComponent : function() {
		var me = this;

		me.items = [ {
			itemId : 'balanceLabel',
			xtype : 'label'
		}, {
			itemId : 'plusBtn',
			xtype : 'container',
			items : [ new Ext.button.Button(new Ecfa.view.usage.action.PointPlusAction({
				tooltip : Locale.getMsg('view.billing.pointplus')
			}))	]	
		}, {
			itemId : 'notifyBtn',
			xtype : 'button',
			hidden : true,			
			icon : 'css/images/email_16.png',
			tooltip : Locale.getMsg('view.billing.sendowner'),
			handler : function() {
				console.log('notify owner');
				Ecfa.Restful.request({
					url : 'rest/billing/notify',
					method : 'GET',
					params: {
						projectOwnerId: me.owner,
						userId : Ecfa.Session.getUser().id
					}, 
					success : function(jsonResp) {				
						Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.notify.msg.success', me.owner),3000); 
						
					},
					callback : function(){
						
					},
					failure : function(jsonResp) {				
						Ext.getCmp('notifybar').showError(
								Ecfa.locale.Converter.getErrorMsg(
										Locale.getMsg('view.notify.msg.fail', me.owner), jsonResp));
								
					}
				});
			}

		} ];
		
		me.callParent(arguments);
		
		me.on({
			afterrender : function(){
				//me.setText(Locale.getMsg('view.billing.balance')+': '+Ecfa.Session.getUser().balance);
				//style
			}
		});
		
		//console.log(me);		
	},
	
	getBalance : function(projectId, owner){
		//console.log('balance', projectId);
		var me = this;
		me.owner = owner; // for notify
		Ecfa.Restful.request({
			url : 'rest/billing/balance',
			method : 'GET',
			params: {
				projectId : projectId
			},  
			success : function(jsonResp) {
				//console.log('get');
				me.down('#plusBtn').setVisible(false);
				me.down('#notifyBtn').setVisible(false);
				var msg = '';
				//console.log(jsonResp['target']);
				var balance = jsonResp['target']['balance'];
				//console.log(jsonResp['target']['balance']);				
				var isPoolSubscriber = jsonResp['target']['poolSubscriber'];
				
				//dedicate pool
				if(isPoolSubscriber){
					var poolName = jsonResp['target']['poolName']; 
					if(owner == Ecfa.Session.getUser().id){
						msg = Locale.getMsg('view.billing.pool.self', poolName);
					}else{
						msg = Locale.getMsg('view.billing.pool.projectowner', poolName);						
					}
					
				}else{//deduct points									
					
					if(balance <= 0){
						//console.log(' balance <= 0 ');
						if(owner == Ecfa.Session.getUser().id){// owner submit, can plus directly
							msg = Locale.getMsg('view.billing.balance')+': '+balance;					
							
							msg += ', '	+ Locale.getMsg('view.billing.nopoints') ;						
							me.down('#plusBtn').setVisible(true);
							me.down('#notifyBtn').setVisible(false);
							
						}else{// not owner, notify owner
							msg = Locale.getMsg('view.billing.ownerbalance')+': '+balance;				
							
							msg += ', '	+ Locale.getMsg('view.billing.nopoints') ;
							me.down('#plusBtn').setVisible(false);
							me.down('#notifyBtn').setVisible(true);
							
						}
					}
				}
				
				me.down('#balanceLabel').setText(msg);
				me.setVisible(true);
				me.fireEvent('balance', balance, isPoolSubscriber);
				
			},
			failure : function(jsonResp) {
				me.down('#balanceLabel').setText('');
				me.setVisible(false);
//				Ext.getCmp('notifybar').showError(
//						Ecfa.locale.Converter.getErrorMsg(
//								Locale.getMsg('view.billing.error.balance'), jsonResp));
			}
		});
		
		
	}
});