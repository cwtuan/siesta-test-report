
Ext.define('Ecfa.util.AuthValidator', {
	singleton : true,
	alternateClassName : [ 'Ecfa.AuthValidator' ],
	//*validator only return true, false*//
	isProjectAuth : function(admins){
		var result = false;
//		console.log(admins);
//		console.log('Session id: ');
//		console.log(Ecfa.Session.getUser().id);
		var userId = Ecfa.Session.getUser().id;
		Ext.each(admins, function(adminId){
			//console.log(adminId);
			//console.log(userId);
			if(userId == Ext.String.trim(adminId)){
				//console.log('true---');
				result = true;
				return false;				
			}
		});
		//console.log(result);
		return result;
	},
	
	isMissionOwner : function(record){
		var result = false;			
		//console.log(record);
		if(record){
			var missionUserId  = record.get('userName');			
			var userId = Ecfa.Session.getUser().id;
			
			if(missionUserId == userId){
				return true;
			}
		}			
		
		return result;
	}
});