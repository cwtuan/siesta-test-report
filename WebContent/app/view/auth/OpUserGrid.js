// for OP
Ext.define('Ecfa.view.auth.OpUserGrid', {
	extend : 'Ext.grid.Panel',// 'Ext.ux.LiveSearchGridPanel',
	alias : 'widget.opUserGrid',
	store : Ecfa.StoreUtil.getStore('opUsers'),
	title : Locale.getMsg('view.auth.title'),
	icon : 'css/images/user_16x16.png',
	id : Ecfa.Const.User.Type.OP, // TODO tony: Ecfa.Config.isOP() 已經可以判斷是否在OP了，不用在用id識別
	selType : 'checkboxmodel',
	selModel : {
		mode : 'MULTI',
		showHeaderCheckbox : false,
		renderer : function(value, meta, record) {
			var cssPrefix = Ext.baseCSSPrefix;
			var disabled = (record.get('id') === Ecfa.Const.User.DefaultAdmin);

			if (record.get('id') === Ecfa.Const.User.DefaultAdmin) {
				meta.tdAttr = 'data-qtip="' + Locale.getMsg('view.auth.user.defaultOpAdmin.msg') + '"';
			} else if (record.get('id') == Ecfa.Session.getUser().id) {
				meta.tdAttr = 'data-qtip="' + Locale.getMsg('view.auth.user.deleteSelf.msg') + '"';
			}

			if (disabled) {
				var cls = [ cssPrefix + 'grid-checkheader' ];
				cls.push(cssPrefix + 'grid-checkheader-disabled');
				return '<div class="' + cls.join(' ') + '">&#160;</div>';
			} else {
				meta.tdCls = cssPrefix + 'grid-cell-special ' + cssPrefix + 'grid-cell-row-checker';
				return '<div class="' + cssPrefix + 'grid-row-checker">&#160;</div>';
			}
		}
	},
	viewConfig : {
		getRowClass : function(record, index) {
			if (record.get('id') == Ecfa.Const.User.DefaultAdmin)
				return 'type0';
		},
		preserveScrollOnRefresh : true, // 官方 : grid refresh後保留scroll bar位置而不會回捲到最頂
		preserveSelectionOnRefresh : false	// 自定義: grid refresh後保留selection，預設就是打開
	},
	listeners : {
		beforeselect : function(sm, record) {
			if (record.get('id') === Ecfa.Const.User.DefaultAdmin || record.get('id') == Ecfa.Session.getUser().id)
				return false;
		}
	},
	/**
	 * @private search value initialization
	 */
	searchValue : null,

	/**
	 * @private The row indexes where matching strings are found. (used by previous and next buttons)
	 */
	indexes : [],

	/**
	 * @private The row index of the first search, it could change if next or previous buttons are used.
	 */
	currentIndex : null,

	/**
	 * @private The generated regular expression used for searching.
	 */
	searchRegExp : null,

	/**
	 * @private Case sensitive mode.
	 */
	caseSensitive : false,

	/**
	 * @private Regular expression mode.
	 */
	regExpMode : false,

	/**
	 * @cfg {String} matchCls The matched string css classe.
	 */
	matchCls : 'x-livesearch-match',

	initComponent : function() {
		var me = this;

		me.columns = [ {
			xtype : 'componentcolumn',
			width : 25,
			//align : 'right',
			renderer : function(value, metadata, record) {
				return {
					xtype : 'container',
					items : [ new Ext.button.Button(new Ecfa.view.auth.action.EditUserAction({
						panel : me,
						itemId : 'updateButton',
						record : record
					})) ]
				};
			}
		}, {
			header : Locale.getMsg('view.common.id'),
			dataIndex : 'id',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.auth.user.type'),
			dataIndex : 'role',
			flex : 0.5,
			renderer : function(value) {
				if (value === Ecfa.Const.User.Role.ADMIN)
					return Locale.getMsg('view.auth.user.type.op.admin');
				if (value === Ecfa.Const.User.Role.VIEWER)
					return Locale.getMsg('view.auth.user.type.op.viewer');
				if (value === Ecfa.Const.User.Role.USER)
					return Locale.getMsg('view.auth.user.type.up.user');
				return value;
			}
		},/*
			 * { header : Locale.getMsg('view.common.status'), dataIndex : 'status', flex : 0.5, renderer : function(value) { if(value ===
			 * Ecfa.Const.User.Status.ACTIVE) return Locale.getMsg('view.auth.user.status.active'); if(value === Ecfa.Const.User.Status.INACTIVE) return
			 * Locale.getMsg('view.auth.user.status.inactive'); if(value === Ecfa.Const.User.Status.DELETE) return
			 * Locale.getMsg('view.auth.user.status.delete'); return value; } },
			 */
		{
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
		})), new Ext.button.Button(new Ecfa.view.auth.action.DeleteUserAction({
			panel : me,
			itemId : 'deleteBtn'
		})), {
			itemId : 'refreshBtn',
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.store.load();
			}
		}, '-', Locale.getMsg('view.common.search'), {
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
		}, , {
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
				me.down('#deleteBtn').validate(records.length);
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

	/**
	 * In normal mode it returns the value with protected regexp characters. In regular expression mode it returns the raw value except if the regexp is
	 * invalid.
	 * 
	 * @return {String} The value to process or null if the textfield value is blank or invalid.
	 * @private
	 */
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

	/**
	 * Finds all strings that matches the searched value in each grid cells.
	 * 
	 * @private
	 */
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
				var td = Ext.fly(me.view.getNode(idx)).down('td'), cell, matches, cellHTML;
				while (td) {
					cell = td.down('.x-grid-cell-inner');
					matches = cell.dom.innerHTML.match(me.tagsRe);
					cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);

					if (td.dom.className.indexOf('componentcolumn') === -1) {
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

	/**
	 * Selects the previous row containing a match.
	 * 
	 * @private
	 */
	onPreviousClick : function() {
		var me = this, idx;

		if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
			me.currentIndex = me.indexes[idx - 1] || me.indexes[me.indexes.length - 1];
			me.getSelectionModel().select(me.currentIndex);
		}
	},

	/**
	 * Selects the next row containing a match.
	 * 
	 * @private
	 */
	onNextClick : function() {
		var me = this, idx;

		if ((idx = Ext.Array.indexOf(me.indexes, me.currentIndex)) !== -1) {
			me.currentIndex = me.indexes[idx + 1] || me.indexes[0];
			me.getSelectionModel().select(me.currentIndex);
		}
	},

	/**
	 * Switch to case sensitive mode.
	 * 
	 * @private
	 */
	caseSensitiveToggle : function(checkbox, checked) {
		this.caseSensitive = checked;
		this.onTextFieldChange();
	},

	/**
	 * Switch to regular expression mode
	 * 
	 * @private
	 */
	regExpToggle : function(checkbox, checked) {
		this.regExpMode = checked;
		this.onTextFieldChange();
	}
});
