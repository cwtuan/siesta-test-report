Ext.define('Ecfa.view.queue.characteristics.field.Atmospherics', {
	extend : 'Ext.form.Checkbox',
	alias : 'widget.charAtmospherics',
	mixins : ['Ecfa.view.queue.characteristics.Characteristic'],
	characteristicId : Ecfa.Spec.Extra.ATMOSPHERICS,
	boxLabel : 'Atmospherics',	
	columns : 2,
	vertical : true,
	labelWidth : 120,
	labelAlign : 'right',
	allowBlank : false,
	name : null, //**productCharSpec.name
	initComponent : function() {
		var me = this;
		me.inputValue = me.name;
		console.log('Atmospherics CREATION');
		//console.log(me.features);
		

		var settings = me.features['renderSettings'];
		console.log(settings);		
		if(settings!=null && settings.length>0){
			me.checked = true;
		}
		
		
		me.callParent(arguments);		
		
	}
});
