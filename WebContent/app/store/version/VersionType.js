Ext.define('Ecfa.store.version.VersionType', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getVersionType(Ecfa.Const.Version.TYPE.APP),
		value : Ecfa.Const.Version.TYPE.APP,
		number : 0
	}, {
		display : Ecfa.locale.Converter.getVersionType(Ecfa.Const.Version.TYPE.PLUGIN),
		value : Ecfa.Const.Version.TYPE.PLUGIN,
		number : 1
	} ]
});
