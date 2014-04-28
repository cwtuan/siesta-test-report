Ext.define('Ecfa.view.license.action.EditLicenseAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/edit_16x16.png',
	//text :  Locale.getMsg('view.common.edit'),
	getDisabledTooltip : function(recordCount) {
		var me = this;		
		var authDisabledTooltip = me.callParent([]); //OpAction getDisabledTooltip
		if(authDisabledTooltip != null) { //權限判斷
			console.log(authDisabledTooltip);
			return authDisabledTooltip;
		}
		
		/*if (recordCount==null || recordCount != 1){			
 		    return Locale.getMsg('view.edit.select'); 
		}*/
		return null;
	},	
		
	constructor : function(config) {
		var me = this;
		config.eventType = Ecfa.event.License;
		//config.tooltip = Locale.getMsg('view.common.edit');
		config.disabledTooltip = me.getDisabledTooltip(config.panel.getSelectionModel().getCount());
		config.validate = function(recordCount) {  // For outside usage			
			var disabledTooltip = me.getDisabledTooltip();
			this.setDisabled(disabledTooltip != null);
			this.setTooltip(disabledTooltip? disabledTooltip:'');			
		};
		me.callParent([ config ]);
	},
	
	handler : function(config) {
		console.log('Edit handler');
		var win = Ext.widget('licensePropertiesWin',{
			title : Locale.getMsg('view.license.edit'),
			action : 'EDIT'
		});
		
		var form = win.down('form');
		//console.log(config.panel.getSelectionModel().getSelection()[0]);
		//var selectedRecord = config.panel.getSelectionModel().getSelection()[0];
		//form.loadRecord(selectedRecord);
		var targetRecord =config.record;
		form.loadRecord(targetRecord);
		console.log('EDIT targetRecord',targetRecord);
		var poolLicenseNums = targetRecord.get('poolLicenseNums');
		
		
		
		//var store = form.down('licensePoolPropertiesGrid').getStore();
		var store = Ecfa.StoreUtil.getStore('pools');
		//console.log('store data',store);
		store.on({
			load : function(){
				console.log('af store data',store.data.items);
				console.log('af store getData',store.getData());
				Ext.each(store.getData(), function(data){
					console.log(data);
					var rec = store.findRecord('oid', data['oid']);
					var isOidExist = false;
					Ext.Object.each(poolLicenseNums,function(key, value){
						if(data['oid']==key){
							isOidExist = true;					
							rec.set('numbers', value);
							return false;
						}
					});
					
					if(isOidExist == false){				
						rec.set('numbers', 0);
					}
					
					//return false;
				});		
			}
		});	
		
		store.load();
		
	
		win.show();
	}

});
