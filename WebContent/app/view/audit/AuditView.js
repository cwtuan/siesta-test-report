Ext.define('Ecfa.view.audit.AuditView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.auditView',
	border : false,
	layout : 'border',
	requires : [ 'Ecfa.view.audit.AuditGrid', 'Ecfa.view.audit.AuditSearchPanel' ],
	initComponent : function() {
		var me = this;

		me.items = [ {
			xtype : 'auditSearchPanel',
			region : 'west',
			width : 300,
			split : true,
			collapsible : false,
			hideCollapseTool : true
		}, {
			xtype : 'auditGrid',
			region : 'center'
		} ];
		me.callParent(arguments);

	}
});
