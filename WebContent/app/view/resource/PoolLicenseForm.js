// for OP
Ext.define('Ecfa.view.resource.PoolLicenseForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.poolLicenseForm',
	requires : [ 'Ecfa.view.resource.PoolLicenseGrid' ],
	bodyStyle : 'padding:-10px -10px -10px -10px',
	defaultType : 'textfield',
	// title : Locale.getMsg('view.resource.pool.licenseEdit'),
	// store : 'license.License',
	layout : 'fit',
	poolOid : null,

	initComponent : function() {
		var me = this;

		me.bbar = [ {
			itemId : 'savebtn',
			formBind : true,
			text : Locale.getMsg('view.common.save'),
			width : 80,
			margin : '0 0 10 0',
			handler : function() {
				var osType = 'WINDOWS64'; // Same as CreatePoolWizard but CAN NOT input null, why?~~~~~~
				var submit = Ext.create('Ecfa.model.resource.Pool', {
					osType : osType,
					licenses : me.down('poolLicenseGrid').getPoolLicense()
				});
				console.log('submit', submit);

				var poolLicenseProxy = Ext.data.proxy.Proxy({
					url : 'rest/op/resource/poolLicenses',
					type : submit.proxy.type
				});
				submit.setProxy(poolLicenseProxy);

				// submit.getProxy().on('exception', this.onProxyException, this);
				me.setLoading(true);

				Ecfa.Restful.request({
					record : submit,
					method : 'POST',
					url : submit.getProxy().url,
					success : function(rec, op) {
						console.log('success', rec, op);// op.getRecords()[0]);
						Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.pool.licenseEdit.success'), 5000);
						console.log('poolOid', me.down('#poolLicenseGrid').poolOid);
						me.up('poolView').down('poolLicenseGrid').loadAllLicense(); // Refresh License
						me.up('poolView').down('#poolLicenseGrid').load(me.down('#poolLicenseGrid').poolOid);
						Ecfa.event.License.fireEvent('destroyed');
					},

					failure : function(rec, op) {
						console.log('fail', rec);// op.request.scope.reader.jsonData["error"]);
						Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg('', rec));
						me.down('#poolLicenseGrid').getView().refresh();
						// me.down('#poolLicenseGrid').setLoading(false);
					},
					callback : function() {
						me.setLoading(false);
					}
				});
			}
		}, {
			text : Locale.getMsg('view.common.cancel'),
			margin : '0 0 10 0',
			width : 80,
			handler : function() {
				me.down('#poolLicenseGrid').getView().refresh();
			}
		} ];

		me.items = [ {
			region : 'center', // center region is required, no width/height specified
			xtype : 'poolLicenseGrid',
			itemId : 'poolLicenseGrid'
		} ],

		me.callParent(arguments);

		me.on({
			activate : function() {
				// console.log('activate poolLicenseForm');
			}
		});
	},
	onProxyException : function(proxy, response, operation) {
		var errors;
		errors = Ext.JSON.decode(response.responseText).message;
		console.log('exception log', errors);
	},
	loadPoolLicense : function(record) {
		this.setTitle(Locale.getMsg('view.resource.pool.licenseEdit') + '(' + record.get('name') + ')');
		this.down('#poolLicenseGrid').setPoolOid(record.get('oid'), record.get('subscriber'));
		this.down('#poolLicenseGrid').loadAllLicense();
		this.down('#poolLicenseGrid').load(this.down('#poolLicenseGrid').poolOid);
	},
	refreshPoolLicense : function() {
		var poolLicenseGrid = this.down('#poolLicenseGrid');
		poolLicenseGrid.loadAllLicense();
		poolLicenseGrid.load(poolLicenseGrid.poolOid);
	}
});
