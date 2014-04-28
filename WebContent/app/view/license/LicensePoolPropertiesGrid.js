Ext.define('Ecfa.view.license.LicensePoolPropertiesGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.licensePoolPropertiesGrid',
	//store : 'resource.Pool',	
	title : Locale.getMsg('view.resource.poolGrid'),
	layout : 'fit',
	height : 300,
	border : true,
	totalLicense : null,
	summaryValue : null,
	requires : ['Ext.grid.feature.Summary'],//feature requires for build all-classes.js
	features: [{
        ftype: 'summary'
    }],
	
	    
	initComponent : function() {
		var me = this;		
		me.store = Ecfa.StoreUtil.getStore('pools');
		
		me.columns = [  {
			header : Locale.getMsg('view.common.name'), 
			dataIndex : 'name',
			flex : 1.0,
			summaryRenderer: function(value, summaryData, dataIndex) {
	            return Locale.getMsg('view.license.dedicatedNumbers'); 
	        }
		}, {
			header : Locale.getMsg('view.resource.pool.subscriber'),
			dataIndex : 'subscriber',
			flex : 1.0
		},{
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 1.0
		},{
			header : Locale.getMsg('view.license.dedicatedNums'),
			dataIndex : 'numbers',			
			flex : 0.7,
			xtype : 'componentcolumn',		
			renderer : function(value, meta, record) {
				//console.log(Ext.isDefined(value));
				console.log('poolproperties grid value',value);
				return 	{				
					xtype : 'numberfield',				
					minValue : 0,
					value : (value==null||value=='')?0 : value,					
					listeners : {
						blur : function(field){
							var val = field.getValue().valueOf();					
							//console.log(val);						
							record.set('numbers', val);						
						}
					}				
					
				};
			},
			summaryType: 'sum',		
			summaryRenderer: function(value, summaryData, dataIndex) {
				
				me.summaryValue = value;
				me.up('window').down('#licenseNumsValidator').validate();
				return value; 
	        }
		}];
		
		
		me.callParent(arguments);
		/*me.on({
			show : function(){
				console.log('ACTIVATE');
				me.getStore().load(); //initial data
			}
		});*/
		

		Ecfa.event.Pool.on({
			destroyed : function(tasks) {
				me.getStore().load();
			},
			created : function(tasks) {
				me.getStore().load();
			},
			updated : function(tasks) {
				me.getStore().load();
			},
			refresh : function(isRunning) {
				me.getStore().load();
			}
		});
		
		Ecfa.event.License.on({
			passPoolLicenseNums : function(passPoolLicenseNums){//click cell to pass poolLicenseNums
				//console.log(passPoolLicenseNums);
				
			}
		});
	},
	load : function(){
		this.getStore().load();
	}
});
