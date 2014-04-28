Ext.define('Ecfa.view.license.LicenseForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.licenseForm',
	border : false,
	layout : 'anchor',
	action : null, // from propertiedWin
	// store : 'license.License',
	bodyPadding : 10,
	bodyStyle : 'padding:10px 10px 10px 10px',
	defaultType : 'textfield',
	defaults : {
		anchor : '100%',
		labelWidth : 120,
		labelAlign : 'right'
	},
	loadMask : {
		msg : 'Processing...'
	},

	initComponent : function() {
		var me = this;
		// console.log('License Form init');		
		
		me.items = [ {
			xtype : 'hidden',
			name : 'oid'
		}, {
			fieldLabel : Locale.getMsg('view.license.name'),
			itemId : 'name',			
			name : 'name',
			allowBlank : false,			
			validator : function(value) {
				// console.log(me.action);
				if (me.action == 'CREATE') {
					if (Ecfa.StoreUtil.getStore('allLicenses').findExact('name', value) !== -1) {
						return Locale.getMsg('view.license.msg.name.duplicate');
					}
				} else {
					// console.log(me.getRecord().data['name']);
					// 在store中找的到一樣的值(回傳不是-1)true && 不是同一個
					if (Ecfa.StoreUtil.getStore('allLicenses').findExact('name', value) !== -1 && me.getRecord().data['name'] != value) {

						return Locale.getMsg('view.license.msg.name.duplicate');
					}
				}

				return true;
			}
		}, {
			itemId : 'versionField',
			fieldLabel : Locale.getMsg('view.license.version'),
			name : 'version',
			tooltip : Locale.getMsg('view.license.tooltip.version'),
			regex : /^[\.a-z0-9]+((,[\.a-z0-9]+)+)*$/,// 1.validate format
			regexText : Locale.getMsg('view.license.msg.version'),
			allowBlank : false,
			tooltip : Locale.getMsg('view.license.tooltip.version'),
			maskRe : /^[\.,a-z0-9]*$/,// 3.restrict input character
			listeners : {
				change : function(field, newValue, oldValue) {
					// 2.force lowercase
					field.setValue(newValue.toLowerCase());

				}
			}

		}, {
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.license.type'),
			name : 'type',
			store : Ext.create('Ecfa.store.license.LicenseType'),
			queryMode : 'local',
			editable : false,
			displayField : 'name',
			valueField : 'value',
			allowBlank : false,
			listeners : {
				change : function(combo, newValue, oldValue, eOpts) {
					// TYPE combo related to EXTENSION field
					// console.log(newValue);
					if (newValue == Ecfa.Const.LicenseType.SOFTWARE) {
						me.down('#extensionField').setVisible(true);
						me.down('#extensionField').setDisabled(false);
					} else {
						me.down('#extensionField').setVisible(false);
						me.down('#extensionField').setDisabled(true);
					}
					me.down('#extensionField').validate();

				}
			}
		}, {
			itemId : 'openSourceRadios',
			fieldLabel : Locale.getMsg('view.license.openSource'),
			xtype : 'radiogroup',
			defaults : {
				anchor : '100%',
				padding : '3 5 5 5',
				name : 'openSource'
			},
			layout : 'hbox',
			allowBlank : false,
			items : [ {
				boxLabel : Locale.getMsg('view.common.yes'),
				inputValue : 'true',
				checked : true

			}, {
				boxLabel : Locale.getMsg('view.common.no'),
				inputValue : 'false'
			} ],
			listeners : {
				change : function(field, newValue, oldValue, eOpts) {
					/* field show or hide depends on is OpenSource or not */

					if (newValue['openSource'] == 'true') {

						me.down('#totalLicenseField').setVisible(false);
						me.down('#totalLicenseField').setDisabled(true);
						me.down('#licenseNumsValidator').setDisabled(true);
						me.down('#validateMsgDisplay').setVisible(false);
						me.down('#limitedTypeRadios').setVisible(false);
						me.radioGroupDisabled(me.down('#limitedTypeRadios'),true);
//						me.down('#limitedTypeRadios').setDisabled(true);
//						me.down('#limitedTypeRadios').items.items[0].setDisabled(true);
//						me.down('#limitedTypeRadios').items.items[1].setDisabled(true);
						me.down('#licensePoolPropertiesGrid').setVisible(false);

					} else {

						me.down('#totalLicenseField').setVisible(true);
						me.down('#totalLicenseField').setDisabled(false);
						me.down('#licenseNumsValidator').setDisabled(false);
						me.down('#validateMsgDisplay').setVisible(true);
						me.down('#limitedTypeRadios').setVisible(true);
						me.radioGroupDisabled(me.down('#limitedTypeRadios'),false);
//						me.down('#limitedTypeRadios').setDisabled(false);
//						me.down('#limitedTypeRadios').items.items[0].setDisabled(false);
//						me.down('#limitedTypeRadios').items.items[1].setDisabled(false);
						
						if (me.action == 'CREATE') {//refresh when radio been selected
							me.down('#licensePoolPropertiesGrid').load();
						}//else if(me.action == 'EDIT'){//EDIT refresh when popup...loadRecord
							//me.down('#licensePoolPropertiesGrid').load();
						//}
						
						me.down('#licensePoolPropertiesGrid').setVisible(true);
						
						me.down('#openSourceRadios').items.items[1].setValue(true);
						// select the second radio
					}

					me.down('#totalLicenseField').validate();
					me.down('#licenseNumsValidator').validate();

				}
			}
		}, {
			itemId : 'extensionField',
			fieldLabel : Locale.getMsg('view.transfer.file.extension'),
			name : 'extension',
			//regex : /^\.[a-z]+((,\.[a-z]+)+)*$/,// 1.validate format
			regex : /^\.[a-z0-9]+((,\.[a-z0-9]+)+)*$/,// 1.validate format
			regexText : Locale.getMsg('view.license.msg.extension'),
			hidden : true,
			disabled : true,// for hidden field not consider in blank or not (form bind issue)
			allowBlank : false,
			//maskRe : /^[\.,a-z]*$/,// 3.restrict input character
			maskRe : /^[\.,a-z0-9]*$/,// 3.restrict input character
			listeners : {
				change : function(field, newValue, oldValue) {
					// 2.force lowercase
					field.setValue(newValue.toLowerCase());

					// 3.restrict input character
					/*
					 * var re = /^[\.,a-z]*$/; if(newValue!='' && !re.test(newValue)){ console.log('FALSE'); field.setValue(oldValue); }
					 */
				}
			}

		}, {
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.license.basicService'),
			name : 'basicService',
			store : Ext.create('Ecfa.store.license.BasicService'),
			queryMode : 'remote',
			editable : false,
			displayField : 'service',
			valueField : 'service',
			allowBlank : false
		}, {
			itemId : 'totalLicenseField',
			fieldLabel : Locale.getMsg('view.license.totalLicense'),
			name : 'totalLicense',
			xtype : 'numberfield',
			minValue : 0,
			hidden : true,
			disabled : true,// for hidden field not consider in blank or not (form bind issue)
			allowBlank : false,
			listeners : {
				change : function(field, newValue, oldValue, eOpts) {
					me.down('#licenseNumsValidator').validate();
				}
			}
		}, { // /hidden field for validate!!///
			itemId : 'licenseNumsValidator',
			fieldLabel : 'validator',
			hidden : true,
			remoteValid : true,
			validator : function(value) {
				var localeValidator = me.licenseNumbersValidator();
				// console.log(localeValidator);
				if (localeValidator === true) {
					// console.log('true!!!');
					me.down('#validateMsgDisplay').setValue('');
				} else {
					// console.log('false!!!');
					me.down('#validateMsgDisplay').setValue(localeValidator);
				}
				return localeValidator;
			}
		}, {
			itemId : 'validateMsgDisplay',
			xtype : 'displayfield',
			fieldStyle : 'color:red !important;'
		}, {
			itemId : 'limitedTypeRadios',
			fieldLabel : Locale.getMsg('view.license.limitedType'),
			hidden : true,
			xtype : 'radiogroup',
			defaults : {
				anchor : '100%',
				padding : '3 5 5 5',
				name : 'limitedType'
			},
			layout : 'hbox',
			allowBlank : false,
			items : [ {
				boxLabel : Locale.getMsg('view.license.limitedType.host'),				
				inputValue : Ecfa.Const.LimitedType.HOST,
				checked : true,
				disabled : true

			}, {
				boxLabel : Locale.getMsg('view.license.limitedType.process'),
				inputValue : Ecfa.Const.LimitedType.PROCESS,
				disabled : true//not submit when hidden
			} ]
		}, {
			itemId : 'licensePoolPropertiesGrid',
			xtype : 'licensePoolPropertiesGrid',
			// totalLicense : me.down('totalLicenseField').getValue(),
			hidden : true
		} ];

		me.buttons = [ {
			itemId : 'formSubmitBtn',
			text : Locale.getMsg('view.common.ok'),
			formBind : true,
			type : 'submit'
		}, {
			text : Locale.getMsg('view.common.cancel'),
			handler : function() {
				me.up('window').close();
			}
		} ];

		me.callParent();

		me.on({
			afterrender : function() {
				if (me.down('#totalLicenseField').getValue() != null) {
					me.down('#licensePoolPropertiesGrid').totalLicense = me.down('#totalLicenseField').getValue();
				}

			}
		});

	},

	licenseNumbersValidator : function() {
		var total = this.down('#totalLicenseField').getValue();
		var sum = this.down('#licensePoolPropertiesGrid').summaryValue;
		if (total < sum)
			return '**' + Locale.getMsg('view.license.validate.nums');
		else
			return true;
	},
	radioGroupDisabled : function(target, disabled){
		target.setDisabled(disabled);
		Ext.each(target.items.items, function(item){
			console.log('ii',item);
			item.setDisabled(disabled);
		});
	}

});
