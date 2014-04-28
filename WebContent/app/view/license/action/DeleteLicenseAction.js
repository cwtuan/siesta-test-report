Ext.define('Ecfa.view.license.action.DeleteLicenseAction', {
	extend : 'Ecfa.action.OpAction',	
	icon : 'css/images/delete_16x16.png',
	//text :  Locale.getMsg('view.common.delete'),	
	getDisabledTooltip : function(recordCount) {
		var me = this;
		var authDisabledTooltip = me.callParent([]);
		if(authDisabledTooltip != null){ //權限判斷		    
			return authDisabledTooltip;
		}
		
		return null;
	},	
	constructor : function(config) {
		var me = this;
		config.eventType = Ecfa.event.License;
		config.disabledTooltip = me.getDisabledTooltip(config.panel.getSelectionModel().getCount());
		
		me.callParent([ config ]);
	},
	
	handler : function(config) {
		var me = this;
		
		Ext.Msg.show({
			title : Locale.getMsg('view.common.information'),
			icon : Ext.Msg.QUESTION,
			msg : Locale.getMsg('view.common.delete.confirm'),
			buttonText : {
                yes : Locale.getMsg('view.common.yes'), // do action							
				no : Locale.getMsg('view.common.no')                
            },
            buttons: Ext.Msg.YESNO,
            
            fn : function(btn){
            	console.log(btn);
            	
            	if(btn == 'yes'){
            		var selectedRecord = config.panel.getSelectionModel().getSelection()[0];
            		console.log(selectedRecord.data['oid']);
            		Ecfa.event.License.fireEvent('running', true);
            		Ecfa.Restful.request({
            			url : 'rest/op/license/license/',
            			method : 'DELETE',
            			record : selectedRecord,
            			success : function(jsonResp) {
            				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.license.msg.delete.success'), 5000);
            				Ecfa.event.License.fireEvent('destroyed', jsonResp.tasks);
            				// TODO show message for failure subtask
            			},
            			failure : function(jsonResp) {				
            				Ext.getCmp('notifybar').showError(
            						Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.license.msg.delete.fail',selectedRecord.data['name']), jsonResp));
            						
            			},
            			callback : function() {
            				Ecfa.event.License.fireEvent('running', false);
            			}	
            			
            		});
            	
            	}else{
            		console.log('no, don\'t');	
            		
            	}						
			}
		});	
		

	}	

});
