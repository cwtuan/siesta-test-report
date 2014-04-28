Ext.define('Ecfa.view.queue.trigger.SceneFileTrigger', {
	extend : 'Ext.form.field.Trigger',
	alias : 'widget.sceneFileTrigger',
	requires : [ 'Ecfa.view.queue.trigger.SelectSceneFileWin' ],
	projectOid : null,
	fileFilter : null,
	workspacePath : null, // for maya only
	onTriggerClick : function() {
		var me = this;

		Ext.widget('selectSceneFileWin', {
			fileFilter : me.fileFilter,
			projectOid : me.projectOid,
			workspacePath : me.workspacePath
		}).show();

	}
});
