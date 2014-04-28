Ext.define('Ecfa.view.license.LicensePropertiesWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.licensePropertiesWin',
	width : 400,
	// height : 400,
	// minHeight : 200,
	modal : true,
	layout : 'fit',
	// layout : 'border',
	title : Locale.getMsg('view.license.add'),
	action : null, // from Action
	initComponent : function() {

		
		var me = this;		
		//console.log(me.action);
		
		me.defaultFocus = 'name';

		console.log(me.action);

		me.items = [ {
			xtype : 'licenseForm',
			itemId : 'licenseForm',
			action : me.action

		} ];	
		
		
		
		me.callParent();
		//console.log(me.down('#licenseForm'));
		//console.log(me.down('#licenseForm').down('#formSubmitBtn'));
//		me.down('#licenseForm').down('#name').on({
//			afterrender : function(field){
//				console.log('afterrender',field);
//				//field.inputEl.dom.autofocus=true;
//				//console.log(field.inputEl);
//				field.focus('',1000);
//			}
//		});

		me.down('#licenseForm').down('#formSubmitBtn').on({
			click : function() {
				console.log('click ok');
				me.down('#licenseForm').setLoading(true);

				var params = me.down('form').getValues();
				if (params['openSource'] == 'true') {// open source
					delete params['totalLicense'];
				} else { // Not open source(need license)
					var data = me.down('form').down('#licensePoolPropertiesGrid').getStore().getData();
					//console.log(data);
					var map = new Ext.util.HashMap();
					Ext.each(data, function(obj) {
						if (obj['numbers'] > 0)
							map.add(obj['oid'], obj['numbers']);
					});

					// console.log(map);
					params['poolLicenseNums'] = map.map;
					//console.log(params);
				}

				if (me.action == 'CREATE') {
					me.doCreate(params);
				} else if (me.action == 'EDIT') {
					me.doEdit(params);
				}
			}
		});
	},

	doCreate : function(params) {
		console.log(params);

		var me = this;
		Ecfa.Restful.POST('rest/op/license/license', params, {
			success : function(jsonResp) {
				console.log(jsonResp);// NO OID
				Ecfa.event.License.fireEvent('created', jsonResp.tasks);
				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.license.msg.add.success'), 5000);
			},
			callback : function() {
				me.close();
				// Ecfa.event.License.fireEvent('created', jsonResp);
			},
			failure : function() {
				console.log('fail');
				Ext.getCmp('notifybar').showError(Locale.getMsg('view.license.msg.add.fail'));
			}
		});
	},

	doEdit : function(params) {
		//console.log(params);
		var me = this;
		Ecfa.Restful.PUT('rest/op/license/license', params, {
			success : function(jsonResp) {
				console.log(jsonResp);
				Ecfa.event.License.fireEvent('updated', jsonResp.tasks);
				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.license.msg.edit.success'), 5000);
			},
			callback : function() {
				me.close();
				// Ecfa.event.License.fireEvent('updated', true);
			},
			failure : function() {
				console.log('fail');
				Ext.getCmp('notifybar').showError(Locale.getMsg('view.license.msg.edit.fail'));
			}
		});

	}
});
