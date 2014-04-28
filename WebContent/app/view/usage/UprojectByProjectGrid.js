Ext
		.define(
				'Ecfa.view.usage.UprojectByProjectGrid',
				{
					extend : 'Ext.grid.Panel',
					alias : 'widget.uprojectByProjectGrid',
					border : false,
					requires : [ 'Ext.grid.feature.GroupingSummary' ],
					features : [ {
						ftype : 'groupingsummary'
					} ],
					viewConfig : {
						getRowClass : function(record, index) {
							return 'cursorPointer';
						}
					},

					initComponent : function() {
						var me = this;
						var projectStore;
						me.store = Ext.create('Ecfa.store.usage.UProject');

						// projectStore.load();
						if (Ecfa.Config.isOP()) {
							// get all projects in system
							projectStore = Ext.create('Ecfa.store.project.Project');
							projectStore.sort('ownerId', 'ASC');
							projectStore.setProxy(Ext.data.proxy.Proxy({
								url : 'rest/op/projects',
								type : projectStore.proxy.type,
								reader : projectStore.proxy.reader
							}));

						} // UP
						else {

							projectStore = Ext.create('Ecfa.store.project.Project');
							// projectStore.sort('name', 'ASC');
							projectStore.setProxy(Ext.data.proxy.Proxy({
								url : 'rest/projects',
								type : projectStore.proxy.type,
								reader : projectStore.proxy.reader,
								extraParams : {
									who : 'owner'
								}
							}));

						}

						me.columns = [ {
							header : Locale.getMsg('view.usage.period'),
							dataIndex : 'interval',
							flex : 1
						}, {
							xtype : 'coreHours',
							width : 90,
							// cursorPointer : true,
							summaryType : 'sum',
							summaryRenderer : function(value) {
								return '(sum) ' + Ecfa.Format.floatRound(value, Ecfa.Const.DOLLAR_ROUND);
							}
						}, {
							xtype : 'cost',
							width : 90,
							// cursorPointer : true,
							summaryType : 'sum',
							summaryRenderer : function(value) {
								return '(sum) ' + Ecfa.Format.currency(value);
							}
						} ];

						me.tbar = [
								{
									// TODO move to usageView
									icon : 'css/images/refresh.png',
									text : Locale.getMsg('view.common.refresh'),
									handler : function() {
										me.store.reload();
									}
								},
								'->',
								{

									xtype : 'combobox',
									// name : 'period',
									itemId : 'projectCombo',
									lastQuery : '',
									displayField : 'name',
									valueField : 'oid',
									store : projectStore,
									// queryMode : 'remote',
									fieldLabel : Locale.getMsg('view.project.name'),
									labelWidth : 70,
									width : 260,
									labelAlign : 'left',
									editable : false,
									displayTpl : Ext.create('Ext.XTemplate', '<tpl for=".">', '{name} ', Ecfa.Config.isUP() ? '' : ' ('
											+ Locale.getMsg('view.project.user.role.owner') + ': {ownerId})', '</tpl>'),
									tpl : Ext
											.create(
													'Ext.XTemplate',
													'<tpl for=".">',
													'<div class="x-boundlist-item" title="{[Locale.getMsg("view.queue.management.renderNode.createTime")]}: {[Ecfa.Format.dateTime(values.createTime)]}">',
													'{name} ', Ecfa.Config.isUP() ? '' : ' (' + Locale.getMsg('view.project.user.role.owner') + ': {ownerId})',
													'</div>', '</tpl>'),
//									emptyText : Locale.getMsg('view.usage.period.select'),
									listeners : {
										select : function(combo) {
											me.load(combo.getValue());
										}
									}
								} ];

						me.callParent(arguments);

						projectStore.load();

						projectStore.on({
							load : function() {
//								console.log('onProjectLoad');

								var combo = me.down('#projectCombo');
								if (combo.getRawValue() == '' && combo.store.getCount() != 0) {
									combo.select(combo.store.getAt(0));
									me.load(combo.getValue());
								}

								// console.log('getData', combo.store.getData());
							}
						});

						me.on({
							viewready : function() {
								if (me.store.getCount() > 0) {
									me.getSelectionModel().select(0);
								}
							}
						});

						// select the first one
						me.store.on({
							load : function(store, records, successful) {
								// console.log('by porject load', records, successful);
								if (successful && records.length != 0) {
									me.getSelectionModel().select(0);
									// then update MissionSummaryPropertyGrid and UmissionView in Usage.js controller
								} else {
									me.up('usageTabProject').down('missionSummaryPropertyGrid').clear();
									me.up('usageTabProject').down('umissionView').clear();
								}
							}
						});

					},

					load : function(projectOid) {

						var me = this;

						// console.log('load by projectOid', projectOid);
						//
						// console.log('me.store', me.store);

						me.store.load({
							ids : [ projectOid ]
						});
					}
				});
