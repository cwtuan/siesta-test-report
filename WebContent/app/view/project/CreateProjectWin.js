Ext.define('Ecfa.view.project.CreateProjectWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.createProjectWin',
	width : 400,
	modal : true,
	layout : {
		type : 'fit'
	},
	title : Locale.getMsg('view.project.create'),
	initComponent : function() {
		var me = this;

		var priorityItems = [];
		// var priorityStore = Ext.create('Ecfa.store.Priority');
		var priorityStore = Ecfa.StoreUtil.getStore('priorities');

		priorityStore.each(function(record) {
			priorityItems.push({
				boxLabel : record.get('display'),
				name : 'maximumPriority',
				inputValue : record.get('value'),
				checked : Ecfa.Const.Job.Priority.MEDIUM === record.get('value')
			});
		});

		me.defaultFocus = 'name';

		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			layout : 'anchor',
			defaults : {
				anchor : '100%',
				labelWidth : 110
			},
			defaultType : 'textfield',
			items : [ {
				fieldLabel : Locale.getMsg('view.common.title'),
				name : 'name',
				itemId : 'name',
				maxLength : 50,
				allowBlank : false,
				listeners : {
					'change' : function(textfield, newValue) {
						// Strip invalid string. Ex: '少年PI 第2集' -> 'PI_2'
						me.down('#folderName').setValue(newValue.replace(/[\ ]/g, "_").replace(/[^0-9a-zA-Z-_]/g, ""));
					}
				}
			}, {
				xtype : 'radiogroup',
				fieldLabel : Locale.getMsg('view.project.priority.max'),
				items : priorityItems,
				// // columns : 2,
				tooltip : Locale.getMsg('view.project.priority.max.tooltip'),
				allowBlank : false
			}, {
				// TODO default as project name. replace blank with _
				itemId : 'folderName',
				fieldLabel : Locale.getMsg('view.project.folder.name'),
				tooltip : Locale.getMsg('view.project.folder.name.tooltip'),
				name : 'folderName',
				maxLength : 50,
				allowBlank : false,
				remoteValid : true,
				validator : function(value) {
					var localeValidator = Ecfa.Validator.fileName(value);
					return localeValidator === true ? this.remoteValid : localeValidator;
				},
				listeners : {
					// TODO trigger remote validator only when button up
					// for remote validator
					'change' : function(textfield, newValue, oldValue) {
						var me = this;
						Ecfa.Restful.GET('rest/projects', [ {
							action : 'validate'
						}, {
							folderName : newValue
						} ], {
							success : function(jsonResp) {
								me.remoteValid = jsonResp.valid ? true : Locale.getMsg('view.project.folder.name.validator.duplicate');
								me.validate();
							},
							failure : function() {
								// TODO just let user create project...
								console.error('cannot validate folder name');
								me.validate();
							}
						});
					}
				}
			// validator : Ecfa.Validator.projectFolder
			} ],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				formBind : true,
				type : 'submit',
				handler : function() {

					// console.log(params);
					// Ecfa.event.Project.fireEvent('running', true);
					var data = this.up('form').getValues();

					Ecfa.Restful.request({
						url : 'rest/projects',
						record : data,
						method : 'POST',
						successSubject : Locale.getMsg('view.project.create.success', data.name),
						failureSubject : Locale.getMsg('view.project.create.failure', data.name),
						eventType : Ecfa.event.Project
					// , notifyBar : Ext.getCmp('notifybar')
					});
					me.close();

				}
			}, {
				text : Locale.getMsg('view.common.cancel'),
				handler : function() {
					me.close();
				}
			} ]
		} ];
		me.callParent();
	}
});
