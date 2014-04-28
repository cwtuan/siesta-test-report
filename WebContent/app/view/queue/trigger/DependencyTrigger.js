Ext.define('Ecfa.view.queue.trigger.DependencyTrigger', {
	extend : 'Ext.form.field.Trigger',
	alias : 'widget.dependencyTrigger',
	requires : ['Ecfa.view.queue.trigger.MissionWin'],
	value : null, //pass field mission to missionWin
	initComponent : function() {		
		this.callParent(arguments);
	},
	projectOid : null,
	onTriggerClick : function() {
		var me = this;
		var value = me.value;	
		var title = Locale.getMsg('view.job.project.runninglist');	
		
		var inputData = me.up('form').down('#submissionOidKeeper').value;
		console.log(inputData);
		
		Ext.widget('missionWin',{			
			title : title,
			displayData : value,
			inputValue : inputData,
			width : 800,
			projectOid : me.projectOid			 
		}).show();	
		
	}
});
