Ext.define('Ecfa.model.queue.Mission', {
	extend : 'Ext.data.Model',
	idProperties : 'oid',
	fields : [ {
		name : 'num', 
		type : 'int'/*,
		mapping : 'submission.num'*/
	},{
		name : 'oid',
		type : 'string'
	}/*, {
		name : 'service',
		type : 'string'
	}*/,{
		name : 'renderingProduct',
		type : 'string'
	},{
		name : 'product',
		type : 'string'
	}, {
		name : 'name',
		type : 'string'
	}, {
		name : 'frameFirst',
		type : 'int'
			
	}, {
		name : 'frameLast',
		type : 'int'
	}, {
		name : 'framesPerTask',
		type : 'int'
	}, {
		name : 'framesInc',
		type : 'int'
	}, {
		name : 'workingDirectory',
		type : 'string'
	}, {
		name : 'files',
		type : 'string'
	}, {
		name : 'project',
		type : 'string'
	}, {
		name : 'projectName',
		type : 'string'
	},{
		name : 'projectLastCleanTime'
	}, {
		name : 'sceneFile', //format to submit : resource/xxx/HulkRig_Mark02.mb
		type : 'string'
	}, {
		name : 'corePerFrame',
		type : 'int'
	}, {
		name : 'outputType',
		type : 'string'
	}, {
		name : 'convertVideo',
		type : 'boolean'
	},{
		name : 'fileCheck',
		type : 'boolean'
	},{
		name : 'renderMode',
		type : 'string'			
	}, {
		name : 'email',
		type : 'string'
	}, {
		name : 'state',
		type : 'string'
	}, {
		name : 'numQueueing',
		type : 'int'
	}, {
		name : 'numRunning',
		type : 'int'
	}, {
		name : 'numDone',
		type : 'int'
	}, {
		name : 'numFail',
		type : 'int'
	}, {
		name : 'numTotal',
		type : 'int'
	},{
		name : 'progress',
		type : 'float'
	},{
		name : 'dependency',//depreciate (move to submission)
		type : 'string'
	},{
		name : 'compressedFileName',
		type : 'string'
	},{
		name : 'userName',
		type : 'string'
	}, {
		name : 'timeCreation', defaultValue : 0
	}, {
		name : 'timeWait', defaultValue : 0
	}, {
		name : 'timeStart', defaultValue : 0
	}, {
		name : 'timeDone', defaultValue : 0
	}, {
		name : 'priority',
		type : 'string'
	},{
		name : 'dependency', //Job Global Depend Mask		
		type : 'string'
	},{
		name : 'dependencyName',		
		type : 'string'
	}, {
		name : 'characteristics',
		defaultValue : []
	},{
		name :  'averageFrameTime',
		type : 'float'
	},{
		name :  'coreHours',
		type : 'float'
	},{
		name :  'cost',
		type : 'float'
	}]

	,
	proxy : {
		type : 'rest',
		timeout: 120000,
		url : 'rest/queue/submission'/*,
		writer : Ext.create('Ecfa.util.JsonWriter', {
			writeAllFields : true
		})*/
	}
	
	////belongsTo: 'Ecfa.model.queue.Submission'
	
	/*belongsTo: [{		
		name : 'submission',
		model :'Ecfa.model.queue.Submission',
		associationKey : 'submission',
		getterName:'getSubmission',
	    setterName:'setSubmission'
		
	} ]*/
});
