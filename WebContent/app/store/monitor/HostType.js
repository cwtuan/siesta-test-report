Ext.define('Ecfa.store.monitor.HostType', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getHostTypeOs(Ecfa.Const.Host.TYPE.APP),
		value : 0,//Ecfa.Const.Host.TYPE.APP,
		number : 0
	}, {
		display : Ecfa.locale.Converter.getHostTypeOs(Ecfa.Const.Host.TYPE.NODE),
		value : 1,//Ecfa.Const.Host.TYPE.NODE,
		number : 1
	}]
});
