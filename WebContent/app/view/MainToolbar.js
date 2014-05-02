/**
 * To switch view, use Ext.getCmp('mainToolbar').press('#opMonitor');
 */

Ext.define('MyApp.view.MainToolbar', {
	extend : 'Ext.toolbar.Toolbar',
	// excludeItemId : [ 'notification' ],
	actions : [],
	press : function(itemId) {
		var me = this;
		me.down(itemId).el.dom.click();
	},
	onItemPressed : function(item) {
		// this.clearAllPressedCls();
		// item.addClsWithUI('pressed');
	},
	clearAllPressedCls : function() {
		// Ext.each(this.actions, function(btn) {
		// btn.removeClsWithUI('pressed');
		// });
	},
	initComponent : function() {
		var me = this;
		// me.selectable = false;
		me.callParent(arguments);

		// Ext.util.History.init();
		// var token = window.location.hash.substring(1);
		// if (token != '') {
		// console.log('1.token', token);
		// me.down('#' + token).el.dom.click();
		// }
		// Ext.util.History.on({
		// change : function(token) {
		// // console.log('token', token);
		// if (token) {
		// me.down('#' + token).el.dom.click();
		// }
		// }
		// });

		me.on({
			afterrender : function(toolbar, eOpts) {
				// console.log('toolbar', toolbar);

				Ext.each(toolbar.items.items, function(btn) {
					// console.log('btn', btn.getItemId());

					if (btn.pressed) {
						btn.el.dom.click();
					}

					btn.on({
						click : function() {
							if (this.historable) {
								// Ext.util.History.add(this.getItemId());
							}
						}
					});
				});

				// for ( var i in toolbar.items.items) {
				//
				// (function() {
				// var item = toolbar.items.items[i];
				// if (item.handler || item.menu) {
				// if (!Ext.Array.contains(me.excludeItemId, item.getItemId())) {
				// me.actions.push(item);
				//
				// if (item.menu) {
				// item.menu.on({
				// click : function() {
				// me.onItemPressed(item);
				// }
				// });
				// } else {
				// item.on({
				// click : function() {
				// me.onItemPressed(item);
				// }
				// });
				// }
				// }
				//
				// }
				// })();
				//
				// }
			}
		});
	}
});
