// for OP
Ext.define('Ecfa.view.resource.PoolLicenseSetting', {
	extend : 'Ext.form.Panel',
	alias : 'widget.poolLicenseSetting',
	requires : [ 'Ecfa.view.resource.PoolLicenseGrid' ],
	height : 185,
	//width : 400,
	layout : 'fit',
	//autoHeight:true,
	// autoWidth:true,
	//autoSize : true,
	//autoScroll : true,
	border : false,
	// title : Locale.getMsg('view.resource.pool.licenseEdit'),

	initComponent : function() {
		var me = this;

		me.bbar = [ '->', {
			itemId : 'cardPrev',
			text : Locale.getMsg('view.wizard.previous'),
			width : 80,
			handler : function() {
				this.up('#createPoolWizard').previous();
			}
		}, {
			itemId : 'submit',
			text : Locale.getMsg('view.submit'),
			icon : 'css/images/cloud_upload_16.png',
			width : 80,
			handler : function() {
				me.up('#createPoolWizard').submit();
			}
		} ];

		me.items = [ {
			region : 'center',
			xtype : 'poolLicenseGrid',
			createflag : true,
			itemId:'poolLicenseGrid'
		} ],

		me.callParent(arguments);

		me.on({
			activate : function() {
				//console.log('activate poolLicenseSetting',me.down('#poolLicenseGrid').store.getRange());
			}
		});
	}
});
