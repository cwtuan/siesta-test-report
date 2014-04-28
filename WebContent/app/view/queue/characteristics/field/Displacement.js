Ext.define('Ecfa.view.queue.characteristics.field.Displacement', {
	extend : 'Ext.form.Checkbox',
	alias : 'widget.charDisplacement',
	mixins : ['Ecfa.view.queue.characteristics.Characteristic'],
	characteristicId : Ecfa.Spec.Extra.DISPLACEMENT,
	boxLabel : 'Displacements',	
	columns : 2,
	vertical : true,
	labelWidth : 120,
	labelAlign : 'right',
	allowBlank : false,
	name : null, //**productCharSpec.name
	initComponent : function() {
		var me = this;
		me.inputValue = me.name;
		console.log('Displacement CREATION');
		//console.log(me.features);
		

		var settings = me.features['renderSettings'];
		console.log(settings);		
		if(settings!=null && settings.length>0){
			me.checked = true;
		}
				
		me.callParent(arguments);		
		
	}
});
