Ext.define('Ecfa.util.Util', {
	singleton : true,
	alternateClassName : [ 'Ecfa.Util' ],
	
	constructor : function(config) {		
		this.initConfig(config);
	},	
	
	isDateEarlier : function(timestamp1, timestamp2) {
		//is date1 earlier than date2?
		
//		console.log(Ecfa.Config.SOFT_DEL_LIMIT);
//		console.log('30 days to millisec',Ecfa.Config.SOFT_DEL_LIMIT);
//		console.log('elapsed millisec',Ext.Date.getElapsed(d1,d2));//milliseconds	
		
		
//		console.log('startTime',dateString1);
//		console.log('lastCleanTime',dateString2);		
//		
//		
//		var d1 =  Ext.Date.parse(dateString1, Ecfa.Config.DATETIME_FORMAT);
//		var d2 =  Ext.Date.parse(dateString2, Ecfa.Config.DATETIME_FORMAT);
//		console.log(timestamp1);
//		console.log(timestamp2);
		if(timestamp1==0 || timestamp1==null || timestamp2==0 || timestamp2==null){
			return false;
		}
		
		return (timestamp1 < timestamp2);
		
	}
});
