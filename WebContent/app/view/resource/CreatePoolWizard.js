Ext.define('Ecfa.view.resource.CreatePoolWizard', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.createPoolWizard',
	requires : [ 'Ecfa.view.resource.PoolSetting', 'Ecfa.view.resource.PoolRenderSetting', 'Ecfa.view.resource.PoolLicenseSetting',
			'Ecfa.view.resource.SelectUserGrid' ],
	layout : 'card',
	border : false,
	activeItem : 0, // index or id+
	records : null,

	initComponent : function() {
		var me = this;

		me.items = [ {
			itemId : 'poolSetting',
			xtype : 'poolSetting',
			records : me.records
		}, {
			itemId : 'poolRenderSetting',
			xtype : 'poolRenderSetting'
		}, {
			itemId : 'poolLicenseSetting',
			xtype : 'poolLicenseSetting'
		} ];

		me.callParent(arguments);
	},

	buttonVisible : function() {
		if (this.getLayout().getNext()) {
			this.down('#cardNext').setVisible(true);
			this.down('#submit').setVisible(false);
		} else {
			this.down('#cardNext').setVisible(false);
			this.down('#submit').setVisible(true);
		}

		if (this.getLayout().getPrev()) {
			this.down('#cardPrev').setVisible(true);
		} else {
			this.down('#cardPrev').setVisible(false);
		}
	},

	submit : function() {
		var me = this;
		me.down('poolLicenseSetting').setLoading(true);

		var poolSetting = this.down('poolSetting');
		var poolSettingVals = poolSetting.getValues();
		console.log('poolset', poolSettingVals);

		var renderSetting = this.down('poolRenderSetting');
		var renderSettingVals = renderSetting.getValues();
		// console.log('renderSetting', renderSettingVals);

		var licenseSetting = this.down('poolLicenseSetting');
		var licenseSettingVals = licenseSetting.getValues();
		// console.log('*licenseSettingVals',licenseSettingVals);

		var licenseRecords = licenseSetting.down('poolLicenseGrid').getStore().getRange();
		// console.log('licenseRecords',licenseRecords);
		var data = new Array();
		var temp = null;
		for ( var i = 0; i < licenseRecords.length; i++) {
			if (licenseSettingVals.number[i] != 0) {
				temp = 'basename:\'' + licenseRecords[i].getData().name + '\', number:' + licenseSettingVals.number[i];
				data.push(eval('({' + temp + '})'));
			}
		}

		var osType = null;
		if (renderSettingVals['osType'] != 'nonSpecified') {
			osType = renderSettingVals['osType'];
		}

		var submit = Ext.create('Ecfa.model.resource.Pool', {
			name : poolSettingVals['name'],
			subscriber : poolSettingVals['subscriber'],
			startTime : poolSetting.down('#startTime').getValue().getTime(),
			endTime : poolSetting.down('#endTime').getValue().getTime(),// poolSettingVals['endTime'],
			osType : osType == '' ? null : osType,
			levelHighNum : renderSettingVals['levelHighNum'],
			levelMidNum : renderSettingVals['levelMidNum'],
			levelLowNum : renderSettingVals['levelLowNum'],
			licenses : data
		});
		console.log('submit', submit);

		Ecfa.Restful.request({
			record : submit,
			method : 'POST',
			url : submit.getProxy().url,
			success : function(rec, op) {
				console.log('sucess', rec, op);
				me.down('poolLicenseSetting').setLoading(false);
				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.pool.add.success'), 5000);
				Ecfa.event.Pool.fireEvent('created', rec, op);
				me.up('createPoolWin').close();
			},

			failure : function(rec, op) {
				console.log('fail', rec.error, op);// op.request.scope.reader.jsonData
				me.down('poolLicenseSetting').setLoading(false);
				Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.pool.add.fail'), rec));
				Ecfa.event.Pool.fireEvent('fail', rec, op);
				me.up('createPoolWin').close();
			}
		});

		/* Default timeout 30s of model.save is not enough! */
		/*
		 * submit.save({ success : function(rec, op) { console.log('sucess',rec,op); me.down('poolLicenseSetting').setLoading(false);
		 * Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.pool.add.success'), 5000); Ecfa.event.Pool.fireEvent('created', rec, op);
		 * me.up('createPoolWin').close(); },
		 * 
		 * failure : function(rec, op) { console.log('faile',rec,op); me.down('poolLicenseSetting').setLoading(false);
		 * Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.pool.add.fail'), op.request.scope.reader.jsonData));
		 * Ecfa.event.Pool.fireEvent('fail', rec, op); me.up('createPoolWin').close(); } });
		 */
	},

	previous : function() {
		if (this.getLayout().getPrev()) {
			this.getLayout().prev();
			// this.buttonVisible();
		}
	},

	next : function() {
		if (this.getLayout().getNext()) {
			this.getLayout().next();
			// this.buttonVisible();
		}
	},

	first : function() {
		this.getLayout().setActiveItem(0);
	},

	resetSetting : function() {
		this.down('#poolSetting').getForm().reset();
		this.down('#poolRenderSettingConfirm').getForm().reset();
	}

});
