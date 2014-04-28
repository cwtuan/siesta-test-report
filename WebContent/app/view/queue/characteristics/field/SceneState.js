Ext.define('Ecfa.view.queue.characteristics.field.SceneState', {
	extend : 'Ext.form.CheckboxGroup',
	alias : 'widget.charSceneState',	
	mixins : ['Ecfa.view.queue.characteristics.Characteristic'],
	characteristicId : Ecfa.Spec.Extra.SCENE_STATE,	
	//feature : null,
	fieldLabel : 'Scene State',//TODO i18n
	columns : 2,
	vertical : true,		
	labelWidth : 120,
	labelAlign : 'right',	
	allowBlank : true,
	single : null, //single : characteristicsForm
	initComponent : function() {
		
		var me = this;

		console.log('SceneState CREATION');
		//console.log(me.features);
		if(me.single){
			me.fieldLabel = 'Scene State ('+ Locale.getMsg('view.common.tick.single') +')';			
		}else{
			me.fieldLabel = 'Scene State ('+ Locale.getMsg('view.common.tick.multiple') +')';
		}
		var settings = me.features['renderSettings'];
		console.log(settings);
		
		var items = [];
		Ext.Array.forEach(settings, function(setting){
			items.push({
				boxLabel : setting['name'],
				name : (me.name==null)? 'sceneState' : me.name,
				inputValue : setting['name'],
				checked: (setting['value']==1)? true : false
			});
		});
		me.items = items;
		
		me.callParent(arguments);
		console.log(me.validate());
	},

	getValue : function() {
		//FORMAT :  layerA

		var me = this;
		
		//console.log('Camera',me.items.items);
		var value = '';		
		Ext.Array.forEach(me.items.items, function(option){						
			if(option.checked){
				value = option.inputValue;
			}
				 
		});
		console.log('scene state value', value);
		return value;
	}
	
});
