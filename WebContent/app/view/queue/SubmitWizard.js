Ext.define('Ecfa.view.queue.SubmitWizard', {	
	extend : 'Ext.panel.Panel',
	alias : 'widget.submitWizard',
	store : 'queue.Submission',
	requires : [ 'Ecfa.view.queue.SubmitSettingAdv', 'Ecfa.view.queue.SubmitCheck',
	             'Ecfa.view.queue.RenderSetting', 'Ecfa.view.queue.SubmitConfirm',
	             'Ecfa.view.queue.ProcessingView', 'Ecfa.view.queue.AssetGrid',
	             'Ecfa.view.queue.AnalysisAssetView','Ecfa.view.queue.AnalysisView'],
	layout : 'card',
	border : false,
	activeItem : 0, // index or id
	assetTracking : false, // for step
	renderSetting : false, // for step
	
	initComponent : function() {
		var me = this;
		//console.log(Ecfa.Spec.Fields);
		if(Ecfa.Spec.Fields==null){
			Ecfa.Spec.Fields = Ext.ClassManager.getNamesByExpression('Ecfa.view.queue.characteristics.field.*');
			//console.log(Ecfa.Spec.Fields);
		}
				

		me.items = [ {
			itemId : 'submitSetting',
			xtype : 'submitSettingAdv'
		}, {
			itemId : 'submitCheck',
			xtype : 'submitCheck'
		},{
			itemId : 'renderSetting',				
			xtype : 'renderSetting'
		}, {
			itemId : 'submitConfirm',
			xtype : 'submitConfirm'
		} ];
		me.callParent(arguments);
	},

	buttonVisible : function() {
		if (this.getLayout().getNext()) {
			this.down('#cardNext').setVisible(true);
			this.down('#submit').setVisible(false);
		} else {
			this.down('#cardNext').setVisible(false);
			this.down('#submit').setVisible(true);
		}

		if (this.getLayout().getPrev()) {
			this.down('#cardPrev').setVisible(true);
		} else {
			this.down('#cardPrev').setVisible(false);
		}
	},

	submit : function() {
		console.log('composite submission!');
		var confirmform = this.down('#submitConfirm');
		var confirmVals = confirmform.getValues();		
		//console.log(confirmVals);
		

		var settingform = this.down('#submitSetting');
		var settingVals = settingform.getValues();		
		settingVals['email'] = confirmVals['email'];
		//console.log(settingVals);
		/*common char*/
		//compose field value to Characteristics format
		var commonChars = settingform.createCharacteristics();	
		
		
		/*extra char*/
		if(this.renderSetting){
			var renderSettingForm = this.down('#renderSetting');			
			//var extraVals = renderSettingForm.getValues();
			//console.log('RENDERSETTING_VALUE',extraVals);
			
			//compose field value to Characteristics format
			var extraChars = renderSettingForm.createCharacteristics();
			//console.log('extra', extraChars);			
		
			var mergeChars = Ext.Array.merge(commonChars, extraChars);
			settingVals['characteristics'] = mergeChars;
		}else{
			settingVals['characteristics'] = commonChars;
		}		
		
		
		//radio group decide
		var timeWait ;
		//console.log(confirmVals['timing']);
		if(confirmVals['timing']=='now'){
			timeWait = 0; 
		}else{
			timeWait = confirmVals['timeWait'];
			console.log(timeWait);
		}		
		
		/*** /projectname/resource/xxx.mb --> resource/xxx.mb ***/
//		var originalScene = settingVals['sceneFile'];
//		var alterScene = this.alterFilePath(originalScene);
//		console.log(alterScene);
//		
//		settingVals['sceneFile'] =  alterScene;
		settingVals['userName'] =  Ecfa.Session.getUser().id;		
		settingVals['timeWait'] = timeWait;
		
		
		console.log(settingVals);
		var submit = Ext.create('Ecfa.model.queue.Mission');
		submit['data'] = settingVals;
		
		console.log(submit);
		//**TEMP CLOSE**//
		submit.save({
			success : function(rec, op) {	
				/*console.log('success?!');
				console.log(rec);
				console.log(op);*/								 
				Ecfa.event.Submission.fireEvent('created', rec, op);
			},
			
			failure : function(rec, op) {	
				/*console.log('failure!');
				console.log(rec);
				console.log(op);*/			
				Ecfa.event.Submission.fireEvent('fail', rec, op);				
			}
		});		

	},

	previous : function() {
		if (this.getLayout().getPrev()) {
			this.getLayout().prev();
			// this.buttonVisible();
		}
	},

	next : function() {
		if (this.getLayout().getNext()) {
			this.getLayout().next();
			// this.buttonVisible();
		}
	},	
	
	
	first : function(){
		this.getLayout().setActiveItem(0);
	},
	
	end : function(){		
		console.log(this.items.length);
		this.getLayout().setActiveItem(this.items.length-1);
	},
	
	jump : function(step){		
		console.log(step);		
		this.getLayout().setActiveItem(step-1);
	},
	
	resetSetting : function(){
		this.down('#submitSetting').getForm().reset();
		this.down('#submitSetting').initDisableFields();
		this.down('#submitConfirm').getForm().reset();
	},	
	
	firstReset : function(){
		this.first();
		this.resetSetting();
		this.down('#submitConfirm').makeEditable();
	},
	
	alterPath : function(path){
		var arr = path.split('/');
		console.log(arr);
		var alterarr = Ext.Array.slice(arr,2);		
		console.log(alterarr);
		var alterPath ='';

		for(var i=0; i< alterarr.length; i++){			
			alterPath += alterarr[i]+'/';					
		}
		
		console.log(alterPath);
		return alterPath;
	},
	
	alterFilePath : function(filePath){
		var arr = filePath.split('/');
		console.log(arr);
		var alterarr = Ext.Array.slice(arr,2);		
		console.log(alterarr);
		var alterFilePath ='';

		for(var i=0; i< alterarr.length; i++){
			if(i < alterarr.length-1){
				alterFilePath += alterarr[i]+'/';
			}else{
				alterFilePath += alterarr[i];
			}			
		}
		
		console.log(alterFilePath);
		return alterFilePath;
	}
});
