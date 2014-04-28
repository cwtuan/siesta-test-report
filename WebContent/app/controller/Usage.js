Ext.define('Ecfa.controller.Usage', {
	extend : 'Ext.app.Controller',
	stores : [ 'usage.UmissionByUproject', 'usage.MissionSummary', 'usage.UframeByUmission', 'usage.Purchase' ],
	models : [ 'usage.Umission', 'usage.Uframe', 'usage.MissionSummary', 'usage.Purchase' ],
	// views : [ 'usage.UprojectGrid' ],
	refs : [ {
		ref : 'uprojectByPeriodGrid',
		selector : 'uprojectByPeriodGrid'
	}, {
		ref : 'uprojectByProjectGrid',
		selector : 'uprojectByProjectGrid'
	}, {
		ref : 'usageTabProject',
		selector : 'usageTabProject'
	}, {
		ref : 'periodMissionSummaryPropertyGrid',
		selector : 'usageTabPeriod missionSummaryPropertyGrid'
	}, {
		ref : 'periodUmissionGroupGrid',
		selector : 'usageTabPeriod umissionView umissionGroupGrid'
	}, {
		ref : 'projectMissionSummaryPropertyGrid',
		selector : 'usageTabProject missionSummaryPropertyGrid'
	}, {
		ref : 'projectUmissionGroupGrid',
		selector : 'usageTabProject umissionView umissionGroupGrid'
	} ],

	init : function() {
		var me = this;
		me.control({
			'uprojectByPeriodGrid' : {
				select : function(panel, record, index, eOpts) {
					// console.log('uprojectByPeriodGrid select record', record);

					me.getPeriodMissionSummaryPropertyGrid().loadByProject(record);
					me.getPeriodUmissionGroupGrid().loadByProject(record);
				}

			},
			'uprojectByProjectGrid' : {
				select : function(panel, record, index, eOpts) {
					// console.log('uprojectByProjectGrid select record', record);

					me.getProjectMissionSummaryPropertyGrid().loadByUProject(record);
					me.getProjectUmissionGroupGrid().loadByUProject(record);

				}

			}
		});
	}

});
