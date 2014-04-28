// for OP
Ext.define('Ecfa.view.monitor.ServiceOverviewGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.serviceOverviewGrid',
	store : 'monitor.ServiceOverview',
	header : false,	
	loadMask : true,
	viewConfig : {
		preserveScrollOnRefresh : true, // 官方 : grid refresh後保留scroll bar位置而不會回捲到最頂
		preserveSelectionOnRefresh : false, // 自定義: grid refresh後保留selection，預設就是打開
		getRowClass : function(record, index) {
			return 'cursorPointer';
		}
	},
	
	initComponent : function() {
		var me = this;

		me.columns = [ {
			header : Locale.getMsg('view.monitor.host.name'),
			dataIndex : 'name',
			flex : 1.0
		},{
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'hostStatus',
			flex : 0.5,
			renderer : function(value, meta, record) {
				if (value === Ecfa.Const.MonitorStatus.UP) {
					meta.style = 'background-color: #e2ffe2 !important;'; // Green
				}
				return Ecfa.Converter.getMonitorHostStatus(value);
			}

		},{
			header : Locale.getMsg('view.monitor.service.status'),
			xtype : 'componentcolumn',
			flex : 1.0,
			renderer : function(value, metadata, record) {
				return {
					xtype : 'container',					
					items : [{
						itemId : record.get('oid')+'_okBtn',
						xtype: 'button',
						height : 20,
						margin : '0 5 0 5',
			            //cls : 'service-ok-btn',
			            text : record.get('ok')+' '+Locale.getMsg('view.monitor.service.status.OK'),
			            renderer : function(){
			            	console.log('testtesttes');
			            }
			        },{
			        	itemId : record.get('oid')+'_criticalBtn',
			            xtype: 'button',
			            height : 20,
			            margin : '0 5 0 0',
			            //cls : 'service-critical-btn',
			            text : record.get('critical')+' '+Locale.getMsg('view.monitor.service.status.CRITICAL')
			        },{
			        	itemId : record.get('oid')+'_warningBtn',
			            xtype: 'button',
			            height : 20,
			            margin : '0 5 0 0',
			            //cls : 'service-warning-btn',
			            text : record.get('warning')+' '+Locale.getMsg('view.monitor.service.status.WARNING')
			        },{
			        	itemId : record.get('oid')+'_unknownBtn',
			            xtype: 'button',
			            height : 20,
			            //cls : 'service-unknown-btn',
			            text : record.get('unknown')+' '+Locale.getMsg('view.monitor.service.status.UNKNOWN')
			        }],
			        listeners: { 
                        beforerender:function(comp, meta, rec) { 
                        	//console.log('component beforerender',record,this);
                        	if(record.get('ok')!=0){
                        		//this.down('#'+record.get('oid')+'_okBtn').setVisible(true);
                        		this.down('#'+record.get('oid')+'_okBtn').cls = 'service-ok-btn';
                        	}
                        	if(record.get('critical')!=0){
                        		//this.down('#'+record.get('oid')+'_criticalBtn').setVisible(true);
                        		this.down('#'+record.get('oid')+'_criticalBtn').cls = 'service-critical-btn';
                        	}
                        	if(record.get('warning')!=0){
                        		//this.down('#'+record.get('oid')+'_warningBtn').setVisible(true);
                        		this.down('#'+record.get('oid')+'_warningBtn').cls = 'service-warning-btn';
                        	}
                        	if(record.get('unknown')!=0){
                        		//this.down('#'+record.get('oid')+'_unknownBtn').setVisible(true);
                        		this.down('#'+record.get('oid')+'_unknownBtn').cls = 'service-unknown-btn';
                        	}
                        } 
                    } 
				};
			}
		}];

		me.tbar = [ {
			text : Locale.getMsg('view.monitor.add.nagiosWeb'),
			icon : 'css/images/webAdd_16x16.png',
			handler : function() {
				window.open(me.up('monitorView').nagios);
			}
		}, {
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.store.load();
				me.up('monitorView').refreshActiveTab();
			}
		}, '-', {
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

		// paging bar on the bottom
		me.bbar = Ext.create('Ext.PagingToolbar', {
			store : me.store,
			displayInfo : true
		});

		me.callParent(arguments);

		Ecfa.event.Service.on({
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
	loadFilter : function() {
		var me = this;
		//console.log('serviceOverview loadFilter', me.down('#hostOs').getValue(), me.down('#hostType').getValue());
		me.up('#servicePanel').down('#serviceGrid').store.loadData([],false);

		var store = me.store;
		Ext.apply(store.proxy.extraParams, {
			hostName : me.down('#hostName').getValue(),
			hostIp : me.down('#hostIp').getValue(),
			hostOs : me.down('#hostOs').getValue(),//getRawValue(),
			hostType : me.down('#hostType').getValue()//getRawValue()
		});

		store.currentPage = 1;
		store.load();  //TODO : add select(0) in callback and define select event to load serviceGrid in controller
	}
});
