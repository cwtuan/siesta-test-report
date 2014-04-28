Ext.define('Ecfa.view.project.action.EditProjectUserAction', {
	extend : 'Ecfa.action.RowEditAction',
	alias : 'widget.editProjectUserAction',
	record : null,
	project : null,
	panel : null,
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
	constructor : function(config) {
		var me = this;
		config.disabledTooltip = me.getDisabledTooltip(config.project, config.record);
		config.eventType = Ecfa.event.User;
		me.callParent([ config ]);
	},
	getErrorMsg : function(jsonResp, record) {
		return Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.project.user.edit.error', record.getId()), jsonResp);
	},
	constructor : function(config) {
		var me = this;
		config.getErrorMsg = me.getErrorMsg;
		config.eventType = Ecfa.event.User;
		config.disabledTooltip = me.getDisabledTooltip(config.project, config.record);
		delete config.record.data.role; // role is enum in UserVO, so we can't send it as empty string to server 
		me.callParent([ config ]);
	}

});
