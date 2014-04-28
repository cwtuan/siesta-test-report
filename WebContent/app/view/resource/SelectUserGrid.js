// for OP

Ext.define('Ecfa.view.resource.SelectUserGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.selectUserGrid',
	selType : 'checkboxmodel',
	layout : 'fit',	   
	selModel : {
		mode : 'SINGLE',
		showHeaderCheckbox : false,
		allowDeselect : true
	},
	columns : [ {
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
	}, {
		header : Locale.getMsg('view.common.status'),
		dataIndex : 'status',
		flex : 0.5,
		renderer : function(value) {
			if (value === Ecfa.Const.User.Status.ACTIVE)
				return Locale.getMsg('view.auth.user.status.active');
			if (value === Ecfa.Const.User.Status.INACTIVE)
				return Locale.getMsg('view.auth.user.status.inactive');
			if (value === Ecfa.Const.User.Status.DELETE)
				return Locale.getMsg('view.auth.user.status.delete');
			return value;
		}
	}],

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

		// me.store = Ecfa.StoreUtil.getStore('upUsers'),me.store.load();

		/* Copy user store in order to filder activated users */
		// me.bindStore(Ecfa.StoreUtil.deepCloneStore(Ecfa.StoreUtil.getStore('upUsers'))); // bindStore failed due to view error
		me.store = Ext.create('Ecfa.store.auth.User');

		var source = Ecfa.StoreUtil.getStore('upUsers');
		source.load({
			callback : function() {
				console.log('source load',source.getProxy().url);
				Ext.each(source.getRange(), function(record) {
					var newRecordData = Ext.clone(record.copy().data);
					var model = new source.model(newRecordData, newRecordData.id);
					me.store.add(model);
				});
				me.store.filter('status', Ecfa.Const.User.Status.ACTIVE);
			}
		});

		me.tbar = [ Locale.getMsg('view.common.search'), {
			xtype : 'textfield',
			name : 'searchField',
			itemId : 'searchField',
			hideLabel : true,
			width : 160,
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
				console.log('###me', me.down('#searchField'));
				me.down('#searchField').reset();
			},
			scope : me
		} ];

		me.bbar = Ext.create('Ext.ux.StatusBar', {
			defaultText : Locale.getMsg('view.common.defaultStatusText'),
			name : 'searchStatusBar'
		});

		me.on({
			activate : function(me, eOpts) {
				console.log('activate SELECTuser grid');
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
		/*
		 * running : function(isRunning) { me.setLoading(isRunning); }
		 */
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
				var td = Ext.fly(me.view.getNode(idx)).down('td'), cell, matches, cellHTML;
				while (td) {
					cell = td.down('.x-grid-cell-inner');
					matches = cell.dom.innerHTML.match(me.tagsRe);
					cellHTML = cell.dom.innerHTML.replace(me.tagsRe, me.tagsProtect);

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
