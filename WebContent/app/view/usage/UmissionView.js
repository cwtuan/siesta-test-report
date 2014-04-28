Ext.define('Ecfa.view.usage.UmissionView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.umissionView',
	border : false,
	margins : '0 0 5 0',
	layout : 'border',
	initComponent : function() {
		var me = this;

		me.items = [ {
			region : 'center',
			xtype : 'umissionGroupGrid',
			flex : 1.5
		}, {
			region : 'south',
			xtype : 'uframeGrid',
			flex : 1
		} ];

		me.callParent(arguments);

		me.down('umissionGroupGrid').on({
			select : function(grid, record, item, index, e, eOpts) {
				console.log('UmissionView', record);
				var missionOid = record.get('mission')['oid'];
				var oid = record.get('oid');
				var name = record.get('num') + '#' + record.get('name');
				// console.log(oid);
				me.down('uframeGrid').load(oid, name, missionOid); // missionOid for startCount
			},
			clearUframeGrid : function() {
				me.down('uframeGrid').clear();
			}
		});

	},
	clear : function() {
//		console.log('clear umissionView');
		this.down('uframeGrid').clear();
		this.down('umissionGroupGrid').clear();
	}

});
