Ext.define('Ecfa.view.project.action.DeleteProjectAction', {
	extend : 'Ecfa.action.DeleteAction',
	alias : 'widget.deleteProjectAction',
	record : null,
	getDisabledTooltip : function(record) {
		if (record.get('projectRole') !== Ecfa.Const.Project.Role.OWNER) {
			return Locale.getMsg('view.project.user.disabledBtnTip.role.owner');
		}
		return null;
	},
	getErrorMsg : function(jsonResp, record) {
		return Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.project.delete.error', record.get('name')), jsonResp);
	},
	constructor : function(config) {
		var me = this;	
		config.disabledTooltip = me.getDisabledTooltip(config.record);
		config.confirmMsg = Locale.getMsg('view.project.delete.confirm', config.record.get('name'));
		config.eventType = Ecfa.event.Project;
		me.callParent([ config ]);
	}
});
