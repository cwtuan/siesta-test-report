Ext.define('Ecfa.view.license.LicenseGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.licenseGrid',
	// border : false,
	autoscroll : true,
	layout : 'fit',
	// store : 'license.Licenses',
	//selType : 'checkboxmodel',
	
	//selModel : { mode : 'SINGLE', showHeaderCheckbox :false, allowDeselect:true },
	 
	viewConfig : {
		preserveScrollOnRefresh : true,
		preserveSelectionOnRefresh : true
	},	
	initComponent : function() {
		var me = this;
		
		me.store = Ecfa.StoreUtil.getStore('allLicenses');

		me.tbar = [ new Ext.button.Button(
						new Ecfa.view.license.action.CreateLicenseAction({}))
					// [CREATE] licensePoolPropertiesGrid reload : licenseForm.opensource switch radio 
		];

		me.columns = [ {
			xtype : 'componentcolumn',
			width : 50,
			renderer : function(value, metadata, record) {
				var items = [];
				// [EDIT] licensePoolPropertiesGrid reload : editLicenseAction handler loadRecord
				items.push(new Ext.button.Button(new Ecfa.view.license.action.EditLicenseAction({
					itemId : 'editButton',
					panel : me,// for getSelectionModel count
					record : record
				})));

				items.push(new Ext.button.Button(new Ecfa.view.license.action.DeleteLicenseAction({
					itemId : 'deleteButton',
					panel : me
				})));

				return {
					xtype : 'container',
					items : items
				};
			}
		}, {
			header : Locale.getMsg('view.license.name'),
			dataIndex : 'name',
			flex : 2
		}, {
			header : Locale.getMsg('view.license.version'),
			dataIndex : 'version',
			flex : 1
		}, {
			header : Locale.getMsg('view.license.type'),
			dataIndex : 'type',
			flex : 1,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {
				return Ecfa.locale.Converter.getLicenseType(record.get('type'));
			}
		}, {
			header : Locale.getMsg('view.license.openSource'),
			dataIndex : 'openSource',
			flex : 1,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {
				//console.log(value);
				//return value;
				return Ecfa.locale.Converter.getTrueFalse(value);
			}
		}, {
			header : Locale.getMsg('view.license.limitedType'),
			dataIndex : 'limitedType',
			flex : 1,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {
				var type = '';
				if(value!=''){
					type = Locale.getMsg('view.license.limitedType.'+value.toLowerCase());
				}
					
				return type;
			}
		}, {
			header : Locale.getMsg('view.license.basicService'),
			dataIndex : 'basicService',
			flex : 1
		}, {
			header : Locale.getMsg('view.transfer.file.extension'),
			dataIndex : 'extension'
		}, {
			header : Locale.getMsg('view.license.totalLicense'),
			dataIndex : 'totalLicense',
			flex : 1,
			renderer : function(val, metadata, record) {
				// console.log(record.get('openSource'));
				if (record.get('openSource')) {
					return 'N/A';
				}
				return val;

			}
		}, {
			header : Locale.getMsg('view.license.nonDedicatedNums'),
			dataIndex : 'nonDedicatedNums',
			flex : 1,
			renderer : function(val, metadata, record) {
				// console.log(record.get('openSource'));
				if (record.get('openSource')) {
					return 'N/A';
				}
				return val;

			}
		}, {
			header : Locale.getMsg('view.license.dedicatedNums'),
			dataIndex : 'dedicatedNums',
			flex : 1,
			renderer : function(val, metadata, record) {

				if (record.get('openSource')) {
					return 'N/A';
				} else {
					metadata.style = 'background-color: #FFFFCC !important;cursor: pointer;';
					metadata.tdAttr = 'data-qtip="' + Locale.getMsg('view.license.dedicatedDetail') + '"';
				}
				return val;
			}
		} ];

		me.callParent(arguments);
		/*me.on({
			selectionchange : function(selectionModel, records, index) {
				// me.down('#editButton').validate(records.length);
				// me.down('#deleteButton').validate(records.length);

			}
		});*/

		Ecfa.event.License.on({
			destroyed : function(tasks) {
				me.getStore().load();
			},
			created : function(tasks) {
				me.getStore().load();// reload left panel
				var oid = tasks[0].target['oid'];// FIXME NO OID
				console.log('created');
				console.log(oid);
				me.up('licenseView').down('#licensePoolGrid').getStore().load({
					params : {
						oid : oid
					}
				}); // reload right panel
			},
			updated : function(tasks) {
				me.getStore().load();// reload left panel
				var oid = tasks[0].target['oid'];
				console.log('updated');
				console.log(oid);
				me.up('licenseView').down('#licensePoolGrid').getStore().load({
					params : {
						oid : oid
					}
				}); // reload right panel
			},

			running : function(isRunning) {
				me.setLoading(isRunning);
			}

		});

	}
});
