Ext.define('Ecfa.view.license.action.EditProductAction', {
	extend : 'Ecfa.action.OpAction',
	icon : 'css/images/edit_16x16.png',
	//text :  Locale.getMsg('view.common.edit'),
	getDisabledTooltip : function( recordCount) {
		var me = this;		
		var authDisabledTooltip = me.callParent([]); //OpAction getDisabledTooltip
		if(authDisabledTooltip != null) { //權限判斷
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
			var disabledTooltip = me.getDisabledTooltip(recordCount);
			this.setDisabled(disabledTooltip != null);
			this.setTooltip(disabledTooltip? disabledTooltip:'');			
		};
		me.callParent([ config ]);
	},
	
	handler : function(config) {
		
		var win = Ext.widget('productPropertiesWin',{
			title : Locale.getMsg('view.product.edit'),
			action : 'EDIT'
		});
		var form = win.down('form');
		//console.log(config.panel.getSelectionModel().getSelection()[0]);
		//form.loadRecord(config.panel.getSelectionModel().getSelection()[0]);
		form.loadRecord(config.record);
		win.show();
		/*form.down('#animationSoftwareCombo').getStore().on({
			load : function(){
				console.log('!!!!');
				
			}
		});*/
		
	}

});
