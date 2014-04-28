Ext.define('Ecfa.view.queue.MissionGrid', {
	extend : 'Ecfa.view.common.ColumnsGrid',
	alias : 'widget.missionGrid',
	store : 'queue.MissionByProject',
	admins : null,
	border : false,
	region : 'center',
	layout : 'fit',
	
	viewConfig : {
		preserveScrollOnRefresh : true,
		getRowClass : function(record, rowIndex, rowParams, store) {
			// var s = record.get('state');
			// return 'state-' + s;
			return 'state';
		}
	},
//	requires : [ 'Ecfa.view.queue.trigger.DependencyTrigger', 
//	             'Ecfa.view.queue.action.MissionAction', 
//	             'Ecfa.view.queue.action.MissionAlertAction'],
	

	columns : [{
		header : Locale.getMsg('view.common.id'),
		dataIndex : 'num',
		flex : 0.5
	},{
		xtype : 'missionName',
		flex : 1.5
	}
	,{
		header : Locale.getMsg('view.job.userName'),
		flex : 1,
		dataIndex : 'userName'
	},{ 
		xtype : 'missionProduct'
	}, {
		xtype : 'missionScene',
		flex : 2

	}, {
		header : Locale.getMsg('view.job.frameRange'),
		dataIndex : 'frameFirst',// frameFirst+'-'+frameLast
		flex : 1,
		renderer : function(val, metadata, record) {
			val = record.get('frameFirst') + '-' + record.get('frameLast');
			return val;
		}
	}, {
		header : Locale.getMsg('view.job.timeCreate'),
		flex : 1.5,
		dataIndex : 'timeCreation',
		renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
			if (value != 0) {
				return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
			}
			return '';
		}
	}, {
		header : Locale.getMsg('view.job.isconvertanimate'),
		flex : 1,
		dataIndex : 'convertVideo', 
		renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {				
			return Ecfa.locale.Converter.getTrueFalse(value);
		}
	}, {
		header : Locale.getMsg('view.job.timeStart'),
		flex : 1.5,
		dataIndex : 'timeStart',
		renderer : Ecfa.Format.dateTime
	}, {
		xtype : 'missionState',
		flex : 1
	},{
		header : Locale.getMsg('view.job.dependency'),
		flex : 1.5,
		dataIndex : 'dependencyName'
			
	}, {
		header : Locale.getMsg('view.job.priority'),
		flex : 1,
		dataIndex : 'priority', 
		renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {				
			return Ecfa.locale.Converter.getJobPriority(value);
		}
	}, {
		header : Locale.getMsg('view.queue.count.pend'),
		dataIndex : 'numQueueing',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.run'),
		dataIndex : 'numRunning',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.fail'),
		dataIndex : 'numFail',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.done'),
		dataIndex : 'numDone',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.total'),
		dataIndex : 'numTotal',
		align : 'right',
		flex : 0.6
	}, {
		header : Locale.getMsg('view.queue.count.progress'),
		xtype : 'componentcolumn',
		dataIndex : 'progress',
		tdCls : 'narrow',
		flex : 1.5,
		renderer : function(value, meta, record) {

			var progress = record.get('progress');
			return {
				xtype : 'progressbar',
				height : 17,
				// margin : '0 0 0 0',
				value : progress,
				text : '(' + Math.floor(progress * 100) + ' % '+ Locale.getMsg('view.job.state.don')+')'
			};
		}

	},{
		xtype : 'missionActions',
		width : 50
	}
],

	initComponent : function() {
		var me = this;
		var updateTask = {
			run : function() {
				me.up('missionView').reloadWholeParts(me);
			},
			interval : Ecfa.Config.TASK_UPDATING_PERIOD
		};

		
 		me.dockedItems = [{
			 xtype: 'toolbar',
             dock: 'top',
             items: [{
     			itemId : 'refresh',
    			tooltip : Locale.getMsg('view.common.refresh'),
    			icon : 'css/images/refresh.png',
    			handler : function() {
    				me.up('missionView').reloadWholeParts(me);    				
    			}
    		}, '-', {
    			itemId : 'polling',
    			text : Locale.getMsg('view.queue.menu.polling'),
    			enableToggle : true,
    			toggleHandler : function(me, pressed, eOpts) {
    				if (pressed) {
    					//me.setText(Locale.getMsg('view.queue.menu.pollingOn'));
    					Ext.TaskManager.start(updateTask);
    				} else {
    					//me.setText(Locale.getMsg('view.queue.menu.pollingOff'));
    					Ext.TaskManager.stop(updateTask);
    				}
    			}
    		}, '-', {
    			itemId : 'projectCombo',
    			xtype : 'combobox',
    			fieldLabel : Locale.getMsg('view.queue.project.title'),
    			labelWidth : 50,
    			labelAlign : 'right',
    			stateful : true,
    			name : 'project',
    			store : Ecfa.StoreUtil.getStore('detailProjects'), 
    			queryMode : 'remote',
    			editable : false,
    			displayField : 'name',
    			valueField : 'oid',
    			emptyText : Locale.getMsg('view.msg.project.select'),
    			listeners : {    				
    				select : function(combo, records, eOpts) {
    					var adminarr = [];
    					adminarr.push(records[0].data.ownerId);
    					if(records[0].data.adminIds!=null)
    						adminarr = adminarr.concat(records[0].data.adminIds);
    					
    					//console.log(adminarr);
    					me.admins = adminarr;
    					//console.log(records[0].data.oid);
    					// me.store.getProxy().url = Ext.String.format('rest/queue/{0}/missions', records[0].data.oid);
    					var projectOid = records[0].data.oid;
    					me.load(projectOid);
    				}/*,
    				
    				collapse : function (field, eOpts ) {
    					console.log('fire select!');
    					this.fireEvent('select', this, );
    				}*/
    			}
    		} 
                 
             ]
		}];		
	
 		 		
		me.callParent(arguments);		
		
		
		me.on({
			activate : function(){
				//console.log('pressed',me.down('#polling').pressed);
				if(me.down('#polling').pressed){
					Ext.TaskManager.start(updateTask);
				}
			},
			deactivate : function(){
				//console.log('get deactivate delegate');
				Ext.TaskManager.stop(updateTask);
			}
		});

		
		/*if no value in project combobox,set firt project as default*/
		me.down('#projectCombo').store.on({
			load : function(){
				var combo = me.down('#projectCombo');
				//console.log('mission grid, project load',combo.store);
				if((combo.value==null || combo.value=='') && combo.store.totalCount > 0){
					var firstRecord = combo.store.getAt(0);
					combo.select(firstRecord);
					//console.log(firstRecord);
					/*set admin for action*/
					var adminarr = [];
					adminarr.push(firstRecord.get('ownerId'));
					if(firstRecord.get('adminIds')!=null)
						adminarr = adminarr.concat(firstRecord.get('adminIds'));					
					//console.log(adminarr);
					me.admins = adminarr;
					
					/*load*/
					me.load(combo.store.getAt(0).get('oid'));
				}				
			},
			
			datachanged : function(){
				console.log('STORE CHANGE');
				
			}
		});
		
		Ecfa.event.Project.on({
			destroyed : function(projectData) {
				var projectCombo = me.down('#projectCombo');
				var selectedProject = projectCombo.value;
				console.log('destroyed effect combo in missionGrid', selectedProject);
				if (selectedProject && selectedProject === projectData.oid) {
					// if the current selected project was deleted, select the defualt one
					projectCombo.store.load({
						callback : function(records, operation, success) {
							if (success) {
								var toSelectRecord;
								// TODO select the default one
								toSelectRecord = projectCombo.store.first();
								// console.log('toSelectRecord', toSelectRecord);
								if (toSelectRecord) {
									projectCombo.select(toSelectRecord);
								}

							}
						}
					});
				} /*else {
					me.load();
				}*/
			}
		});
		Ecfa.event.Mission.on({
			passProjectOid : function(projectOid) {
				console.log(projectOid);
				me.down('#projectCombo').select(projectOid);
				me.load(projectOid);

			},
			reload : function(){
				me.load();
			},
			switch2Resume : function(btn){
				console.log('switch  to resume ');
				me.showResumeIcon(btn);
			},
			switch2Hold : function(){
				console.log('switch  to hold ');
				//me.showHoldIcon();
			}			

		});

	},

	load : function(projectOid) {
		//console.log('first',projectOid);
		// trigger by refresh or combobox selection
		if (projectOid==null) {
			projectOid = this.down('#projectCombo').getValue();
			//console.log('project oid is null',projectOid);
		}
		
		// first time activate, project combo haven't been selected, no value
		// don't load, combo select will load
		if(projectOid!=null){
			this.getStore().load({
				ids : [ projectOid ]
			});
		}
		

	},

	reloadFilter : function() {
		this.down('#projectCombo').getStore().reload();
	},

	showResumeIcon : function(btn) {
		console.log('showResumeIcon');
		//this.down('#resumeAction').setVisible(true);
		//this.down('#holdAction').setVisible(false);
		btn.setVisible(false);
		btn.up('container').down('#resumeAction').setVisible(true);
	},

	showHoldIcon : function(btn) {
		console.log('showHoldIcon');
		//this.down('#resumeAction').setVisible(false);
		//this.down('#holdAction').setVisible(true);
		btn.setVisible(false);
		btn.up('container').down('#holdAction').setVisible(true);
	},
	pausePolling : function(){
		console.log('pause');
		Ext.TaskManager.stopAll();
		
	}
	/*,
	reloadWholeParts : function(){
		//reload missionGrid 
		this.load();
		// polling all frametabs as well (only activeTab)	
		if(this.up('missionView').down('#frameTabs').getActiveTab()!=null){//south part not open
			this.up('missionView').down('#frameTabs').getActiveTab().down('panel').load();
		}
	}*/
	
});
