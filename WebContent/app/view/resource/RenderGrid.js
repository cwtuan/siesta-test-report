// for OP
Ext.define('Ecfa.view.resource.RenderGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.renderGrid',
	store : 'resource.Render',
	requires : [ 'Ecfa.view.resource.DeleteRenderWin' ],
	header : false,
	selModel : Ext.create('Ext.selection.CheckboxModel', {
		showHeaderCheckbox : false
	}),
	selType : 'rowmodel',
	plugins : [ {
		ptype : 'rowediting'
	} ],
	viewConfig : {
		preserveScrollOnRefresh : true, // 官方 : grid refresh後保留scroll bar位置而不會回捲到最頂
		preserveSelectionOnRefresh : false	// 自定義: grid refresh後保留selection，預設就是打開
	},

	initComponent : function() {
		var me = this;

		me.columns = [ {
			xtype : 'rownumberer',
			width : 30
		}, {
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
			dataIndex : 'hostName',
			flex : 1,
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
			flex : 1,
			renderer : function(value, meta, record) {
				if (value === 0)
					return 'N/A';
				return value;
			},
			editor : {
				xtype : 'textfield',
				allowBlank : false,
				maskRe : /^[0-9]*$/,// restrict input character
				maxLength : 50
			}
		}, {
			header : Locale.getMsg('view.resource.render.cpuMhz') + '(Mhz)',
			dataIndex : 'cpuMhz',
			flex : 1,
			editor : {
				xtype : 'textfield',
				allowBlank : false,
				maskRe : /^[.0-9]*$/,// restrict input character
				maxLength : 50
			}
		}, {
			header : Locale.getMsg('view.resource.render.memory') + '(MB)',
			dataIndex : 'memory',
			flex : 1,
			editor : {
				xtype : 'textfield',
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
				allowBlank : false,
				forceSelection : true
			}
		}, {
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 1,
			xtype : 'componentcolumn',
			renderer : function(value, meta, record) {
				// value = Ecfa.Const.Render.Status.ERR;
				// console.log('value',value);
				if (value === Ecfa.Const.Render.Status.ERR) {
					var note = {
						error : record.get('note')
					};
					meta.tdAttr = 'data-qtip="' + Ecfa.locale.Converter.getErrorMsg('', note) + '"';

					return {
						xtype : 'container',
						items : [ {
							xtype : 'linkButton',
							columnWidth : 0.2,
							text : Ecfa.locale.Converter.getRenderStatus(value)
						} ]
					};
				}
				return Ecfa.locale.Converter.getRenderStatus(value);
			}
		} ];

		me.tbar = [ new Ext.button.Button(new Ecfa.view.resource.action.CreateRenderAction({})),
				new Ext.button.Button(new Ecfa.view.resource.action.DeleteRenderAction({
					panel : me,
					itemId : 'deleteButton'
				})), new Ext.button.Button(new Ecfa.view.resource.action.CreateBatchRenderAction({
					panel : me,
					itemId : 'batchRenderFileButton'
				})), {
					itemId : 'exportBtn',
					icon : 'css/images/save.png',
					text : Locale.getMsg('view.resource.render.exportBatch'),
					handler : function() {
						var body = Ext.getBody(), frame = body.createChild({
							tag : 'iframe',
							cls : 'x-hidden',
							id : 'hiddenform-iframe',
							name : 'iframe'
						}), form = body.createChild({
							tag : 'form',
							cls : 'x-hidden',
							id : 'hiddenform-form',
							action : 'rest/op/resource/batchRenders',
							target : 'iframe'
						});
						form.dom.submit();
					}
				}, {
					itemId : 'refreshBtn',
					icon : 'css/images/refresh.png',
					text : Locale.getMsg('view.common.refresh'),
					handler : function() {
						me.store.load();
					}
				} ];

		me.on({
			edit : function(editor, e) {
				Ecfa.Restful.request({
					method : 'PUT',
					record : e.record,
					successSubject : Locale.getMsg('view.resource.render.edit.success'),
					failureSubject : Locale.getMsg('view.resource.render.edit.fail'),
					eventType : Ecfa.event.Render
				});

				// console.log('render record', e.record);
				// e.record.save({
				// success : function(record, operation) {
				// //console.log("record",record);
				// Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.render.edit.success'), 5000);
				// Ecfa.event.Render.fireEvent('updated');
				// },
				// failure : function(record, operation) {
				// console.log('fail', record, operation);
				// Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.render.edit.fail'), record));
				// me.store.rejectChanges();
				// }
				// });
			},
			selectionchange : function(selectionModel, records, index) {
				me.down('#deleteButton').validate(records.length);
			}
		});

		me.callParent(arguments);

		// me.store.load();

		Ecfa.event.Render.on({
			destroyed : function(tasks) {
				me.getStore().load();
			},
			created : function(tasks) {
				me.getStore().load();
			},
			updated : function(tasks) {
				me.getStore().load();
			},
			running : function(isRunning) {
				me.setLoading(isRunning);
			}
		});
	}
});
