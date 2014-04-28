// for OP
Ext.define('Ecfa.view.monitor.UsageGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.usageGrid',
	itemId : 'usageGrid',
	header : false,
	viewConfig : {
		preserveScrollOnRefresh : true, // 官方 : grid refresh後保留scroll bar位置而不會回捲到最頂
		preserveSelectionOnRefresh : true	// 自定義: grid refresh後保留selection，預設就是打開
	},
	listeners : {
		beforeRender : function(thisGrid, options) {
			if (!Ecfa.Config.isOP()) {
				this.down('#ipAddress').setVisible(false);
			}
		}
	},

	initComponent : function() {
		var me = this;

		me.store = Ext.create('Ecfa.store.monitor.Host');//Ecfa.StoreUtil.getStore('hosts');
		var allhostProxy = Ext.data.proxy.Proxy({
			url : 'rest/op/monitor/hosts/all',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		me.store.setProxy(allhostProxy);
		me.poolRender = Ecfa.StoreUtil.deepCloneStore(Ecfa.StoreUtil.getStore('poolRender'));
		
		me.columns = [ {
			header : Locale.getMsg('view.monitor.host.name'),
			dataIndex : 'name',
			flex : 1.0,
			renderer : function(value, meta, record) {
				meta.style = 'background-color: #FFFFCC !important;cursor: pointer;';
				meta.tdAttr = 'data-qtip="' + Locale.getMsg('view.resource.pool.showDetail') + '"';
				meta.style = 'cursor: pointer;';
				return value;
			}
		}, {
			header : 'ipAddress',
			dataIndex : 'ipAddress',
			fles : 1.0,
			itemId : 'ipAddress'
		} ];

		var tbarItems = [];

		if (Ecfa.Config.isOP()) {
			tbarItems.push({
				itemId : 'poolCombo',
				xtype : 'combobox',
				fieldLabel : Locale.getMsg('view.resource.pool.title'),
				labelWidth : 70,
				labelAlign : 'left',
				name : 'pool',
				store : Ecfa.StoreUtil.getStore('pools'),// Ext.create('Ecfa.store.resource.Pool'),
				queryMode : 'remote',
				editable : false,
				displayField : 'name',
				valueField : 'oid',
				emptyText : Locale.getMsg('view.resource.pool.select'),
				listeners : {
					select : function(combo, records, eOpts) {
						//console.log('combo select', me.poolRender,records[0].data.oid);						
					    me.setLoading(true);						
						me.getPoolHosts(records[0].data.oid);							
						
						/*me.store.clearFilter(true);
						me.bindStore(Ecfa.StoreUtil.deepCloneStore(Ecfa.StoreUtil.getStore('hosts')));
						me.poolRender.load({
							id : records[0].data.oid, // pool oid
							callback : function(records, operation, success) {
								me.setLoading(false);

								me.store.filter([ {
									filterFn : function(item) {
										// console.log('item',item);
										for ( var i = 0; i < me.poolRender.getCount(); i++) {
											// console.log('render',me.poolRender.getAt(i).data.ipAddress);
											if (item.data.ipAddress == me.poolRender.getAt(i).data.ipAddress)
												return true;
										}
										return false;
									}
								} ]);

								if (me.store.getCount() != 0) {
									me.getSelectionModel().select(0);
								}else{
									//Stop previous timer on usage Grid
									me.up('#usagePanel').down('#cpuChart').stopTimer();
									me.up('#usagePanel').down('#networkChart').stopTimer();
								}									
							}
						});*/
					}
				}
			}, '-', {
				text : Locale.getMsg('view.monitor.add.nagiosWeb'),
				icon : 'css/images/webAdd_16x16.png',
				handler : function() {
					window.open(me.up('monitorView').nagios);
				}
			}, {
				icon : 'css/images/refresh.png',
				text : Locale.getMsg('view.monitor.hostUsage.refreshAll'),
				handler : function() {
					me.down('#poolCombo').reset();
					me.store.clearFilter(true);
					me.store.load();
				}
			});
		} else { /* UP refresh */
			tbarItems.push({
				icon : 'css/images/refresh.png',
				text : Locale.getMsg('view.common.refresh'),
				handler : function() {
					me.load();
				}
			});
		}

		me.tbar = tbarItems;
		me.callParent(arguments);

		Ecfa.event.HostUsage.on({
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
	load : function() {
		var me = this;
        
		if (!Ecfa.Config.isOP()) {
			var poolRenderProxy = Ext.data.proxy.Proxy({
				url : 'rest/monitor/pool',
				type : 'rest',
				reader : {
					type : 'restTaskGrid'
				}
			});
			me.store.setProxy(poolRenderProxy);
		}
		me.store.load({
			callback : function(records, operation, success) {
				if (success) { // reselect selection
					if (me.store.getCount() != 0) {
						if (me.getSelectionModel().getCount() != 0) {
							var index = me.getSelectionModel().getSelection()[0].index;
							me.getSelectionModel().deselectAll(); // Deselect orignial record,otherwise it won't trigger select event
							me.getSelectionModel().select(index);
						} else {
							me.getSelectionModel().select(0);
						}
					}
				}
			   }
			});
	},
	getPoolHosts : function(poolId) {
		var me = this;
		
		Ecfa.Restful.request({
			url : 'rest/op/monitor/pool',
			method : 'GET',
			params : {
				poolId : poolId
			},
			success : function(jsonResp) {
				//console.log('success',jsonResp);
				me.setLoading(false);
				me.store.loadData(jsonResp.target, false);	
				
				//Stop timer on usage Grid
				me.up('#usagePanel').down('#cpuChart').stopTimer();
				me.up('#usagePanel').down('#networkChart').stopTimer();
				
				//Select first host record
				if (me.store.getCount() != 0) {
					me.getSelectionModel().select(0);
				}	
			},
			failure : function(jsonResp) {
				console.log('fail',jsonResp);
			}
		});
	}
});
