// for OP

Ext.define('Ecfa.view.auth.UserGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.userGrid',
	store : Ecfa.StoreUtil.getStore('upUsers'),
	title : Locale.getMsg('view.auth.title'),
	selType : 'checkboxmodel',
	selModel : {
		mode : 'MULTI',
		showHeaderCheckbox : false
	},
	viewConfig : {
		preserveScrollOnRefresh : true, // 官方 : grid refresh後保留scroll bar位置而不會回捲到最頂
		preserveSelectionOnRefresh : false	// 自定義: grid refresh後保留selection，預設就是打開
	},
	id : Ecfa.Const.User.Type.UP,
	icon : 'css/images/user_16x16.png',

	// LiveSearch grid
	searchValue : null,
	indexes : [],
	currentIndex : null,
	searchRegExp : null,
	caseSensitive : false,
	regExpMode : false,
	matchCls : 'x-livesearch-match',

	initComponent : function() {
		var me = this;

		if (!Ecfa.Config.isOP()) {
			var upUsersProxy = Ext.data.proxy.Proxy({
				url : 'rest/auth/users',
				type : 'rest',
				reader : {
					type : 'restTaskGrid'
				}
			});
			me.store.setProxy(upUsersProxy);
		}

		me.columns = [ {
			xtype : 'componentcolumn',
			width : 25,
			renderer : function(value, metadata, record) {
				 var items = []; 
				 items.push(new Ext.button.Button(new Ecfa.view.auth.action.EditUserAction({
						panel : me,
						itemId : 'updateButton',
						record : record
				   }))
				);
				
                if(Ecfa.Config.isOP()){                    
				   this.width = 50;
				   
				   // View credit history button                 
                   items.push(new Ext.button.Button(new Ecfa.view.auth.action.CreditAction({ 
                         panel : me, 
                         itemId : 'creditButton', 
                         record : record
					 }))
					 );
                } 
                
                 return { xtype : 'container', 
                          items : items 
                 };
				 
				/*return {
					xtype : 'container', // id:'uc'+record.getId(),
					items : [ new Ext.button.Button(new Ecfa.view.auth.action.EditUserAction({
						panel : me,
						itemId : 'updateButton',
						record : record
					})), new Ext.button.Button(new Ecfa.view.auth.action.CreditAction({
						panel : me,
						itemId : 'creditButton',
						record : record
					})) ]
				};*/

			}
		}, {
			header : Locale.getMsg('view.auth.user.id'),
			dataIndex : 'id',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.auth.user.type'),
			dataIndex : 'role',
			itemId : 'role',
			flex : 0.5,
			renderer : function(value) {
				if (value === Ecfa.Const.User.Role.ADMIN)
					return Locale.getMsg('view.auth.user.type.op.admin');
				if (value === Ecfa.Const.User.Role.VIEWER)
					return Locale.getMsg('view.auth.user.type.op.viewer');
				if (value === Ecfa.Const.User.Role.USER) {
					me.down('#role').setVisible(false);
				}
				return value;
			}
		}, {
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 0.5,
			renderer : Ecfa.locale.Converter.getUserStatus
		}, {
			header : Locale.getMsg('view.common.email'),
			dataIndex : 'email',
			flex : 1.5
		}, {
			header : Locale.getMsg('view.common.phoneNumber'),
			dataIndex : 'phoneNumber',
			flex : 1.5
		} ];

		me.tbar = [ new Ext.button.Button(new Ecfa.view.auth.action.CreateUserAction({
			itemId : 'createBtn',
			panel : me
		})),/*
			 * new Ext.button.Button(new Ecfa.view.auth.action.DeleteUserAction({ panel : me, itemId : 'deleteBtn' })),
			 */{
			itemId : 'refreshBtn',
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.store.load();
			}
		}, new Ext.button.Button(new Ecfa.view.auth.action.ResendLinkUserAction({
			panel : me,
			itemId : 'resendLinkButton'
		})), '-', Locale.getMsg('view.common.search'), {
			xtype : 'textfield',
			name : 'searchField',
			itemId : 'searchField',
			hideLabel : true,
			width : 200,
			listeners : {
				change : {
					fn : me.onTextFieldChange,
					scope : this,
					buffer : 100
				}
			}
		}, {
			xtype : 'button',
			text : '<',
			tooltip : Locale.getMsg('view.common.previousRow'),
			handler : me.onPreviousClick,
			scope : me
		}, {
			xtype : 'button',
			text : '>',
			tooltip : Locale.getMsg('view.common.nextRow'),
			handler : me.onNextClick,
			scope : me
		}, {
			xtype : 'button',
			text : 'X',
			tooltip : Locale.getMsg('view.common.clear'),
			handler : function() {
				me.down('#searchField').reset();
			},
			scope : me
		}, '-' ];

		me.bbar = Ext.create('Ext.ux.StatusBar', {
			defaultText : Locale.getMsg('view.common.defaultStatusText'),
			name : 'searchStatusBar'
		});

		me.on({
			selectionchange : function(selectionModel, records, index) {
				// me.down('#updateButton').validate(records.length);
				// me.down('#deleteBtn').validate(records.length);
				me.down('#resendLinkButton').validate(records.length);
			},
			activate : function(comp, eOpts) {
				me.getStore().load();
			}
		});

		me.callParent(arguments);

		Ecfa.event.User.on({
			destroyed : function(tasks) {
				me.getStore().load();
			},
			created : function(tasks) {
				me.getStore().load();
			},
			updated : function(tasks) {
				me.getStore().load();
			}
		// running : function(isRunning) { me.setLoading(isRunning); }
		});
	},
	// afterRender override: it adds textfield and statusbar reference and start monitoring keydown events in textfield input
	afterRender : function() {
		var me = this;
		me.callParent(arguments);
		me.textField = me.down('textfield[name=searchField]');
		me.statusBar = me.down('statusbar[name=searchStatusBar]');
	},
	// detects html tag
	tagsRe : /<[^>]*>/gm,

	// DEL ASCII code
	tagsProtect : '\x0f',

	// detects regexp reserved word
	regExpProtect : /\\|\/|\+|\\|\.|\[|\]|\{|\}|\?|\$|\*|\^|\|/gm,

	getSearchValue : function() {
		var me = this, value = me.textField.getValue();

		if (value === '') {
			return null;
		}
		if (!me.regExpMode) {
			value = value.replace(me.regExpProtect, function(m) {
				return '\\' + m;
			});
		} else {
			try {
				new RegExp(value);
			} catch (error) {
				me.statusBar.setStatus({
					text : error.message,
					iconCls : 'x-status-error'
				});
				return null;
			}
			// this is stupid
			if (value === '^' || value === '$') {
				return null;
			}
		}

		var length = value.length, resultArray = [ me.tagsProtect + '*' ], i = 0, c;

		for (; i < length; i++) {
			c = value.charAt(i);
			resultArray.push(c);
			if (c !== '\\') {
				resultArray.push(me.tagsProtect + '*');
			}
		}
		return resultArray.join('');
	},

	onTextFieldChange : function() {
		var me = this, count = 0;

		me.view.refresh();
		// reset the statusbar
		me.statusBar.setStatus({
			text : Locale.getMsg('view.common.defaultStatusText'),
			iconCls : ''
		});

		me.searchValue = me.getSearchValue();
		me.indexes = [];
		me.currentIndex = null;

		if (me.searchValue !== null) {
			me.searchRegExp = new RegExp(me.searchValue, 'g' + (me.caseSensitive ? '' : 'i'));

			me.store.each(function(record, idx) {
				// console.log('idx',idx,'td',me.view.getNode(idx));
				var td = Ext.fly(me.view.getNode(idx)).down('td'), cell, matches, cellHTML;
				while (td) {
					cell = td.down('.x-grid-cell-inner');
					matches = cell.dom.innerHTML.match(me.tagsRe);
					cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);
					// console.log('td.dom.className', td.dom.className);

					if (td.dom.className.indexOf('componentcolumn') === -1) {
						// console.log('cellHTML O' + cellHTML + 'O');
						// populate indexes array, set currentIndex, and replace wrap matched string in a span
						cellHTML = cellHTML.replace(me.searchRegExp, function(m) {
							count += 1;
							if (Ext.Array.indexOf(me.indexes, idx) === -1) {
								me.indexes.push(idx);
							}
							if (me.currentIndex === null) {
								me.currentIndex = idx;
							}
							return '<span class="' + me.matchCls + '">' + m + '</span>';
						});
						// restore protected tags
						Ext.each(matches, function(match) {
							cellHTML = cellHTML.replace(me.tagsProtect, match);
						});
						// update cell html
						cell.dom.innerHTML = cellHTML;
					}
					td = td.next();
				}
			}, me);

			// results found
			if (me.currentIndex !== null) {
				me.getSelectionModel().select(me.currentIndex);
				me.statusBar.setStatus({
					text : count + Locale.getMsg('view.common.matchedFound'),
					iconCls : 'x-status-valid'
				});
			}
		}

		// no results found
		if (me.currentIndex === null) {
			me.getSelectionModel().deselectAll();
		}

		// force textfield focus
		me.textField.focus();
	},

	onPreviousClick : function() {
		var me = this, idx;

		if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
			me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
			me.getSelectionModel().select(me.currentIndex);
		}
	},

	onNextClick : function() {
		var me = this, idx;

		if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
			me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
			me.getSelectionModel().select(me.currentIndex);
		}
	},

	caseSensitiveToggle : function(checkbox, checked) {
		this.caseSensitive = checked;
		this.onTextFieldChange();
	},

	regExpToggle : function(checkbox, checked) {
		this.regExpMode = checked;
		this.onTextFieldChange();
	}
});
