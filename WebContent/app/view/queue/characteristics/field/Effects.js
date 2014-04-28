Ext.define('Ecfa.view.queue.characteristics.field.Effects', {
	extend : 'Ext.form.Checkbox',
	alias : 'widget.charEffects',
	mixins : ['Ecfa.view.queue.characteristics.Characteristic'],
	characteristicId : Ecfa.Spec.Extra.EFFECTS,
	boxLabel : 'Effects',	
	columns : 2,
	vertical : true,
	labelWidth : 120,
	labelAlign : 'right',
	allowBlank : false,
	name : null, //**productCharSpec.name
	initComponent : function() {
		var me = this;
		me.inputValue = me.name;
		console.log('Effects CREATION');
		//console.log(me.features);
		

		var settings = me.features['renderSettings'];
		console.log(settings);		
		if(settings!=null && settings.length>0){
			me.checked = true;
		}
				
		me.callParent(arguments);		
		
	}
});
