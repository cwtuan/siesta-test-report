Ext.define('Ecfa.store.resource.PoolStatus', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value'],
	data : [{
		display : Ecfa.locale.Converter.getPoolStatus(Ecfa.Const.Pool.STATUS.ACTIVE),
		value : Ecfa.Const.Pool.STATUS.ACTIVE
	}, {
		display : Ecfa.locale.Converter.getPoolStatus(Ecfa.Const.Pool.STATUS.INACTIVE),
		value : Ecfa.Const.Pool.STATUS.INACTIVE
	}]
});
