Ext.define('MyApp.util.SpecUtil', {
	singleton : true,
	alternateClassName : [ 'MyApp.SpecUtil' ],
	
	constructor : function(config) {		
		this.initConfig(config);
	},	
	
	isMaya : function(productOid) {
		//console.log(MyApp.Spec.getProductContainMaya());
		//console.log(Ext.Array.contains(MyApp.Spec.getProductContainMaya(), productOid));
		return Ext.Array.contains(MyApp.Spec.getProductContainMaya(), productOid);
	},
	isBlender : function(productOid){
		return Ext.Array.contains(MyApp.Spec.getProductContainBlender(), productOid);
	}
});
