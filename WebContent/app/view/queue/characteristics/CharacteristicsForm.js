Ext.define('Ecfa.view.queue.characteristics.CharacteristicsForm', {
	extend : 'Ext.form.Panel',
	border : false,
	alias : 'widget.characteristicsForm',
	requires : ['Ecfa.view.queue.characteristics.field.Layer','Ecfa.view.queue.characteristics.field.Camera',
	            'Ecfa.view.queue.characteristics.field.SceneState','Ecfa.view.queue.characteristics.field.Atmospherics',
	            'Ecfa.view.queue.characteristics.field.VideoColorCheck','Ecfa.view.queue.characteristics.field.SuperBlack',
	            'Ecfa.view.queue.characteristics.field.RenderHidden','Ecfa.view.queue.characteristics.field.Force2Sided',
	            'Ecfa.view.queue.characteristics.field.Effects','Ecfa.view.queue.characteristics.field.Displacement',
	            'Ecfa.view.queue.characteristics.field.AreaLights',
	            'Ecfa.view.queue.characteristics.field.RenderFields','Ecfa.view.queue.characteristics.field.GammaCorrection'],
	constructor : function(config) {	
		var me = this;		
		me.callParent([ config ]);
	},	
	
	//compose field value to Characteristics format
	createCharacteristics : function() {
		console.log('createCharacteristics');
		var me = this;
		//console.log('characteristicsForm GETVALUES',me.getValues());
		console.log(me.items.items);
		var chars = [];
		Ext.each(me.items.items, function(field) {
			//console.log('field', field);
			//console.log(field.characteristicId);
			//console.log(field.value);
			if(field.characteristicId!=null && field.characteristicId!=''){
				//console.log('field', field);
				//console.log(field.name);
				//console.log(field.getName());
				var name = (field.name)? field.name : field.features.name; 
				var c = Ext.create('Ecfa.model.queue.MissionCharacteristic', {
					charSpecId : field.characteristicId,
					name : name,					
					value : field.getValue()//override in each component
				});
				chars.push(c.data);
			}
			
		});
		console.log(chars);
		return chars;
		
	},
	
	productSpecParser : function(specs){
		
		var extraFields = [];
		Ext.each(specs, function(spec) {
			var specId = spec['charSpecId'];
			Ext.each(Ecfa.Spec.Fields, function(field) {
				
				var obj = Ext.ClassManager.get(field);
				//console.log(obj.prototype.characteristicId);				
				if (specId === obj.prototype.characteristicId) {
					extraFields.push(Ext.ClassManager.instantiateByAlias(obj.prototype.alias,{
						name : spec.name,
						features : spec, //pass feature which get from analysis to each field component
						single : spec.singleValue
					}));
				
					return false;
				}
			});			

		});		
	
		return extraFields;
	}

});
