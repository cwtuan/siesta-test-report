Ext.define('Ecfa.store.license.LicenseType', {
    extend : 'Ext.data.Store',    
    fields : [ 'name', 'value' ],
	data : [ {
		name : Ecfa.locale.Converter.getLicenseType(Ecfa.Const.LicenseType.SOFTWARE),
		value : Ecfa.Const.LicenseType.SOFTWARE
	}, {
		name : Ecfa.locale.Converter.getLicenseType(Ecfa.Const.LicenseType.ENGINE),
		value : Ecfa.Const.LicenseType.ENGINE
	}],
    sorters : [ {
		property : 'name',
		direction : 'DESC'
	}]
});
