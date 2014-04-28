Ext.define('Ecfa.view.queue.characteristics.field.Camera', {
	extend : 'Ext.form.CheckboxGroup',
	alias : 'widget.charCamera',	
	mixins : ['Ecfa.view.queue.characteristics.Characteristic'],
	characteristicId : Ecfa.Spec.Extra.CAMERA,	
	//feature : null,
	fieldLabel : 'Camera',//TODO i18n
	columns : 2,
	vertical : true,		
	labelWidth : 120,
	labelAlign : 'right',	
	allowBlank : false,
	single : null, //single : characteristicsForm
	initComponent : function() {
		
		var me = this;

		console.log('CAMERA CREATION');
		//console.log(me.features);
		if(me.single){
			me.fieldLabel = 'Camera ('+ Locale.getMsg('view.common.tick.single') +')';			
		}else{
			me.fieldLabel = 'Camera ('+ Locale.getMsg('view.common.tick.multiple') +')';
		}
		var settings = me.features['renderSettings'];
		console.log(settings);
		
		var items = [];
		Ext.Array.forEach(settings, function(setting){
			items.push({
				boxLabel : setting['name'],
				name : 'camera',
				inputValue : setting['name'],
				checked: (setting['value']==1)? true : false
			});
		});
		me.items = items;
		
//		me.items = [{
//			boxLabel : 'Front',
//			name : 'camera',
//			inputValue : 'front'
//		}, {
//			boxLabel : 'Persp',
//			name : 'camera',
//			inputValue : 'persp'
//		}, {
//			boxLabel : 'Side',
//			name : 'camera',
//			inputValue : 'side'
//		}, {
//			boxLabel : 'Top',
//			name : 'camera',
//			inputValue : 'top'
//		} ];

		me.callParent(arguments);
		console.log(me.validate());
		
//		me.on({
//			change : function(){
//				me.markInvalid('You need to select at least 1!');				
//			}
//		});
		
	},
	
//	validate : function(){
//		var me = this;
//		var newValue = me.lastValue;
//		var key = Ext.Object.getKeys(newValue)[0];
//		console.log(Ext.isArray(newValue[me.name]));
//		console.log(key);
//		console.log(newValue[key]);
//		
//		if(Ext.isArray(newValue[key])) {
//			//if(newValue[key].length)
//			console.log(newValue[key].length);
//			me.markInvalid('You can select only 1!');                  
//			console.log('You can select only 1!');
//			return false;
//        } else if(!newValue[key]){
//        	me.markInvalid('You need to select at least 1!');
//            console.log('You need to select at least 1!');
//            return false;
//        } else{
//        	//me.markInvalid('You can select only 1!');
//        	console.log('OK!');
//        	me.clearInvalid();
//        	return true;
//        }
//		
//	},
	getValue : function() {
		//FORMAT :  cameraB@@@1###cemeraA@@@0

		//pass all items, unchecked item needs to be disabled
		var me = this;
		
		//console.log('Camera',me.items.items);
		var value = '';		
		Ext.Array.forEach(me.items.items, function(option){
			
			var v = '0';			
			if(option.checked){
				v = '1';
			}
			
			var result = option.inputValue + Ecfa.Const.KV_SPLITTER + v ;			
			if(value==''){
				value = result ;
			}else{
				value += Ecfa.Const.ITEM_SPLITTER + result;
			}			 
		});
		//console.log('camera value', value);
		return value;
	}
	
});
