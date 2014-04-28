Ext.define('Ecfa.store.resource.RenderLevel', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getRenderLevel(Ecfa.Const.Render.Level.LOW),
		value : Ecfa.Const.Render.Level.LOW,
		number : 0
	}, {
		display : Ecfa.locale.Converter.getRenderLevel(Ecfa.Const.Render.Level.MID),
		value : Ecfa.Const.Render.Level.MID,
		number : 10
	}, {
		display : Ecfa.locale.Converter.getRenderLevel(Ecfa.Const.Render.Level.HIGH),
		value : Ecfa.Const.Render.Level.HIGH,
		number : 20
	} ]
});
