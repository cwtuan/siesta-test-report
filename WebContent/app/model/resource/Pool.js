Ext.define('Ecfa.model.resource.Pool', {
	extend : 'Ext.data.Model',
	// idProperty : 'oid', // Don't support current update url
	fields : [ {
		name : 'oid'
	// ,type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'subscriber',
		type : 'string'
	}, {
		name : 'levelHighNum',
		type : 'int'
	}, {
		name : 'levelMidNum',
		type : 'int'
	}, {
		name : 'levelLowNum',
		type : 'int'
	}, {
		name : 'status',
		type : 'string'
	}, {
		name : 'osType'
	// ,
	// type : 'string'
	}, {
		name : 'licenses'
	}, {
		name : 'numbers',// 卐卐卐卐卐PLZ DON'T REMOVE ME 卐卐卐卐卐卐 @Alvita: for dedicated pool
		type : 'int'		
	},{
		name : 'startTime' 
	},{
		name : 'endTime'
	} ],

	associations : [ {
		type : 'hasMany',
		model : 'Ecfa.model.resource.PoolLicense',
		name : 'licenses'
	} ],

	proxy : {
		type : 'rest',
		url : 'rest/op/resource/pools',
		reader : {
			// type : 'json'
			type : 'restTaskGrid'
		},
		writer : Ext.create('Ecfa.util.JsonWriter', {
			writeAllFields : true
		})
	/*
	 * writer: Ext.create('Ecfa.util.JsonWriter', { writeAllFields : false, //just send changed fields allowSingle :false //always wrap in an array //
	 * nameProperty: 'mapping' })
	 */
	}
});
