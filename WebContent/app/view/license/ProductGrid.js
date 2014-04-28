Ext.define('Ecfa.view.license.ProductGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.productGrid',
	requires : ['Ecfa.view.license.ProductForm','Ecfa.view.license.ProductPropertiesWin',	            
	            'Ecfa.view.license.action.CreateProductAction','Ecfa.view.license.action.EditProductAction','Ecfa.view.license.action.DeleteProductAction'],
	// border : false,
	autoscroll : true,
	layout : 'fit',	
	
	//edit in each row, and no delete function, so checkbox is unnecessary	
	/*selType : 'checkboxmodel',
	selModel : {		
		mode : 'SINGLE',
		showHeaderCheckbox :false,
		allowDeselect:true		
	},*/
	defaults : { labelWidth : 150, labelAlign : 'right' },

	

	initComponent : function() {
		var me = this;
		me.store = Ecfa.StoreUtil.getStore('allProducts');
		
//		me.tbar = [ new Ext.button.Button(new Ecfa.view.license.action.CreateProductAction({}))/*,
//		            new Ext.button.Button(new Ecfa.view.license.action.EditProductAction({
//		            	itemId : 'editButton',
//		            	panel : me
//		            }))*/];

		me.columns = [{
			xtype : 'componentcolumn',
			width : 25,
			renderer : function(value, metadata, record) {
			return {
				xtype : 'container',
				items : [ new Ext.button.Button(new Ecfa.view.license.action.EditProductAction({
	            	itemId : 'editButton',
	            	panel : me,
	            	record : record
	            }))]
			};
		 }
		}, {
			header : Locale.getMsg('view.product.name'),
			dataIndex : 'name',
			flex : 2
		},{
			header : Locale.getMsg('view.license.software'),
			dataIndex : 'animationSoftwareName',
			flex : 1,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
				var version = record.get('animationSoftwareVersion');				
				if(version){
					value = value +' (' + version + ')';
				}
				return value;
			}
		}, {
			header : Locale.getMsg('view.license.engine'),
			dataIndex : 'renderEngineName',
			flex : 1,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {				
				var version = record.get('renderEngineVersion');				
				if(version){
					value = value + ' (' + version + ')';
				}
				return value;
			}
		},{
			header : Locale.getMsg('view.common.state'),
			dataIndex : 'state',
			flex : 1,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
				return Ecfa.locale.Converter.getProductState(value);
			}
		},{
			header : Locale.getMsg('view.product.pluginSupport'),
			dataIndex : 'pluginSupport',
			flex : 1,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
				return Ecfa.Converter.getYesNo(value);
			}
		}],
		
		me.callParent(arguments);
		me.on({
			selectionchange : function(selectionModel, records, index) {
				//me.down('#editButton').validate(records.length);				
			},
			activate : function() {
				//console.log('product activate & refresh');
				me.getStore().load();
			}
			
		});
		
		Ecfa.event.Product.on({
			destroyed : function(tasks) {
				me.getStore().load();
			},
			created : function(tasks) {
				me.getStore().load();
			},
			updated : function(tasks) {
				me.getStore().load();
			}
			/*running : function(isRunning) {
				me.setLoading(isRunning);
			}*/
		});

	},

	doExpand : function() {
		var rightpanel = this.up('licenseView').down('#licensePoolGrid');

		if (rightpanel.collapsed) {
			rightpanel.expand();
		}
	},

	doCollapse : function() {
		console.log(doCollapse);
		var rightpanel = this.up('licenseView').down('#licensePoolGrid');

		if (!rightpanel.collapsed) {
			rightpanel.collapse();
		}
	}
});
