Ext.define('Ecfa.view.queue.SubmitSettingAdv', {
	// extend : 'Ext.form.Panel',
	extend : 'Ecfa.view.queue.characteristics.CharacteristicsForm',
	alias : 'widget.submitSettingAdv',
	store : 'queue.Mission',
	requires : [ 'Ecfa.view.project.CreateProjectWin', 'Ecfa.view.queue.trigger.DependencyTrigger',
			'Ecfa.view.transfer.SimpleUploaderWin', 'Ecfa.view.queue.trigger.SceneFileTrigger', 
			'Ecfa.view.queue.trigger.ProjectWorkspaceTrigger', 'Ecfa.view.usage.OwnerBalanceCheck'],
	region : 'center',
	border : true,
	layout : 'form',
	overflowY : 'auto',
	overflowX : 'auto',
	style : 'margin-left:20px;margin-right:700px;margin-top:8px;',
	bodyStyle : 'padding:10px 10px 10px 10px',
	defaultType : 'textfield',
	minWidth : 400,
	initComponent : function() {
		var me = this;
		me.title = Locale.getMsg('view.submit.setting', 1);// 'General Setting (1/3)';

		me.bbar = [
				'->',
				{
					itemId : 'cardNext',
					formBind : true,//************************
					//formBind : false,
					text : Locale.getMsg('view.wizard.next'),
					width : 80,
					handler : function() {
						
						
						//prepare for scene check
						var productOid = me.down('#productCombo').getValue(), 
							projectOid = me.down('#projectCombo').getValue(), 
							sceneFileName = me.down('#sceneFile').getValue(),
							workspace = me.down('#projectWorkspace').getValue();
						
						//save setting to cookie
						console.log('me.getValues()', me.getValues());
						//me.getValues().set('userName', Ecfa.Session.getUser().id);
						var formValues = me.getValues();
						formValues['userName'] =  Ecfa.Session.getUser().id ;
						console.log('me.getValues() add user', formValues);						
						Ext.util.Cookies.set(projectOid, Ext.encode(formValues));
						
							
						//prepare for scene check

						var submitCheck = me.up('#submitWizard').down('#submitCheck');
						
						var assetTracking = me.up('#submitWizard').assetTracking;
						
						
						submitCheck.responseCounter = 0; //init counter
						
						//**call 3 function, wait for all response**//
						if(assetTracking){
							submitCheck.callAssetTracking(productOid, sceneFileName, workspace, projectOid);
						}
						
						//**call 2 function, wait for all response**//
						
						submitCheck.callSceneAnalysis(
								productOid,								
								sceneFileName,
								workspace,
								projectOid);
						
						submitCheck.analysisRenderSetting(productOid,sceneFileName, workspace ,projectOid);
						//**call function, wait for all response**//
						
						me.up('#submitWizard').next();
						//this.up('#submitWizard').down('#submitCheck').down('#cardNext').setDisabled(true);
					}
				} ];

		me.layout = 'column';
		me.defaults = {
			columnWidth : 0.8,
			labelWidth : 120,
			labelAlign : 'right',
			margin : '3 5 2 5',
			disabledCls : 'customDisabledClass'
		};

		me.items = [  {
			itemId : 'projectNameKeeper',
			xtype : 'hiddenfield',
			name : 'projectDisplay'
		}, {
			itemId : 'projectCombo',
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.queue.project.title'),
			name : 'project',
			store : Ecfa.StoreUtil.getStore('detailProjects'),
			queryMode : 'remote',
			editable : false,
			displayField : 'name',
			valueField : 'oid',
			allowBlank : false,
			isSelected : false,
			displayTpl: Ext.create('Ext.XTemplate',
					'<tpl for=".">',						
						'{name}' ,
						' ('+Locale.getMsg('view.project.user.role.owner')+': {ownerId})',
						
		        	'</tpl>'),			
		    tpl: Ext.create('Ext.XTemplate',
					'<tpl for=".">',
						'<div class="x-boundlist-item">',
						'{name}',
						' ('+Locale.getMsg('view.project.user.role.owner')+': {ownerId})',
						'</div>',
        			'</tpl>'),
        	//'<span style="color:#5556BD;"> ('+Locale.getMsg('view.project.user.role.owner')+': {ownerId})</span>',
			listeners : {				
				select : function(combo, records, eOpts) {
					this.isSelected = true;
					//check balance
					me.down('#ownerBalanceCheck').getBalance(records[0].data.oid, records[0].data.ownerId);
															
					// ///* set projectDisplay value for SubmitConfirm display */////
					me.down('#projectNameKeeper').setValue(records[0].data.name);
					
					
					// ///* check cookie for fill form
					if(!me.fillDefault()){					

						/* enable and set priority combobox */
						// Tony: Don't filter the original priorities store (it will remove data in store). Creating project win use the same store.
						me.down('#priorityCombo').bindStore(Ecfa.StoreUtil.deepCloneStore(Ecfa.StoreUtil.getStore('priorities')));
						// me.down('#priorityCombo').store.clearFilter(true); // clear for number mapping
						var priorityrec = me.down('#priorityCombo').findRecordByValue(records[0].data.maximumPriority);
	
						if (me.down('#priorityCombo').disabled) {
							me.down('#priorityCombo').setDisabled(false);
						}
						var upper = priorityrec.data.number;
						// console.log(upper);
						me.down('#priorityCombo').store.filter('number', new RegExp("[1-" + upper + "]"));
						me.down('#priorityCombo').setValue('');// reset field to blank
						// me.down('#priorityCombo').store.load(); //tony: store.filter() already reload the data
	
						/* enable dependency combobox */
						me.down('#dependencyTrigger').setDisabled(false);
						me.down('#dependencyTrigger').setValue('');// display (name)
						me.down('#submissionOidKeeper').setValue('');// value (oid)
						me.down('#dependencyTrigger').projectOid = this.value;
	
						/* enable sceneFile combobox */
						me.down('#sceneFile').setValue('');
						me.down('#sceneFile').projectOid = this.value;
	
						/* enable projectWorkspace combobox */
						me.down('#projectWorkspace').setValue('');
						me.down('#projectWorkspace').projectOid = this.value;
	
						if (me.isSceneFileEnabled()) {
							me.down('#sceneFile').setDisabled(false);
							me.down('#projectWorkspace').setDisabled(false);
						}
					
					}else{// fillCookie then trying to change setting value
						
						//priority bind store and load in fillDefault 
						var priorityrec = me.down('#priorityCombo').findRecordByValue(records[0].data.maximumPriority);						
						var upper = priorityrec.data.number;						
						me.down('#priorityCombo').store.filter('number', new RegExp("[1-" + upper + "]"));
						
						
						me.down('#projectWorkspace').projectOid = this.value;
						me.down('#dependencyTrigger').projectOid = this.value;
						me.down('#sceneFile').projectOid = this.value;
						
					}

				}
			}
		}, {
			xtype : 'linkButton',
			columnWidth : 0.2,
			text : '+ ' + Locale.getMsg('view.job.project.create'),
			listeners : {
				click : function() {
					Ext.widget('createProjectWin').show();
				}
			}
		},{
			xtype : 'ownerBalanceCheck',
			itemId : 'ownerBalanceCheck',
			align : 'right',
			hidden : true
		},{
			fieldLabel : Locale.getMsg('view.job.name'),
			name : 'name',
			allowBlank : false,			
			regex : /^[\_0-9a-zA-Z\$\%\-\@\{\}\~\!\#\&\^\+\=\$]*$/,			
			regexText : Locale.getMsg('view.mission.msg.submit.name')
		}, {
			itemId : 'renderingProductNameKeeper',
			xtype : 'hiddenfield',
			name : 'renderingProductDisplay'
		}, {
			itemId : 'productCombo',
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.job.renderEngine'),
			name : 'renderingProduct',
			store : Ext.create('Ecfa.store.license.Product', {
				filters : [ function(item) {
					return item.get('state') == 'ON';
				} ]
			}),
			queryMode : 'remote',
			editable : false,
			displayField : 'name',
			valueField : 'oid',
			allowBlank : false,
			isSelected : false,
			listeners : {
				//select : function(combo, records, eOpts) {
				change : function ( combox , newValue, oldValue, eOpts ) {
					this.isSelected = true;
					/* set projectDisplay value for SubmitConfirm display */
					//me.down('#renderingProductNameKeeper').setValue(records[0].data.name);
					console.log(newValue);
					if(newValue!=null){ //clear value after submit
						console.log(combox.lastSelection);
						var records = combox.lastSelection;
						
						me.down('#renderingProductNameKeeper').setValue(records[0].data.name);
						
						//console.log('extension', records[0].data.extension);
						me.down('#sceneFile').fileFilter = records[0].data.extension;
						
	
						if (me.isSceneFileEnabled()) {
							me.down('#sceneFile').setDisabled(false);
							me.down('#projectWorkspace').setDisabled(false);
						}
	
						me.isOptionWorkspace(records[0].data.oid);
						
						me.isExrSupport(records[0].data.oid);
					}
				}
			}
		}, {
			xtype : 'projectWorkspaceTrigger',
			itemId : 'projectWorkspace',
			characteristicId : Ecfa.Spec.Common.WORKSPACE,
			name : 'workspace',
			projectOid : null,
			fieldLabel : Locale.getMsg('view.job.project.workspace'),
			disabledTooltip : Locale.getMsg('view.msg.hint.project.product.select'),
			hidden : true,
			allowBlank : true,
			disabled : true,
			editable : false,  
			//editable : true,  //FOR TEST
			listeners : {
				change : function(field, newValue) {
					//console.log('set path to sene trigger', newValue);
					me.down('#sceneFile').workspacePath = newValue;
				}
			}
		}, {
			xtype : 'sceneFileTrigger',
			itemId : 'sceneFile',			
			projectOid : null,
			workspacePath : null, // for maya only
			fileFilter : null, // file extension for specific render engine
			fieldLabel : Locale.getMsg('view.job.sceneFile'),
			name : 'sceneFile',
			disabledTooltip : Locale.getMsg('view.msg.hint.project.product.select'),
			allowBlank : false,
			disabled : true,
			editable : false
			//editable : true //FOR TEST
		}, {
			itemId : 'priorityCombo',
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.job.priority'),
			name : 'priority',
			// store : Ecfa.StoreUtil.getStore('priorities'), // tony:set store dynamically when project is selected.			
			disabledTooltip : Locale.getMsg('view.msg.hint.project.select'),
			queryMode : 'local',
			editable : false,
			displayField : 'display',
			valueField : 'value',
			allowBlank : false,
			disabled : true
		}, {
			itemId : 'outputType',
			fieldLabel : Locale.getMsg('view.job.outputType'),
			tooltip : Locale.getMsg('view.job.output.limit.msg'),
			name : 'outputType',
			xtype : 'combobox',
			store : Ecfa.StoreUtil.getStore('output'),
			queryMode : 'local',
			editable : false,
			displayField : 'display',
			valueField : 'value',
			allowBlank : false
		},{
			itemId : 'convertVideo',
			boxLabel : Locale.getMsg('view.job.outputType.convertanimate'),
			name : 'convertVideo',
			xtype : 'checkbox',
			checked : false,
			allowBlank : false,
			inputValue : true,
			uncheckedValue : false,
			hideEmptyLabel : false
		},
		{
			xtype : 'fieldset',
			title : Locale.getMsg('view.job.frameRange'),
			columnWidth : 1,
			layout : 'column',
			defaultType : 'numberfield',
			defaults : {
				labelWidth : 50,
				labelAlign : 'right'
			},
			items : [ {
				itemId : 'frameFirst',
				fieldLabel : Locale.getMsg('view.common.from'),
				name : 'frameFirst',
				minValue : 1,
				columnWidth : 0.33,
				allowBlank : false,
				enableKeyEvents : true,
				validator : function(value) {
					//console.log(me.down('#renderModeRadios').getValue());
					
					if (me.down('#frameLast').getValue() && me.down('#frameLast').getValue() < value) {
						return Locale.getMsg('view.mission.msg.submit.frange');
					} else {
						
						if(me.down('#renderModeRadios').getValue()['renderMode'] != Ecfa.Const.Mission.RenderMode.STANDARD){
							//console.log('radio evalution');
							return Ecfa.Validator.evalutionFrames(value, 
														me.down('#frameLast').getValue(), 
														me.down('#framesInc').getValue());
						}
						//console.log('true');
						return true;
					}
				},
				listeners : {
					change : function(){						
						me.down('#frameLast').validate();
						me.down('#framesInc').validate();
					}
				}
			}, {
				itemId : 'frameLast',
				fieldLabel : Locale.getMsg('view.common.to'),
				name : 'frameLast',
				minValue : 1,
				columnWidth : 0.33,
				allowBlank : false,
				enableKeyEvents : true,
				validator : function(value) {
					//console.log('radio evalution!! vv');
					if (me.down('#frameFirst').getValue() > value) {
						return Locale.getMsg('view.mission.msg.submit.frange');
					} else {
						//console.log('radio evalution!!vvv');
						//console.log(me.down('#renderModeRadios').getValue()['renderMode']);
						
						if(me.down('#renderModeRadios').getValue()['renderMode'] != Ecfa.Const.Mission.RenderMode.STANDARD){
							//console.log('radio evalution!!vvvv');
							return Ecfa.Validator.evalutionFrames(
														me.down('#frameFirst').getValue(),
														value,														 
														me.down('#framesInc').getValue());
						}
						return true;
					}
				},
				listeners : {
					change : function(){						
						me.down('#frameFirst').validate();
						me.down('#framesInc').validate();
					}
				}
			}, {
				itemId : 'framesInc',
				fieldLabel : Locale.getMsg('view.common.step'),
				name : 'framesInc',
				value : 1,
				minValue : 1,
				columnWidth : 0.33,
				allowBlank : false,
				validator : function(value) {					
						
					if(me.down('#renderModeRadios').getValue()['renderMode'] != Ecfa.Const.Mission.RenderMode.STANDARD){
						//console.log('radio evalution');
						return Ecfa.Validator.evalutionFrames(
													me.down('#frameFirst').getValue(),
													me.down('#frameLast').getValue(),													 
													value);
					}
					
					return true;
					
				},
				listeners : {
					change : function(){						
						me.down('#frameFirst').validate();
						me.down('#frameLast').validate();
					}
				}
				
			} ]

		}, {
			fieldLabel : Locale.getMsg('view.queue.dependency'),
			itemId : 'dependencyTrigger',
			xtype : 'dependencyTrigger',
			name : 'dependencyDisplay',
			disabledTooltip : Locale.getMsg('view.msg.hint.project.select'),
			disabled : true
		}, {
			itemId : 'submissionOidKeeper',
			xtype : 'hiddenfield',
			name : 'dependency'
		},{
			// enabled and selection cause by ownerBalanceCheck fire 'balance' event
			itemId : 'renderModeRadios',
			fieldLabel : Locale.getMsg('view.job.rendermode'),
			xtype : 'radiogroup',			
			defaults : {
				anchor : '100%',
				padding : '3 5 5 5',
				name : 'renderMode'
			},
			layout : 'vbox',
			allowBlank : false,
			items : [ {
				itemId : 'standardRadio',
				boxLabel : Locale.getMsg('view.job.rendermode.standard'),
				inputValue : Ecfa.Const.Mission.RenderMode.STANDARD,
				disabled : true
			}, {
				itemId : 'evaluationRadio',
				boxLabel : Locale.getMsg('view.job.rendermode.evaluation'),
				inputValue : Ecfa.Const.Mission.RenderMode.EVALUATION,
				tooltip : Locale.getMsg('view.job.evaluation.msg'),
				checked : true,
				handler : function(){
					//console.log('radio handler');
					me.down('#frameFirst').validate();
					me.down('#frameLast').validate();
					me.down('#framesInc').validate();
				}
			} ]
		}, {
			itemId : 'fileCheck',
			boxLabel : Locale.getMsg('view.job.fileCheck'),
			name : 'fileCheck',
			xtype : 'checkbox',
			checked : false,
			allowBlank : false,
			inputValue : true,
			uncheckedValue : false,
			hideEmptyLabel : false,
			handler : function(checkbox, checked) {

				me.up('#submitWizard').assetTracking = checked;

			}
		} ];
		me.callParent(arguments);

		
		
		me.down('#ownerBalanceCheck').on({
			//fire by ownerBalanceCheck
			balance : function(balance, isPoolSubscriber){
				//console.log('event', balance);
				//balance > 0 enabled standard mode and select standard mode					
				if(balance > 0 || isPoolSubscriber){
					me.down('#standardRadio').setDisabled(false);
					me.down('#renderModeRadios').setValue({renderMode: Ecfa.Const.Mission.RenderMode.STANDARD});
				}else{
					//balance <=0 disabled standard mode and select evaluation mode
					me.down('#standardRadio').setDisabled(true);
					me.down('#renderModeRadios').setValue({renderMode: Ecfa.Const.Mission.RenderMode.EVALUATION});
					
				}
			}
		});
		/*
		 * me.down('#priorityCombo').on({ afterrender : function(){ Ext.QuickTips.register({ target: me.down('#priorityCombo').getEl(), text: 'WHYHWYWHHWHUIHJK'
		 * }); } });
		 */

	},

	fillDefault : function(){
		var me = this;		
		var projectOid = me.down('#projectCombo').getValue();
		
		console.log('projectOid',projectOid);
		var values = Ext.util.Cookies.get(projectOid);
		console.log(Ext.decode(values));
		if(values != null && Ext.decode(values)['userName'] ==  Ecfa.Session.getUser().id){ // &&  
			console.log(Ext.decode(values));//json			
			me.down('#sceneFile').on('enable', function handler(combo, event){
				console.log('listen!!!');
				me.down('#productCombo').store.load();
				
				me.down('#priorityCombo').bindStore(Ecfa.StoreUtil.deepCloneStore(Ecfa.StoreUtil.getStore('priorities')));
				me.down('#priorityCombo').store.load();
				//console.log(Ext.decode(values));
				me.getForm().setValues(Ext.decode(values));
				combo.un('enable', handler);				
			});				
						
			me.enableDisableFields();
//			var store = Ext.create('Ecfa.store.queue.SubmitSetting',{
//				data :  [ Ext.decode(values) ] 
//			});
//			console.log(store);
//			console.log(me);
//			me.getForm().loadRecord(store.data.first());
			return true;			
		}
		
		return false;
	},
	
	isSceneFileEnabled : function() {
		
		if (this.down('#productCombo').isSelected && this.down('#projectCombo').isSelected) {
			console.log('RETURN TRUE : enable scenefile combo');
			return true;
		}
		return false;
	},

	initDisableFields : function() {
		this.down('#priorityCombo').setDisabled(true);
		this.down('#sceneFile').setDisabled(true);
		this.down('#dependencyTrigger').setDisabled(true);
		this.down('#projectWorkspace').setVisible(false);
	},
	
	enableDisableFields : function(){
		
		this.down('#priorityCombo').setDisabled(false);
		this.down('#sceneFile').setDisabled(false);
		this.down('#dependencyTrigger').setDisabled(false);		
		
	},

	isOptionWorkspace : function(productOid) {
		console.log(productOid);
		if (Ecfa.SpecUtil.isMaya(productOid)) {
			this.down('#projectWorkspace').setVisible(true);
		} else {
			this.down('#projectWorkspace').setVisible(false);
		}
	},
	
	isExrSupport : function(productOid){
		var store = this.down('#outputType').store;
		//remove
		store.clearFilter();
		if(productOid == Ecfa.Spec.MAYA_2012 || productOid == Ecfa.Spec.MAYA_2013 || productOid == Ecfa.Spec.MAYA_2014){
			store.filterBy(function(rec, id) {
				if (Ecfa.Const.Job.Output.EXR != rec.get('value'))
					return true;
				else
					return false;
			});
		}
		
	}
});
