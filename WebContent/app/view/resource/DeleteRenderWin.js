// for OP
Ext.define('Ecfa.view.resource.DeleteRenderWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.deleteRenderWin',
	width : 250,
	modal : true,
	layout : 'fit',
	title : Locale.getMsg('view.common.warning'),
	initComponent : function() {
		var me = this;

		me.items = [ {
			xtype : 'form',
			bodyPadding : 10,
			layout : 'anchor',
			defaults : {
				anchor : '100%',
				labelWidth : 95,
				labelAlign : 'right'
			},
			defaultType : 'textfield',
			items : [ {
				itemId : 'sshAccount',
				name : 'sshAccount',
				fieldLabel : Locale.getMsg('view.resource.render.sshAccount'),
				maxLength : 50,
				allowBlank : false,
				// value :'berlin',
				margin : '0 10 0 0'
			}, {
				itemId : 'sshPassword',
				name : 'sshPassword',
				fieldLabel : Locale.getMsg('view.resource.render.sshPassword'),
				maxLength : 50,
				allowBlank : false,
				// value :'Pa$$w0rd',
				inputType : 'password',
				margin : '0 10 0 0'
			} ],

			buttons : [ {
				text : Locale.getMsg('view.common.ok'),
				formBind : true,
				margin : '0 0 10 0',
				handler : function() {
					var url = 'rest/op/resource/renders';

					Ext.Array.each(me.selection, function(r) {
						url = Ext.urlAppend(url, 'id=' + r.get('oid'));
						console.log("url", url, r.get('oid'));
					});

					me.setLoading(true);
										
					Ecfa.Restful.request({
						url : url,
						method : 'POST',
						record : {
							sshAccount : me.down('#sshAccount').getValue(),
							sshMima : me.down('#sshPassword').getValue()
						},
						success : function(jsonResp) {
							Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.render.delete.success'), 5000);
							Ecfa.event.Render.fireEvent('destroyed', jsonResp);
							me.close();
						},
						failure : function(jsonResp) {
							Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.render.delete.fail'), jsonResp));
							me.close();
						}
					});
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
