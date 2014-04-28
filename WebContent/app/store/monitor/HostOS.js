Ext.define('Ecfa.store.monitor.HostOS', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getHostTypeOs(Ecfa.Const.Host.OS.LINUX),
		value : Ecfa.Const.Host.OS.LINUX,
		number : 0
	}, {
		display : Ecfa.locale.Converter.getHostTypeOs(Ecfa.Const.Host.OS.WINDOWS),
		value : Ecfa.Const.Host.OS.WINDOWS,
		number : 1
	} ]
});
