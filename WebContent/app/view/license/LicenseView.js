Ext.define('Ecfa.view.license.LicenseView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.licenseView',	
	region : 'center',	
	border : false,
	autoscroll : true,
	requires : ['Ecfa.view.license.LicenseGrid','Ecfa.view.license.LicenseForm',
	            'Ecfa.view.license.LicensePropertiesWin','Ecfa.view.license.LicensePoolGrid', 'Ecfa.view.license.LicensePoolPropertiesGrid',	            
	            'Ecfa.view.license.action.CreateLicenseAction','Ecfa.view.license.action.EditLicenseAction','Ecfa.view.license.action.DeleteLicenseAction'
	            ],
	layout : 'border',	
	
	initComponent : function() {
		var me = this;
		
				
		me.items = [ {
			itemId : 'licenseGrid',
			title : Locale.getMsg('view.license.grid.licenses'),
			xtype : 'licenseGrid',			
			region : 'center',			
			flex : 0.7
		},{
			itemId : 'licensePoolGrid',			
			title : Locale.getMsg('view.license.grid.dedicated'),
			xtype : 'licensePoolGrid',
			region : 'east',
			split : true,
			collapsible : true,
			//collapsed : true,			
			flex : 0.3
			
		}];

		me.callParent(arguments);
		me.on({			
			activate : function(){
				//console.log('license activate & refresh');
				me.down('#licenseGrid').getStore().load();
				
			},
			show : function(){				
				//me.refreshLicenseGrid();
			}
		});		
		
		
		me.down('#licenseGrid').on({
			/*cellclick : function(grid, td, colIdx, record, tr, rowIndex, e, eOpts){
				
				//var fieldName = grid.getHeaderAtIndex(colIdx).dataIndex;				
				//fieldName=='dedicatedNums' && 
				if(record.get('openSource')==false){					
					
					//click 'dedicatedNums'; pass 'oid' for LicensePoolGrid 
													
					//var poolLicenseNums = record.data['poolLicenseNums'];
					//console.log(poolLicenseNums);					
					me.down('#licensePoolGrid').getStore().load({
						params:{
							oid : record.get('oid')
						}
					});									
				}else{
					
					me.down('#licensePoolGrid').getView().emptyText = '<div align="center">' + Locale.getMsg('view.license.msg.opensource.nodedicated') + '</div>';;
					me.down('#licensePoolGrid').getStore().removeAll();
					
				}
			},	*/
		
			selectionchange : function( grid, selected, eOpts){
				console.log('selectionchange');
				if(selected[0] && selected[0].data['openSource']==false){
					me.down('#licensePoolGrid').getView().emptyText = '<div align="center">' + Locale.getMsg('view.common.noRecords') + '</div>';
					me.refreshLicensePoolGrid(selected);
				}else{
					
					me.down('#licensePoolGrid').getView().emptyText = '<div align="center">' + Locale.getMsg('view.license.msg.opensource.nodedicated') + '</div>';
					me.down('#licensePoolGrid').getStore().removeAll();
					
				}
				
				//re-select row after grid reload
				//pass selected and get oid to refresh right panel
			}
			
		});		
		
	},
	
	refreshLicenseGrid : function(){
		this.down('#licenseGrid').getStore().load();
	},
	
	refreshLicensePoolGrid : function(selected){		
		
		var oid = selected[0].data['oid'];		
		this.down('#licensePoolGrid').getStore().load({
			params:{
				oid : oid
			}
		});		
	},
	
	
	
	doExpand : function() {
		var rightpanel = this.down('#licensePoolGrid');

		if (rightpanel.collapsed) {
			rightpanel.expand();
		}
	},

	doCollapse : function() {
		var rightpanel = this.down('#licensePoolGrid');

		if (!rightpanel.collapsed) {
			rightpanel.collapse();
		}
	}
});
