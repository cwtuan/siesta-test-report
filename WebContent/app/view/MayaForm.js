Ext.define('Ecfa.view.queue.characteristics.MayaForm', {
	//extend : 'Ext.form.Panel',
	extend : 'Ecfa.view.queue.characteristics.CharacteristicsForm',
	alias : 'widget.mayaForm',
	defaultType : 'textfield',
	defaults : {
		anchor : '100%',
		labelWidth : 120,
		labelAlign : 'right',
		margin : '3 5 2 5'
	},
	layout : 'anchor',

	initComponent : function() {
		var me = this;
		var items = [];
		
		//Ecfa.Characteristic.getCustomFields();
		/*var m = Ecfa.Characteristic.getCharMap();
		//console.log('char map:'+m);
		
		console.log(m);
		var spec = Ecfa.Characteristic.getSpec('abc');
		console.log(spec);
		
		console.log(Ecfa.Characteristic.getCharMap());
		
		var spec = Ecfa.Characteristic.getSpec('efg');
		console.log(spec);
		console.log(Ecfa.Characteristic.getCharMap());*/
		
		
		items.push({
			xtype : 'charCamera'
		});
		items.push({
			xtype : 'charLayer'
		});
		console.log('various view items :');
		console.log(items);
		me.items = items;
		/*me.items = [ {
			fieldLabel : 'camera',
			characteristicId : '4d400fde-1e46-4a3c-a6bf-f6b4efd768aa',
			name : 'camera'			
			
		}, {
			fieldLabel : 'layer',
			characteristicId : 'fee28150-8df8-4b4b-b090-b1ed637f6958',
			name : 'layer'
			
		} ];*/
		
		me.callParent(arguments);
		
		//me.createCharacteristics();
	}
});
