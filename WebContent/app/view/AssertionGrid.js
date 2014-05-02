Ext.define('Ecfa.view.AssertionGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.assertionGrid',
	title : 'Assertions',
	cls : 'feed-grid',

	requires : [ 'Ext.ux.PreviewPlugin', 'Ext.toolbar.Toolbar' ],
	viewConfig : {
		getRowClass : function(record) {
			// if (record.get('passed') === 'false') {
			return 'host-status-down'; // TODO rename

			// return 'cursorPointer';//TODO
			// }

		}
	},
	viewConfig : {
		plugins : [ {
			pluginId : 'preview',
			ptype : 'preview',
			bodyField : 'annotation',
			previewExpanded : true
		} ]
	},
	initComponent : function() {
		var me = this;
		me.store = Ext.create('Ecfa.store.Assertion');

		me.columns = [ {
			text : 'Description',
			dataIndex : 'description',
			flex : 1,
			renderer : this.formatTitle
		}, {
			text : 'Passed',
			dataIndex : 'passed',
			 hidden : true,
			width : 200
		// }, {
		// text : 'Date',
		// dataIndex : 'pubDate',
		// renderer : this.formatDate,
		// width : 200
		} ];

		// me.dockedItems = [ {
		// xtype : 'toolbar',
		// dock : 'top',
		// items : [ {
		// iconCls : 'open-all',
		// text : 'Open All',
		// action : 'openall'
		// } ]
		// } ];

		this.callParent(arguments);
	},

	/**
	 * Title renderer
	 * 
	 * @private
	 */
	formatTitle : function(value, p, record) {
		var passed = record.get('passed');
//		debugger;
		console.log('passed',passed);
		if (passed == "") {
			return Ext.String.format('<div class="topic"><b>{0}</b></div>', record.get('description'));
		} else if (passed === "true") {
			return Ext.String.format('<div class="topic"><b>{0}</b><span class="label label-success">{1}</span> </div>', record.get('description'), 'Success');
		} else {
			
			return Ext.String.format('<div class="topic"><b>{0}</b><span class="label label-important">{1}</span> </div>', record.get('description'), 'Failure');
		}
	},

	/**
	 * Date renderer
	 * 
	 * @private
	 */
	formatDate : function(date) {
		if (!date) {
			return '';
		}

		var now = new Date(), d = Ext.Date.clearTime(now, true), notime = Ext.Date.clearTime(date, true).getTime();

		if (notime === d.getTime()) {
			return 'Today ' + Ext.Date.format(date, 'g:i a');
		}

		d = Ext.Date.add(d, 'd', -6);
		if (d.getTime() <= notime) {
			return Ext.Date.format(date, 'D g:i a');
		}
		return Ext.Date.format(date, 'Y/m/d g:i a');
	},
	load : function(testCase) {

		var me = this;
		me.setTitle(Ext.String.format('Assertions ({0})', testCase.get('url')));
		var assertions = testCase.get('assertions');
		me.store.loadData(assertions == null ? [] : assertions);

	}
});
