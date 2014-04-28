Ext.define('Ecfa.store.notification.EventType', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getEventType(Ecfa.Const.NotificationType.PROBLEM),//Ecfa.locale.Converter.getRenderOS(Ecfa.Const.Render.OS.WIN64),
		value : Ecfa.Const.NotificationType.PROBLEM
	}, {
		display : Ecfa.locale.Converter.getEventType(Ecfa.Const.NotificationType.SYSTEM),
		value : Ecfa.Const.NotificationType.SYSTEM
	},  {
		display : Ecfa.locale.Converter.getEventType(Ecfa.Const.NotificationType.SERVICE),
		value : Ecfa.Const.NotificationType.SERVICE
	}, {
		display : Ecfa.locale.Converter.getEventType(Ecfa.Const.NotificationType.POOL_EXPIRATION),
		value : Ecfa.Const.NotificationType.POOL_EXPIRATION
	}, {
		display : Ecfa.locale.Converter.getEventType(Ecfa.Const.NotificationType.RENDER_FAIL),
		value : Ecfa.Const.NotificationType.RENDER_FAIL
	}]
});
