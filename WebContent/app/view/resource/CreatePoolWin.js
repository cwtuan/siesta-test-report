// for OP
Ext.define('Ecfa.view.resource.CreatePoolWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.createPoolWin',
	requires : [ 'Ecfa.view.resource.CreatePoolWizard' ],
	width : 400,
	minWidth : 300,
	y : 80,
	layout : 'fit',
	modal : true,
	title : Locale.getMsg('view.resource.pool.add'),
	initComponent : function() {
		var me = this;

		me.items = [ {
			xtype : 'createPoolWizard',
			itemId : 'createPoolWizard',
			records : me.records
		} ];

		me.callParent();

		me.on({
			show : function() {
				//console.log('create poolWin show');
				me.down('#poolLicenseGrid').loadAllLicense();
			}
		});
	}
});
