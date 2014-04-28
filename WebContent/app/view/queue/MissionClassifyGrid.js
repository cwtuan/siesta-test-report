Ext.define('Ecfa.view.queue.MissionClassifyGrid', {
	extend : 'Ecfa.view.common.ColumnsGrid',
	alias : 'widget.missionClassifyGrid',
	store : 'queue.MissionByClassify',
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

	columns : [ {
		header : Locale.getMsg('view.job.userName'),
		flex : 1,
		dataIndex : 'userName'
	},{
		header : Locale.getMsg('view.queue.project.title'),
		dataIndex : 'projectName',
		flex : 1.5
	},{
		header : Locale.getMsg('view.common.id'),
		dataIndex : 'num',
		flex : 0.5
	}, {
		xtype : 'missionName',
		flex : 1.5
	},   {
		xtype : 'missionProduct',
		flex : 1.5
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
	}, {
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
				text : '(' + Math.floor(progress * 100) + ' % ' + Locale.getMsg('view.job.state.don') + ')'
			};
		}

	}, {
		xtype : 'missionActions',
		width : 50
	} ],

	initComponent : function() {
		var me = this;
		var updateTask = {
			run : function() {
				me.up('missionView').reloadWholeParts(me);
			},
			interval : Ecfa.Config.TASK_UPDATING_PERIOD
		};

		me.dockedItems = [ {
			xtype : 'toolbar',
			dock : 'top',
			items : [ {
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
						// me.setText(Locale.getMsg('view.queue.menu.pollingOn'));
						Ext.TaskManager.start(updateTask);
					} else {
						// me.setText(Locale.getMsg('view.queue.menu.pollingOff'));
						Ext.TaskManager.stop(updateTask);
					}
				}
			}, '-', {
				itemId : 'over',
				xtype : 'label',
				text : Locale.getMsg('view.job.over')
			}, {
				itemId : 'exceedHours',
				width : 50,
				xtype : 'numberfield',
				value : 0,
				minValue : 0,
				listeners : {
					change : function(field, newValue, oldValue) {
						setTimeout(function() {
							me.load();
						}, 500);

						// if(me.down('#filterButton').pressed){
						// me.load();
						// }
					},
					spin : function() {
						console.log('spin!!');
						// this.disable();
					}
				}

			}, {
				xtype : 'label',
				text : Locale.getMsg('view.job.exceedhours')
			},{
				xtype : 'boxselect',
				itemId : 'stateCombo',				
				tooltip : Locale.getMsg('view.common.mutipleSelect.qtip'),
				fieldLabel : Locale.getMsg('view.mission.state'),
				multiSelect : true,
				displayField : 'display' ,
				valueField : 'value',
				store : Ext.create('Ecfa.store.queue.MissionState'),
				queryMode : 'local',
				labelWidth : 80,
				width : 400,
				listeners : {
					change : function(field, newValue, oldValue) {
						setTimeout(function() {
							me.load();
						}, 500);

						// if(me.down('#filterButton').pressed){
						// me.load();
						// }
					}
				}
				
			} /*
				 * ,{ itemId : 'filterButton', xtype : 'button', icon : 'css/images/filter_16.png', enableToggle : true, handler : function(){
				 * console.log('pressed',this.pressed); me.load(); var label = me.down('#filterLabel'); if(this.pressed){
				 * label.setText(Locale.getMsg('view.common.filter.on')); }else{ label.setText(Locale.getMsg('view.common.filter.off')); }
				 * 
				 * label.show(); Ext.defer(function () { label.hide(); }, 2000); } },{ itemId : 'filterLabel', xtype : 'label', text : '', hidden : true
				 *  }
				 */]
		} ];

		me.callParent(arguments);

		me.on({
			activate : function() {
				// console.log('pressed',me.down('#polling').pressed);
				if (me.down('#polling').pressed) {
					Ext.TaskManager.start(updateTask);
				}
			},
			deactivate : function() {
				// console.log('get deactivate delegate');
				Ext.TaskManager.stop(updateTask);
			}
		// ,
		// viewready : function(){
		// console.log('viewready');
		// var field = me.down('#exceedHours');
		// if(field.disabled){
		// field.enable();
		// }
		// }
		});

		

		Ecfa.event.Mission.on({

			reload : function() {
				me.load();
			},
			switch2Resume : function(btn) {
				console.log('switch  to resume ');
				me.showResumeIcon(btn);
			},
			switch2Hold : function() {
				console.log('switch  to hold ');
				// me.showHoldIcon();
			},
			applyFilter : function(options) {
				// applyFilter event is fired at DashBoardView.js
				if (Ext.isNumber(options.exceedHours)) {
					var hourField = me.down('#exceedHours');					
					// Since page "activate" event will reload grid, don't make field fire "change" event and reload again
					hourField.suspendEvents(false);
					hourField.setValue(options.exceedHours);
					hourField.resumeEvents();
					me.down('label#over').el.highlight();
				}
				
				var stateCombo = me.down('#stateCombo');
				console.log('state',options.state);
				//console.log('stateCombo',stateCombo);
				//stateCombo.getSelectionModel().select(options.state);
				
				var stateItem = stateCombo.findRecordByDisplay(Ecfa.Converter.getMissionState(options.state));
				stateCombo.select(stateItem);				
			}

		});

	},

	load : function() {
		// var exceedHours = 0;
		// if(this.down('#filterButton').pressed){
		// ('filter on');
		// exceedHours = (this.down('#exceedHours').getValue()==null)? 0 : this.down('#exceedHours').getValue().valueOf();
		// }

		var exceedHours = (this.down('#exceedHours').getValue() == null) ? 0 : this.down('#exceedHours').getValue().valueOf();
		var stateSelection = this.down('#stateCombo').lastSelection;
		var states = [];
		console.log('stateSelection',stateSelection);
		Ext.each(stateSelection, function(select){
			var values = select.data['value'];
			Ext.each(values, function(value){
				states.push(value);
			});
		});
		console.log('exceedHours', exceedHours);
		console.log('state', states);
		

		this.getStore().load({
			params : {
				exceedHours : exceedHours,
				state : states
			}
		});

	},

	showResumeIcon : function(btn) {
		console.log('showResumeIcon');
		// this.down('#resumeAction').setVisible(true);
		// this.down('#holdAction').setVisible(false);
		btn.setVisible(false);
		btn.up('container').down('#resumeAction').setVisible(true);
	},

	showHoldIcon : function(btn) {
		console.log('showHoldIcon');
		// this.down('#resumeAction').setVisible(false);
		// this.down('#holdAction').setVisible(true);
		btn.setVisible(false);
		btn.up('container').down('#holdAction').setVisible(true);
	},
	pausePolling : function() {
		console.log('pause');
		Ext.TaskManager.stopAll();

	}
/*
 * , reloadWholeParts : function(){ //reload missionGrid this.load(); // polling all frametabs as well (only activeTab)
 * if(this.up('missionView').down('#frameTabs').getActiveTab()!=null){//south part not open
 * this.up('missionView').down('#frameTabs').getActiveTab().down('panel').load(); } }
 */

});
