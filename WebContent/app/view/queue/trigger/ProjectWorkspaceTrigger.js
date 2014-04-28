Ext.define('Ecfa.view.queue.trigger.ProjectWorkspaceTrigger', {
	extend : 'Ext.form.field.Trigger',
	alias : 'widget.projectWorkspaceTrigger',
	requires : [ 'Ecfa.view.queue.trigger.SelectProjectWorkspaceWin' ],
	projectOid : null,
	onTriggerClick : function() {
		var me = this;

		Ext.widget('selectProjectWorkspaceWin', {
			projectOid : me.projectOid
		}).show();

	}
});
