Ext.define('Ecfa.view.audit.AuditSearchPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.auditSearchPanel',
	autoScroll : true,
	requires : [ 'Ecfa.ux.form.BoxSelect' ],
	title : Locale.getMsg('view.audit.filter'),
	initComponent : function() {
		var me = this;
		var now = new Date();
		var oneMinute = 60000;
		var oneHour = 3600000;
		var oneDay = 86400000;
		var fieldWidth = 190;
		var labelWidth = 110;

		me.items = [ {
			// layout: 'fit',
			plain : true,
			xtype : 'form',
			bodyPadding : 5,
			// title : Locale.getMsg('Vos.view.log.searchConditions'),
			region : 'center',
			margin : '5 5 5 5',
			items : [ {
				xtype : 'boxselect',
				itemId : 'categories',
				name : 'categories',
				tooltip : Locale.getMsg('view.common.mutipleSelect.qtip'),
				fieldLabel : Locale.getMsg('view.audit.category'),
				multiSelect : true,
				displayField : 'category',
				store : Ext.create('Ext.data.Store', {
					fields : [ 'category' ],
					proxy : {
						type : 'rest',
						url : 'rest/op/audits/categories',
						reader : {
							type : 'restTaskGrid'
						}
					}
				}),
				queryMode : 'remote',
				labelWidth : labelWidth,
				anchor : '100%'
			}, {
				xtype : 'textfield',
				itemId : 'subject',
				name : 'subject',
				fieldLabel : Locale.getMsg('view.audit.subject'),
				anchor : '100%',
				labelWidth : labelWidth
			}, {
				xtype : 'boxselect',
				itemId : 'userIds',
				name : 'userIds',
				tooltip : Locale.getMsg('view.common.mutipleSelect.qtip'),
				fieldLabel : Locale.getMsg('view.audit.userId'),
				multiSelect : true,
				displayField : 'id',
				store : Ext.create('Ecfa.store.auth.User', {
					proxy : {
						type : 'rest',
						url : 'rest/op/auth/allusers',
						reader : {
							type : 'restTaskGrid'
						}
					}
				}),
				queryMode : 'remote',
				labelWidth : labelWidth,
				anchor : '100%'
			}, {
				xtype : 'textfield',
				tooltip : Locale.getMsg('view.audit.ip.noReg'),
				fieldLabel : Locale.getMsg('view.resource.render.ip'),
				itemId : 'ip',
				name : 'ip',
				labelWidth : labelWidth,
				anchor : '100%'
			}, {
				xtype : 'textfield',
				fieldLabel : Locale.getMsg('view.audit.description'),
				itemId : 'description',
				name : 'description',
				tooltip : Locale.getMsg('view.audit.description.tooltip'),
				labelWidth : labelWidth,
				anchor : '100%'
			}, {
				xtype : 'fieldset',
				title : Locale.getMsg('view.audit.timeRange'),
				// TODO use dateTimeField
				items : [ {
					xtype : 'button',
					text : Locale.getMsg('view.audit.dateTime.hr', 1),
					handler : function() {
						me.setStartDateTime(new Date(now.getTime() - oneHour));
					}
				}, {
					xtype : 'button',
					text : Locale.getMsg('view.audit.dateTime.hr', 3),
					handler : function() {
						me.setStartDateTime(new Date(now.getTime() - oneHour * 3));
					}
				}, {
					xtype : 'button',
					text : '1天',
					handler : function() {
						me.setStartDateTime(new Date(now.getTime() - oneDay));
					}
				}, {
					xtype : 'button',
					text : '3天',
					handler : function() {
						me.setStartDateTime(new Date(now.getTime() - oneDay * 3));
					}
				}, {
					xtype : 'button',
					text : '10天',
					handler : function() {
						me.setStartDateTime(new Date(now.getTime() - oneDay * 10));
					}
				}, {
					xtype : 'button',
					text : '30天',
					handler : function() {
						me.setStartDateTime(new Date(now.getTime() - oneDay * 30));
					}
				}, {
					xtype : 'datefield',
					name : 'startDate',
					itemId : 'startDate',
					fieldLabel : Locale.getMsg('view.audit.startDate'),
					allowBlank : false,
					format : Ecfa.Config.DATE_FORMAT,
					anchor : '100%',
					// value : now,
					labelWidth : labelWidth,
					width : fieldWidth
				}, {
					xtype : 'timefield',
					name : 'startTime',
					itemId : 'startTime',
					fieldLabel : Locale.getMsg('view.audit.startTime'),
					allowBlank : false,
					format : Ecfa.Config.TIME_FORMAT,
					anchor : '100%',
					// value : new Date(now.getTime() - oneHour),
					increment : 60,
					labelWidth : labelWidth,
					width : fieldWidth
				}, {
					xtype : 'datefield',
					name : 'endDate',
					itemId : 'endDate',
					fieldLabel : Locale.getMsg('view.audit.endDate'),
					allowBlank : false,
					format : Ecfa.Config.DATE_FORMAT,
					anchor : '100%',
					value : now,
					labelWidth : labelWidth,
					width : fieldWidth
				}, {
					xtype : 'timefield',
					name : 'endTime',
					itemId : 'endTime',
					fieldLabel : Locale.getMsg('view.audit.endTime'),
					allowBlank : false,
					format : Ecfa.Config.TIME_FORMAT,
					anchor : '100%',
					value : '23:59:59',
					increment : 60,
					labelWidth : labelWidth,
					width : fieldWidth
				} ]
			}, {
				xtype : 'checkboxgroup',
				title : Locale.getMsg('view.audit.protalType'),
				allowBlank : false,
				blankText : Locale.getMsg('view.common.groupNotAllowBlank'),
				items : [ {
					boxLabel : 'OP',
					name : 'protalTypes',
					inputValue : 'OP',
					checked : true
				}, {
					boxLabel : 'UP',
					name : 'protalTypes',
					inputValue : 'UP',
					checked : true
				} ]
			} ],

			buttons : [ {
				height : 30,
				text : Locale.getMsg('view.common.clear'),
				handler : function() {
					var form = this.up('form');
					form.down('#categories').reset();
					form.down('#subject').reset();
					form.down('#userIds').reset();
					form.down('#ip').reset();
					form.down('#description').reset();
				}
			}, {
				height : 30,
				type : 'submit',
				icon : 'css/images/search_16.png',
				itemId : 'search',
				formBind : true,
				text : Locale.getMsg('view.audit.search')
			} ]

		} ];

		me.callParent(arguments);

		me.setStartDateTime(new Date(now.getTime() - oneHour));
	},
	setStartDateTime : function(timestamp) {
		var startTimeField = this.down('#startTime');
		var startDateField = this.down('#startDate');
		if (startTimeField.el) {
			startTimeField.el.highlight();
		}
		if (startDateField.el) {
			startDateField.el.highlight();
		}
		startTimeField.setValue(timestamp);
		startDateField.setValue(timestamp);
	}

});
