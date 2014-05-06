Ext.define('MyApp.ExtSetting', {
	singleton : true,
	init : function(config) {


	
		// TODO init stateful component
//		Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider', {
//			expires : new Date(new Date().getTime() + 15552000000), // 180 days
//			path : 'MyApp'
//		}));
//		Ext.define('Ext.setting.grid.Panel', {
//			override : 'Ext.grid.Panel',
//			initComponent : function() {
//				
//				console.log('stateful');
//				
//				var me = this;
//				var className = Ext.getClassName(me);
//				if (className != null && className.indexOf('MyApp') != -1) {
//					me.stateful = true;
//					me.stateId = className;
//				}
//				me.callParent();
//			}
//		});

		// Disable row selection when clicking row on grid
		// Ext.define('Ext.setting.grid.Panel', {
		// override : 'Ext.grid.Panel',
		// initComponent : function() {
		// if (this.selModel && Ext.Array.contains([ 'MULTI', 'SIMPLE' ],
		// this.selModel.mode)) {
		// this.selModel.checkOnly = true;
		// }
		// this.callParent();
		// }
		// });

		// global setting for Grid View

		Ext.define("Ext.setting.grid.View", {
			override : "Ext.grid.View",
			autoScroll : true,
			enableTextSelection : true,
			emptyText : 'No data' // FIXME
		});

		// global setting for Panel Table
		Ext.define('Ext.setting.panel.Table', {
			override : 'Ext.panel.Table',
			columnLines : true
		});

		// init quicktips
		Ext.tip.QuickTipManager.init();

		// global setting for tooltip
		Ext.apply(Ext.tip.QuickTipManager.getQuickTip(), {
			dismissDelay : 0,
			showDelay : 0,
			autoHide : false
		// ,
		// cls : 'tooltip-message',
		// bodyCls : 'tooltip-message',
		// componentCls: 'tooltip-message'
		});

		// To show dialog/menu over Java Applet !!
		// Remove this if not use applet any more.
		// Ext.useShims = true;

		// make the error message under the field
		Ext.form.Field.prototype.msgTarget = 'under';
		Ext.form.CheckboxGroup.prototype.msgTarget = 'under';

	}
});
