Ext.define('Ecfa.view.queue.RenderSetting', {	
	extend : 'Ecfa.view.queue.characteristics.CharacteristicsForm',
	//extend : 'Ext.FormPanel',
	alias : 'widget.renderSetting',
	region : 'center',	
	style : 'margin-left:20px;margin-right:700px;margin-top:8px;',
	overflowY : 'auto',
	overflowX : 'auto',
	border : true,
	defaultType : 'textfield',
	defaults : {
		anchor : '100%',
		labelWidth : 120,
		labelAlign : 'right',
		margin : '3 5 2 5'
	},
	minWidth : 400,

	initComponent : function() {
		
		var me = this;
		me.title = Locale.getMsg('view.submit.rendersetting',3);// 'Ready to Submit (3/3)';
		
		me.bbar = [ '->', {
			itemId : 'cardPrev',
			text : Locale.getMsg('view.wizard.previous'),
			width : 80,
			handler : function() {
				this.up('#submitWizard').previous();
			}
		}, {
			itemId : 'cardNext',
			formBind : true,
			text : Locale.getMsg('view.wizard.next'),			
			width : 80,
			handler : function() {
				this.up('#submitWizard').next();
			}
		} ];
		
		//var items = [];
		
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
		
		me.callParent(arguments);
	
	}
	
	
	
	
});
