Ext.define('Ecfa.view.queue.characteristics.field.Layer', {
	extend : 'Ext.form.CheckboxGroup',
	alias : 'widget.charLayer',
	mixins : ['Ecfa.view.queue.characteristics.Characteristic'],
	characteristicId : Ecfa.Spec.Extra.LAYER,	
	fieldLabel : 'Layer',//TODO i18n
	columns : 2,
	vertical : true,
	labelWidth : 120,
	labelAlign : 'right',
	allowBlank : false,
	initComponent : function() {
		var me = this;

		console.log('LAYER CREATION');
		//console.log(me.features);
		
		var settings = me.features['renderSettings'];
		//console.log(settings);
		
		var items = [];		
		Ext.Array.forEach(settings, function(setting){
			var name = setting['name'];
			if(name=='defaultRenderLayer'){
				name = 'masterLayer';
			}
			
			items.push({
				boxLabel : name,
				name : 'layer',
				inputValue : name,
				checked: (setting['value']==1)? true : false
			});
		});
		me.items = items;
		
		me.callParent(arguments);
		
		
	},
	
	getValue : function() {
		////FORMAT :  layerB@@@1###layerA@@@0
		//pass all items, for recognizing generate folder or not
		//XXX ( 2013/12/30 deprecate for movie maker) pass checked items
		
		var me = this;
		//console.log(me.getChecked());
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
		
//		Ext.Array.forEach(me.getChecked(), function(select){
//			if(value==''){
//				value = select.inputValue;
//			}else{
//				value += Ecfa.Const.ITEM_SPLITTER + select.inputValue;
//			}			 
//		});
		//console.log('layer value', value);
		return value;
	}
});
