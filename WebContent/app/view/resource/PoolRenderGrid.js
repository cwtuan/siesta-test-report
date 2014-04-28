// for OP
Ext.define('Ecfa.view.resource.PoolRenderGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.poolRenderGrid',
	border : false,
	selType : 'rowmodel',
	plugins : [ {
		itemId : 'poolRenderGrid-roweditor',
		ptype : 'rowediting'
	} ],
	poolOid : null,

	initComponent : function() {
		var me = this;

		me.store = Ecfa.StoreUtil.getStore('poolRender');

		me.columns = [ {
			xtype : 'componentcolumn',
			width : 25,
			renderer : function(value, metadata, record) {
				return {
					xtype : 'container',
					items : [ new Ext.button.Button(Ext.widget('editRenderAction', {
						record : record,
						panel : me
					})) ]
				};
			}
		}, {
			header : Locale.getMsg('view.resource.render.name'),
			name : 'hostName',
			dataIndex : 'hostName',
			flex : 1.5,
			editor : { // TODO : name check validation
				xtype : 'textfield',
				allowBlank : false,
				maxLength : 50
			}
		}, {
			header : Locale.getMsg('view.resource.render.ip'),
			dataIndex : 'ipAddress',
			flex : 1
		}, {
			header : Locale.getMsg('view.resource.render.capacity'),
			dataIndex : 'capacity',
			flex : 1
		}, {
			header : Locale.getMsg('view.resource.render.cpuCores'),
			dataIndex : 'cpuCores',
			name : 'cpuCores',
			flex : 0.5,
			editor : {
				xtype : 'textfield',
				allowBlank : false,
				maskRe : /^[0-9]*$/,// restrict input character
				maxLength : 50
			}
		}, {
			header : Locale.getMsg('view.resource.render.cpuMhz'),
			dataIndex : 'cpuMhz',
			flex : 0.5,
			editor : {
				xtype : 'textfield',
				allowBlank : false,
				maskRe : /^[.0-9]*$/,// restrict input character
				maxLength : 50
			}
		}, {
			header : Locale.getMsg('view.resource.render.memory'),
			dataIndex : 'memory',
			flex : 1,
			editor : {
				xtype : 'textfield',
				allowBlank : false,
				maskRe : /^[0-9]*$/,// restrict input character
				maxLength : 50
			}
		}, {
			header : Locale.getMsg('view.resource.render.os'),
			dataIndex : 'os',
			flex : 1,
			renderer : function(value, meta, record) {
				return Ecfa.locale.Converter.getRenderOS(value);
			},
			editor : {
				xtype : 'combobox',
				store : Ext.create('Ecfa.store.resource.RenderOS'),
				queryMode : 'local',
				displayField : 'display',
				valueField : 'value',
				allowBlank : false,
				editable : false,
				forceSelection : true
			}
		}, {
			header : Locale.getMsg('view.resource.render.level'),
			dataIndex : 'level',
			flex : 1,
			renderer : function(value, meta, record) {
				return Ecfa.locale.Converter.getRenderLevel(value);
			},
			editor : {
				xtype : 'combobox',
				store : Ext.create('Ecfa.store.resource.RenderLevel'),
				queryMode : 'local',
				displayField : 'display',
				valueField : 'value',
				allowBlank : false,
				editable : false,
				forceSelection : true
			}
		}, {
			header : Locale.getMsg('view.resource.render.priority'),
			dataIndex : 'priority',
			flex : 1,
			renderer : function(value, meta, record) {
				return Ecfa.locale.Converter.getRenderPriority(value);
			},
			editor : {
				xtype : 'combobox',
				store : Ext.create('Ecfa.store.resource.RenderPriority'),
				queryMode : 'local',
				editable : false,
				displayField : 'display',
				valueField : 'value',
				allowBlank : false
			}
		}, {
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 1,
			renderer : function(value) {
				return Ecfa.locale.Converter.getRenderStatus(value);
			}
		} ];

		/*
		 * me.tbar = [ new Ext.button.Button(new Ecfa.view.resource.action.CreateRenderAction({})), new Ext.button.Button(new
		 * Ecfa.view.resource.action.DeleteRenderAction({ panel : me, itemId : 'deleteButton' })), { itemId : 'refreshBtn', icon : 'css/images/refresh.png',
		 * text : Locale.getMsg('view.common.refresh'), handler : function() { me.store.load(); } } ];
		 */

		me.on({
			edit : function(editor, e) {
				e.record.save({
					success : function(record, operation) {
						Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.pool.renderEdit.success'), 5000);
						Ecfa.event.PoolRender.fireEvent('updated');
					},
					failure : function(record, operation) {
						me.store.rejectChanges();
						Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.pool.renderEdit.fail'), jsonResp));
					}
				});
			}
		});

		me.callParent(arguments);

		Ecfa.event.PoolRender.on({
			destroyed : function(tasks) {
				me.store.load({
					id : me.poolOid
				});
			},
			created : function(tasks) {
				me.store.load({
					id : me.poolOid
				});
			},
			updated : function(tasks) {
				me.store.load({
					id : me.poolOid
				});
			}
		/*
		 * running : function(isRunning) { me.setLoading(isRunning); }
		 */
		});
	},

	load : function(poolId) {
		var me = this;

		me.store.load({
			id : poolId			
		});
		me.poolOid = poolId;

		//console.log('poolRender load', me.poolOid);
	}
});
