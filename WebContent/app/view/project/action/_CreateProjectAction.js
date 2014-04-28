Ext.define('Ecfa.view.project.action.CreateProjectAction', {
	extend : 'Ecfa.action.CreateAction',
	alias : 'widget.createProjectAction',
//	// set by grid:
	record : null,
	panel : null, // TODO 要顯示notification bar 的panel
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = null;
		 // TODO defaultTooltip 在create action應為text
		config.eventType = Ecfa.event.Project;
//		config.defaultTooltip = 'set your own tooltip here'; 
//		config.success = function() {console.log('you can override success callback here')};
//		config.failure = function() {console.log('you can override failure callback here')};
//		config.failureMsg = 'set your message for notification bar here';
		
		
		me.callParent([ config ]);
	}

});
