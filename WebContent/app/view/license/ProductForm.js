Ext.define('Ecfa.view.license.ProductForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.productForm',
	//border : false,	
	layout : 'anchor',
	
	defaults : {
		anchor : '100%',
		labelAlign : 'right'
	},
	
	action : null, // from propertiedWin
	//store : 'license.License',
	bodyPadding : 10,
	bodyStyle : 'padding:10px 10px 10px 10px',
	defaultType : 'textfield',
	
	initComponent : function() {
		var me = this;	
		
		me.items = [ {	
			xtype: 'hidden',
			name : 'oid'
		},{			
			itemId : 'animationSoftwareCombo',
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.license.software'),
			name : 'animationSoftware',
			store : Ecfa.StoreUtil.getStore('softwareLicense'),
			queryMode : 'remote',
			editable : false,
			displayField : 'name',
			displayTpl: Ext.create('Ext.XTemplate',
						'<tpl for=".">',
							'{name}',
			        		'<tpl if="version != &quot;&quot;">',			        		
			        			' ({version})',
			        		'</tpl>',			        									
			        	'</tpl>'),			
			tpl: Ext.create('Ext.XTemplate',
						'<tpl for=".">',
							'<tpl if="version != &quot;&quot;">',
								'<div class="x-boundlist-item">{name} ({version})</div>',
							'</tpl>',							
							'<tpl if="version == &quot;&quot;">',
								'<div class="x-boundlist-item">{name}</div>',
							'</tpl>',							
	        			'</tpl>'),
			valueField : 'oid',
			allowBlank : false,
			listeners : {
				'select' : function(combo, records, eOpts){					
					//me.compositeProductName();
				}
			}
		},{			
			itemId : 'renderEngineCombo',
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.license.engine'),
			name : 'renderEngine',
			store : Ecfa.StoreUtil.getStore('engineLicense'),			
			queryMode : 'remote',
			editable : false,
			displayField : 'name',
			displayTpl: Ext.create('Ext.XTemplate',
					'<tpl for=".">',
						'{name}',
		        		'<tpl if="version != &quot;&quot;">',			        		
		        			' ({version})',
		        		'</tpl>',			        									
		        	'</tpl>'),			
		    tpl: Ext.create('Ext.XTemplate',
					'<tpl for=".">',
						'<tpl if="version != &quot;&quot;">',
							'<div class="x-boundlist-item">{name} ({version})</div>',
						'</tpl>',							
						'<tpl if="version == &quot;&quot;">',
							'<div class="x-boundlist-item">{name}</div>',
						'</tpl>',							
        			'</tpl>'),
			valueField : 'oid',
			listeners : {
				'select' : function(combo, records, eOpts){					
					//me.compositeProductName();
				}
			}
		},{
			itemId : 'productName',
			fieldLabel : Locale.getMsg('view.product.name'),
			name : 'name',
			allowBlank : false,
			validator : function(value){
				if(me.action=='CREATE'){
					if(Ecfa.StoreUtil.getStore('allProducts').findExact('name', value) !== -1){					
						return Locale.getMsg('view.product.msg.name.duplicate');
					}
				}else{
					if(Ecfa.StoreUtil.getStore('allProducts').findExact('name', value) !== -1
							&& me.getRecord().data['name']!=value){	
						
						return Locale.getMsg('view.product.msg.name.duplicate');
					}
				}
				
			
				return true;			
			}
		},{
			fieldLabel : Locale.getMsg('view.common.state'),
			name : 'state',
			xtype : 'combobox',
			queryMode : 'local',
			store : Ext.create('Ecfa.store.license.ProductState'),
			allowBlank : false,
			editable : false,
			displayField : 'name',
			valueField : 'value'
		},{
			fieldLabel : Locale.getMsg('view.product.pluginSupport'),
			name : 'pluginSupport',
			xtype : 'combobox',
			queryMode : 'local',
			store : Ext.create('Ecfa.store.license.ProductPluginSupport'),
			allowBlank : false,
			editable : false,
			displayField : 'name',
			valueField : 'value'
		}];

		
		me.buttons = [ {
			itemId : 'formSubmitBtn',
			text : Locale.getMsg('view.common.ok'),
			formBind : true,
			type : 'submit'
		}, {
			text : Locale.getMsg('view.common.cancel'),
			handler : function() {
				me.up('window').close();
			}
		} ];
		
		
		me.callParent();
		
		me.on({
			render : function(){
				//make sure combobox.getStore().load() before setValue() (loadRecord)
				me.down('#animationSoftwareCombo').getStore().load();
				me.down('#renderEngineCombo').getStore().load();
			}
		});
		
	},
	compositeProductName : function(){
		//if(this.down('#productName').getValue()==null || this.down('#productName').getValue()==''){		
			var software = (this.down('#animationSoftwareCombo').getRawValue())==null?'':this.down('#animationSoftwareCombo').getRawValue();
			var engine = (this.down('#renderEngineCombo').getRawValue())==null?'':this.down('#renderEngineCombo').getRawValue();
			if(engine!=''){
				this.down('#productName').setValue(software+':'+engine);
			}else{
				this.down('#productName').setValue(software);
			}
			
		//}
	}
});
