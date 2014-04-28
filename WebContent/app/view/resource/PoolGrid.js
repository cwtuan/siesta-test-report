// for OP
Ext.define('Ecfa.view.resource.PoolGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.poolGrid',
	requires : [ 'Ecfa.view.resource.EditPoolRenderWin' ],
	title : Locale.getMsg('view.resource.poolGrid'),
	header : false,
	autoscroll : true,
	selModel : Ext.create('Ext.selection.CheckboxModel', {
		mode : "MULTI",
		showHeaderCheckbox : false
	}),
	selType : 'rowmodel',
	plugins : [ {
		itemId : 'poolGrid-roweditor',
		ptype : 'rowediting'
	} ],
	viewConfig : {
		preserveScrollOnRefresh : true, // 官方 : grid refresh後保留scroll bar位置而不會回捲到最頂
		preserveSelectionOnRefresh : false	// 自定義: grid refresh後保留selection，預設就是打開
	},
	poolStatus : Ecfa.Const.Pool.STATUS.ACTIVE,

	initComponent : function() {
		var me = this;

		me.store = Ecfa.StoreUtil.getStore('pools');

		me.columns = [ {
			xtype : 'componentcolumn',
			width : 25,
			renderer : function(value, metadata, record) {
				return {
					xtype : 'container',
					items : [ new Ext.button.Button(Ext.widget('editPoolAction', {
						record : record,
						panel : me
					})) ]
				};
			}
		}, {
			header : Locale.getMsg('view.common.name'),
			dataIndex : 'name',
			flex : 1.0,
			renderer : function(value, meta, record) {
				meta.style = 'background-color: #FFFFCC !important;cursor: pointer;';
				meta.tdAttr = 'data-qtip="' + Locale.getMsg('view.resource.pool.showDetail') + '"';
				return value;
			},
			editor : { // TODO : name check validation
				xtype : 'textfield',
				allowBlank : false,
				maxLength : 50
			// ,validator : function(value) {
			// //var check_space = /^([ ]?[\w-]*[ ]+[\w-]*)+$/;
			// var check_id = /^[A-Za-z0-9_-]*[ ]{1,20}$/;
			//					
			// if (value === '') {
			// return true;
			// }
			// /*else if(check_space.test(value)){
			// return Locale.getMsg('view.auth.id.invalid_space');
			// }*/
			// else if(!check_id.test(value))
			// {
			// return Locale.getMsg('view.auth.id.invalid_char');
			// }
			// // duplicated render name
			// /*else if (Ext.getStore('resource.Pool').findExact('name', value) !== -1) {
			// return Locale.getMsg('view.auth.user.create.failure.duplicated');
			// } */
			// return true;
			// }
			}
		}, {
			header : Locale.getMsg('view.resource.pool.subscriber'),
			dataIndex : 'subscriber',
			flex : 1.0
		}, {
			header : Locale.getMsg('view.resource.pool.renderNum'),
			dataIndex : 'number',
			flex : 0.5,
			xtype : 'componentcolumn',
			renderer : function(value, meta, record) {
				if (record.get('status') === Ecfa.Const.Pool.STATUS.ACTIVE) {
					meta.tdAttr = 'data-qtip="' + Locale.getMsg('view.resource.pool.editRenderNum') + '"';

					return {
						xtype : 'container',
						items : [ {
							xtype : 'linkButton',
							columnWidth : 0.2,
							text : record.get('levelHighNum') + record.get('levelMidNum') + record.get('levelLowNum'),
							listeners : {
								click : function() {
									Ext.create('Ecfa.view.resource.EditPoolRenderWin', {
										oid : record.get('oid'),
										pool : record
									}).show();
								}
							}
						} ]
					};
				} else if (record.get('status') === Ecfa.Const.Pool.STATUS.INACTIVE)
					return 0;
			}
		}, {
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 1.0,
			renderer : function(value) {
				return Ecfa.locale.Converter.getPoolStatus(value);
			}
		}, {
			dataIndex : 'oid',
			hidden : true
		}, {
			header : Locale.getMsg('view.resource.pool.startTime'),
			dataIndex : 'startTime',
			flex : 1.0,
			renderer : function(val, metadata, record) {
				return Ecfa.Format.dateTime(val);
			}
		}, {
			header : Locale.getMsg('view.resource.pool.endTime'),
			dataIndex : 'endTime',
			flex : 1.0,
			renderer : function(val, metadata, record) {
				return Ecfa.Format.dateTime(val);
			}
		} ];

		me.tbar = [ new Ext.button.Button(new Ecfa.view.resource.action.CreatePoolAction({
			panel : me,
			itemId : 'createBtn'
		})), new Ext.button.Button(new Ecfa.view.resource.action.DeletePoolAction({
			panel : me,
			itemId : 'deleteBtn'
		})), {
			itemId : 'refreshBtn',
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				// refresh poolGrid
				me.store.load();

				// refresh down panel
				me.up('poolView').down('poolLicenseForm').refreshPoolLicense();
				me.up('poolView').down('poolRenderForm').refreshPoolRender();
			}
		}, {
			itemId : 'poolStatusCombo',
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.resource.pool.status'),
			labelWidth : 100,
			labelAlign : 'left',
			store : Ext.create('Ecfa.store.resource.PoolStatus'),
			editable : false,
			displayField : 'display',
			valueField : 'value',
			queryMode : 'local',
			emptyText : Locale.getMsg('view.resource.pool.status.select'),
			listeners : {
				select : function(combo, records, eOpts) {
					console.log('combo select', records);
					me.load(records[0].get('value'));
				}
			}
		} ];

		me.on({
			canceledit : function(editor, context, eOpts) {
				console.log('canceledit');
				me.getSelectionModel().deselectAll();
			},
			edit : function(editor, e) {
				var editPoolNameProxy = Ext.data.proxy.Proxy({
					url : me.store.proxy.url,
					type : me.store.proxy.type,
					writer : Ext.create('Ext.data.writer.Json', {
						getRecordData : function(record) {
							return {
								'oid' : record.get('oid'),
								'name' : record.data.name,
								'endTime' : record.data.endTime
							};
						}
					})
				});
				e.record.setProxy(editPoolNameProxy);

				// console.log('editPool:', editPoolNameProxy.url, e.record.data);
				e.record.save({
					success : function(record, operation) {
						Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.pool.edit.success'), 5000);
						Ecfa.event.Pool.fireEvent('updated', record.data);
					},
					failure : function(record, operation) {
						console.log('fail', record, operation);
						Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.pool.edit.fail'), record));
						me.store.rejectChanges();
					}
				});
			},
			selectionchange : function(selectionModel, records, index) {
				me.down('#deleteBtn').validate(records.length);
			}
		});

		me.callParent(arguments);

		// me.store.load();

		Ecfa.event.Pool.on({
			destroyed : function() {
				me.doCollapse();
				me.getStore().load();
			},
			created : function(rec, op) {
				me.getStore().load({
					callback : function(records, operation, success) {
						if (success) {
							var index = me.store.findBy(function(record, id) {
								return record.data.oid == rec.target.oid;
							}, this);
							// Refresh poolLicense Grid & poolRender Grid
							var newrec = me.store.getAt(index);
							me.up('poolView').down('poolLicenseForm').loadPoolLicense(newrec);
							me.up('poolView').down('poolRenderForm').loadPoolRender(newrec);
							me.doExpand();
						}
					}
				});
			},
			updated : function(rec) {
				me.getStore().load({
					callback : function(records, operation, success) {
						//console.log('poolGrid update event', rec, records);
						if (success) {
							if (rec != null) {
								var index = me.store.findBy(function(record, oid) {
									return record.data.oid == rec.oid; // rec.data.oid;
								}, this);
								// Refresh poolLicense Grid & poolRender Grid
								var newrec = me.store.getAt(index);
								me.up('poolView').down('poolLicenseForm').loadPoolLicense(newrec);
								me.up('poolView').down('poolRenderForm').loadPoolRender(newrec);
								me.doExpand();
							}
						}
					}
				});
			},
			fail : function(rec, op) {
			},
			running : function(isRunning) {
				me.setLoading(isRunning);
			}
		});
	},
	load : function(poolStatus) {
		var me = this;
		me.store.clearFilter(true);
		
		me.getStore().load({
			callback : function(records, operation, success) {
				if (poolStatus === Ecfa.Const.Pool.STATUS.ACTIVE) {
					me.down('#poolStatusCombo').setValue(Ecfa.Const.Pool.STATUS.ACTIVE);
					me.store.filter('status', Ecfa.Const.Pool.STATUS.ACTIVE);
					
					// Enable operation for active pools
					me.down('#createBtn').setDisabled(false);
					me.down('#createBtn').setTooltip( me.down('#createBtn').defaultTooltip);			
					me.down('#deleteBtn').setTooltip(me.down('#deleteBtn').disabledTooltip);		
					me.getSelectionModel().setLocked(false);					
				} else {
					me.down('#poolStatusCombo').setValue(Ecfa.Const.Pool.STATUS.INACTIVE);
					me.store.filter('status', Ecfa.Const.Pool.STATUS.INACTIVE);
					
					// Disable operation for inactive pools
					me.down('#createBtn').setDisabled(true);
					me.down('#deleteBtn').setDisabled(true);						
					me.down('#createBtn').setTooltip(Locale.getMsg('view.resource.pool.operate.inactiveTooltip'));		
					me.down('#deleteBtn').setTooltip(Locale.getMsg('view.resource.pool.operate.inactiveTooltip'));		
					me.getSelectionModel().setLocked(true);	
				}
				me.poolStatus = poolStatus;
			}
		});
	},

	doExpand : function() {
		var downpanel = this.up('poolView').down('#editPoolPanel');

		if (downpanel.collapsed) {
			downpanel.expand();
		}
		downpanel.setDisabled(false);
	},

	doCollapse : function() {
		var downpanel = this.up('poolView').down('#editPoolPanel');

		if (!downpanel.collapsed) {
			downpanel.collapse();
			downpanel.setDisabled(true);
		}
	}
});
