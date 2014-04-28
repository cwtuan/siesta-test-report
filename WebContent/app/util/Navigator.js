/**
 * Switch to a view panel (and show tab on that panel)
 */

/* Ex1 :Just switch to the view pane */
// Ecfa.Navigator.show('#opMonitor');
/* Ex2: not only switct to view panel but also show a a specific tab panel */
// Ecfa.Navigator.show('#opMonitor', '#monitorView #usagePanel');
Ext.define('Ecfa.util.Navigator', {
	singleton : true,
	alternateClassName : [ 'Ecfa.Navigator' ],

	/**
	 * <pre>
	 * mainToolbarItemId: main toolbar's menu itemId. 
	 * tabSelector (optional): tab panel's selector. See [http://docs.sencha.com/extjs/4.1.1/#!/api/Ext.container.AbstractContainer-method-down]
	 * </pre>
	 */
	show : function(mainToolbarMenuItemId, tabSelector) {
		var me = this;

		if (me.mainToolbar == null) {
			me.viewport = Ext.getCmp('viewport');
			me.mainToolbar = me.viewport.items.items[0].child('#mainToolbar');
		}

		me.mainToolbar.press(mainToolbarMenuItemId);

		if (tabSelector) {
			me.viewport.items.items[0].down(tabSelector).show();
		}
	}
});
