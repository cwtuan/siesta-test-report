Ext.define('Ecfa.store.resource.RenderOS', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getRenderOS(Ecfa.Const.Render.OS.WIN64),
		value : Ecfa.Const.Render.OS.WIN64,
		number : 0
	}, {
		display : Ecfa.locale.Converter.getRenderOS(Ecfa.Const.Render.OS.WIN32),
		value : Ecfa.Const.Render.OS.WIN32,
		number : 10
	}, {
		display : Ecfa.locale.Converter.getRenderOS(Ecfa.Const.Render.OS.LINUX),
		value : Ecfa.Const.Render.OS.LINUX,
		number : 20
	}, {
		display : Ecfa.locale.Converter.getRenderOS(Ecfa.Const.Render.OS.MAC),
		value : Ecfa.Const.Render.OS.MAC,
		number : 30
	}]
});
