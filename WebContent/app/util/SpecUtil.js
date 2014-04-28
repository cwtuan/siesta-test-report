Ext.define('Ecfa.util.SpecUtil', {
	singleton : true,
	alternateClassName : [ 'Ecfa.SpecUtil' ],
	
	constructor : function(config) {		
		this.initConfig(config);
	},	
	
	isMaya : function(productOid) {
		//console.log(Ecfa.Spec.getProductContainMaya());
		//console.log(Ext.Array.contains(Ecfa.Spec.getProductContainMaya(), productOid));
		return Ext.Array.contains(Ecfa.Spec.getProductContainMaya(), productOid);
	},
	isBlender : function(productOid){
		return Ext.Array.contains(Ecfa.Spec.getProductContainBlender(), productOid);
	}
});
