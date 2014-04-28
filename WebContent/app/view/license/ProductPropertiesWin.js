Ext.define('Ecfa.view.license.ProductPropertiesWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.productPropertiesWin',
	width : 400,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.common.add')+Locale.getMsg('view.product'),
	action : null,
	initComponent : function() {
		var me = this;	
		
		me.items = [ {
			xtype : 'productForm',
			itemId : 'productForm',
			action : me.action
		} ];
		
		me.callParent();
		
		me.down('form').down('#formSubmitBtn').on({
			click : function(){
				console.log('click ok');
				me.setLoading(true);
				var params = me.down('form').getValues();
				if(me.action=='CREATE'){
					me.doCreate(params);
				}else if(me.action=='EDIT'){
					me.doEdit(params);
				}
			}
		});
	},
	
	doCreate : function(params){					
		console.log(params);
		var me = this;
		Ecfa.Restful.POST('rest/op/license/product', params, {
			success : function(jsonResp) {
				console.log(jsonResp);
				Ext.getCmp('notifybar').showSuccess(
						Locale.getMsg('view.product.msg.add.success'), 
						5000);							
			},
			callback : function() {							
				me.close();
				Ecfa.event.Product.fireEvent('updated', true);
			},
			failure : function(){
				console.log('fail');
				Ext.getCmp('notifybar').showError(
						Locale.getMsg('view.product.msg.add.fail'));
			}
		});
	},
	
	doEdit : function(params){
		console.log(params);
		var me = this;
		Ecfa.Restful.PUT('rest/op/license/product', params, {
			success : function(jsonResp) {
				console.log(jsonResp);
				Ext.getCmp('notifybar').showSuccess(
						Locale.getMsg('view.product.msg.edit.success'), 
						5000);							
			},
			callback : function() {							
				me.close();
				Ecfa.event.Product.fireEvent('updated', true);
			},
			failure : function(){
				console.log('fail');
				Ext.getCmp('notifybar').showError(
						Locale.getMsg('view.product.msg.edit.fail'));
			}
		});
		
	}
});
