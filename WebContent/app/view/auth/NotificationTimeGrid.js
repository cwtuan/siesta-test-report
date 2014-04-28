Ext.define('Ecfa.view.auth.NotificationTimeGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.notificationTimeGrid',
	selType : 'checkboxmodel',
	selModel : {
		mode : 'MULTI',
		showHeaderCheckbox : false
	},
	viewConfig : {
		preserveScrollOnRefresh : true, // 官方 : grid refresh後保留scroll bar位置而不會回捲到最頂
		preserveSelectionOnRefresh : false
	// 自定義: grid refresh後保留selection，預設就是打開
	},

	initComponent : function() {
		var me = this;

		me.store = Ext.create('Ecfa.store.notification.NotificationTime');

		me.columns = [ {
			header : Locale.getMsg('view.notification.eventType'),
			dataIndex : 'eventType',
			flex : 1,
			renderer : Ecfa.locale.Converter.getEventType
		}, {
			header : Locale.getMsg('view.notification.time.start'),
			dataIndex : 'startTime',
			itemId : 'role',
			flex : 1
		}, {
			header : Locale.getMsg('view.notification.time.end'),
			dataIndex : 'endTime',
			flex : 1,
			renderer : Ecfa.Format.userStatus
		} ];

		me.tbar = [
				{
					text : Locale.getMsg('view.notification.time.add'),
					icon : 'css/images/add_16x16.png',
					menuAlign : 'bl-tl?', // menu contents show above menu botton,
					listeners : {
						click : function(f, eOpts) {
							console.log('click');

						}
					},
					menu : {
						xtype : 'menu',
						itemId : 'timemenu',
						plain : true,
						items : [ {
							xtype : 'form',
							layout : 'anchor',
							border : false,
							defaults : {
								anchor : '100%',
								margin : '5 5 5 5'
							},
							defaultType : 'timefield',
							items : [
									{
										// itemId : 'selectEventType',
										xtype : 'combo',
										itemId : 'eventType',
										fieldLabel : Locale.getMsg('view.notification.eventType'),
										queryMode : 'local',
										displayField : 'display',
										valueField : 'value',
										store : Ext.create('Ecfa.store.notification.EventType'),
										// allowBlank : false,
										validator : function(value) {
											if (me.down('#eventType').isVisible()) {
												if (me.down('#eventType').getValue() != null)
													return true;
												return Locale.getMsg('view.notification.fill.eventType');
											}
											return true;
										}
									},
									{
										// xtype : 'timefield',
										format : 'H:i',
										increment : 60,
										fieldLabel : Locale.getMsg('view.notification.time.start'),
										itemId : 'startTime',
										// allowBlank : false,
										listeners : {
											select : function(field, value, eOpts) {
												me.down('#endTime').setMinValue(value);
												me.down('#endTime').dateRangeMin = value;
											}
										},
										validator : function(value) {
											if (me.down('#eventType').isVisible()) {
												if (me.down('#startTime').getValue() != null)
													return true;
												return Locale.getMsg('view.notification.timerange.fill.startTime');
											}
											return true;
										}
									},
									{
										// xtype : 'timefield',
										format : 'H:i',
										increment : 60,
										fieldLabel : Locale.getMsg('view.notification.time.end'),
										itemId : 'endTime',
										// allowBlank : false,
										validator : function(value) {
											if (me.down('#eventType').isVisible()) {
												if (me.down('#endTime').getValue() == null)
													return Locale.getMsg('view.notification.timerange.fill.endTime')
												else if (me.down('#startTime').getValue() != null
														&& me.down('#endTime').getValue().getTime() >= me.down('#startTime').getValue().getTime())
													return true;
												else
													return Locale.getMsg('view.notification.timerange.compare');
											}
											return true;
										}
									} ],
							bbar : [ {
								height : 30,
								xtype : 'button',
								formBind : true,
								icon : 'css/images/add_16x16.png',
								itemId : 'addNotificationTimeBtn',
								text : Locale.getMsg('view.common.add'),
								handler : function() {
									var rec = Ext.create('Ecfa.model.notification.NotificationTime', {
										eventType : me.down('#eventType').getValue(),
										startTime : Ext.Date.format(me.down('#startTime').getValue(), 'H:i'),
										endTime : Ext.Date.format(me.down('#endTime').getValue(), 'H:i')
									});
									// me.timeRangeParser(rec);
									me.merge(rec);
								}
							}, {
								height : 30,
								xtype : 'button',
								itemId : 'cancelBtn',
								text : Locale.getMsg('view.common.cancel'),
								handler : function() {
									me.down('#timemenu').hide();
								}
							} ]
						} ]
					}
				}, {
					height : 30,
					xtype : 'button',
					itemId : 'deleteBtn',
					text : Locale.getMsg('view.common.delete'),
					icon : 'css/images/delete_16x16.png',
					handler : function() {
						me.store.remove(me.getSelectionModel().getSelection());
					}
				} ];

		me.on({
			selectionchange : function(selectionModel, records, index) {

			},
			activate : function(comp, eOpts) {
				me.getStore().load();
			}
		});

		me.callParent(arguments);
	},
	merge : function(inputrec) {
		var me = this;

		var rec = Ext.create('Ecfa.model.notification.NotificationTime', {
			eventType : inputrec.getData().eventType,
			startTime : inputrec.getData().startTime,
			endTime : inputrec.getData().endTime
		});
		// console.log('merge', rec.getData().eventType, rec.getData().startTime, rec.getData().endTime);

		var startTime = rec.getData().startTime;
		var endTime = rec.getData().endTime;
		var mergeFlag = false;
		// console.log('store', me.store.getRange());
		me.store.each(function(record, index) {
			if (record.get('eventType') == rec.getData().eventType) {
				var s1 = record.get('startTime').split(":")[0];
				var e1 = record.get('endTime').split(":")[0];
				var s2 = rec.getData().startTime.split(":")[0];
				var e2 = rec.getData().endTime.split(":")[0];

				if (s1 == s2 && e1 == e2) {
					// console.log('equal! continue!!');
					mergeFlag = true;
					me.store.removeAt(index);
					return false;
				}
				if (s2 >= s1 && e2 <= e1) { // range 1 contains range 2
					// console.log('ragne 1 contains range 2');
					startTime = record.get('startTime');
					endTime = record.get('endTime');
					me.store.removeAt(index);
					rec.set("startTime", startTime);
					rec.set("endTime", endTime);
					me.store.add(rec);
					mergeFlag = true;
					return false;
				} else if (s2 <= s1 && e2 >= e1) { // range 2 contains range 1
					// console.log('range 2 contains range 1');
					startTime = rec.getData().startTime;
					endTime = rec.getData().endTime;
					me.store.removeAt(index);
					rec.set("startTime", startTime);
					rec.set("endTime", endTime);
					me.store.add(rec);
					mergeFlag = true;
					return false;
				} else if (s2 >= s1 && s2 <= e1) { // overlap range 2 start to range 1 end
					// console.log('overlap range 2 start to range 1 end');
					startTime = record.get('startTime');
					endTime = rec.getData().endTime;
					me.store.removeAt(index);
					rec.set("startTime", startTime);
					rec.set("endTime", endTime);
					me.store.add(rec);
					mergeFlag = true;
					return false;
				} else if (s2 <= s1 && e2 >= s1) { // overlap range 1 start to range 2 end
					// console.log('overlap range 1 start to range 2 end');
					startTime = rec.getData().startTime;
					endTime = record.get('endTime');
					me.store.removeAt(index);
					rec.set("startTime", startTime);
					rec.set("endTime", endTime);
					me.store.add(rec);
					mergeFlag = true;
					return false;
				}
				/*
				 * else { startTime = rec.getData().startTime; endTime = rec.getData().endTime; }
				 */
			}
		}, this);

		if (mergeFlag == false) {
			rec.set("startTime", startTime);
			rec.set("endTime", endTime);
			me.store.add(rec);
		} else
			me.merge(rec);
		// console.log('terminate!!!');
	}

});
