Ext.define('MyApp.Spec', {
	singleton : true,	
	
	MAYA_2012 : '9c8bac37-83f1-4b59-87d4-329a376c2d04',
	MAYA_2013 : 'c3cba6f2-eb2e-4f9e-b7bc-9c0a41708dd2',
	MAYA_2014 : '093a72aa-6602-4fb0-9665-53279dec9e1f',
	MAYA_2012_MENTAL : '6ccbb74b-d1d3-41cf-8193-8f166541e36a',
	MAYA_2013_MENTAL : '18502ddd-25e9-4aea-9a44-010b8e58f30b',
	MAYA_2014_MENTAL : '314d6e60-37a0-11e3-aa6e-0800200c9a66',
	BLENDER_2_2_6 : '23c63464-7918-4245-af3e-625688cdd719',
	BLENDER_2_2_8_A : 'a00d70ac-2fe4-436b-a032-75df1d345907',
	MAX_2013 : '7504346c-3831-4695-a028-5998b7ec43d7',
	MAX_2014 : '0cd63c8d-871a-4452-bbb3-c99572f5b618',
	MAYA_2012_VRAY : 'd82f5a41-0dd3-4467-83da-7f366bc9b85e',
	MAYA_2013_VRAY : '126101bd-aca7-44ea-ac72-400591d3668f',
	MAYA_2014_VRAY : '20151abc-e6cb-4a45-9e8b-08c702b7a325',
	
	
	getProductContainMaya : function(){
		return [ this.MAYA_2012, this.MAYA_2013, this.MAYA_2014,
		         this.MAYA_2012_MENTAL, this.MAYA_2013_MENTAL, this.MAYA_2014_MENTAL,
		         this.MAYA_2012_VRAY, this.MAYA_2013_VRAY, this.MAYA_2014_VRAY];
	},
	getProductContainBlender : function(){
		return [ this.BLENDER_2_2_6, this.BLENDER_2_2_8_A ];
	},
	
	getProductContainMax : function(){
		return [ this.MAX_2013, this.MAX_2014 ];
	},

	
//	ProductContains : {
//		MAYA : [ '9c8bac37-83f1-4b59-87d4-329a376c2d04', 'c3cba6f2-eb2e-4f9e-b7bc-9c0a41708dd2', '093a72aa-6602-4fb0-9665-53279dec9e1f',
//		         '6ccbb74b-d1d3-41cf-8193-8f166541e36a', '18502ddd-25e9-4aea-9a44-010b8e58f30b', '314d6e60-37a0-11e3-aa6e-0800200c9a66',
//		         'd82f5a41-0dd3-4467-83da-7f366bc9b85e','126101bd-aca7-44ea-ac72-400591d3668f','20151abc-e6cb-4a45-9e8b-08c702b7a325'
//		        ],
//		BLENDER : [ '23c63464-7918-4245-af3e-625688cdd719', 'a00d70ac-2fe4-436b-a032-75df1d345907'],		
//		MAX : [ '7504346c-3831-4695-a028-5998b7ec43d7', '0cd63c8d-871a-4452-bbb3-c99572f5b618' ]
//	},
	
	Extra : { //step3
		CAMERA : '4d400fde-1e46-4a3c-a6bf-f6b4efd768aa',
		LAYER : 'fee28150-8df8-4b4b-b090-b1ed637f6958',
		SCENE_STATE : '3935f822-e4e5-421b-b2d2-a7ee98003d1c',
		VIDEO_COLOR_CHECK : '09886905-404a-4b21-b3d5-faa50ff07e1a',
		ATMOSPHERICS : '0e836c8c-596a-4b93-82eb-cbeea68dfa09',
		SUPER_BLACK : '27552fe0-e2fa-4412-9f3a-11e371687db5',
		RENDER_HIDDEN : '18b6f719-1fb4-40db-84ee-b86c51165c98',
		FORCE2SIDED : 'ec4a46a6-72d4-4d89-a2c8-ec766800245c',
		EFFECTS : '383ddbc7-a47a-475b-b7b4-c62cd64eca29',		
		DISPLACEMENT : '47e23fb6-0c0f-4491-b41b-8bcbec29a283',
		RENDER_FIELDS :	'ad7858c8-965b-4978-948c-6ad76e37b258',
		AREA_LIGHTS : '2ba16f5b-6368-4e1d-a983-6ae568e7c399',
		GAMMA_CORRECTION : 'b8d1f43d-6b07-4f18-a244-e2089d8c1b1a',
		GAMMA_VALUE_IN : 'b0bae000-e9db-4f80-bfb4-2504b13e8192',
		GAMMA_VALUE_OUT : '019500f6-0fdc-4461-bf6e-cfd5203afaa8'	
	},
	
	Common : { //step1
		WORKSPACE : '6b338ca3-dd31-4228-800d-f652e9c2a8ca'
	},
	Fields : null //define in SubmitWizard
	
	

});
