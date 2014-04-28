Ext.define('Ecfa.view.common.ColumnsGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.columnsGroupGrid',	
	border : false,	
	layout : 'fit',
	
	rowCursorPointer : false,
	requires : [ 
	        //column : queue    
	        'Ecfa.view.queue.column.Num', 'Ecfa.view.queue.column.Name', 'Ecfa.view.queue.column.NumTotal',
	        'Ecfa.view.queue.column.State','Ecfa.view.queue.column.Actions','Ecfa.view.queue.column.Product',
	        'Ecfa.view.queue.column.Scene',
	        //column : usage
	        'Ecfa.view.usage.column.AverageFrameTime',
			'Ecfa.view.usage.column.CoreHours', 'Ecfa.view.usage.column.Cost','Ecfa.view.usage.column.TimeUsed',
			'Ecfa.view.usage.column.RetryCount','Ecfa.view.usage.column.StartCount',
			
			//action
			'Ecfa.view.queue.trigger.DependencyTrigger', 
            'Ecfa.view.queue.action.MissionAction', 
            'Ecfa.view.queue.action.MissionAlertAction'],
	

	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}
});
