Ext.define('Ecfa.view.project.action.EditProjectAction', {
	extend : 'Ecfa.action.RowEditAction',
	alias : 'widget.editProjectAction',
	record : null,
	panel : null,
	getDisabledTooltip : function(project) {
		if (project.get('projectRole') !== Ecfa.Const.Project.Role.OWNER) {
			return Locale.getMsg('view.project.user.disabledBtnTip.role.owner');
		}
		return null;
	},
	getErrorMsg : function(jsonResp, record) {
		return Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.project.edit.error', record.get('name')), jsonResp);
	},
	constructor : function(config) {
		var me = this;
		config.getErrorMsg = me.getErrorMsg;
		config.eventType = Ecfa.event.Project;
		config.disabledTooltip = me.getDisabledTooltip(config.record);
		me.callParent([ config ]);
	}
});
