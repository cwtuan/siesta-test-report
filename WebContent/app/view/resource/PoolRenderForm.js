// for OP
Ext.define('Ecfa.view.resource.PoolRenderForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.poolRenderForm',
	requires : [ 'Ecfa.util.StoreUtil', 'Ecfa.view.resource.PoolRenderGrid' ],
	layout : 'fit',
	// bodyStyle : 'padding:10px 10px 10px 10px',
	defaultType : 'textfield',
	// title : Locale.getMsg('view.resource.pool.licenseEdit'),
	store : 'license.License',
	pool : null,

	initComponent : function() {
		var me = this;

		me.bbar = [ {
			xtype : 'button',
			text : Locale.getMsg('view.monitor.hostUsage.switch'),
			icon : 'css/images/monitor_16x16.png',
			margin : '0 0 10 0',
			handler : function() {
				/* Switch to Monitor Usage panel */
				Ecfa.Navigator.show('#opMonitor', '#monitorView #usagePanel');

				/* Select pool */
				var combo = me.up('viewport').down('#poolCombo');
				// console.log('switch',me.pool,combo);
				combo.select(me.pool); // Ext comboBox doesn't fire the select event.
				combo.fireEvent('select', combo, [ me.pool ]); // Fire select event
			}
		} ];

		me.items = [ {
			region : 'center', // center region is required, no width/height specified
			xtype : 'poolRenderGrid',
			itemId : 'poolRenderGrid'
		} ];

		me.callParent(arguments);
	},
	loadPoolRender : function(record) {
		this.setTitle(Locale.getMsg('view.resource.pool.licenseEdit') + '(' + record.get('name') + ')');
		this.pool = record; // Need selected pool record to switch to monitor page
		this.down('#poolRenderGrid').load(record.get('oid'));
	},
	refreshPoolRender : function() {
		if(this.pool)
		   this.down('poolRenderGrid').load(this.pool.get('oid'));
	}
});
