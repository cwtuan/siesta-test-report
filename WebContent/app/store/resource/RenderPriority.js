Ext.define('Ecfa.store.resource.RenderPriority', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getRenderPriority(Ecfa.Const.Render.Priority.LOW),
		value : Ecfa.Const.Render.Priority.LOW,
		number : 0
	}, {
		display : Ecfa.locale.Converter.getRenderPriority(Ecfa.Const.Render.Priority.MID),
		value : Ecfa.Const.Render.Priority.MID,
		number : 10
	}, {
		display : Ecfa.locale.Converter.getRenderPriority(Ecfa.Const.Render.Priority.HIGH),
		value : Ecfa.Const.Render.Priority.HIGH,
		number : 20
	} ]
});
