Ext.define('MyApp.event.ModelEvent', {
	extend : 'Ext.util.Observable',
	constructor : function() {

		// TODO: const for event type
		this.addEvents({
			"selected" : false, // MyApp.event.XXX.fireEvent('selected', record);
			"created" : false, // MyApp.event.XXX.fireEvent('created', record);
			"updated" : false, // MyApp.event.XXX.fireEvent('updated', record);
			"destroyed" : false,// MyApp.event.XXX.fireEvent('destroyed', record);
			// "bulkupdated" : false,
			"running" : false
		// MyApp.event.XXX.fireEvent('running', true);
		});
		this.callParent(arguments);

		Ext.util.Observable.capture(this, function(eventName, signature) {
			console.log('Event:', eventName, signature);
		});

	}
});
