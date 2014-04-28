Ext.define('Ecfa.view.usage.UmissionGroupGrid', {
	extend : 'Ecfa.view.common.ColumnsGrid',
	alias : 'widget.umissionGroupGrid',
	//store : 'usage.UmissionByUproject',
	border : true,
	title : Locale.getMsg('view.usage.umissionGroup.simpletitle'),
	layout : 'fit',
	// frame: true,
	requires : [ 'Ext.grid.feature.GroupingSummary' ],
	features : [ {
		ftype : 'groupingsummary',
		groupHeaderTpl : Locale.getMsg('view.job.userName') + ':{name} (' + Locale.getMsg('view.usage.missionNum') + ':{rows.length}' + ')',
		startCollapsed : true,
		id : 'groupingFeature'
	} ],

	rowCursorPointer : true,
	initComponent : function() {
		var me = this;

		me.store = Ext.create('Ecfa.store.usage.UmissionByUproject');
		
		me.tools = [ {
			xtype : 'tool',
			type : 'expand',
			align : 'left',
			tooltip : Locale.getMsg('view.common.expand'),
			handler : function(event, target, owner, tool) {
				var view = me.view;
				view.features[0].expandAll();
			}
		}, {
			xtype : 'tool',
			type : 'collapse',
			align : 'left',
			tooltip : Locale.getMsg('view.common.collapse'),
			handler : function(event, target, owner, tool) {
				var view = me.view;
				view.features[0].collapseAll();
			}
		} ];

		var columns = [];
		columns.push({
			xtype : 'missionNum',
			flex : 1
		}, {
			header : Locale.getMsg('view.usage.missionName'),
			xtype : 'missionName',
			flex : 2
		}, {
			xtype : 'missionState',
			flex : 1
		}, {
			header : Locale.getMsg('view.usage.frametotal'),
			xtype : 'numTotal',
			flex : 1,
			summaryType : 'sum',
			summaryRenderer : Ext.util.Format.numberRenderer('(sum) 0')
		}, {
			xtype : 'averageFrameTime',
			flex : 2,
			summaryType : 'average',
			summaryRenderer : function(value) {
				return '(avg) ' + Ecfa.Format.secondsToTime(Ecfa.Format.floatRound(value, Ecfa.Const.DOLLAR_ROUND));
			}
		}, {
			xtype : 'coreHours',
			flex : 1,
			summaryType : 'sum',
			summaryRenderer : function(value) {
				return '(sum) ' + Ecfa.Format.floatRound(value, Ecfa.Const.DOLLAR_ROUND);
			}
		}, {
			xtype : 'cost',
			flex : 2,
			summaryType : 'sum',
			summaryRenderer : function(value) {
				// return '(sum) ' + Ecfa.Const.DOLLAR_PREFIX + Ecfa.Format.floatRound(value, Ecfa.Const.DOLLAR_ROUND);
				return '(sum) ' + Ecfa.Format.currency(value);
			}

		});
		me.columns = columns;

		me.callParent(arguments);

		// console.log(me.getStore());

		me.getStore().on({
			load : function() {
				// console.log(me.getStore().getCount());
				if (me.getStore().getCount() > 0) {
					me.getSelectionModel().select(0);
					// me.fireEvent('s', me, me.getSelectionModel().getLastSelected());
				} else {
					// if no record in UmissionGroupGrid, clear UframeGrid as well
					me.fireEvent('clearUframeGrid');
				}
			}
		});
	},
	loadByProject : function(project) {

		// console.log('[UmissionGroupGrid] uproject oid and project name', project.get('uprojectOid'), project.get('name'));

		// tony: if project.get('uprojectOid')== null, clear store

		// console.log(project);

//		console.log('UmissionGroupGrid load', project);

		this.setTitle(Locale.getMsg('view.usage.umissionGroup.title', project.get('name')));
		var oid = project.get('uprojectOid');
		
		if (oid != "") {
			this.getStore().load({
				params : {
					uprojectOid : oid
				},
				callback : function() {
					// console.log('callback');
				}
			});
		}else{
			this.clear();
		}
		
	},
	loadByUProject : function(uproject) {

		this.setTitle(Locale.getMsg('view.usage.umissionGroup.title', uproject.get('interval')));

		var oid = uproject.getId();
		if(oid != ""){
			this.getStore().load({
				params : {
					uprojectOid : oid
				},
				callback : function() {
					// console.log('callback');
				}
			});
		}else{
			this.clear();
		} 
		

	},
	clear : function() {
		this.getStore().loadData([], false);
		this.getStore().fireEvent('load', this.getStore(), [], true);
		this.setTitle(Locale.getMsg('view.usage.umissionGroup.simpletitle'));
	}
});
