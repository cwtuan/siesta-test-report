Ext.define('Ecfa.store.license.ProductState', {
    extend : 'Ext.data.Store',    
    fields : [ 'name', 'value' ],
	data : [ {
		name : Ecfa.locale.Converter.getProductState(Ecfa.Const.Product.State.ON),
		value : Ecfa.Const.Product.State.ON
	}, {
		name : Ecfa.locale.Converter.getProductState(Ecfa.Const.Product.State.OFF),
		value : Ecfa.Const.Product.State.OFF
	}],
    sorters : [ {
		property : 'name',
		direction : 'ASC'
	}]
});
