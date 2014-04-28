Ext.define('Ecfa.model.notification.NotificationTime', {
	extend : 'Ext.data.Model',
	//idProperty : 'oid',
	fields : [ {
		name : 'oid',
		type : 'string'
	}, {
		name : 'eventType',
		type : 'string'
	}, {
		name : 'startTime',
		type : 'long'
	}, {
		name : 'endTime',
		type : 'long'
	} ]
});
