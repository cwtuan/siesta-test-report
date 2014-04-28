// for OP
Ext.define('Ecfa.view.resource.PoolRenderSetting', {
	extend : 'Ext.form.Panel',
	alias : 'widget.poolRenderSetting',
	// autoHeight:true,
	// autoWidth:true,
	autoSize : true,
	layout : 'fit',
	bodyStyle : 'padding:10px 10px 10px 10px',
	defaultType : 'container',
	layout : {
		type : 'table',
		columns : 2,
		tdAttrs : {
			style : 'padding: 5px 10px;'
		}
	},

	initComponent : function() {
		var me = this;
		me.availableRender = Ecfa.StoreUtil.getStore('availableRender');

		me.bbar = [ '->', {
			itemId : 'cardPrev',
			text : Locale.getMsg('view.wizard.previous'),
			width : 80,
			handler : function() {
				this.up('#createPoolWizard').previous();
			}
		}, {
			itemId : 'cardNext',
			text : Locale.getMsg('view.wizard.next'),
			width : 80,
			formBind: true,
			handler : function() {
				this.up('#createPoolWizard').next();
			}
		} ];

		me.items = [ {
			name : 'osType',
			fieldLabel : Locale.getMsg('view.resource.render.os'),
			xtype : 'combobox',
			temId : 'levelHighNum_os',
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
					//console.log('combo beforerender');
					combo.store.insert(0, [ {
							display : Locale.getMsg('view.resource.render.os.mixed'),
							value : 'nonSpecified',
							number : 0
						} ]);
					combo.setValue('nonSpecified');
				},
				afterrender : function(combo, eOpts) {
					//console.log('combo afterrender');
					me.load(me.id,combo.getValue());
				},
				select : function(combo, records, eOpts) {
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
			maxValue : 0,
			value : 0,
			labelWidth : 65,
			width : 200,
			labelAlign : 'right'
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
			maxValue : 0,
			value : 0,
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
			maxValue : 0,
			value : 0,
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
		} ];

		me.callParent();
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
				
				var field = 'levelHighNum';
				me.down('#' + field + '_available').setText('/' + available.get(field));
				me.down('#' + field).setMaxValue(available.get(field) + me.down('#' + field).getValue());
				me.down('#' + field).setValue(0);

				field = 'levelMidNum';
				me.down('#' + field + '_available').setText('/' + available.get(field));
				me.down('#' + field).setMaxValue(available.get(field) + me.down('#' + field).getValue());
				me.down('#' + field).setValue(0);

				field = 'levelLowNum';
				me.down('#' + field + '_available').setText('/' + available.get(field));
				me.down('#' + field).setMaxValue(available.get(field) + me.down('#' + field).getValue());
				me.down('#' + field).setValue(0);

				me.availableRender.clearListeners();
			}
		});
	}
});
