Ext.define('Ecfa.view.usage.BalanceLabel', {
	extend : 'Ext.form.Label',
	alias : 'widget.balanceLabel',
	style : 'cursor: pointer;text-decoration:underline;',
	initComponent : function() {
		var me = this;
		var updateBalance = {
			run : function() {
				me.getBalance();
			},
			interval : Ecfa.Config.BALANCE_UPDATING_PERIOD
		};

		Ext.TaskManager.start(updateBalance);
		me.task = updateBalance;

		me.callParent(arguments);
		me.on({
			render : function() {
				me.setText(Locale.getMsg('view.billing.balance') + ': ' + Ecfa.Session.getUser().balance);

				me.el.on('click', function() {
					// console.log('click', me.el);
					// fir event to refresh text
					Ecfa.event.Balance.fireEvent('refresh');
					if (Ext.getCmp('#purchaseWin')) {
						Ext.getCmp('#purchaseWin').close();
					}

					var grid = Ext.create('Ecfa.view.usage.PurchaseGrid');

					Ext.create('Ecfa.view.usage.PurchaseWin', {
						x : me.el.lastBox.x - 20,
						y : me.el.lastBox.y + 20,
						items : [ grid ]
					}).show();
					// show purchase history
				});
			}
		});

		// console.log(me);

		Ecfa.event.Balance.on({
			'refresh' : function() {
				me.getBalance();
			}
		});
	},

	getBalance : function() {
		var me = this;
		Ecfa.Restful.request({
			url : 'rest/billing/balance',
			method : 'GET',
			params : {
				userId : Ecfa.Session.getUser().id
			},
			success : function(jsonResp) {
				// console.log('get');
				var balance = jsonResp['target']['balance'];
				var msg = Locale.getMsg('view.billing.balance') + ': ' + balance;

				if (jsonResp['target']['poolSubscriber']) {
					msg = msg + ' ' + Locale.getMsg('view.billing.pool', jsonResp['target']['poolName']);
					me.up('viewport').down('#upMonitor').show();
				} else
					me.up('viewport').down('#upMonitor').hide();
				me.setText(msg);
			},
			failure : function(jsonResp) {
				// Ext.getCmp('notifybar').showError(
				// Ecfa.locale.Converter.getErrorMsg(
				// Locale.getMsg('view.billing.error.balance'), jsonResp));
			}
		});
	},

	stopTask : function() {
		// console.log('stop', this.task);
		Ext.TaskManager.stop(this.task);

	}
});
