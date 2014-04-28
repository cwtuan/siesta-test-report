Ext.define('Ecfa.controller.Resource', {
	extend : 'Ext.app.Controller',
	stores : [ 'resource.Pool', 'resource.Render', 'resource.PoolLicense', 'resource.PoolInfo' ],
	models : [ 'resource.Pool', 'resource.Render', 'resource.PoolLicense' ],
	views : [ 'resource.ResourceView' ],
	refs : [ {
		ref : 'resourceView',
		selector : 'resourceView'
	}, {
		ref : 'poolGrid',
		selector : 'poolGrid'
	}, {
		ref : 'poolLicenseForm',
		selector : 'poolLicenseForm'
	}, {
		ref : 'poolLicenseGrid',
		selector : 'poolLicenseGrid'
	}, {
		ref : 'poolRenderForm',
		selector : 'poolRenderForm'
	}, {
		ref : 'poolRenderGrid',
		selector : 'poolRenderGrid'
	}, {
		ref : 'poolSetting',
		selector : 'poolSetting'
	}, {
		ref : 'selectUserGrid',
		selector : 'selectUserGrid'
	} ],

	init : function() {
		var me = this;

		me.control({
			'resourceView' : { // Reload poolLicenseGrid by switching pages
				activate : function(panel, eOpts) {
					if (me.getPoolGrid().getSelectionModel().getSelection().length != 0) {
						me.getPoolLicenseGrid().loadAllLicenseByClone(); // Reload License
						me.getPoolLicenseGrid().load(me.getPoolRenderGrid().poolOid); // Reload poolLicense number
					}
				}
			},
			'poolGrid' : {
				cellclick : function(panel, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					if (cellIndex === 2) { // Click pool name cell
						///me.getPoolGrid().getSelectionModel().select(rowIndex, true);
						me.readPoolPanel(record, rowIndex);
					}
				},
				selectionchange : function(selectionModel, records, index) {
					if (records[0]) {
						if (selectionModel.getCount() > 1) { // If multi selected, clear down panel 
							me.clearPoolPanel();
						} else
							me.readPoolPanel(records[0]); // If only one selected, load down panel
					}
					//else me.clearPoolPanel(); // No record selected ,clear down panel
				}
			},
			'selectUserGrid' : {
				selectionchange : function(selectionModel, records, index) {
					if (records[0] != null) {
						me.getPoolSetting().down('#subscriber').setValue(records[0].get('id'));
					} else
						me.getPoolSetting().down('#subscriber').setValue('');
				}
			}
		});
	},
	readPoolPanel : function(record) {
		// console.log('readPoolPanel');
		var me = this;
		// Select this record
		// me.getPoolGrid().getSelectionModel().select(index);

		// Load poolLicenseGrid
		me.getPoolLicenseForm().loadPoolLicense(record);
		/*me.getPoolLicenseForm().setTitle(Locale.getMsg('view.resource.pool.licenseEdit')+'('+record.get('name')+')');
		me.getPoolLicenseGrid().setPoolOid(record.get('oid'), record.get('subscriber'));
		me.getPoolLicenseGrid().loadAllLicense();
		me.getPoolLicenseGrid().load(me.getPoolLicenseGrid().poolOid);*/
		
		// Load poolRenderGrid
		me.getPoolRenderForm().loadPoolRender(record);
		/*me.getPoolRenderForm().setTitle(Locale.getMsg('view.resource.pool.licenseEdit')+'('+record.get('name')+')');
		me.getPoolRenderForm().pool = record; // Need selected pool record to switch to monitor page
		me.getPoolRenderGrid().load(record.get('oid'));*/

		me.getPoolGrid().doExpand();
	},
	clearPoolPanel : function() {
		var me = this;
		me.getPoolLicenseGrid().poolOid = null;
		me.getPoolLicenseGrid().store.loadData([], false);
		me.getPoolRenderGrid().store.loadData([], false);
		
		me.getPoolGrid().doCollapse();
	}
});
