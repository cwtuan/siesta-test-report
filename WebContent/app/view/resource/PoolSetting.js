// for OP
Ext.define('Ecfa.view.resource.PoolSetting', {
	extend : 'Ext.form.Panel',
	alias : 'widget.poolSetting',
	border : false,	
	layout : 'anchor',
	defaultType : 'textfield',
	defaults : {
		anchor : '100%',
		labelWidth : 90,
		labelAlign : 'right',
		width : 300
	},
	bodyStyle : 'padding:10px 10px 10px 10px',
	records : null,

	initComponent : function() {
		var me = this;

		var check_space = /^([ ]?[\w-]*[ ]+[\w-]*)+$/;
		var check_id = /^([A-Za-z0-9_-]*[ ]*)+$/;

		me.bbar = [ '->', {
			itemId : 'cardNext',
			formBind : true,
			text : Locale.getMsg('view.wizard.next'),
			width : 80,
			handler : function() {
				console.log('isValid', me.down('#subscriber').isValid());
				if (me.down('#subscriber').isValid()) {
					this.up('#createPoolWizard').next();
				}
			}
		} ];

		me.items = [ {
			fieldLabel : Locale.getMsg('view.common.name'),
			name : 'name',
			itemId : 'name',
			maxLength : 50,
			allowBlank : false,
			validator : function(value) {
				/*
				 * if (value === '') { return true; } else if(!check_id.test(value)) { return Locale.getMsg('view.auth.id.invalid_char'); }
				 */
				// duplicated pool name
				/*
				 * else if (Ext.getStore('resource.Pool').findExact('name', value) !== -1) { return Locale.getMsg('view.auth.user.create.failure.duplicated'); }
				 */
				return true;
			}
		}, {
			name : 'subscriber',
			itemId : 'subscriber',
			fieldLabel : Locale.getMsg('view.resource.pool.subscriber'),
			maxLength : 50,
			allowBlank : false,
			validator : function(value) {
				var subscribers = me.records.getRange();
				for ( var i = 0; i < me.records.getCount(); i++) {
					if (subscribers[i].get('subscriber') === value && subscribers[i].get('status') != 'IAT'){
						return Locale.getMsg('view.resource.pool.add.subscriberDuplicated');
					}
				}
				return true;
			},
			listeners : {
				focus : function(field, The, eOpts) {
					me.down('#selectUserGrid').setVisible(true);
				},
				blur : function(field, The, eOpts) {
					var flag = false;
					var subscribers = me.down('#selectUserGrid').getStore().getRange();
					for ( var i = 0; i < me.down('#selectUserGrid').getStore().getCount(); i++) {
						if (subscribers[i].get('id') === field.getValue())
							flag = true;
					}
					if (!flag)
						field.markInvalid(Locale.getMsg('view.resource.pool.add.subscriberNotExists'));
				}
			}
		}, 
		/*{
			xtype : 'form',
			itemId : 'selectUserGrid',
			//height : 150,
			anchorSize : '50%',
			layout : 'fit',
			border : false,
			hidden : true,
			margin : '0 0 5 0',
			items : [ {
				xtype : 'selectUserGrid',
				itemId : 'selectUser'
			} ]
		},*/{
		    xtype : 'selectUserGrid',
			itemId : 'selectUserGrid',
	        height : 350,   
			border : false,
			hidden : true,
			margin : '0 0 5 0'
			//,resizable : true		
		},{
			fieldLabel : Locale.getMsg('view.resource.pool.startTime'),
			name : 'startTime',
			itemId : 'startTime',
			xtype : 'datefield',
			format : 'Y/m/d',
			minValue: new Date(),
			allowBlank : false,
			listeners: {
			        select: function(field, value, eOpts ){
			        	console.log('select',value,me.down('#endTime'));
			        	me.down('#endTime').setMinValue(value);
			        	me.down('#endTime').dateRangeMin = value;
			        }
			    }
		}, {
			fieldLabel : Locale.getMsg('view.resource.pool.endTime'),
			name : 'endTime',
			itemId : 'endTime',
			xtype : 'datefield',
			format : 'Y/m/d',
			allowBlank : false,
			validator : function(value) {
				if (me.down('#endTime').getValue()!= null && me.down('#endTime').getValue().getTime() >= me.down('#startTime').getValue().getTime())
					return true;
				return false;//Locale.getMsg('view.problem.repairTime.invalid');
			}
		} ];

		me.callParent();
	}
});
