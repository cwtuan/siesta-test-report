/*
 *  UsageView的左下角
 * 
 */

Ext.define('Ecfa.view.usage.MissionSummaryPropertyGrid', {
	extend : 'Ecfa.ux.grid.PropertyGrid',
	alias : 'widget.missionSummaryPropertyGrid',
	model : 'Ecfa.model.usage.MissionSummary',
	title : Locale.getMsg('view.usage.missionSummary.title'),
	// border : false,
	properties : [ {
		name : Locale.getMsg('view.usage.missionSummary.total'),
		dataIndex : 'total'
	}, {
		name : Locale.getMsg('view.job.state.run'),
		dataIndex : 'running'
	}, {
		name : Locale.getMsg('view.job.state.don'),
		dataIndex : 'done'
	}, {
		name : Locale.getMsg('view.job.state.err'),
		dataIndex : 'fail'
	}, {
		name : Locale.getMsg('view.job.state.skp'),
		dataIndex : 'cancel'
	}, {
		name : Locale.getMsg('view.usage.missionSummary.others'),
		dataIndex : 'others'
	} ],

	initComponent : function() {
		var me = this;

		me.callParent(arguments);
	},

	loadByProject : function(project) {

//		console.log('loadByProject', project);

		var me = this;

		if (project.get('uprojectOid') != "") {
			me.store.load({
				ids : [ project.getId() ],
				params : {
					period : project.get('periodInfo').period
				}
			});
		} else {
			me.clear();
		}

		// .getId(), record.get('projectName'),

		me.setTitle(Locale.getMsg('view.usage.missionSummary.title', project.get('name')));

	},
	loadByUProject : function(uproject) {

		console.log('loadByUProject', uproject);

		var me = this;

		if (uproject != null && uproject != "") {
			me.store.load({
				ids : [ uproject.get('projectOid') ],
				params : {
					period : uproject.get('period')
				}
			});

			me.setTitle(Locale.getMsg('view.usage.missionSummary.title', uproject.get('interval')));
		} else {
			me.clear();
		}

	},
	clear : function() {
		this.store.loadData([ {} ]);
		this.setTitle(Locale.getMsg('view.usage.missionSummary.title', Locale.getMsg('view.common.noRecords')));
	}
});
