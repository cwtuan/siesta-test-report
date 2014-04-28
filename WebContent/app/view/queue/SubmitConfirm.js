Ext.define('Ecfa.view.queue.SubmitConfirm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.submitConfirm',	
	region : 'center',
	layout : 'form',	
	overflowY : 'auto',
	overflowX : 'auto',
	style : 'margin-left:20px;margin-right:700px;margin-top:8px;',
	bodyStyle : 'padding:10px 10px 10px 10px',
	requires : [ 'Ecfa.ux.form.DateTimeField' ],
	defaultType : 'textfield',
	defaults : {
		labelWidth : 160,
		labelAlign : 'right'
	},
	//layout : 'fit',
	minWidth : 400,
	initComponent : function() {
		var me = this;
		me.title = Locale.getMsg('view.submit.confirm',3);// 'Ready to Submit (3/3)';
		//console.log(me.up('#submitWizard'));

		me.bbar = [ '->', {
			itemId : 'cardPrev',
			text : Locale.getMsg('view.wizard.previous'),
			width : 80,
			handler : function() {
				//TODO : <--- me.up('#submitWizard').renderSetting
				/*if(!me.up('#submitWizard').assetTracking && !me.up('#submitWizard').renderSetting){
					this.up('#submitWizard').first();
				}else */
				if(!me.up('#submitWizard').renderSetting){
					this.up('#submitWizard').jump(2);
				}else{ 
					this.up('#submitWizard').previous();
				}

				
			}
		}, {
			itemId : 'submit',
			text : Locale.getMsg('view.submit'),
			icon : 'css/images/cloud_upload_16.png',
			width : 80,
			handler : function() {
				console.log('submit!!');
				me.up('#submitWizard').submit();
				me.makeUneditable();				
			}
		},{
			itemId : 'create',
			text : Locale.getMsg('view.submit.create'),
			hidden : true,
			width : 150,
			icon : 'css/images/addnode_16x16.png',
			/*config: {	
				ui : 'plain',
		        style: 'background-color:white !important;'
		    },*/
		    handler : function(){
		    	me.up('#submitWizard').resetSetting();
		    	me.up('#submitWizard').first();
		    	me.makeEditable();
		    }
		} ];

		me.items = [ {
			xtype : 'fieldset',
			title : Locale.getMsg('view.submit.information'),
			defaultType : 'displayfield',
			defaults : {
				labelWidth : 160,
				labelAlign : 'right'				
			},
			items : [ {
				fieldLabel : Locale.getMsg('view.job.name'),
				name : 'name'
			}, {
				fieldLabel : Locale.getMsg('view.job.renderEngine'),
				name : 'renderingProductDisplay'
			}, {
				fieldLabel : Locale.getMsg('view.queue.project.title'),
				name : 'projectDisplay'
			}, {
				fieldLabel : Locale.getMsg('view.job.priority'),
				name : 'priority'
			}, {
				fieldLabel : Locale.getMsg('view.job.sceneFile'),
				name : 'sceneFile'
			}, {
				fieldLabel : Locale.getMsg('view.job.outputType'),
				name : 'outputType'
			}, {
				fieldLabel : Locale.getMsg('view.job.outputType.convertanimate'),
				name : 'convertVideo',				
				renderer: function(value, displayObj ){							
					return Ecfa.Converter.getTrueFalse(value);				
				}
			}, {
				xtype : 'fieldset',
				title : Locale.getMsg('view.job.frameRange'),
				columnWidth : 1,
				layout : 'column',
				defaultType : 'displayfield',
				defaults : {
					labelWidth : 50,
					labelAlign : 'right'
				},
				items : [ {
					fieldLabel : Locale.getMsg('view.common.from'),
					name : 'frameFirst',
					columnWidth : 0.2
				}, {
					fieldLabel : Locale.getMsg('view.common.to'),
					name : 'frameLast',
					columnWidth : 0.2
				}, {
					fieldLabel : Locale.getMsg('view.common.step'),
					name : 'framesInc',
					value : 1,
					columnWidth : 0.2
				} ]

			},{
				fieldLabel : Locale.getMsg('view.queue.dependency'),
				name : 'dependencyDisplay'
			}, {
				fieldLabel : Locale.getMsg('view.job.fileCheck'),
				name : 'fileCheck',
				renderer : function(value, displayObj) {
					return Ecfa.Converter.getTrueFalse(value);
				}
			},{
				fieldLabel : Locale.getMsg('view.job.rendermode'),
				name : 'renderMode',
				renderer: function(value, displayObj ){						
					//console.log('value','view.job.rendermode.'+value.toLowerCase());
					value = 'view.job.rendermode.'+value.toLowerCase();
					return Locale.getMsg(value);				
				}
			} ]
		},{
			fieldLabel : Locale.getMsg('view.job.timeCreate'),
			xtype : 'radiogroup',
			itemId : 'timewaitgroup',
			defaults : {
				xtype : 'radio',
				name : 'timing'				
			},
			layout: {
	            align: 'stretch',
	            type: 'vbox'
	        },
	        columns: 1,
	        listeners: {
	        	change : function(field, newValue, oldValue, eOpts){
	        		console.log(newValue['timing']);
	        		if(newValue['timing']=='now'){
	        			me.down('#timeWaitField').setDisabled(true);
	        		}else{
	        			me.down('#timeWaitField').setDisabled(false);
	        		}
	        		
	        	}
	        },
			items : [ {
				boxLabel : Locale.getMsg('view.job.rendernow'),
				inputValue : 'now',
				checked : 'true'
				
			}, {
				boxLabel : Locale.getMsg('view.job.timeWait'),
				inputValue : 'wait',
				tooltip : Locale.getMsg('view.job.timeWait.msg')
			},{
				itemId : 'timeWaitField',
				xtype : 'dateTimeField',				
				timeIncrement : 30,
				//fieldLabel : Locale.getMsg('view.job.timeWait'),
				name : 'timeWait',
				disabled : true,
				disabledCls : 'customDisabledClass'
			} ]
		}/*, {
			//itemId : 'timeWaitField',
			xtype : 'dateTimeField',
			timeIncrement : 30,
			//fieldLabel : Locale.getMsg('view.job.timeWait'),
			name : 'timeWait',
			disabled : true
			//disabledCls : 'customDisabledClass'
		}*/, {
			itemId : 'emailField',
			xtype : 'textfield',
			fieldLabel : Locale.getMsg('view.common.email'),
			name : 'email',
			value : Ecfa.Session.getUser().email,
			allowBlank : true,			
			disabledCls : 'customDisabledClass'
			
		} ];
		me.callParent(arguments);

		me.on({
			show : function() {
				console.log('SHOW!!!');
				me.loadSetting();
			}
		});

	},

	loadSetting : function() {
		var settingform = this.up('submitWizard').down('#submitSetting');
		console.log(settingform);
		var settingVals = settingform.getValues();
		this.getForm().setValues(settingVals);
		console.log(settingVals);
	},
	
	makeEditable : function(){
		//console.log('makeEditable');
		this.down('#submit').setDisabled(false);
		this.down('#cardPrev').setDisabled(false);		
		
		this.down('#create').setVisible(false);
		
		
		/*disable edtitable field*/				
		this.down('#timeWaitField').setDisabled(false);		
		this.down('#emailField').setDisabled(false);
	},
	
	makeUneditable : function(){
		console.log('makeUneditable');
		/*disable button*/
		this.down('#submit').setDisabled(true);
		this.down('#cardPrev').setDisabled(true);		
		
		this.down('#create').setVisible(true);
		
		
		/*disable edtitable field*/				
		this.down('#timeWaitField').setDisabled(true);		
		this.down('#emailField').setDisabled(true);
	
	},
	
	updateTitle : function(step){
		this.setTitle(Locale.getMsg('view.submit.confirm',step));
	}
	
});
