Ext.define('Ecfa.controller.License', {
	extend : 'Ext.app.Controller',
	stores : [ 'license.License', 'license.Licenses', 'license.Product', 'license.LicenseByType','license.ProductState', 'license.PoolByLicense' ],
	models : [ 'license.License', 'license.Product','license.LicensePool' ],
	views : [ 'license.LicenseGrid', 'license.LicenseForm' ],

	refs : [ {
		ref : 'licenseForm',
		selector : 'form'
	} ],

	init : function() {
		this.control({
			'licenseGrid' : {
			// selectionchange : this.gridSelectionChange//,
			// viewready : this.onViewReady
			}
		});
	},

	gridSelectionChange : function(model, records) {
		if (records[0]) {
			console.log(records[0]);
			this.getLicenseForm().getForm().loadRecord(records[0]);
		}
	},

	onViewReady : function(grid) {
		grid.getSelectionModel().select(0);
	}

});
