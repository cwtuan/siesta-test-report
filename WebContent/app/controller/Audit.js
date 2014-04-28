Ext.define('Ecfa.controller.Audit', {
	extend : 'Ext.app.Controller',
	refs : [ {
		ref : 'auditSearchPanel',
		selector : 'auditSearchPanel'
	}, {
		ref : 'auditGrid',
		selector : 'auditGrid'
	} ],
	init : function() {
		var me = this;
		me.control({
			'auditSearchPanel #search' : {
				click : me.onAuditSearchClick
			},
			'auditGrid' : {
				// first load
				viewready : me.onAuditSearchClick
			}
		});
	},
	onAuditSearchClick : function() {
		var me = this;
		var form = me.getAuditSearchPanel().down('form');

		var values = form.getValues();
		var startDateTime = Ext.Date.parse(values.startDate + ' ' + form.down('#startTime').getRawValue(), Ecfa.Config.DATETIME_FORMAT).getTime();
		var endDateTime = Ext.Date.parse(values.endDate + ' ' + form.down('#endTime').getRawValue(), Ecfa.Config.DATETIME_FORMAT).getTime();

		// console.log('values', values);

		var store = me.getAuditGrid().store;

		Ext.apply(store.proxy.extraParams, values);

		Ext.apply(store.proxy.extraParams, {
			startTime : startDateTime,
			endTime : endDateTime
		});

		store.currentPage = 1;
		store.load();

	}

});
