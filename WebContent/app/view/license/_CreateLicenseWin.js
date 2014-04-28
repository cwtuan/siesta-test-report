Ext.define('Ecfa.view.license._CreateLicenseWin', {
	extend : 'Ext.window.Window',
	alias : 'widget._createLicenseWin',
	width : 400,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.license.add'),
	observers : [], // TODO remove it if not necessary
	initComponent : function() {
		var me = this;	
		
		
		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			layout : 'anchor',
			defaults : {
				anchor : '100%'
			},
			defaultType : 'textfield',
			items : [ {
				fieldLabel : Locale.getMsg('view.license.name'),
				name : 'name',
				allowBlank : false
			},{
				itemId : 'openSourceRadios',
				fieldLabel : Locale.getMsg('view.license.openSource'),						
				xtype: 'radiogroup',			
	            defaults: {
	            	anchor: '100%',
	            	padding : '3 5 5 5',
	            	name : 'openSource'
	            },
	            layout: 'hbox',
	            items: [
	                {
	                    boxLabel  : Locale.getMsg('view.common.yes'),                    
	                    inputValue: 'true',
	                    checked : true
	                    
	                }, {
	                    boxLabel  : Locale.getMsg('view.common.no'),                    
	                    inputValue: 'false'
	                }
	            ],
	            setValue:function(value) {
	                var val = Ext.isObject(value) ? value : {type:value};
	                console.log(this);
	                Ext.form.RadioGroup.prototype.setValue.call(this, val);
	            }
			},{
				fieldLabel : Locale.getMsg('view.license.totalLicense'),
				name : 'totalLicense',
				xtype : 'numberfield',
				allowBlank : false
			}],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				formBind : true,
				type : 'submit',
				handler : function() {

					var params = this.up('form').getValues();					
					console.log(params);
					Ecfa.Restful.POST('rest/op/license/license', params, {
						success : function(jsonResp) {
							console.log(jsonResp);
							Ext.getCmp('notifybar').showSuccess(
									Locale.getMsg('view.license.add')+
									Locale.getMsg('view.common.success'), 
									5000);							
						},
						callback : function() {							
							me.close();
							Ecfa.event.License.fireEvent('updated', true);
						},
						failure : function(){
							console.log("fail");
							Ext.getCmp('notifybar').showError('err');
						}
					});
					
				
				}
			}, {
				text : Locale.getMsg('view.common.cancel'),
				handler : function() {
					me.close();
				}
			} ]
		} ];
		me.callParent();
	}
});
