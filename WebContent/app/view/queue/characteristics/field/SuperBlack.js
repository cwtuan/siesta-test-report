Ext.define('Ecfa.view.queue.characteristics.field.SuperBlack', {
	extend : 'Ext.form.Checkbox',
	alias : 'widget.charSuperBlack',
	mixins : ['Ecfa.view.queue.characteristics.Characteristic'],
	characteristicId : Ecfa.Spec.Extra.SUPER_BLACK,
	boxLabel : 'Super Black',	
	columns : 2,
	vertical : true,
	labelWidth : 120,
	labelAlign : 'right',
	allowBlank : false,
	name : null, //**productCharSpec.name
	initComponent : function() {
		var me = this;
		me.inputValue = me.name;
		console.log('Super Black CREATION');
		//console.log(me.features);
		

		var settings = me.features['renderSettings'];
		console.log(settings);		
		if(settings!=null && settings.length>0){
			me.checked = true;
		}
				
		me.callParent(arguments);		
		
	}
});
