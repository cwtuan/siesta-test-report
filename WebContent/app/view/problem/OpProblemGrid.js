Ext.define('Ecfa.view.problem.OpProblemGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.opProblemGrid',
	requires : [ 'Ecfa.view.problem.CreateProblemWin', 'Ecfa.view.problem.action.CreateProblemAction', 'Ecfa.view.problem.action.DeleteProblemAction',
			'Ecfa.view.problem.action.EditProblemAction', 'Ecfa.view.problem.action.EditRepairTime' ],
	title : Locale.getMsg('view.problem.title'),
	icon : 'css/images/problem_report_16x16.png',
	store : 'problem.Problem',
	viewConfig : {
		preserveScrollOnRefresh : true, // 官方 : grid refresh後保留scroll bar位置而不會回捲到最頂
		preserveSelectionOnRefresh : false, // 自定義: grid refresh後保留selection，預設就是打開
		getRowClass : function(record, index) {
			return 'cursorPointer';
		}
	},

	initComponent : function() {
		var me = this;
		var now = new Date();

		me.plugins = [ {
			itemId : 'opProblemGrid-roweditor',
			ptype : 'rowediting',
			autoSize : {
				height : 100
			// Height from the boundEl
			},
			listeners : {
				// Break down the long value in the store into separate fields
				beforeedit : function(editor, e) {
					/*
					 * console.log('beforeedit', this, this.editor.getEl().getHeight(), this.editor.body.getHeight(), this.editor.body.dom); var body =
					 * this.editor.body; this.editor.getEl().setHeight(54); this.editor.body.setStyle('height','54px');
					 * //this.editor.getEl().setStyle('height',this.editor.getEl().getStyle('height')+20); //this.editor.body.dom.height += 20;
					 * console.log('height', this.editor.getEl().getHeight(),this.editor.body.getStyle('height'));
					 */

					/* 再修改e.record.data.repairTime前, 保留原始值 */
					e.record.data.oldRepairTime = e.record.data.repairTime;
					// console.log('before edit',e.record.data.repairTime, editor.editor.columns.map.editRepairTime.field);
					// console.log('before edit', e.record);
					/* 修改Ext.getCmp('id')為直接取得editRepairTime container物件 */
					var editRepairTime = editor.editor.columns.map.editRepairTime.field;
					editRepairTime.occurTime = e.record.data.occurTime;
					var datefield = editRepairTime.items.items[0];
					var timefield = editRepairTime.items.items[1];
					if (e.record.data.repairTime == 0) {
						datefield.setValue(new Date());
						e.record.data.repairTime = Ext.util.Format.date(new Date(), "H:i:s");
						// e.record.set('repairTime',Ext.util.Format.date(new Date()), "H:i:s");
						timefield.setValue();
					} else {
						var repairTime = new Date(e.record.data.repairTime); // long->Date
						datefield.setValue(repairTime);
						e.record.data.repairTime = Ext.util.Format.date(repairTime, "H:i:s");
						// e.record.set('repairTime',Ext.util.Format.date(new Date()), "H:i:s");
						timefield.setValue();
					}
				},
				// Manually check between the new and old values and set mark dirty
				validateedit : function(editor, e) {
					if (e.originalValues.repairTime !== e.newValues.repairTime) {
						var date = new Date(e.newValues.repairTime);
						e.record.data.repairTime = date.getTime();
						e.record.setDirty(true);
					}
					return true;
				},
				canceledit : function(editor, e) {
					// me.getStore().rejectChanges();
					e.record.data.repairTime = e.record.data.oldRepairTime;
				}
			}
		} ];

		me.columns = [ {
			// header : Locale.getMsg('view.common.action'),
			xtype : 'componentcolumn',
			width : 50,
			renderer : function(value, metadata, record) {
				return {
					xtype : 'container',
					items : [ new Ext.button.Button(new Ecfa.view.problem.action.EditProblemAction({
						record : record,
						panel : me
					})), new Ext.button.Button(new Ecfa.view.problem.action.DeleteProblemAction({
						record : record
					})) ]
				};
			}
		}, {
			header : Locale.getMsg('view.problem.oid'),
			dataIndex : 'oid',
			hidden : true
		}, {
			header : Locale.getMsg('view.problem.name'),
			dataIndex : 'name',
			itemId : 'name',
			flex : 1.5,
			renderer : function(val, metadata, record) {
				metadata.style = 'cursor: pointer;';
				metadata.tdAttr = 'data-qtip="' + Locale.getMsg('view.problem.detail') + '"';
				return val;
			}
		}, {
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			name : 'status',
			flex : 1,
			width : 250,
			renderer : function(value) {
				return Ecfa.locale.Converter.getProblemStatus(value);
			},
			editor : {
				xtype : 'combobox',
				store : Ext.create('Ecfa.store.problem.ProblemStatus'),
				queryMode : 'local',
				displayField : 'display',
				valueField : 'value',
				allowBlank : false,
				editable : false,
				forceSelection : true
			}
		}, {
			header : Locale.getMsg('view.auth.user.id'),
			dataIndex : 'userId',
			flex : 1
		}, {
			header : Locale.getMsg('view.problem.occurTime'),
			dataIndex : 'occurTime',
			width : 150,
			renderer : function(value) {
				if (value == 0 || value == null) {
					return '';
				}
				return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
			}
		}, {
			header : Locale.getMsg('view.problem.repairTime'),
			dataIndex : 'repairTime',
			itemId : 'repairTime',
			width : 175,
			renderer : function(value, attr, rec, rowIndex) {
				// console.log('renderer', value,me.store.getAt(rowIndex));
				if (value == 0 || value == null) {
					return '';
				}
				return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
			},
			editor : {
				xtype : 'editRepairTime',
				id : 'editRepairTime'
			}
		} ];

		me.tbar = [
		// new Ext.button.Button(new Ecfa.view.problem.action.CreateProblemAction({
		// panel : me
		// })),
		{
			itemId : 'refreshBtn',
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				console.log('op refreshed');
				var lastSelect = me.getSelectionModel().getSelection()[0];
				me.store.load({
					scope : this,
					callback : function(records, operation, success) {
						// Select the same record after refresh
						if (lastSelect != null) {
							var rec = me.store.findRecord("oid", lastSelect.get('oid'));
							me.getSelectionModel().select(rec);
						}
					}
				});
			}
		} ];

		me.callParent(arguments);

		//me.store.load();

		me.on({
			viewready : function() {
				if (me.store.getCount() != 0) {
					me.getSelectionModel().select(0);
				}
			},
			edit : function(editor, e) {
				// console.log('edit', e.record.data);
				e.record.save({
					success : function(record, operation) {
						Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.problem.edit.status.success'), 5000);
						Ecfa.event.Problem.fireEvent('updated', record);
					},
					failure : function(record, operation) {
						// console.log('fail record', operation);
						// TODO :Get error code from record to replace jsonResp
						Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.problem.edit.status.fail'), ''));
						me.store.rejectChanges();
					}
				});
			}
		});

		Ecfa.event.Problem.on({
			destroyed : function(record) {
				// console.log('destroy');
				me.getStore().load({
					scope : this,
					callback : function(records, operation, success) {
						if (me.store.getCount() != 0) {
							// Default select first record
							me.getSelectionModel().select(0);
						} else {
							// If no problem record in grid,clear discuss grid
							me.up('panel').down('discussGrid').store.loadData([], false);
							// console.log('no problem recoreds'.me.up('panel').down('discussGrid').store.getRange());
						}
					}
				});
			},
			created : function(record) {
				me.getStore().load();
			},
			updated : function(record) {
				//console.log('op updated');
				me.getStore().load({
					scope : this,
					callback : function(records, operation, success) {
						// Refresh right propertyGrid
						var rec = me.store.findRecord("oid", record.get('oid'));
						me.getSelectionModel().select(rec);
					}
				});
			},
			running : function(isRunning) {
				me.setLoading(isRunning);
			}
		});
	}
});
