Ext.define('Ecfa.view.project.action.DeleteProjectUserAction', {
	extend : 'Ecfa.action.DeleteAction',
	alias : 'widget.deleteProjectUserAction',
	record : null,
	project : null,
	getDisabledTooltip : function(project, user) {

		if (project.get('projectRole') !== Ecfa.Const.Project.Role.ADMIN && project.get('projectRole') !== Ecfa.Const.Project.Role.OWNER) {
			return Locale.getMsg('view.project.user.disabledBtnTip.role.owner_admin');
		} else if (user && user.getId() === Ecfa.Session.getUser().id) {
			return Locale.getMsg('view.project.user.disabledBtnTip.notSelf');
		} else if (user && user.get('projectRole') === Ecfa.Const.Project.Role.OWNER) {
			return Locale.getMsg('view.project.user.disabledBtnTip.role.not_execute_on_owner');
		}
		return null;
	},
	getErrorMsg : function(jsonResp, record) {
		return Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.project.user.remove.error', record.getId()), jsonResp);
	},
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = me.getDisabledTooltip(config.project, config.record);
		config.confirmMsg = Locale.getMsg('view.project.user.remove.confirm', config.record.get('id'), config.project.get('name'));
		config.eventType = Ecfa.event.User;

		me.callParent([ config ]);
	}

});
