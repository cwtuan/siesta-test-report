// for OP
Ext.define('Ecfa.view.monitor.HostGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.hostGrid',
	// store : 'monitor.Host',
	header : false,
	viewConfig : {
		getRowClass : function(record) {
			/*
			 * if (record.get('status') === Ecfa.Const.MonitorStatus.UP) { return 'host-status-up'; // Green } else
			 */
			if (record.get('status') === Ecfa.Const.MonitorStatus.DOWN) {
				return 'host-status-down'; // Red
			} else if (record.get('status') === Ecfa.Const.MonitorStatus.UNREACHABLE) {
				return 'host-status-unreachable'; // Yellow
			}
		}
	},

	initComponent : function() {
		var me = this;

		me.store = Ecfa.StoreUtil.getStore('hosts');

		me.columns = [ {
			header : Locale.getMsg('view.monitor.host.name'),
			dataIndex : 'name',
			flex : 1.0
		}, {
			header : Locale.getMsg('view.resource.render.ip'),
			dataIndex : 'ipAddress',
			flex : 1.0
		},{
			itemId : 'status',
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 0.5,
			renderer : function(value, meta, record) {
				if (value === Ecfa.Const.MonitorStatus.UP) {
					meta.style = 'background-color: #e2ffe2 !important;'; // Green
				}/*
					 * else if (value === Ecfa.Const.MonitorStatus.DOWN) { meta.style = 'background-color: #F00000 !important;'; // Red } else if (value ===
					 * Ecfa.Const.MonitorStatus.UNREACHABLE) { meta.style = 'background-color: #FFFF00 !important;'; // Yellow }
					 */
				return Ecfa.Converter.getMonitorHostStatus(value);
			}
		}, {
			itemId : 'lastcheck',
			header : Locale.getMsg('view.monitor.lastcheck'),
			dataIndex : 'lastcheck',
			flex : 1.0
		}, {
			itemId : 'duration',
			header : Locale.getMsg('view.monitor.duration'),
			dataIndex : 'duration',
			flex : 0.5
		}, {
			itemId : 'statusInfo',
			header : Locale.getMsg('view.monitor.statusInfo'),
			dataIndex : 'info',
			flex : 1.5
		}, {
			itemId : 'lastnotification',
			header : Locale.getMsg('view.monitor.lastnotification'),
			dataIndex : 'lastnotification',
			flex : 1.0,
			xtype : 'componentcolumn',
			renderer : function(value, meta, record) {
				meta.tdAttr = 'data-qtip="' + Locale.getMsg('view.monitor.host.viewLastNotification') + '"';

				return {
					xtype : 'container',
					items : [ {
						xtype : 'linkButton',
						columnWidth : 0.2,
						text : value,
						listeners : {
							click : function() {
								me.up('monitorView').getLastNotificationTabs(record);
							}
						}
					} ]
				};
			}
		} ];

		me.tbar = [ {
			text : Locale.getMsg('view.monitor.add.nagiosWeb'),
			icon : 'css/images/webAdd_16x16.png',
			handler : function() {
				console.log('nagios', me.up('monitorView').nagios);
				window.open(me.up('monitorView').nagios);
			}
		}, {
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.store.load();
				me.up('monitorView').refreshActiveTab();
			}
		},'-',{
			text: Locale.getMsg('view.monitor.host.search'),
            icon: 'css/images/search_16.png',
            menu: {
                xtype: 'menu',
                plain: true,
                defaults: {
                    margin : '5 5 5 5'
                },
                items: [{
        			itemId : 'hostName',
        			xtype : 'textfield',
        			fieldLabel : Locale.getMsg('view.monitor.host.name'),
        			labelWidth : 70,
        			width : 270
        		}, {
        			itemId : 'hostIp',
        			xtype : 'textfield',
        			tooltip : Locale.getMsg('view.audit.ip.noReg'),
        			fieldLabel : Locale.getMsg('view.resource.render.ip'),
        			labelWidth : 70,
        			width : 270
        		},{
        			itemId : 'hostOs',
        			xtype : 'combo',
        			name : 'os',
        			tooltip : Locale.getMsg('view.common.mutipleSelect.qtip'),
        			fieldLabel : Locale.getMsg('view.monitor.host.os'),
        			multiSelect : true,
        			queryMode : 'local',
        			displayField : 'display',
        			valueField : 'number',// 'value',
        			store : Ext.create('Ecfa.store.monitor.HostOS'),
        			labelWidth : 70,
        			width : 270
        		}, {
        			itemId : 'hostType',
        			xtype : 'combo',
        			name : 'type',
        			tooltip : Locale.getMsg('view.common.mutipleSelect.qtip'),
        			fieldLabel : Locale.getMsg('view.monitor.host.type'),
        			queryMode : 'local',
        			displayField : 'display',
        			valueField : 'number',// 'value',
        			multiSelect : true,
        			store : Ext.create('Ecfa.store.monitor.HostType'),
        			labelWidth : 70
        		},{
        			height : 30,
        			xtype : 'button',
        			type : 'submit',
        			icon : 'css/images/search_16.png',
        			itemId : 'search',
        			text : Locale.getMsg('view.audit.search'),
        			handler : function(){
        			   me.loadFilter();
        			}
        		}]
            }
        }];

		me.bbar = Ext.create('Ext.PagingToolbar', {
			store : me.store,
			displayInfo : true
		});

		me.callParent(arguments);

		me.on({
			activate : function() {
				// console.log('HostGrid activate',me.store.getProxy().url);
				// me.store.load();
				me.loadFilter();
			}
		});

		Ecfa.event.Host.on({
			destroyed : function() {
				me.getStore().load();
			},
			created : function(rec, op) {
				me.getStore().load();
			},
			updated : function(rec, op) {
				me.getStore().load();
			},
			fail : function(rec, op) {

			},
			running : function(isRunning) {
				me.setLoading(isRunning);
			}
		});
	},
	loadFilter : function(){
		var me = this;
		// console.log('loadFilter',me.down('#hostOs').getValue(),me.down('#hostType').getValue());
		
		var store = me.store;
		Ext.apply(store.proxy.extraParams, {
			hostName : me.down('#hostName').getValue(),
			hostIp : me.down('#hostIp').getValue(),
			hostOs : me.down('#hostOs').getValue(),// getRawValue(),
			hostType : me.down('#hostType').getValue()// getRawValue()
		});

		store.currentPage = 1;
		store.load();
	}
});
