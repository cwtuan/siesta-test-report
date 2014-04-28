Ext.define('Ecfa.view.queue.characteristics.field.GammaCorrection', {
	extend : 'Ext.form.FieldSet',
	alias : 'widget.charGammaCorrection',	
	mixins : ['Ecfa.view.queue.characteristics.Characteristic'],
	characteristicId : Ecfa.Spec.Extra.GAMMA_CORRECTION,	
	//feature : null,
	title : 'Render Options',//TODO i18n
	//layout: 'hbox',
	allowBlank : false,
	single : null, //single : characteristicsForm
	initComponent : function() {
		
		var me = this;

		console.log('Gamma Correction CREATION');
		//console.log(me.features);
		
		var settings = me.features['renderSettings'];
		console.log('correction',settings);
			
		me.items = [{
			itemId : 'correction',
			xtype : 'checkbox',
			boxLabel : 'Gamma Correction',
			checked : true
		}, {
			itemId : 'gammaValueIn',
			xtype : 'textfield',
			fieldLabel : 'Gamma Value In',
			value : '2.2',
			labelWidth : 120,
			labelAlign : 'right',
			regex : /[0-9.]/,
			regexText : Locale.getMsg('view.format.number.validator'),
			listeners : {
				blur : function(field){					
					//console.log(Ecfa.Format.floatRound(newValue, Ecfa.Const.FLOAT_ROUND));
					if(this.validate()){
						this.setValue(Ecfa.Format.floatRound(this.getValue(), Ecfa.Const.FLOAT_ROUND));
					}
					
				}
			}
			
			
		}, {
			itemId : 'gammaValueOut',
			xtype : 'textfield',
			fieldLabel : 'Gamma Value Out',
			value : '2.2',
			labelWidth : 120,
			labelAlign : 'right',
			regex : /[0-9.]/,
			regexText : Locale.getMsg('view.format.number.validator'),
			listeners : {
				blur : function(field){					
					if(this.validate()){
						this.setValue(Ecfa.Format.floatRound(this.getValue(), Ecfa.Const.FLOAT_ROUND));
					}
				}
			}
		}];

		me.callParent(arguments);
		
		Ext.each(settings, function(setting){
			var val = Ecfa.Format.floatRound(setting['value'], Ecfa.Const.FLOAT_ROUND);
			if(setting['name']== 'gammaValueIn'){				
				me.down('#gammaValueIn').setValue(val);
			}else if(setting['name']== 'gammaValueOut'){
				me.down('#gammaValueOut').setValue(val);
			}else{
				console.log('new item in rendersetting :', setting['name']);
			}
			
		});
		

	},

	getValue : function() {
		
		var value = '';		
		if(this.down('#correction').checked){
			value = 'gammaValueIn'+ Ecfa.Const.KV_SPLITTER +this.down('#gammaValueIn').getValue()
					+ Ecfa.Const.ITEM_SPLITTER 
					+ 'gammaValueOut'+ Ecfa.Const.KV_SPLITTER +this.down('#gammaValueOut').getValue();
		}else{
			value = false;
		}
		console.log('gamma correction', value);
		
		return value;
	}
	
});
