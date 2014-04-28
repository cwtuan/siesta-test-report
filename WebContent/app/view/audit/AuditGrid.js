Ext.define('Ecfa.view.audit.AuditGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.auditGrid',
	border : false,
	requires : [ 'Ext.ux.RowExpander' ],
	plugins : [ {
		pluginId : 'rowexpander',
		ptype : 'rowexpander',
		rowBodyTpl : [ '<p>' + Locale.getMsg('view.audit.description') + ': {description}</p>' ]
	} ],
	title : Locale.getMsg('view.audit.list'),
	initComponent : function() {
		var me = this;
		me.store = Ext.create('Ecfa.store.audit.Audit');
		me.columns = [ {
			xtype : 'rownumberer',
			width : 40
		}, {
			header : Locale.getMsg('view.audit.category'),
			dataIndex : 'category',
			flex : 1
		}, {
			header : Locale.getMsg('view.audit.subject'),
			dataIndex : 'subject',
			flex : 1
		}, {
			// header : Locale.getMsg('view.audit.detail'),
			// dataIndex : 'description',
			// flex : 1
			// }, {
			header : Locale.getMsg('view.audit.userId'),
			dataIndex : 'loginUserId',
			flex : 1
		}, {
			header : Locale.getMsg('view.resource.render.ip'),
			dataIndex : 'ip',
			flex : 1
		}, {
			header : Locale.getMsg('view.common.time'),
			dataIndex : 'createTime',
			flex : 1,
			renderer : Ecfa.Format.dateTime
		}, {
			header : Locale.getMsg('view.audit.protalType'),
			dataIndex : 'op',
			flex : 1,
			renderer : function(value) {
				return value ? 'OP' : 'UP'
			}
		} ];

		me.dockedItems = [ {
			xtype : 'pagingtoolbar',
			store : me.store,
			dock : 'top',
			displayInfo : true
		} ];

		me.tools = [ {
			xtype : 'tool',
			type : 'expand',
			align : 'left',
			tooltip : Locale.getMsg('view.common.expand'),
			handler : function(event, target, owner, tool) {
				var i, records, rowexpander;
				records = me.store.getRange();
				rowexpander = me.getPlugin('rowexpander');
				for (i = 0; i < records.length; ++i) {
					if (!rowexpander.recordsExpanded[records[i].internalId]) {
						rowexpander.toggleRow(i);
					}
				}
			}
		}, {
			xtype : 'tool',
			type : 'collapse',
			align : 'left',
			tooltip : Locale.getMsg('view.common.collapse'),
			handler : function(event, target, owner, tool) {
				var i, records, rowexpander;
				records = me.store.getRange();
				rowexpander = me.getPlugin('rowexpander');
				for (i = 0; i < records.length; ++i) {
					if (rowexpander.recordsExpanded[records[i].internalId]) {
						rowexpander.toggleRow(i);
					}
				}
			}
		} ];

		me.callParent(arguments);

		// me.load();

	}
// ,
// load : function() {
// this.store.load({
// params : {
// start : 0,
// limit : 5
// }
// });
// }
});
