Ext.define('Ecfa.view.Viewport', {
	extend : 'Ext.container.Viewport',
	renderTo : Ext.getBody(),

	requires : [

	// Utils
	'Ecfa.Session', 'Ecfa.util.Format', 'Ecfa.util.StoreUtil', 'Ecfa.util.Validator', 'Ecfa.util.AuthValidator', 'Ecfa.util.Restful', 'Ecfa.locale.Converter',
			'Ext.util.Cookies',

			'Ecfa.util.JsonWriter', 'Ecfa.util.Characteristic', 'Ecfa.util.SpecUtil', 'Ecfa.util.Navigator',

			// events
			'Ecfa.event.Project', 'Ecfa.event.Invitation', 'Ecfa.event.Submission', 'Ecfa.event.User', 'Ecfa.event.Mission', 'Ecfa.event.Session',
			'Ecfa.event.Folder', 'Ecfa.event.Pool', 'Ecfa.event.Render', 'Ecfa.event.PoolRender', 'Ecfa.event.License', 'Ecfa.event.Product',
			'Ecfa.event.File', 'Ecfa.event.Track', 'Ecfa.event.Problem', 'Ecfa.event.Discuss', 'Ecfa.event.Host', 'Ecfa.event.Service',
			'Ecfa.event.MonitorProblem', 'Ecfa.event.Notification', 'Ecfa.event.HostUsage', 'Ecfa.event.HostUsageChart', 'Ecfa.event.Balance',
			'Ecfa.event.Version',

			// actions
			'Ecfa.action.Action', 'Ecfa.view.usage.action.PointPlusAction',

			// views
			'Ecfa.ux.toolbar.NotifyBar', 'Ecfa.ux.IFrame', 'Ecfa.view.usage.BalanceLabel', 'Ecfa.view.queue.MissionView', 'Ecfa.view.queue.MissionUserView',
			'Ecfa.view.project.ProjectView', 'Ecfa.view.queue.SubmitView', 'Ecfa.view.auth.EditAccountWin', 'Ecfa.ux.grid.column.ComponentColumn',
			'Ecfa.view.auth.UserView', 'Ecfa.view.auth.OpUserView', 'Ecfa.view.license.LicensePanel', 'Ecfa.view.resource.ResourceView', 'Ecfa.view.problem.ProblemView',
			'Ecfa.view.usage.UsageView', 'Ecfa.view.monitor.MonitorView', 'Ecfa.view.dashboard.DashboardView', 'Ecfa.view.audit.AuditView',
			'Ecfa.view.version.VersionView',

			// win
			'Ecfa.view.about.OpenSourceLicenseWin',

			// views ux
			'Ecfa.ux.image.ImageViewer', 'Ecfa.ux.image.MultiImageViewer', 'Ecfa.view.common.ColumnsGrid', 'Ecfa.ux.button.LinkButton'

	// , 'Ecfa.ux.panel.upload.uploader.ExtJsUploader'
	// 'Ecfa.view.project.WaitingInvitationWin'
	],
	id : 'viewport',
	layout : 'border',
	defaults : {
		border : false,
		xtype : 'container'
	},
	initComponent : function() {
		var me = this;

		// init Highcharts default setting
		Highcharts.setOptions({
			// xAxis : {
			// dateTimeLabelFormats : {
			// second : '%H:%M:%S',
			// minute : '%H:%M',
			// hour : '%H:%M',
			// day : '%b %e',
			// week : '%b %e',
			// month : '%Y-%b',
			// year : '%Y'
			// },
			// },
			exporting : {
				enabled : false
			},
			global : {
				useUTC : false
			},
			credits : {
				enabled : false
			}
		});

		Ecfa.Session.getSession();
		NProgress.done(true);

		var menuItems = [];

		// **** UP menuItems ****//
		if (Ecfa.Config.isOP() === false) {

			menuItems.push({
				itemId : 'submit',
				historable : true,
				icon : 'css/images/cloud_submit_20.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				text : Locale.getMsg('view.queue.menu.submitView'),
				handler : function() {
					me.determineActivePage('submitView', false, this);
				}
			}, '-', {
				itemId : 'mission',
				historable : true,
				icon : 'css/images/taskManager_18.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				pressed : true,
				text : Locale.getMsg('view.mission.title'),
				handler : function() {
					me.determineActivePage('missionView', false, this);
				}
			}, {
				itemId : 'missionHistory',
				historable : true,
				icon : 'css/images/history_20.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				text : Locale.getMsg('view.history.title'),
				handler : function() {
					me.determineActivePage('missionHistoryView', false, this);
				}

			}, {
				itemId : 'missionUser',
				icon : 'css/images/list_16.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				text : Locale.getMsg('view.queue.menu.myView'),
				handler : function() {
					me.determineActivePage('missionUserView', false, this);
				}
			}, '-', {
				itemId : 'project',
				icon : 'css/images/clapperboard_16x16.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				text : Locale.getMsg('view.project.projects'),
				handler : function() {
					me.determineActivePage('projectView', false, this);
				}
			}, {
				itemId : 'user',
				icon : 'css/images/user_16x16.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				text : Locale.getMsg('view.auth.title'),
				handler : function() {
					me.determineActivePage('userView', false, this);
				}
			}, {
				hidden : true,
				itemId : 'usage',
				icon : 'css/images/money_16.png',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				scale : 'medium',
				text : Locale.getMsg('view.usage.title'),
				handler : function() {
					me.determineActivePage('usageView', false, this);
				}
			}, '-', {
				itemId : 'upMonitor',
				icon : 'css/images/monitor_16x16.png',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				scale : 'medium',
				hidden : true,
				text : Locale.getMsg('view.monitor.title'),
				handler : function() {
					me.determineActivePage('monitorView', false, this);
				}
			});
		}
		// **** OP menuItems ****//
		else {
			menuItems.push({
				itemId : 'dashboard',
				icon : 'css/images/dashboard_16.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				pressed : true,
				allowDepress : false,
				text : Locale.getMsg('view.dashboard.title'),
				handler : function() {
					me.determineActivePage('dashboardView', false, this);
				}
			}, {
				itemId : 'opUser',
				id : 'userManagement', // TODO don't use id
				icon : 'css/images/user_16x16.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				text : Locale.getMsg('view.auth.title'),
				handler : function() {
					me.determineActivePage('opUserView', false, this);
				}
			}, '-', {
				itemId : 'license',
				icon : 'css/images/paper_16.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				text : Locale.getMsg('view.license.title'),
				handler : function() {
					me.determineActivePage('licensePanel', false, this);
				}
			}, '-', {
				itemId : 'resource',
				id : 'resourceManagement', // TODO don't use id
				icon : 'css/images/server_16.png',
				scale : 'medium',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				text : Locale.getMsg('view.resource.title'),
				handler : function() {
					me.determineActivePage('resourceView', false, this);
				}
			}, '-', {
				itemId : 'usage',
				icon : 'css/images/money_16.png',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				scale : 'medium',
				text : Locale.getMsg('view.usage.title'),
				handler : function() {
					me.determineActivePage('usageView', false, this);
				}
			}, {
				itemId : 'missionClassify',
				icon : 'css/images/listerror_16.png',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				scale : 'medium',
				text : Locale.getMsg('view.mission.undone.title'),
				handler : function() {
					me.determineActivePage('missionClassifyView', false, this);
				}
			}, '-', {
				itemId : 'opMonitor',
				icon : 'css/images/monitor_16x16.png',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				scale : 'medium',
				text : Locale.getMsg('view.monitor.title'),
				handler : function() {
					me.determineActivePage('monitorView', false, this);
				}
			}, {
				itemId : 'audit',
				icon : 'css/images/audit_16.png',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				scale : 'medium',
				text : Locale.getMsg('view.audit.title'),
				handler : function() {
					me.determineActivePage('auditView', false, this);
				}
			}, {
				itemId : 'version',
				icon : 'css/images/old_versions_16x16.png',
				height : 30,
				toggleGroup : 'mainbar',
				allowDepress : false,
				scale : 'medium',
				text : Locale.getMsg('view.version.title'),
				handler : function() {
					me.determineActivePage('versionView', false, this);
				}
			});
		}

		// **** Common menuItems ****//

		menuItems.push(' ', {
			xtype : 'notifybar',
			id : 'notifybar',
			maxWidth : 600
		}, '->', {
			itemId : 'accountmenu',
			menu : {
				showSeparator : false,
				defaults : {
					plain : true
				},
				items : [ {
					text : Locale.getMsg('view.session.signout'),
					itemId : 'signout',
					handler : function() {
						me.determineActivePage('./signout', true, this);
					}
				}, {
					text : Locale.getMsg('view.account.title'),
					itemId : 'myAccount',
					handler : function() {
						Ext.widget('editAccountWin').show();
						// me.determineActivePage('accountGrid', false, this);
					}
				} ]
			},
			listeners : {
				render : function() {
					var me = this;

					me.setText(Ecfa.Session.getUser().id);
					// Disable editAccount option in OP
					if (Ecfa.Config.isOP() === true)
						me.menu.down('#myAccount').setVisible(false);
				}
			}
		}, {
			itemId : 'balance',
			xtype : 'balanceLabel',
			tooltip : Locale.getMsg('view.billing.history')
		}, {

			itemId : 'pointplus',
			xtype : 'container',
			items : [ Ext.create('Ext.button.Button', new Ecfa.view.usage.action.PointPlusAction({
				tooltip : Locale.getMsg('view.billing.pointplus')
			})) ]

		}, '-', {
			itemId : 'problem',
			icon : 'css/images/problem_report_16x16.png',
			height : 30,
			toggleGroup : 'mainbar',
			allowDepress : false,
			scale : 'medium',
			text : Locale.getMsg('view.problem.title'),
			handler : function() {
				me.determineActivePage('problemView', false, this);
			}
		}, '-', {
			height : 30,
			text : Locale.getMsg('view.language'),
			menu : {
				showSeparator : false,
				items : [ {
					plain : true,
					text : 'English',
					handler : function() {
						Locale.setLanguage('en_US');
						location.reload();
						// me.determineActivePage('?lang=en_US', true, this);
					}
				}, {
					plain : true,
					text : '繁體中文',
					handler : function() {
						Locale.setLanguage('zh_TW');
						location.reload();
						// me.determineActivePage('?lang=zh_TW', true, this);
					}
				}, {
					plain : true,
					text : '简体中文',
					handler : function() {
						Locale.setLanguage('zh_CN');
						location.reload();
						// me.determineActivePage('?lang=zh_CN', true, this);
					}
				} ]
			}
		}, '-', {
			height : 30,
			text : Locale.getMsg('view.about'),
			menu : {
				showSeparator : false,
				items : [
				// {
				// plain : true,
				// text : '操作說明',
				// handler : function() {
				// }
				// },
				{
					plain : true,
					text : Locale.getMsg('view.about.openSourceLicense'),
					handler : function() {
						Ext.widget('openSourceLicenseWin').show();
					}
				}, {
					plain : true,
					text : Locale.getMsg('view.about.us'),
					handler : function() {
						Ext.MessageBox.show({
							title : Locale.getMsg('view.about.us'),
							msg : Locale.getMsg('view.about.us.msg'),
							buttons : Ext.MessageBox.OK
						});
					}
				} ]

			}
		});

		// console.log(menuItems);
		// console.log('main menu--------',Ext.Array.indexOf(menuItems,'menu'));

		var viewItems = [];
		// **** UP viewItems ****//
		if (Ecfa.Config.isOP() === false) {
			viewItems.push({
				itemId : 'missionView',
				xtype : 'missionView',
				type : Ecfa.Const.ViewType.Mission.RUNNING
			}, {
				itemId : 'missionHistoryView',
				xtype : 'missionView',
				type : Ecfa.Const.ViewType.Mission.HISTORICAL
			}, {
				itemId : 'projectView',
				xtype : 'projectView'
			}, {
				itemId : 'submitView',
				xtype : 'submitView'
			}, {
				itemId : 'missionUserView',
				xtype : 'missionUserView'
			},{
				itemId : 'userView',
				xtype : 'userView'
			});
		}
		// **** OP viewItems ****//
		else {
			viewItems.push({
				itemId : 'dashboardView',
				xtype : 'dashboardView'
			}, {
				itemId : 'opUserView',
				xtype : 'opUserView'
			}, {
				itemId : 'licensePanel',
				xtype : 'licensePanel'
			}, {
				itemId : 'resourceView',
				xtype : 'resourceView'
			}, {
				itemId : 'missionClassifyView',
				xtype : 'missionView',
				type : Ecfa.Const.ViewType.Mission.PEND
			}, {
				itemId : 'auditView',
				xtype : 'auditView'
			}, {
				itemId : 'versionView',
				xtype : 'versionView'
			});
		}
		// **** Common viewItems ****//
		viewItems.push({
			id : 'downloadIframe',
			xtype : 'ecfaiframe'
		}, {
			itemId : 'problemView',
			xtype : 'problemView'
		}, {
			itemId : 'usageView',
			xtype : 'usageView'
		}, {
			itemId : 'monitorView',
			xtype : 'monitorView'
		});

		// NProgress.inc();

		// put menus and views to viewport
		me.items = [ {
			itemId : 'mainCards',
			xtype : 'panel',
			region : 'center',
			layout : 'card',
			tbar : Ext.create('Ecfa.view.MainToolbar', {
				itemId : 'mainToolbar',
				id : 'mainToolbar',
				items : menuItems
			}),
			items : viewItems
		} ];

		me.callParent(arguments);

		me.on({
			afterrender : function() {
				// warning message for old IE
				if (Ext.isIE6 || Ext.isIE7 || Ext.isIE8 || Ext.isIE9) {
					Ext.getCmp('notifybar').showError(Locale.getMsg('view.oldBrowserWarning'));
				}
			}
		});

		/* Hide(or show) usageView when current user has no projects (or has at least one project) */
		if (Ecfa.Config.isUP()) {
			Ecfa.StoreUtil.getStore('detailProjects').on({
				load : function(store, records, successful) {
					me.down('#usage').hide();
					// me.down('#balance').hide();
					if (successful && records.length > 0) {
						for ( var i = 0, len = records.length; i < len; i++) {
							if (records[i].get('projectRole') === Ecfa.Const.Project.Role.OWNER) {
								me.down('#usage').show();
								// me.down('#balance').show();
								break;
							}
						}
					}
				}
			});

			/* Determine user has dedicate pool,if yes shows montitor option */
			/*
			 * Ecfa.Restful.request({ url : 'rest/billing/balance', method : 'GET', params: { userId : Ecfa.Session.getUser().id }, success : function(jsonResp) {
			 * me.down('#upMonitor').hide(); if(jsonResp['target']['poolSubscriber']){ me.down('#upMonitor').show(); } }, failure : function(jsonResp) { } });
			 */
		} else {
			me.down('#balance').hide();
			me.down('#balance').stopTask();
			me.down('#pointplus').hide();
		}

		console.info('viewport is created');

	},

	// pageName can be card panel or URL if isRedirect is fasle or true,
	// respectively
	determineActivePage : function(pageName, isRedirect, button) {

		var me = this;
		if (isRedirect) {
			location.href = pageName;
		} else {
			me.down('#mainCards').getLayout().setActiveItem(pageName);
			// me.down('#mainToolbar').select(button);
		}

	}
});
