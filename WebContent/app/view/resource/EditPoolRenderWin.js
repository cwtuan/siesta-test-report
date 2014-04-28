// for OP
Ext.define('Ecfa.view.resource.EditPoolRenderWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.editPoolRenderWin',
	width : 330,
	height : 240,
	layout : 'fit',
	modal : true,
	title : Locale.getMsg('view.resource.pool.renderEdit'),
	availableRender : null,
	closeAction : 'hide',

	initComponent : function() {
		var me = this;
		me.availableRender = Ecfa.StoreUtil.getStore('availableRender');

		var submitOptions = {
			url : 'rest/op/resource/poolRenders',
			method : 'POST',
			success : function(form, action) {
				//console.log('pool render success',form,action.result.target);
				Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.resource.pool.edit.success'), 5000);
				var rec = Ext.create('Ecfa.model.resource.Pool', action.result.target);
				Ecfa.event.Pool.fireEvent('updated',rec);
				me.close();
			},
			failure : function(form, action) {
				//console.log('fail');
				Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.resource.pool.edit.fail'), action.result));
				me.down('#edit_submit').setDisabled(false);
				Ecfa.event.Pool.fireEvent('updated', action.result.target);
				me.close();
			}
		};

		me.items = [ {
			xtype : 'form',
			itemId : 'form',
			bodyPadding : 10,
			layout : 'anchor',
			defaults : {
				anchor : '100%',
				labelWidth : 100,
				labelAlign : 'right'
			},
			layout : {
				type : 'table',
				columns : 2,
				tdAttrs : {
					style : 'padding: 5px 10px;'
				}
			},

			items : [ {
				name : 'osType',
				fieldLabel : Locale.getMsg('view.resource.render.os'),
				xtype : 'combobox',
				itemId : 'osTypeCombo',
				store : Ext.create('Ecfa.store.resource.RenderOS'),
				queryMode : 'local',
				displayField : 'display',
				valueField : 'value',
				allowBlank : false,
				labelWidth : 65,
				width : 200,
				editable : false,
				forceSelection : true,
				listeners : {
					beforerender : function(combo, eOpts) {
						// console.log('combo beforerender');
						combo.store.insert(0, [ {
							display : Locale.getMsg('view.resource.render.os.mixed'),
							value : 'nonSpecified',
							number : 0
						} ]);
					},
					select : function(combo, records, eOpts) {
						// if (combo.value == me.pool.get('osType')) {
						// me.down('form').getForm().loadRecord(me.pool);
						// }
						// me.initialCombo(combo);
						me.load(me.id, combo.value);
					}
				}
			}, {
				xtype : 'label',
				text : Locale.getMsg('view.resource.pool.renderAvailable')
			}, new Ext.form.field.Number(new Ecfa.action.OpAction({
				fieldLabel : Locale.getMsg('view.resource.render.level_high'),
				name : 'levelHighNum',
				itemId : 'levelHighNum',
				allowBlank : false,
				minValue : 0,
				labelWidth : 65,
				width : 200,
				labelAlign : 'right'
			// validator : function(value){
			// console.log()
			// if(value >= me.down('#levelHighNum').maxValue);
			// }
			})), {
				xtype : 'label',
				itemId : 'levelHighNum_available',
				labelWidth : 50
			}, new Ext.form.field.Number(new Ecfa.action.OpAction({
				fieldLabel : Locale.getMsg('view.resource.render.level_mid'),
				name : 'levelMidNum',
				itemId : 'levelMidNum',
				allowBlank : false,
				minValue : 0,
				labelWidth : 65,
				width : 200,
				labelAlign : 'right'
			})), {
				xtype : 'label',
				itemId : 'levelMidNum_available',
				labelWidth : 50
			}, new Ext.form.field.Number(new Ecfa.action.OpAction({
				fieldLabel : Locale.getMsg('view.resource.render.level_low'),
				name : 'levelLowNum',
				itemId : 'levelLowNum',
				allowBlank : false,
				minValue : 0,
				labelWidth : 65,
				width : 200,
				labelAlign : 'right'
			})), {
				xtype : 'label',
				itemId : 'levelLowNum_available',
				labelWidth : 50
			}, {
				xtype : 'textfield',
				name : 'poolId',
				value : me.oid,
				hidden : true
			} ],

			buttons : [ {
				text : Locale.getMsg('view.common.reset'),
				margin : '0 0 10 0',
				handler : function() {
					me.initialCombo(me.down('#osTypeCombo'));
				}
			}, {
				text : Locale.getMsg('view.common.ok'),
				type : 'submit',
				itemId : 'edit_submit',
				margin : '0 0 10 0',
				formBind: true,
				handler : function() {
					me.setLoading(true);
					var params = me.down('form').getForm().getValues();
					if (params.osType === 'nonSpecified')
						params.osType = null;
					console.log('params', params);
					me.down('form').getForm().submit(submitOptions);
				}
			}, {
				text : Locale.getMsg('view.common.cancel'),
				margin : '0 0 10 0',
				handler : function() {
					me.close();
				}
			} ]
		} ];

		me.callParent();

		me.on({
			activate : function(win, eOpts) {
				console.log('EditPoolRenderWin activate');
				me.initialCombo(me.down('#osTypeCombo'));
			}
		});
	},

	load : function(poolId, osType) {
		var me = this;

		if (osType == '')
			osType = null;
		me.availableRender.proxy.extraParams = {
			osType : osType
		};

		me.availableRender.load({
			id : poolId
		});

		me.availableRender.on({
			load : function() { // make sure load ajax has compeleted
				var available = me.availableRender.getAt(0);

				console.log(me.down('#osTypeCombo').value, me.pool.get('osType'));
				if (me.down('#osTypeCombo').value === me.pool.get('osType') || me.down('#osTypeCombo').value === 'nonSpecified') {
					if (me.down('#osTypeCombo').value === 'nonSpecified') {
						var originOS = me.pool.get('osType');
						me.pool.set('osType','nonSpecified');
						me.down('form').getForm().loadRecord(me.pool);
						me.pool.set('osType',originOS);
						
						// TODO Get Render details
					} else
						me.down('form').getForm().loadRecord(me.pool);

					var field = 'levelHighNum';
					var value = available.get(field) + me.pool.get(field);
					me.down('#' + field + '_available').setText('/' + value);
					me.down('#' + field).setMaxValue(value);
					console.log(field, ' max=', value, me.down('#' + field).maxValue);

					field = 'levelMidNum';
					value = available.get(field) + me.pool.get(field);
					me.down('#' + field + '_available').setText('/' + value);
					me.down('#' + field).setMaxValue(value);
					console.log(field, ' max=', value, me.down('#' + field).maxValue);

					field = 'levelLowNum';
					value = available.get(field) + me.pool.get(field);
					me.down('#' + field + '_available').setText('/' + value);
					me.down('#' + field).setMaxValue(value);
					console.log(field, ' max=', value, me.down('#' + field).maxValue);

				} else {
					me.down('#levelHighNum').setValue(0);
					me.down('#levelMidNum').setValue(0);
					me.down('#levelLowNum').setValue(0);

					me.down('#levelHighNum').setMaxValue(available.get('levelHighNum'));
					me.down('#levelMidNum').setMaxValue(available.get('levelMidNum'));
					me.down('#levelLowNum').setMaxValue(available.get('levelLowNum'));

					me.down('#levelHighNum_available').setText('/' + available.get('levelHighNum'));
					me.down('#levelMidNum_available').setText('/' + available.get('levelMidNum'));
					me.down('#levelLowNum_available').setText('/' + available.get('levelLowNum'));
				}
				me.availableRender.clearListeners();
			}
		});
	},

	initialCombo : function(combo) {
		var me = this;

		console.log('me.pool', me.pool);

		me.down('form').getForm().loadRecord(me.pool);

		// if(combo.store.getCount() === 4){
		// combo.store.insert(0, [{
		// display: Locale.getMsg('view.resource.render.os.mixed'),
		// value:'nonSpecified',
		// number : 0
		// }]);
		// }

		if (me.pool.get('osType') == '' || me.pool.get('osType') == 'nonSpecified') {
			combo.setValue('nonSpecified');
			me.pool.set('osType', 'nonSpecified');
		}

		me.load(me.oid, combo.value);
	}
});
