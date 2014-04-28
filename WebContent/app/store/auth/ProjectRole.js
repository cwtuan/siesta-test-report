// TODO use loop to generate data

Ext.define('Ecfa.store.auth.ProjectRole', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getProjectRole(Ecfa.Const.Project.Role.MEMBER),
		value : Ecfa.Const.Project.Role.MEMBER,
		number : 1
	}, {
		display : Ecfa.locale.Converter.getProjectRole(Ecfa.Const.Project.Role.ADMIN),
		value : Ecfa.Const.Project.Role.ADMIN,
		number : 2
	}, {
		display : Ecfa.locale.Converter.getProjectRole(Ecfa.Const.Project.Role.OWNER),
		value : Ecfa.Const.Project.Role.OWNER,
		number : 3
	} ]
});
