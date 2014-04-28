Ext.define('Ecfa.view.license._LicenseForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget._licenseForm',
	//border : false,	
	//layout : 'fit',
	bodyStyle : 'padding:10px 10px 10px 10px',
	defaultType : 'textfield',
	//store : 'license.License',	
	model : 'license.License',
	initComponent : function() {
		var me = this;
		
		me.bbar = [{
			itemId : 'savebtn',
			formBind : true,
			text : Locale.getMsg('view.common.save'),
			width : 80,
			handler : function() {
				console.log('SAVE');
				me.submit();
				/*console.log(me);
				var record = me.getRecord();
			    console.log(record);
				me.getForm().updateRecord(record);
			    record.save();*/
				
				
				/*var value = me.getValues();
				
				var license = Ext.create('Ecfa.model.license.License');
				license.add(value);
				
				console.log(license);
				
				license.save({
					success : function(rec, op) {	
						console.log('success?!');
						console.log(rec);
						console.log(op);								 
						//Ecfa.event.Submission.fireEvent('created', rec, op);
					},
					
					failure : function(rec, op) {	
						console.log('failure!');
						console.log(rec);
						console.log(op);			
						//Ecfa.event.Submission.fireEvent('fail', rec, op);				
					}
				});*/
			}
		} ];
		
		me.defaults = {			
			//labelWidth : 120,
			labelAlign : 'right',
			margin : '3 5 5 5',
			disabledCls : 'customDisabledClass',
			anchor : '80%'
		};

		me.items = [ {
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
		}];

		me.callParent(arguments);

		
	},
	
	submit : function(){
		/*var form = this.getForm();
		console.log(form);*/
		var record = this.getForm().getRecord();
	    console.log(record);
		this.getForm().updateRecord(record);
	    record.save();
	}
});
