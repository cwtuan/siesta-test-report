Ext.define('Ecfa.view.queue._SubmitWizard', {	
	extend : 'Ext.panel.Panel',
	alias : 'widget._submitWizard',
	store : 'queue.Submission',
	requires : [ 'Ecfa.view.queue.SubmitSetting', 'Ecfa.view.queue.SubmitCheck', 'Ecfa.view.queue.SubmitConfirm',
	             'Ecfa.view.queue.ProcessingView', 'Ecfa.view.queue.AssetGrid','Ecfa.view.queue.SubmitSettingAdv'],
	layout : 'card',
	border : false,
	activeItem : 0, // index or id
	assetTracking : false,
	initComponent : function() {
		var me = this;		

		me.items = [ {
			itemId : 'submitSetting',
			xtype : 'submitSettingAdv'
		}, {
			itemId : 'submitCheck',
			xtype : 'submitCheck'
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
		var confirmform = this.down('submitConfirm');
		var confirmVals = confirmform.getValues();		
		console.log(confirmVals);
		// console.log(confirmVals['timeWait']);

		var settingform = this.down('submitSetting');
		var settingVals = settingform.getValues();		
		settingVals['email'] = confirmVals['email'];
		console.log(settingVals);
		
		//radio group decide
		var timeWait ;
		console.log(confirmVals['timing']);
		if(confirmVals['timing']=='now'){
			timeWait = 0; 
		}else{
			timeWait = confirmVals['timeWait'];
		}

		var submit = Ext.create('Ecfa.model.queue.Submission', {
			name : settingVals['name'],
			userName : Ecfa.Session.getUser().id,
			//timeCreation : Ext.Date.now(),
			timeWait : timeWait,//confirmVals['timeWait'],
			priority : settingVals['priority'],	
			dependency : settingVals['dependency'],
			missions : [ settingVals ]
		});
		// submit.set('missions', [ settingVals ]);
		console.log(submit);
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
	
	resetSetting : function(){
		this.down('#submitSetting').getForm().reset();
		this.down('#submitSetting').initDisableFields();
		this.down('#submitConfirm').getForm().reset();
	},	
	
	firstReset : function(){
		this.first();
		this.resetSetting();
		this.down('#submitConfirm').makeEditable();
	}
});
