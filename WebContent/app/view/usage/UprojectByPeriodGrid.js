Ext.define('Ecfa.view.usage.UprojectByPeriodGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.uprojectByPeriodGrid',
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
		me.store = Ext.create('Ecfa.store.project.Project');

		me.columns = [ {
			header : Locale.getMsg('view.project.name'),
			dataIndex : 'name',
			flex : 2
		}, {
			xtype : 'coreHours',
			width : 65,
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
		}, {
			header : Locale.getMsg('view.project.user.role.owner'),
			dataIndex : 'ownerId',
			hidden : Ecfa.Config.isUP(),
			width : 60
		}, {
			header : Locale.getMsg('view.queue.management.renderNode.createTime'),
			dataIndex : 'createTime',
			// hidden : Ecfa.Config.isUP(),
			width : 80,
			// renderer : Ecfa.Format.date,
			renderer : function(value, metaData, record, rowIdx, colIdx, store) {
				metaData.tdAttr = 'data-qtip="' + Ext.String.htmlEncode(Ecfa.Format.dateTime(value)) + '"';
				return Ecfa.Format.date(value);
			}
		} ];

		me.tbar = [ {
			// TODO move to usageView
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.store.reload();
			}
		}, '->', {
			xtype : 'combobox',
			lastQuery : '',
			name : 'period',
			itemId : 'periodCombo',
			displayField : 'interval',
			valueField : 'period',
			store : Ext.create('Ecfa.store.usage.Period'),
			queryMode : 'remote',
			fieldLabel : Locale.getMsg('view.usage.period'),
			labelWidth : 70,
			width : 260,
			labelAlign : 'left',
			editable : false,
			// emptyText : Locale.getMsg('view.usage.period.select'),
			listeners : {
				select : function(combo) {
					// console.log('combo select', combo.getValue());
					me.load(combo.getValue());
				}
			}
		} ];

		me.callParent(arguments);

		if (Ecfa.Config.isOP()) {
			me.store.setProxy(Ext.data.proxy.Proxy({
				url : 'rest/op/projects',
				type : me.store.proxy.type,
				reader : me.store.proxy.reader
			}));

		} else {
			me.store.setProxy(Ext.data.proxy.Proxy({
				url : 'rest/projects',
				type : me.store.proxy.type,
				reader : me.store.proxy.reader
			}));
		}
		me.store.sort('cost', 'DESC');

		me.load(); // FIXME why it need to load first without period, otherwise it will faill to call rest

		me.down('#periodCombo').store.on({
			load : function() {
				var combo = me.down('#periodCombo');
				// console.log('combo value', combo.getRawValue());
				if (combo.getRawValue() == '' && combo.store.getCount() != 0) {
					// select the first item in combo
					combo.select(combo.store.getAt(0));
					// load projects usage by period. TODO use event listner
					me.load(combo.getValue());
				}
			}
		});

		// select the first one
		me.store.on({
			load : function(store, records, successful) {
				if (successful && records.length != 0) {
					me.getSelectionModel().select(0);
				}
			}
		});

		// reload usage grid when project is created or deleted
		Ecfa.StoreUtil.getStore('detailProjects').on({
			load : function() {
				me.store.reload();
			}
		});

	},
	load : function(period) {

		var me = this;
		me.store.load({
			params : {
				usagePeriod : period,
				who : Ecfa.Config.isUP() ? 'owner' : null
			}
		});
	}
});
