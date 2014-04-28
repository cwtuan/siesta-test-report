Ext.define('Ecfa.view.queue.characteristics.Characteristic', {
	extend : 'Ext.form.Field',
	alias : 'widget.characteristic',

	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	},
	
	//get value for submit
	composeValue : function() {
		throw "unimplemented method";
	}
});
