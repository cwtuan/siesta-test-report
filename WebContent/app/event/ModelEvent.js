Ext.define('Ecfa.event.ModelEvent', {
	extend : 'Ext.util.Observable',
	constructor : function() {

		// TODO: const for event type
		this.addEvents({
			"selected" : false, // Ecfa.event.XXX.fireEvent('selected', record);
			"created" : false, // Ecfa.event.XXX.fireEvent('created', record);
			"updated" : false, // Ecfa.event.XXX.fireEvent('updated', record);
			"destroyed" : false,// Ecfa.event.XXX.fireEvent('destroyed', record);
			// "bulkupdated" : false,
			"running" : false
		// Ecfa.event.XXX.fireEvent('running', true);
		});
		this.callParent(arguments);

		Ext.util.Observable.capture(this, function(eventName, signature) {
			console.log('Event:', eventName, signature);
		});

	}
});
