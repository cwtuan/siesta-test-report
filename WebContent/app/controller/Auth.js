Ext.define('Ecfa.controller.Auth', {
	extend : 'Ext.app.Controller',
	stores : [ 'auth.User','notification.NotificationTime'
	// ,'auth.Role',
	// 'auth.Capability', 'auth.CapabilityTree', 'auth.UserRole',
	// 'auth.RoleUser',
	// 'auth.RoleCapabilityTree', 'auth.UserVm'
	],
	models : [ 'auth.User','notification.NotificationTime'//,'auth.Account','Property'
	],
	init : function() {
		var me = this;
	}
});
