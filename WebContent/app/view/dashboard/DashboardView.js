// TODO polling 不要閃 &  last updated time as btn below more link
// TODO    align center
// TODO ajax batch
// TODO color or tab for grouping
// TODO highchart config 提出來，不要每次request 都new

Ext.define('Ecfa.view.dashboard.DashboardView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.dashboardView',
	border : false,
	// margins : '0 0 5 0',
	requires : [],
	layout : {
		type : 'table',
		columns : 4
	},
	autoScroll : true,
	defaults : {
		frame : false,
		width : 320,
		height : 196,
		margin : 15,
		// bodyStyle : "padding:5px;font-size:11px;",
		bodyPadding : 10
	},
	baseCls : 'x-plain',

	initComponent : function() {
		var me = this;

		var updateTask = {
			run : function() {
				me.reload();
			},
			interval : Ecfa.Config.DASHBOARD_UPDATING_PERIOD
		};

		me.dockedItems = [ {
			xtype : 'toolbar',
			dock : 'top',
			items : [ {
				itemId : 'refresh',
				tooltip : Locale.getMsg('view.common.refresh'),
				icon : 'css/images/refresh.png',
				handler : function() {
					me.reload();
				}
			}, '-', {
				itemId : 'polling',
				text : Locale.getMsg('view.queue.menu.polling'),
				enableToggle : true,
				toggleHandler : function(menu, pressed) {
					if (pressed) {
						Ext.TaskManager.start(updateTask);
					} else {
						Ext.TaskManager.stop(updateTask);
					}
				}
			// }, {
			//
			// html : 'lastest updated time'
			} ]
		} ];

		me.items = [ {
			html : '',
			height : 1,
			frame : false,
			colspan : me.layout.columns
		}, {
			xtype : 'box',
			itemId : 'dashboardView-hosts-widget',
			tpl : [ me.getHostsWidgetHeader(), me.getHostsWidgetBody() ]
		}, {
			xtype : 'box',
			itemId : 'dashboardView-services-widget',
			tpl : [ me.getServicesWidgetHeader(), me.getServicesWidgetBody() ]
		}, {
			xtype : 'box',
			itemId : 'dashboardView-users-widget',
			tpl : [ me.getUsersWidgetHeader(), me.getUsersWidgetBody() ]
		}, {
			xtype : 'box',
			itemId : 'dashboardView-problems-widget',
			tpl : [ me.getProblemsWidgetHeader(), me.getProblemsWidgetBody() ]
		}, {
			xtype : 'box',
			itemId : 'dashboardView-cost-widget',
			tpl : [ me.getCostWidgetHeader(), me.getCostWidgetBody() ]
		}, {
			xtype : 'box',
			itemId : 'dashboardView-not-done-missions-widget',
			tpl : [ me.getNotDoneMissionsWidgetHeader(), me.getNotDoneMissionsWidgetBody() ]
		}, {
			xtype : 'box',
			itemId : 'dashboardView-done-missions-widget',
			tpl : [ me.getDoneMissionsWidgetHeader(), me.getDoneMissionsWidgetBody() ]
		} ];

		me.callParent(arguments);

		me.on({
			afterrender : function() {
				me.reload();
			},
			activate : function() {
				console.log('pressed', me.down('#polling').pressed);
				if (me.down('#polling').pressed) {
					Ext.TaskManager.start(updateTask);
				}
			},
			deactivate : function() {
				Ext.TaskManager.stop(updateTask);
			}

		});

	},

	reload : function() {
		// TODO after box.update(), dom is deleted and listerner is removed, how to keep it? how to update box partcally

		var me = this;

		me.down('#dashboardView-hosts-widget').update(me.getHostsWidgetHeader() + me.getWidgetLoadingBody());
		me.down('#dashboardView-services-widget').update(me.getServicesWidgetHeader() + me.getWidgetLoadingBody());
		me.down('#dashboardView-cost-widget').update(me.getCostWidgetHeader() + me.getWidgetLoadingBody());
		me.down('#dashboardView-users-widget').update(me.getUsersWidgetHeader() + me.getWidgetLoadingBody());
		me.down('#dashboardView-problems-widget').update(me.getProblemsWidgetHeader() + me.getWidgetLoadingBody());
		me.down('#dashboardView-not-done-missions-widget').update(me.getNotDoneMissionsWidgetHeader() + me.getWidgetLoadingBody());
		me.down('#dashboardView-done-missions-widget').update(me.getDoneMissionsWidgetHeader() + me.getWidgetLoadingBody());

		// me.bindHostHeaderLink();

		Ecfa.Restful.request({
			url : 'rest/op/dashboard/hosts',
			method : 'GET',
			success : function(data) {
				me.child('#dashboardView-hosts-widget').update(data);
			},
			failure : function(data) {
				me.down('#dashboardView-hosts-widget').update(me.getHostsWidgetHeader() + me.getWidgetErrorBody(data));
			},
			around : function() {
				me.bindHostsHeaderLink();
			}
		});

		Ecfa.Restful.request({
			url : 'rest/op/dashboard/services',
			method : 'GET',
			success : function(data) {
				me.child('#dashboardView-services-widget').update(data);

			},
			failure : function(data) {
				me.down('#dashboardView-services-widget').update(me.getServicesWidgetHeader() + me.getWidgetErrorBody(data));
			},
			around : function() {
				me.bindServicesHeaderLink();
			}
		});

		Ecfa.Restful.request({
			url : 'rest/op/dashboard/cost',
			params : {
				days : [ 1, 7, 15, 30 ]
			},
			method : 'GET',
			success : function(data) {
				// console.log('cost update', data);
				me.child('#dashboardView-cost-widget').update(data);

			},
			failure : function(data) {
				me.down('#dashboardView-cost-widget').update(me.getCostWidgetHeader() + me.getWidgetErrorBody(data));
			},
			around : function() {
				me.bindCostHeaderLink();
			}
		});

		Ecfa.Restful.request({
			url : 'rest/op/dashboard/users',
			method : 'GET',
			success : function(data) {
				// console.log('users update', data);
				me.child('#dashboardView-users-widget').update(data);
			},
			failure : function(data) {
				me.down('#dashboardView-users-widget').update(me.getUsersWidgetHeader() + me.getWidgetErrorBody(data));
			},
			around : function() {
				me.bindUsersHeaderLink();
			}
		});

		Ecfa.Restful.request({
			url : 'rest/op/dashboard/problems',
			method : 'GET',
			success : function(data) {
				console.log('problemsvvv', data);
				me.child('#dashboardView-problems-widget').update(data);
			},
			failure : function(data) {
				me.down('#dashboardView-problems-widget').update(me.getProblemsWidgetHeader() + me.getWidgetErrorBody(data));
			},
			around : function() {
				me.bindProblemsHeaderLink();
			}
		});

		Ecfa.Restful.request({
			url : 'rest/op/dashboard/missions',
			params : {
				widget : 'notDoneMissions',
				exceedHours : Ecfa.Config.MISSION_EXCEED_HOURS
			},
			method : 'GET',
			success : function(data) {
				console.log('notDoneMissions update', data);

				me.child('#dashboardView-not-done-missions-widget').update(data);

				Ext.get('dashboardView-not-done-missions-more-link-waiting').on('click', Ext.bind(function() {
					// apply filter to MissionClassifyGrid.js
					Ecfa.event.Mission.fireEvent('applyFilter', {
						state : 'RDY',
						exceedHours : 0
					});
					// switch MissionClassifyView
					Ecfa.Navigator.show('#missionClassify', '#missionClassifyView');
				}));

				Ext.get('dashboardView-not-done-missions-more-link-exceed').on('click', Ext.bind(function() {
					Ecfa.event.Mission.fireEvent('applyFilter', {
						state : 'RUN',
						exceedHours : Ecfa.Config.MISSION_EXCEED_HOURS
					});
					Ecfa.Navigator.show('#missionClassify', '#missionClassifyView');
				}));
			},
			failure : function(data) {
				me.down('#dashboardView-not-done-missions-widget').update(me.getNotDoneMissionsWidgetHeader() + me.getWidgetErrorBody(data));
			}
		});

		Ecfa.Restful.request({
			url : 'rest/op/dashboard/missions',
			params : {
				widget : 'doneMissions'
			},
			method : 'GET',
			failure : function(data) {
				me.child('#dashboardView-done-missions-widget').update(me.getDoneMissionsWidgetHeader() + me.getWidgetErrorBody(data));
			},
			around : function() {
				me.bindDoneMissionsHeaderLink();
			},
			success : function(data) {

				console.log('doneMissions update', data);

				var maxIntervalSymbol = '>';

				me.child('#dashboardView-done-missions-widget').update();

				var categories = [];
				for ( var i = 0; i < data.length - 1; ++i) {
					categories.push(i + 1);
				}
				categories.push(maxIntervalSymbol);

				var chart = new Highcharts.Chart({

					chart : {
						renderTo : 'dashboard-done-missions-widget-body',
						type : 'column',
						animation : false,
						height : me.defaults.height
					},
					title : {
						text : null
					},
					subtitle : {
						text : null
					},
					legend : {
						enabled : false
					},

					xAxis : {
						categories : categories,
						title : {
							text : Locale.getMsg('view.dashboard.mission.runningTime')
						}
					},
					yAxis : {
						min : 0,
						title : {
							text : Locale.getMsg('view.dashboard.mission.number')
						}
					},
					tooltip : {
						formatter : function() {
							if (this.key == maxIntervalSymbol) {
								return Locale.getMsg('view.dashboard.mission.runningTime.last', categories[categories.length - 2], this.y);
							} else {
								return Locale.getMsg('view.dashboard.mission.runningTime.notLast', (parseInt(this.key) - 1), this.key, this.y);
							}
						},
						useHTML : true
					// ,
					// shared : true

					},
					plotOptions : {
						column : {
							pointPadding : 0.2,
							borderWidth : 0
						}
					},
					series : [ {
						data : data
					} ]
				});

			}
		});

	},

	getWidgetHeader : function(title, moreLinkId) {
		var html = '';
		if (moreLinkId) {
			html += '<a id="' + moreLinkId + '" class="dashboard-widget-more-link" href="javascript:">' + Locale.getMsg('view.dashboard.moreLink') + '</a>';
		}
		html += '<p class="dashboard-widget-title"> ' + title + ' </p>';
		return html;
	},
	getWidgetErrorBody : function(data) {
		var error;
		if (data) {
			error = data.error;
		}
		var key = 'err.' + ((error) ? error : 'internal');

		// error with defined error key
		if (Locale.hasKey(key)) {
			return '<div style="font-size: medium;color:red;text-align:center">' + '<p>' + Locale.getMsg('view.common.load.error') + '</p><p>'
					+ Locale.getMsg('err.reason') + Locale.getMsg(key) + '</p>' + '</div>';
		}
		// internal error
		else {
			return '<div style="font-size: medium;color:red;text-align:center">' + Locale.getMsg('view.common.load.error.internal') + '</div>';
		}
		return '<p style="color:#000">Failed to read.</p>';
	},
	getWidgetLoadingBody : function() {
		return 'loading...';
	},
	/* Hosts */
	getHostsWidgetHeader : function() {
		return this.getWidgetHeader(Locale.getMsg('view.monitor.host'), "dashboardView-hosts-more-link");
	},
	getHostsWidgetBody : function() {
		var html = '';
		html += '<table class="dashboard-widget-table" >';
		html += '<tr class="dashboard-widget-table-th"><td>' + Locale.getMsg('view.common.status') + '</td> <td>' + Locale.getMsg('view.dashboard.number')
				+ '</td> </tr>';
		html += '<tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getMonitorHostStatus('UP') + '</td> <td>{UP}</td> </tr>';
		html += '<tpl if="DOWN &gt; 0"><tr class="dashboard-widget-table-tr" style="color:red;"> <td>' + Ecfa.Converter.getMonitorHostStatus('DOWN')
				+ '</td> <td>{DOWN}</td> </tr></tpl>';
		html += '<tpl if="DOWN == 0"><tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getMonitorHostStatus('DOWN')
				+ '</td> <td>{DOWN}</td> </tr></tpl>';
		html += '<tpl if="CRITICAL &gt; 0"><tr class="dashboard-widget-table-tr" style="color:red;"> <td>' + Ecfa.Converter.getMonitorHostStatus('CRITICAL')
				+ '</td> <td>{CRITICAL}</td> </tr></tpl>';
		html += '<tpl if="CRITICAL == 0"><tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getMonitorHostStatus('CRITICAL')
				+ '</td> <td>{CRITICAL}</td> </tr></tpl>';
		html += '</table>';
		return html;
	},
	bindHostsHeaderLink : function() {
		Ext.get('dashboardView-hosts-more-link').on('click', Ext.bind(function() {
			Ecfa.Navigator.show('#opMonitor', '#monitorView monitorPanel hostGrid');
		}));
	},
	/* Services */
	getServicesWidgetHeader : function() {
		return this.getWidgetHeader(Locale.getMsg('view.monitor.service'), "dashboardView-services-more-link");
	},
	getServicesWidgetBody : function() {
		var html = '';
		html += '<table class="dashboard-widget-table" >';
		html += '<tr class="dashboard-widget-table-th"><td>' + Locale.getMsg('view.common.status') + '</td> <td>' + Locale.getMsg('view.dashboard.number')
				+ '</td> </tr>';
		html += '<tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getMonitorServiceStatus('OK') + '</td> <td>{OK}</td> </tr>';
		html += '<tpl if="WARNING &gt; 0"><tr class="dashboard-widget-table-tr" style="color:red;"> <td>' + Ecfa.Converter.getMonitorServiceStatus('WARNING')
				+ '</td> <td>{WARNING}</td> </tr></tpl>';
		html += '<tpl if="WARNING == 0"><tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getMonitorServiceStatus('WARNING')
				+ '</td> <td>{WARNING}</td> </tr></tpl>';
		html += '<tpl if="CRITICAL &gt; 0"><tr class="dashboard-widget-table-tr" style="color:red;"> <td>' + Ecfa.Converter.getMonitorServiceStatus('CRITICAL')
				+ '</td> <td>{CRITICAL}</td> </tr></tpl>';
		html += '<tpl if="CRITICAL == 0"><tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getMonitorServiceStatus('CRITICAL')
				+ '</td> <td>{CRITICAL}</td> </tr></tpl>';
		html += '<tpl if="UNKNOWN &gt; 0"><tr class="dashboard-widget-table-tr" style="color:red;"> <td>' + Ecfa.Converter.getMonitorServiceStatus('UNKNOWN')
				+ '</td> <td>{UNKNOWN}</td> </tr></tpl>';
		html += '<tpl if="UNKNOWN == 0"><tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getMonitorServiceStatus('UNKNOWN')
				+ '</td> <td>{UNKNOWN}</td> </tr></tpl>';
		html += '</table>';
		return html;
	},
	bindServicesHeaderLink : function() {
		Ext.get('dashboardView-services-more-link').on('click', Ext.bind(function() {
			Ecfa.Navigator.show('#opMonitor', '#monitorView monitorPanel servicePanel');
		}));
	},
	/* cost */
	getCostWidgetHeader : function() {
		return this.getWidgetHeader(Locale.getMsg('view.dashboard.cost.earnings'), "dashboardView-cost-more-link");
	},
	getCostWidgetBody : function() {
		var html = '';
		html += '<table class="dashboard-widget-table" >';
		html += '<tr class="dashboard-widget-table-th"><td>' + Locale.getMsg('view.dashboard.cost.soFar') + '</td> <td>'
				+ Locale.getMsg('view.dashboard.cost.dollars') + '</td><td>' + Locale.getMsg('view.usage.coreHours') + '</td></tr>';
		html += '<tpl for=".">';
		html += '<tr class="dashboard-widget-table-tr"> <td>' + Locale.getMsg('view.dashboard.cost.passday', '{key}') + '</td>';
		html += '<td>{[Ecfa.Format.currency(values.value1)]}</td>';
		html += '<td>{[Ecfa.Format.cost(values.value2)]}</td>';
		html += '</tpl>';
		html += '</table>';
		return html;
	},
	bindCostHeaderLink : function() {
		Ext.get('dashboardView-cost-more-link').on('click', Ext.bind(function() {
			Ecfa.Navigator.show('#usage');
		}));
	},
	/* Users */
	getUsersWidgetHeader : function() {
		return this.getWidgetHeader(Locale.getMsg('view.dashboard.user'), "dashboardView-users-more-link");
	},
	getUsersWidgetBody : function() {
		var html = '';
		html += '<table class="dashboard-widget-table" >';
		html += '<tr class="dashboard-widget-table-th"><td>' + Locale.getMsg('view.common.status') + '</td> <td>' + Locale.getMsg('view.dashboard.number')
				+ '</td> </tr>';
		html += '<tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getUserStatus('DELETE') + '</td> <td>{DELETE}</td> </tr>';
		html += '<tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getUserStatus('INACTIVE') + '</td> <td>{INACTIVE}</td> </tr>';
		html += '<tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.getUserStatus('ACTIVE') + '</td> <td>{ACTIVE}</td> </tr>';
		html += '</table>';
		return html;
	},
	bindUsersHeaderLink : function() {
		Ext.get('dashboardView-users-more-link').on('click', Ext.bind(function() {
			Ecfa.Navigator.show('#user', '#userView userGrid');
		}));
	},
	/* Not-done missions */
	getNotDoneMissionsWidgetHeader : function() {
		return this.getWidgetHeader(Locale.getMsg('view.dashboard.mission.notDoneWidget')/* , "dashboardView-not-done-missions-more-link" */);
	},
	getNotDoneMissionsWidgetBody : function() {

		var html = '';
		html += '<table class="dashboard-widget-table" >';
		html += '<tr class="dashboard-widget-table-th"><td>' + Locale.getMsg('view.common.status') + '</td> <td>' + Locale.getMsg('view.dashboard.number')
				+ '</td> </tr>';

		html += '<tr class="dashboard-widget-table-tr"> <td>' + '<a data-qtip="'
				+ Locale.getMsg('view.dashboard.mission.waiting.qtip', Ecfa.Converter.getMissionState('RDY'))
				+ '" id="dashboardView-not-done-missions-more-link-waiting" href="javascript:">' + Locale.getMsg('view.dashboard.mission.waiting') + '</a>'
				+ '</td> <td>{RDY}</td> </tr>';

		html += '<tr class="dashboard-widget-table-tr"> <td>' + '<a data-qtip="'
				+ Locale.getMsg('view.dashboard.mission.waiting.qtip', Ecfa.Converter.getMissionState('RUN'))
				+ '" id="dashboardView-not-done-missions-more-link-exceed" href="javascript:">'
				+ Locale.getMsg('view.dashboard.mission.exceedHours', Ecfa.Config.MISSION_EXCEED_HOURS) + '</a>' + '</td> <td>{RUN}</td> </tr>';

		html += '</table>';
		return html;
	},
	/* Done missions */
	getDoneMissionsWidgetHeader : function() {
		return this.getWidgetHeader(Locale.getMsg('view.dashboard.mission.doneWidget'), "dashboardView-done-missions-more-link");
	},
	getDoneMissionsWidgetBody : function() {

		var html = '<div id="dashboard-done-missions-widget-body" />';
		return html;
	},
	bindDoneMissionsHeaderLink : function() {
		Ext.get('dashboardView-done-missions-more-link').on('click', Ext.bind(function() {
			alert('"not implemented yet');
			// Ecfa.Navigator.show('#user', '#userView userGrid');
		}));
	},
	/* problems */
	getProblemsWidgetHeader : function() {
		return this.getWidgetHeader(Locale.getMsg('view.dashboard.problem.widget'), "dashboardView-problems-more-link");
	},
	getProblemsWidgetBody : function() {
		var html = '';
		html += '<table class="dashboard-widget-table" >';
		html += '<tr class="dashboard-widget-table-th"><td>' + Locale.getMsg('view.common.status') + '</td> <td>' + Locale.getMsg('view.dashboard.number')
				+ '</td> </tr>';
		html += '<tpl if="NEW &gt; 0"><tr class="dashboard-widget-table-tr" style="color:red;"> <td>' + Ecfa.Converter.problemStatus('NEW')
				+ '</td> <td>{NEW}</td> </tr></tpl>';
		html += '<tpl if="NEW == 0"><tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.problemStatus('NEW')
				+ '</td> <td>{NEW}</td> </tr></tpl>';
		
			html += '<tpl if="PROCESSING &gt; 0"><tr class="dashboard-widget-table-tr" style="color:red;"> <td>' + Ecfa.Converter.problemStatus('PROCESSING')
				+ '</td> <td>{PROCESSING}</td> </tr></tpl>';
		html += '<tpl if="PROCESSING == 0"><tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.problemStatus('PROCESSING')
				+ '</td> <td>{PROCESSING}</td> </tr></tpl>';

		html += '<tr class="dashboard-widget-table-tr"> <td>' + Ecfa.Converter.problemStatus('FINISH') + '</td> <td>{FINISH}</td> </tr>';
		html += '</table>';
		return html;
	},
	bindProblemsHeaderLink : function() {
		Ext.get('dashboardView-problems-more-link').on('click', Ext.bind(function() {
			Ecfa.Navigator.show('#problem');
		}));
	}

});
