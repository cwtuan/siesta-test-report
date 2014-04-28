Ext.define('Ecfa.view.project._EditProjectWin', {
	extend : 'Ext.window.Window',
	alias : 'widget._editProjectWin',
//	requires : [ 'Ext.ux.CheckCombo' ],
	width : 400,
	modal : true,
	layout : {
		type : 'fit'
	},
	project : null,
	title : Locale.getMsg('view.common.properites'),	
	initComponent : function() {
		var me = this;
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
				fieldLabel : Locale.getMsg('view.common.id'),
				name : 'id',
				vtype : 'userId',
				maxLength : 50,
				allowBlank : false
			}, {
				fieldLabel : Locale.getMsg('view.common.name'),
				name : 'name',
				maxLength : 50,
				allowBlank : false
			}
//			, {
//				name : 'userIds',
//				xtype : 'combo',
//				multiSelect : true,
//				displayField : 'id',//name
//				valueField : 'id',
//				store : Ext.create('Ecfa.store.auth.User'),
//				queryMode : 'remote',				
//				fieldLabel : Locale.getMsg('view.queue.project.admin')				
//			}
			],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				formBind : true,
				type : 'submit',
				handler : function() {

					var params = this.up('form').getValues();					
					//console.log(params);
					Ecfa.event.Project.fireEvent('running', true);

					Ecfa.Restful.PUT('rest/auth/project', params, {

						success : function(jsonResp) {
							Ecfa.event.Project.fireEvent('updated', jsonResp);
						},
						failure : function() {
						},
						callback : function() {
							Ecfa.event.Project.fireEvent('running', false);
						}
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
		

		// setup the original data in form
		me.on({
			show : function(dialog, eOpts) {
				var form = this.down('form').getForm();
				form.loadRecord(me.project);				
				//form.clearDirty();
				// form.isValid(); // make all fields not marked as invalid
			}
		});
		
		me.callParent();
	}
});
