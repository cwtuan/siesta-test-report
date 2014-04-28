Ext.define('Ecfa.view.queue.SubmitSetting', {
	extend : 'Ext.form.Panel',
	alias : 'widget.submitSetting',
	store : 'queue.Mission',
	requires : [ 'Ecfa.view.project.CreateProjectWin', 'Ecfa.view.queue.trigger.DependencyTrigger',
			'Ecfa.view.transfer.SimpleUploaderWin' ],
	region : 'center',
	// layout : 'anchor',
	// anchor : '70%',
	layout : 'form',
	// style : 'width:750px;margin-left:20px;margin-right:auto;margin-top:8px;',
	style : 'margin-left:20px;margin-right:600px;margin-top:8px;',
	//ui : 'autoscroll',
	bodyStyle : 'padding:10px 10px 10px 10px',
	defaultType : 'textfield',
	autoScroll: true,
	initComponent : function() {
		var me = this;
		me.title = Locale.getMsg('view.submit.setting');// 'General Setting (1/3)';

		me.bbar = [ '->', {
			itemId : 'cardNext',
			formBind : true,
			text : Locale.getMsg('view.wizard.next'),
			width : 80,
			handler : function() {
				
				////call assetTracking...////
				console.log('Do asset tracking....? ');
				console.log(me.up('#submitWizard').assetTracking);
				var productOid = me.down('#productCombo').getValue(),
				projectOid = me.down('#projectCombo').getValue(),
				sceneFileName = me.down('#sceneFile').getValue();
				
				console.log('productOid='+productOid );
				console.log('projectOid=' + projectOid);
				console.log('sceneFileName=' +sceneFileName);
				this.up('#submitWizard').down('#submitCheck').callSceneAnalysis(
							productOid, projectOid, sceneFileName, me.up('#submitWizard').assetTracking
						);
								
				
				this.up('#submitWizard').next();
				
				/*if(me.up('#submitWizard').assetTracking){
					this.up('#submitWizard').down('#submitCheck').down('processingView').updateText(Locale.getMsg('view.msg.tracking'));
					this.up('#submitWizard').next();				
					
					this.up('#submitWizard').down('#submitCheck').down('assetGrid').projectOid = projectOid; //for file upload
					this.up('#submitWizard').down('#submitCheck').callAssetTracking(productOid, projectOid, sceneFileName);
				}else{					
					this.up('#submitWizard').end();//SKP STEP
				}*/
				
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

		me.items = [ {
			fieldLabel : Locale.getMsg('view.job.name'),
			name : 'name',
			allowBlank : false,			
			//regex :  /^(?!\/|\\|:|\*|\?|\"|<|>|\|)*$/,
			//regex : /^[\_0-9a-zA-Z\$\%\'\-\@\{\}\~\!\#\(\)\&\^]*$/,
			regex : /^[\_0-9a-zA-Z\$\%\-\@\{\}\~\!\#\&\^\+\=\$]*$/,
			//maskRe : /^[\-_a-z]*$/,			
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
			select : false,
			listeners : {
				select : function(combo, records, eOpts) {
					this.select = true;
					/* set projectDisplay value for SubmitConfirm display */
					me.down('#renderingProductNameKeeper').setValue(records[0].data.name);

					console.log('extension', records[0].data.extension);
					me.down('#sceneFile').fileFilter = records[0].data.extension;
					// me.down('#sceneFile').filter= '.ma,.mb';

					if (me.isSceneFileEnabled()) {
						me.down('#sceneFile').setDisabled(false);
						me.down('#uploadSceneFile').setDisabled(false);
					}
				}
			}
		}, {
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
			select : false,
			listeners : {
				select : function(combo, records, eOpts) {
					this.select = true;
					/* set projectDisplay value for SubmitConfirm display */
					me.down('#projectNameKeeper').setValue(records[0].data.name);

					/* enable and set priority combobox */
					// Tony: Don't filter the original priorities store (it will remove data in store). Creating project win use the same store.
					me.down('#priorityCombo').bindStore(Ecfa.StoreUtil.deepCloneStore(Ecfa.StoreUtil.getStore('priorities')));
					// me.down('#priorityCombo').store.clearFilter(true); // clear for number mapping
					var priorityrec = me.down('#priorityCombo').findRecordByValue(records[0].data.maximumPriority);

					if (me.down('#priorityCombo').disabled) {
						me.down('#priorityCombo').setDisabled(false);
					}
					var upper = priorityrec.data.number;
					//console.log(upper);
					me.down('#priorityCombo').store.filter('number', new RegExp("[1-" + upper + "]"));
					me.down('#priorityCombo').setValue('');//reset field to blank
					//me.down('#priorityCombo').store.load();  //tony: store.filter() already reload the data

					/* enable dependency combobox */
					me.down('#dependencyTrigger').setDisabled(false);
					me.down('#dependencyTrigger').setValue('');//display (name)
					me.down('#submissionOidKeeper').setValue('');//value (oid)
					me.down('#dependencyTrigger').projectOid = this.value;

					/* enable sceneFile combobox */
					me.down('#sceneFile').setValue('');
					me.down('#sceneFile').projectOid = this.value;
					me.down('#uploadSceneFile').projectOid = this.value;

					if (me.isSceneFileEnabled()) {
						me.down('#sceneFile').setDisabled(false);
						me.down('#uploadSceneFile').setDisabled(false);
					}

				}/*
					 * ,
					 * 
					 * expand : function(field, eOpts) { this.store.reload(); }
					 */
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

		}, {
			itemId : 'priorityCombo',
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.job.priority'),
			name : 'priority',
			// store : Ecfa.StoreUtil.getStore('priorities'), // tony:set store dynamically when project is selected.
			// tooltip : 'testesteset',
			disabledTooltip : Locale.getMsg('view.msg.hint.project.select'),
			queryMode : 'local',
			editable : false,
			displayField : 'display',
			valueField : 'value',
			allowBlank : false,
			disabled : true
		}, {
			itemId : 'sceneFile',
			name : 'sceneFile',
			xtype : 'combobox',
			projectOid : null,
			fileFilter : null,
			subFolder : 'resource',
			fieldLabel : Locale.getMsg('view.job.sceneFile'),
			allowBlank : false,
			store : Ecfa.StoreUtil.getStore('resourceFiles'),
			disabledTooltip : Locale.getMsg('view.msg.hint.project.product.select'),
			disabled : true,
			queryMode : 'remote',
			//editable : false,
			editable : true,
			displayField : 'name',
			valueField : 'name',
			listeners : {
				expand : function() {
					// TODO dont load at first expand
					var me = this;
					console.log('sceneFile fileFilter', me.fileFilter);
					console.log('projectOid', me.projectOid);

					me.store.load({
						params : {
							projectOid : me.projectOid,
							filter : me.fileFilter
						},
						callback : function(records, operation, success) {
							if (success) {
								if (records.length == 0) {
									me.clearValue();
									Ext.getCmp('notifybar').showError(Locale.getMsg('view.job.sceneFile.select.noFiles', me.fileFilter), 10000);
								}
							} else {
								Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.job.sceneFile.select.error'), {
									error : 'internal_error'
								}));
							}
						}
					});
				},
				collapse : function(){
					console.log('scenefile collapse');
					
				}
			}
		}, {
			itemId : 'uploadSceneFile',
			xtype : 'linkButton',
			columnWidth : 0.2,
			disabled : true,
			text : '+ ' + Locale.getMsg('view.job.sceneFile.upload'),
			listeners : {
				click : function() {
					Ext.widget('simpleUploaderWin', {
						projectOid : this.projectOid
					}).show();
				}
			}
		},/*
			 * { fieldLabel : Locale.getMsg('view.job.outputType'), xtype : 'radiogroup', itemId : 'typegroup', defaults : { xtype : 'radio', name :
			 * 'outputType' }, items : [ { boxLabel : Locale.getMsg('view.job.frame.title'), inputValue : 'frame', checked : 'true' }, { boxLabel :
			 * Locale.getMsg('view.job.animation'), //inputValue : 'animation' inputValue : Ecfa.Const.Job.Output.ANIMATION } ] },
			 */
		{
			fieldLabel : Locale.getMsg('view.job.outputType'),
			name : 'outputType',
			xtype : 'combobox',
			store : Ecfa.StoreUtil.getStore('output'),
			queryMode : 'local',
			editable : false,
			displayField : 'display',
			valueField : 'value',
			allowBlank : false
		}, {
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
					if (me.down('#frameLast').getValue() && me.down('#frameLast').getValue() < value) {
						return Locale.getMsg('view.mission.msg.submit.frange');
					} else {
						return true;
					}
				},
				listeners : {
					keyup : function() {
						me.down('#frameLast').validate();
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
					if (me.down('#frameFirst').getValue() > value) {
						return Locale.getMsg('view.mission.msg.submit.frange');
					} else {
						return true;
					}
				},
				listeners : {
					keyup : function() {
						me.down('#frameFirst').validate();
					}
				}
			}, {
				fieldLabel : Locale.getMsg('view.common.step'),
				name : 'framesInc',
				value : 1,
				minValue : 1,
				columnWidth : 0.33,
				allowBlank : false
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
			handler : function(checkbox, checked){
				 
				me.up('#submitWizard').assetTracking = checked;
				
			}
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
		} ];
		me.callParent(arguments);

		/*
		 * me.down('#priorityCombo').on({ afterrender : function(){ Ext.QuickTips.register({ target: me.down('#priorityCombo').getEl(), text: 'WHYHWYWHHWHUIHJK'
		 * }); } });
		 */

	},

	isSceneFileEnabled : function() {
		// scenefile combobox depends on Product(extension) and Project(folder)
		/*
		 * console.log('product'); console.log(this.down('#productCombo').select); console.log('project'); console.log(this.down('#projectCombo').select);
		 */

		if (this.down('#productCombo').select && this.down('#projectCombo').select) {
			console.log('RETURN TRUE : enable scenefile combo');
			return true;
		}
		return false;
	},
	
	initDisableFields : function(){
		this.down('#priorityCombo').setDisabled(true);
		this.down('#sceneFile').setDisabled(true);
		this.down('#uploadSceneFile').setDisabled(true);
		this.down('#dependencyTrigger').setDisabled(true);		
	}
});
