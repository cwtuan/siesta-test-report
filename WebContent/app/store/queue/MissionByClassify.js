Ext.define('Ecfa.store.queue.MissionByClassify', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.queue.Mission',
	sorters : [ {		
		property : 'userName',
		direction : 'ASC'
	},{		
		property : 'projectName',
		direction : 'ASC'
	},{
		property : 'num',
		direction : 'ASC'
	} ],
	proxy : {
		type : 'nestedRest',
		//url : 'rest/op/dashboard/missions?classify=pend',
		url : 'rest/op/dashboard/missions?classify=dynamic',
		params : {			
			exceedHours : 0,
			state : []
		},
		reader : {
			type : 'restTaskGrid'
		}

	}
});
