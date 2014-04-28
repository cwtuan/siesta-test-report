Ext.define('Ecfa.store.license.ProductPluginSupport', {
    extend : 'Ext.data.Store',    
    fields : [ 'name', 'value' ],
	data : [ {
		name : Ecfa.Converter.getYesNo(Ecfa.Const.Product.PluginSupport.YES),
		value : Ecfa.Const.Product.PluginSupport.YES
	}, {
		name : Ecfa.Converter.getYesNo(Ecfa.Const.Product.PluginSupport.NO),
		value : Ecfa.Const.Product.PluginSupport.NO
	}],
    sorters : [ {
		property : 'name',
		direction : 'ASC'
	}]
});
