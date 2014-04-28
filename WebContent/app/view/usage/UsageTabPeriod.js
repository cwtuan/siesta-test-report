Ext.define('Ecfa.view.usage.UsageTabPeriod', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.usageTabPeriod',
	border : false,
	margins : '0 0 5 0',
	requires : [ 'Ecfa.view.usage.UprojectByPeriodGrid', 'Ecfa.view.usage.UmissionView', 'Ecfa.view.usage.UmissionGroupGrid', 'Ecfa.view.usage.UframeGrid',
			'Ecfa.view.usage.MissionSummaryPropertyGrid', 'Ecfa.view.usage.UmissionView', 'Ecfa.view.usage.UmissionGroupGrid', 'Ecfa.view.usage.UframeGrid' ],
	layout : 'border',
	title : Locale.getMsg('view.usage.byPeriodView'),
	initComponent : function() {
		var me = this;

		me.items = [ {
			title : Locale.getMsg('view.project.projects'),
			icon : 'css/images/clapperboard_16x16.png',
			region : 'west',
			flex : .45,
			split : true,
			collapsible : true,
			animCollapse : true,
			// margins : '0 0 5 5',
			layout : 'border',
			items : [ {
				region : 'center',
				xtype : 'uprojectByPeriodGrid',
				flex : 1.5
			}, {
				region : 'south',
				xtype : 'missionSummaryPropertyGrid',
				flex : 1,
				minHeight : 160,
				collapsible : true,
				split : true
			} ]
		}, {
			region : 'center',
			xtype : 'umissionView',
			flex : 1
		} ];

		me.callParent(arguments);

	}

});
