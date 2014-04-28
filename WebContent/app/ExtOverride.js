// To provide more function or override default behavior for ExtJS 4.1
// Must load ExtJS before this
Ext.define('Ecfa.ExtOverride', {
	singleton : true,
	init : function(vosConfig) {

		// Part 1. Helpers or new methods

		// 1.1 clearDirty: clear the isDirty state in the form. The new value of
		// field won't be reset
		Ext.define('Ext.enhance.form.BasicForm', {
			override : 'Ext.form.BasicForm',
			clearDirty : function() {
				Ext.each(this.getFields().items, function(field) {
					field.resetOriginalValue();
				});
			}
		});
		// 1.2 show/hide checkbox of grid
		Ext.define('Ext.enhance.grid.Panel', {
			override : 'Ext.grid.Panel',
			hideCheckbox : function() {
				var me = this;
				if (me.selType === 'checkboxmodel') {
					var selModel = me.getSelectionModel(), idx = selModel.injectCheckbox;
					if (idx == 'first') {
						idx = 0;
					} else if (idx == 'last') {
						idx = me.columns.length - 1;
					}
					me.columns[idx].hide();
					selModel.deselectAll(true);
					selModel.setLocked(true);
				}
			},
			showCheckbox : function() {
				var me = this;
				if (me.selType === 'checkboxmodel') {
					var selModel = me.getSelectionModel(), idx = selModel.injectCheckbox;
					if (idx == 'first') {
						idx = 0;
					} else if (idx == 'last') {
						idx = me.columns.length - 1;
					}
					me.columns[idx].show();
					selModel.setLocked(false);
				}
			}
		});

		// 1.3 Convert ExtJS model in store to primitive object
		Ext.define('Ext.enhance.data.Store', {
			override : 'Ext.data.Store',
			getData : function() {
				var me = this;
				return Ext.Array.map(me.getRange(), function(model) {
					return model.getData();
				});
			}
		});

		// 1.3 disable all buttons in grid
		Ext.define('Ext.enhance.grid.Panel', {
			override : 'Ext.grid.Panel',
			disableAllButtons : function(disabled) {
				this.dockedItems.each(function(toolbar) {
					if (toolbar.xtype === 'toolbar' && toolbar.dock === 'top') {
						Ext.each(toolbar.items.items, function(btn) {
							btn.setDisabled(disabled);
						});
					}
				});
			}
		});

		// 1.4 for grid re-select after reload (with 1.5)
		Ext.define('Ext.enhance.view.View', {
			override : 'Ext.view.View',
			preserveSelectionOnRefresh : true,
			constructor : function() {
				this.callParent(arguments);
				if (this.preserveSelectionOnRefresh) {
					this.mon(this.getStore(), {

						// FIXME tony: loadData(append)應該就不用re-select了
						beforeload : this.beforeStoreLoadPreserveSelectionRoutine,
						scope : this
					});
				}
			},
			beforeStoreLoadPreserveSelectionRoutine : function() {
				var sm = this.getSelectionModel(), selection = sm.getSelection(), i = 0, l = selection.length, savedSelection = [];
				delete sm.savedSelection;
				for (; i < l; i++) {
					// console.log(selection[i]);
					savedSelection.push(selection[i].getId());
				}
				if (savedSelection.length) {
					sm.savedSelection = savedSelection;
				}
			}
		});

		// 1.5 for grid re-select after reload (with 1.4)
		Ext.define('Ext.enhance.selection.Model', {
			override : 'Ext.selection.Model',
			refresh : function() {
				// console.log('print refresh');
				// console.log(this.savedSelection);
				// include selections saved across store reloads
				if (this.savedSelection && this.savedSelection.length) {
					var rs = [], r, j = 0, l = this.savedSelection.length;
					for (; j < l; j++) {
						// r = this.store.getById(this.savedSelection[j]);
						// console.log(this.savedSelection[j]);
						r = this.store.getById(this.savedSelection[j]);
						// console.log('r');
						// console.log(r);
						if (r) {
							rs.push(r);
						}
					}
					if (rs.length) {
						this.select(rs, false, false);
					}

				}
				this.callParent();

				delete this.savedSelection;
			}
		});

		// 1.6 tooltip and disabledTooltip for field (combobox/trigger)
		Ext.define('Ext.enhance.form.Field', {
			override : 'Ext.form.Field',
			tooltip : null,
			disabledTooltip : null,
			constructor : function() {
				this.callOverridden(arguments);
				if (this.tooltip != null && this.tooltip != '') {
					this.mon(this, {
						afterrender : this.setTooltip,
						scope : this
					});
				}

				if (this.disabledTooltip != null && this.disabledTooltip != '') {
					this.mon(this, {
						afterrender : this.setDisabledTooltip,
						enable : this.setDisabledTooltip,
						scope : this
					});
				}

			},
			setTooltip : function() {
				Ext.QuickTips.register({
					target : this.getEl(),
					text : this.tooltip
				});
			},
			setDisabledTooltip : function() {

				if (this.isDisabled()) {
					Ext.QuickTips.register({
						target : this.getEl(),
						text : this.disabledTooltip
					});
				} else {
					// console.log('Disabled==false');
					Ext.QuickTips.unregister(this.getEl());
				}

			}
		});

		/**
		 * function for combo box : select sn item by specific field of record. <BR>
		 * 
		 * 
		 * @param {Ext.form.field.ComboBox/String}
		 *            combo The ComnoBox or a ComponentQuery matching it
		 * @param {String}
		 *            fieldName The field name for selecting item
		 * @param {String}
		 *            value The field value for matching
		 * 
		 */

		Ext.define('Ext.enhance.form.Field.ComboBox', {
			override : 'Ext.form.field.ComboBox',

			selectRecord : function(fieldName, value, triggerEvent) {
				this.select(this.store.findRecord(fieldName, value));
				triggerEvent = triggerEvent === undefined ? false : triggerEvent;
				if (triggerEvent) {
					this.fireEvent('select', this, [ this.store.findRecord(fieldName, value) ]);
				}
			}
		});

		// 1.7 Cancel a load on an Ext.data.Store
		// FIXME it will make folder tree keep loading when click reload many times
		// Ext.define('Ext.enhance.data.Request', {
		// override : 'Ext.data.Request',
		// // support abort() for Ext.data.Request
		// abort : function(suppressProxyEvents) {
		// var options = this, ajaxRequests = Ext.Ajax.requests;
		// for ( var requestId in ajaxRequests) {
		// if (options == ajaxRequests[requestId].options) {
		// var proxy = ajaxRequests[requestId].options.proxy;
		// if (suppressProxyEvents)
		// proxy.suspendEvents();
		// Ext.Ajax.abort(ajaxRequests[requestId]);
		// if (suppressProxyEvents)
		// proxy.resumeEvents();
		// }
		// }
		// }
		// });
		// Ext.define('Ext.enhance.data.AbstractStore', {
		// override : 'Ext.data.AbstractStore',
		// loadRequest : null,
		// load : function(options) {
		// var me = this, operation;
		// options = Ext.apply({
		// action : 'read',
		// filters : me.filters.items,
		// sorters : me.getSorters()
		// }, options);
		// me.lastOptions = options;
		// operation = new Ext.data.Operation(options);
		// if (me.fireEvent('beforeload', me, operation) !== false) {
		// if (me.loading === true && me.loadRequest) {
		// // Abort the previous loading request
		// me.loadRequest.abort();
		// }
		// // Since the previous request is aborted, we need fire beforeload again to keep loading mask appear
		// me.fireEvent('beforeload', me, operation);
		//									
		// // Then do the read operation
		// me.loading = true;
		// var request = me.proxy.read(operation, me.onProxyLoad, me);
		//									
		// // We only keep read request to loadRequest
		// if (request && request.action === 'read') {
		//										
		// me.loadRequest = request;
		// }
		// }
		// return me;
		// }
		// });

		// 1.9 Programmatically selecting partial text in an input field
		// Select text starting from {start} to {end}. (excluding char at index {end})
		// Source: http://stackoverflow.com/questions/646611/programmatically-selecting-partial-text-in-an-input-field
		Ext.define('Ext.enhance.form.field.Text', {
			override : 'Ext.form.field.Text',
			selectText : function(start, end) {
				var field = this.inputEl.dom;
				// console.log('field,start, end', field, start, end);
				if (field.createTextRange) {
					var selRange = field.createTextRange();
					selRange.collapse(true);
					selRange.moveStart('character', start);
					selRange.moveEnd('character', end);
					selRange.select();
				} else if (field.setSelectionRange) {
					field.setSelectionRange(start, end);
				} else if (field.selectionStart) {
					field.selectionStart = start;
					field.selectionEnd = end;
				}
				field.focus();
			}

		});

		// 1.10 filename util
		// case 1: path='/folder1' ,name='file1'. Then return /folder1/file1
		// case 2: path='/folder1/' ,name='file1'. Then return /folder1/file1
		Ext.define('Ext.enhance.String', {
			override : 'Ext.String',
			filenameAppend : function(path, name) {
				return (path.endsWith(Ecfa.Const.Folder.SEPARATOR)) ? path + name : path + Ecfa.Const.Folder.SEPARATOR + name;
			},
			// filenameNormlizion

			// Ex: filenameFolder('/xx/yy') -> '/xx'
			filenameFolder : function(fullPath) {
				// TODO 正規化
				var path = fullPath.split(Ecfa.Const.Folder.SEPARATOR);
				path.pop();
				var result = '';
				Ext.Array.forEach(path, function(p) {
					result = Ext.String.filenameAppend(result, p);
				});
				return result;
			}
		});

		// 1.11 DisabledTooltip for grid records
		Ext.define('Ext.enhance.grid.Panel', {
			override : 'Ext.grid.Panel',
			initComponent : function() {

				// FIXME callParent first and dynamically to set getRowClass and selModel

				var me = this;

				if (Ext.isDefined(me.getRecordDisabledTooltip) && Ext.isFunction(me.getRecordDisabledTooltip)) {
					me._disabledRecordNum = 0;
					// console.log('getRecordDisabledTooltip', me.id);

					me.on({
						beforeselect : function(sm, record) {
							return me.getRecordDisabledTooltip(record) === null;
						}
					});

					me.store.on({
						load : function(store, records, successful) {
							if (successful) {
								var i = 0, ln = records.length;
								for (; i < ln; ++i) {
									if (me.getRecordDisabledTooltip(records[i]) !== null) {
										++(me._disabledRecordNum);
									}
								}
							}
						}
					});

					// console.log('getRowClass', me.viewConfig.getRowClass);

					Ext.merge(me.viewConfig, {

						getRowClass : function(record, index) {
							// console.log('getRowClassgetRowClassgetRowClassgetRowClassgetRowClass');
							if (me.getRecordDisabledTooltip(record) !== null) {
								return 'disabled-record'; // TODO new css
							}
							return '';
						}
					});

					Ext.merge(me, {
						selModel : {
							renderer : function(value, meta, record) {
								var cssPrefix = Ext.baseCSSPrefix;
								var disabledTooltip = me.getRecordDisabledTooltip(record);
								// console.log('disabledTooltip', disabledTooltip);

								if (disabledTooltip) {
									meta.tdAttr = 'data-qtip="' + disabledTooltip + '"';
								}

								// FIXME css not fit
								if (disabledTooltip != null) {
									var cls = [ cssPrefix + 'grid-checkheader' ];
									cls.push(cssPrefix + 'grid-checkheader-disabled');
									return '<div class="' + cls.join(' ') + '">&#160;</div>';
								} else {
									meta.tdCls = cssPrefix + 'grid-cell-special ' + cssPrefix + 'grid-cell-row-checker';
									return '<div class="' + cssPrefix + 'grid-row-checker">&#160;</div>';
								}
							}
						}
					});
				}

				this.callParent(me);

				// deselectAll
				if (Ext.isDefined(me.getRecordDisabledTooltip) && Ext.isFunction(me.getRecordDisabledTooltip)) {
					// TODO check if checkBoxModel
					me.getView().getHeaderCt().on({

						headerclick : function(ct, column, e, t, eOpts) {
							// console.log('column.className', column.className);
							// console.log('getCount', me.getSelectionModel().getCount(), me.store.getCount());
							// console.log('me.disabledRecordNum', me._disabledRecordNum);
							if (column.className = 'x-grid-row-checker') {
								if (me.getSelectionModel().getCount() === me.store.getCount() - me._disabledRecordNum) {
									// ///////////////// FIXME
									setTimeout(function() {
										me.getSelectionModel().deselectAll();
									}, 50);

								}
								// else {
								// me.getSelectionModel().selectAll();
								// }
							}

						}

					});
				}

			}
		});

		// 1.12 hide window if click somewhere other than the window
		Ext.define('Ext.enhance.window.Window', {
			override : 'Ext.window.Window',
			initComponent : function() {
				var me = this;
				me.mon(Ext.getBody(), 'click', function(el, e) {
					me.close(me.closeAction);
				}, me, {
					delegate : '.x-mask'
				});
				me.callParent(arguments);
			}
		});

		// 1.13 shortcut for ComponentQuery
		Ext.apply(Ext, {
			cq1 : function(selector, root) {
				return Ext.ComponentQuery.query(selector, root)[0];
			},
			cq : function(selector, root) {
				return Ext.ComponentQuery.query(selector, root);
			}
		});

		// End of Part 1
		// Part 2. Override default behavior/style of ExtJS
		// 2.2 Sort after setValue in ItemSelector
		Ext.define('Ext.enhance.ux.form.ItemSelector', {
			override : 'Ext.ux.form.ItemSelector',
			setValue : function(value) {
				var me = this, fromStore = me.fromField.store, toStore = me.toField.store, selected;
				// Wait for from store to be loaded
				if (!me.fromField.store.getCount()) {
					me.fromField.store.on({
						load : Ext.Function.bind(me.setValue, me, [ value ]),
						single : true
					});
					return;
				}
				value = me.setupValue(value);
				me.mixins.field.setValue.call(me, value);
				selected = me.getRecordsForValue(value);
				Ext.Array.forEach(toStore.getRange(), function(rec) {
					if (!Ext.Array.contains(selected, rec)) {
						// not in the selected group, remove it from the toStore
						toStore.remove(rec);
						fromStore.add(rec);
					}
				});
				toStore.removeAll();
				Ext.Array.forEach(selected, function(rec) {
					// In the from store, move it over
					if (fromStore.indexOf(rec) > -1) {
						fromStore.remove(rec);
					}
					toStore.add(rec);
				});
				fromStore.sort('id', 'ASC');
				toStore.sort('id', 'ASC');
			}
		});

		// 2.3 Force to expand all nodes, original expandAll can't expand direct
		// nodes that already expanded
		Ext.define('Ext.enhance.tree.Panel', {
			override : 'Ext.tree.Panel',
			expandAll : function(callback, scope) {
				this.getRootNode().cascadeBy(function(child) {
					if (child.isExpandable()) {
						child.expand();
					}
				});
			}
		});

		// 2.4 Extjs dosn't escape html and whitesapce in various places [START]
		// So we need to override htmlEncode and some components
		// FIXME some other place may also need to override, should be removed
		// for newer ExtJS
		var htmlEncoder = function(value) {
			if (value && Ext.isString(value)) {
				return Ext.String.htmlEncode(value);
			} else
				return value;
		};
		// Extjs dosn't escape html in grid cells
		Ext.define('Ext.enchance.grid.column.Column', {
			override : 'Ext.grid.column.Column',
			initComponent : function() {
				var me = this, oldRender = null;
				if (this.renderer) {
					oldRender = this.renderer;
					this.renderer = function() {
						arguments[0] = htmlEncoder(arguments[0]);
						return oldRender.apply(me, arguments);
					};
				} else if (this.defaultRenderer) {
					oldRender = this.defaultRenderer;
					this.defaultRenderer = function() {
						arguments[0] = htmlEncoder(arguments[0]);
						return oldRender.apply(me, arguments);
					};
				} else {
					this.renderer = htmlEncoder;
				}
				this.callParent(arguments);
			}
		});
		// Extjs dosn't escape html in panel title
		// Ext.define('Ext.enhance.panel.Panel', {
		// override : 'Ext.panel.Panel',
		// setTitle : function(title) {
		// this.callOverridden([ Ext.String.htmlEncode(title) ]);
		// }
		// });
		// FIXME : can't apply other than Virtuoso
		// Ext.define('Ext.enhance.ux.RowExpander', {
		// override : 'Ext.ux.RowExpander',
		// constructor : function(config) {
		// Ext.each(config.rowBodyTpl, function(value, idx, tpls) {
		// tpls[idx] = value.replace('{messages}', '{[Ext.String.htmlEncode(values.messages)]}');
		// });
		// this.callOverridden(arguments);
		// }
		// });
		// FIXME : Need to try later for global setting
		// Ext.define('Ext.enhance.XTemplate', {
		// override : 'Ext.XTemplate',
		// applyTemplate : function(values) {
		// if (Ext.isObject(values)) {
		// Ext.Object.each(values, function(name, value) {
		// values[name] = Ext.String.htmlEncode(value);
		// });
		// } else if (Ext.isArray(values)) {
		// Ext.Array.each(values, function(value, idx) {
		// values[idx] = Ext.String.htmlEncode(value);
		// });
		// }
		// this.callOverridden(arguments);
		// }
		// });
		// 2.4 Extjs dosn't escape html and whitesapce in various places [END]

		// 2.5 Fire event while setActiveTab is called in tab panel
		Ext.define('Ext.enhance.tab.Panel', {
			override : 'Ext.tab.Panel',
			initComponent : function() {
				var me = this;
				me.addEvents(
				/**
				 * @event Fires when a tab has been activated (activated by {@link #setActiveTab}, even the tab is already activated).
				 * @param {Ext.tab.Panel}
				 *            tabPanel The TabPanel
				 * @param {Ext.Component}
				 *            newCard The newly activated item
				 * @param {Ext.Component}
				 *            oldCard The previously active item
				 */
				'tabactivate');
				this.callOverridden(arguments);
			},
			setActiveTab : function(card) {
				var me = this, previous;
				card = me.getComponent(card);
				if (card) {
					card = me.callOverridden(arguments);
					previous = me.getActiveTab();
					me.fireEvent('tabactivate', me, card, previous);
					return card;
				}
			},
			/* add by Alvita 2013.8.8 */
			getActiveIndex : function() {
				var activeTab = this.getActiveTab();
				var activeTabIndex = this.items.findIndex('id', activeTab.id);
				return activeTabIndex;
			}
		});

		// 2.6 use debugOnly config to not construct objects
		// var showDebugOnlyObj = function(obj) {
		// return !(obj.debugOnly === true && vosConfig.DEBUG === false);
		// };
		// Ext.define("Ext.enhance.Container", {
		// override : "Ext.container.Container",
		// prepareItems : function() {
		// var me = this;
		//
		// var items = me.callParent(arguments);
		//
		// Ext.each(items, function(c, i, array) {
		// if (!showDebugOnlyObj(c)) {
		// array[i] = null;
		// delete c;
		// }
		// });
		// return Ext.Array.clean(items);
		// }
		// });
		// Ext.define("Ext.enhance.Component", {
		// override : "Ext.Component",
		// constructor : function(config) {
		// var me = this;
		// config = config || {};
		// me.debugOnly = config.debugOnly || me.debugOnly || false;
		// if (!showDebugOnlyObj(me)) {
		// return;
		// }
		// me.callParent(arguments);
		// }
		// });
		// Ext.define("Ext.enhance.Action", {
		// override : 'Ext.Action',
		// constructor : function(config) {
		// var me = this;
		// config = config || {};
		// // unlike componet, need to use only config to create component
		// config.debugOnly = config.debugOnly || me.debugOnly || false;
		// if (!showDebugOnlyObj(config)) {
		// config.hidden = true;
		// }
		// me.callParent(arguments);
		// }
		// });

		// 2.7 support foreground

		// var foregroundComponents = new Ext.util.MixedCollection();
		//
		// Ext.define('Ext.Container.forground', {
		// override : 'Ext.container.Container',
		// initComponent : function() {
		// var me = this;
		// me.isForeground = false;
		// me.on({
		// afterlayout : function(c, layout, eOpts) {
		// if (c.isVisible(true)) {
		// // tab will relayout
		// if (!foregroundComponents.contains(c)) {
		// foregroundComponents.add(c);
		// c.fireEvent('foreground');
		// me.isForeground = true;
		// // console.debug(Ext.getClassName(c) + '
		// // foreground');
		// }
		// }
		// },
		// deactivate : function(c, eOpts) {
		// c.cascade(function(item) {
		// if (foregroundComponents.remove(item)) {
		// item.fireEvent('background');
		// me.isForeground = false;
		// // console.debug(Ext.getClassName(item) + '
		// // background');
		// }
		// });
		// }
		// });
		// me.callOverridden(arguments);
		// },
		// foreground : function() {
		// var me = this;
		// // console.debug(Ext.getClassName(me) + ' bubble
		// // foregrounding');
		// me.bubble(function(c) {
		// if (c.ownerCt && c.ownerCt.getLayout().setActiveItem) {
		// if (c.ownerCt.getLayout().getActiveItem() !== c) {
		// c.ownerCt.getLayout().setActiveItem(c);
		// }
		// }
		// });
		// if (foregroundComponents.contains(me)) {
		// me.fireEvent('foreground');
		// }
		// }
		// });

		// 2.8 Overrides for file upload field
		// TODO check this function in later version (4.1.1 ?)
		Ext.define('Ext.enhance.form.field.File', {
			override : 'Ext.form.field.File',
			// Prevent reset file upload field on sumbit,
			// this will cause files uploading failed in some situation.
			extractFileInput : function() {
				var fileInput = this.fileInputEl.dom;
				// this.reset();
				return fileInput;
			},
			// Get rid of fake path, just show file name
			onFileChange : function() {
				this.lastValue = null; // force change event to get fired even
				// if the user selects a file with the same name
				Ext.form.field.File.superclass.setValue.call(this, Ecfa.Format.fullFileNameFromPath(this.fileInputEl.dom.value));
			}
		});

		// 2.9 assume form.submit succeed until read {success:false}
		// Ext.define('Ext.enhance.form.action.Submit', {
		// override : 'Ext.form.action.Submit',
		// handleResponse : function(response) {
		// var me = this, form = this.form, errorReader = form.errorReader, rs, success;
		// if (errorReader) {
		// return me.callParent(arguments);
		// }
		// rs = (response.responseText !== '') ? Ext.decode(response.responseText) : {};
		// success = rs.success;
		// // failed submit must return an error JSON object with
		// // success=false
		// if (success !== false) {
		// // since we may not return result when succeed
		// rs.success = true;
		// }
		// return rs;
		// }
		// });

		// 2.10 Apply decodeURIComponent() for all Ext.Ajax's response so that we don't have to convert unicode to string for each model field
		// Ext
		// .define(
		// 'Ext.enhance.data.Connection',
		// {
		// override : 'Ext.data.Connection',
		// // chrome bug :Uncaught Error: INVALID_STATE_ERR: DOM Exception 11
		// // http://www.sencha.com/forum/showthread.php?249577-time-out-Ext.Ajax.Request-mistakenly-process-as-valid-in-Chrome
		//
		// onComplete : function(request) {
		// var me = this, options = request.options, result, success, response;
		//
		// try {
		// result = me.parseStatus(request.xhr.status);
		// } catch (e) {
		// // in some browsers we can't access the status if the readyState is not 4, so the request has failed
		// result = {
		// success : false,
		// isException : false
		// };
		// }
		//
		// success = result.success && !request.timedout;
		//
		// if (success) {
		// response = me.createResponse(request);
		// me.fireEvent('requestcomplete', me, response, options);
		// Ext.callback(options.success, options.scope, [ response, options ]);
		// } else {
		// if (result.isException || request.aborted || request.timedout) {
		// response = me.createException(request);
		// } else {
		// response = me.createResponse(request);
		// }
		// me.fireEvent('requestexception', me, response, options);
		// Ext.callback(options.failure, options.scope, [ response, options ]);
		// }
		// Ext.callback(options.callback, options.scope, [ options, success, response ]);
		// delete me.requests[request.id];
		// return response;
		// },
		// createResponse : function(request) {
		// var xhr = request.xhr, headers = {}, lines = xhr.getAllResponseHeaders().replace(/\r\n/g, '\n').split('\n'), count = lines.length, line, index, key,
		// response, byteArray;
		// while (count--) {
		// line = lines[count];
		// index = line.indexOf(':');
		// if (index >= 0) {
		// key = line.substr(0, index).toLowerCase();
		// if (line.charAt(index + 1) == ' ') {
		// ++index;
		// }
		// headers[key] = line.substr(index + 1);
		// }
		// }
		//
		// request.xhr = null;
		// delete request.xhr;
		//
		// response = {
		// request : request,
		// requestId : request.id,
		// status : xhr.status,
		// statusText : xhr.statusText,
		// getResponseHeader : function(header) {
		// return headers[header.toLowerCase()];
		// },
		// getAllResponseHeaders : function() {
		// return headers;
		// }
		// };
		//
		// if (request.binary) {
		// response.responseBytes = this.getByteArray(xhr);
		// } else {
		// // an error is thrown when trying to access responseText or responseXML
		// // on an xhr object with responseType of 'arraybuffer', so only attempt
		// // to set these properties in the response if we're not dealing with
		// // binary data
		// response.responseText = xhr.responseText;
		// response.responseXML = xhr.responseXML;
		// }
		//
		// // If we don't explicitly tear down the xhr reference, IE6/IE7 will hold this in the closure of the
		// // functions created with getResponseHeader/getAllResponseHeaders
		// xhr = null;
		//
		// // *Apply decodeURIComponent(...) for all Ext.Ajax's response
		// // response.responseText = decodeURIComponent(response.responseText);
		// return response;
		// }
		// });

		// 2.11 nopadding for all ComponentColumn
		Ext.define('Ecfa.enhance.ux.grid.column.ComponentColumn', {
			override : 'Ecfa.ux.grid.column.ComponentColumn',
			tdCls : 'nopadding'
		});

		// 2.12 emptyText and error message for grid with no records
		// FIXME not work with grid in win
		// TODO Ext.panel.Table

		/**
		 * 1. Abort store loading <BR>
		 * 2. If there's previous reading request, abort it then start a new one
		 */
		Ext.define('Ext.enhance.data.Store', {
			override : 'Ext.data.Store',
			abort : function() {
				var me = this;
				if (me.loading && me.lastOperation) {
					var requests = Ext.Ajax.requests;
					for (id in requests) {
						if (requests.hasOwnProperty(id) && requests[id].options == me.lastOperation.request) {
							Ext.Ajax.abort(requests[id]);
							delete requests[id];
							break;
						}
					}
				}
			},
			constructor : function(config) {
				var me = this;
				me.callParent([ config ]);
				me.on({
					'beforeload' : function(store, operation) {
						// abort previous request
						if (me.loading) {
							me.abort();
						}
						store.lastOperation = operation;
					}
				});
			}
		});

		Ext.define('Ext.enhance.grid.Panel', {
			override : 'Ext.grid.Panel',
			initComponent : function() {
				var me = this;
				me.callParent(arguments);

				// keep response status on exception
				me.store.getProxy().on({
					exception : function(conn, response, options, eOpts) {
						// console.log('exception', conn, response, options, eOpts);
						me.store.getProxy().lastExceptionResponseStatus = response.status;
					},
					scope : this
				});

				me.store.on({
					load : function(store, records, successful) {
						// No records found
						if (successful) {
							if (records.length === 0) {
								me.getView().emptyText = '<div class="grid-loading-no-record">' + Locale.getMsg('view.common.noRecords') + '</div>';
								me.getView().refresh();
							}
						}
						// Fail to load
						else {

							// if (!me.id) {
							// return;
							// }

							// 1. abort (http status = -1)
							if (store.getProxy().lastExceptionResponseStatus === -1) {
								console.warn('Abort loading grid', store.getProxy().url);
								// Don't show error msg when aborting the previous request.
								me.getView().emptyText = '';
							}

							// 2. timeout (http status = 0)
							else if (store.getProxy().lastExceptionResponseStatus === 0) {
								console.warn('Loading grid Timeout', store.getProxy().url);
								me.getView().emptyText = '<div class="grid-loading-error">'
										+ Locale.getMsg('view.common.load.error.timeout', "grid-reload-" + me.id) + '</div>';
							}

							// 3. RestTask response (http status = 200)
							else {
								var reader = store.getProxy().getReader();

								console.warn('Failed to load grid with RestTask response ', store.getProxy().url);

								if (reader.type === 'restTaskGrid' || reader.type === 'restTaskPagingGrid') {

									var error;
									if (reader.rawData) {
										error = reader.getMessage(reader.rawData);
									}

									var key = 'err.' + ((error) ? error : 'internal');

									// error with defiend error key
									if (Locale.hasKey(key)) {
										me.getView().emptyText = '<div class="grid-loading-error">' + '<p>' + Locale.getMsg('view.common.load.error')
												+ '</p><p>' + Locale.getMsg('err.reason') + Locale.getMsg(key) + '</p>' + '</div>';
									}
									// internal error
									else {
										me.getView().emptyText = '<div class="grid-loading-error">'
												+ Locale.getMsg('view.common.load.error.internal', "grid-reload-" + me.id) + '</div>';
									}
								}
								// for store with normal ("rest" instead of "restTask") reader. It's assumed all errors are internal errors
								else {
									me.getView().emptyText = '<div class="grid-loading-error">'
											+ Locale.getMsg('view.common.load.error.internal', "grid-reload-" + me.id) + '</div>';

								}
							}

							store.removeAll();
							me.getView().refresh();
							var element = Ext.get("grid-reload-" + me.id);
							if (element) {
								element.on('click', function(e, dom) {
									console.log('click reload', dom.id);
									store.reload();
								});
							}

						}
					}
				});
			}
		});

		// 2.13 @Alvita: checkgroup box for single selection( behavior like radio group)
		Ext.define('Ext.enhance.form.CheckboxGroup', {
			override : 'Ext.form.CheckboxGroup',
			single : false,
			blankText : Locale.getMsg('view.msg.checkgroup.atleastone'),
			initComponent : function() {
				var me = this;

				me.callParent(arguments);
				var oldchk;
				if (me.getChecked().length > 0) {
					oldchk = me.getChecked()[0];
				}
				;

				me.on({
					change : function(me, newValue, oldValue, eOpts) {
						// console.log('newValue',newValue);
						// console.log('oldValue',oldValue);
						if (me.single == true) {
							if (oldchk != null) {
								oldchk.setValue(0);
							}
							var newchk;
							if (me.getChecked().length > 0) {
								newchk = me.getChecked()[0];
							}
							oldchk = newchk;
						}
					}
				});
			}

		});

		/**
		 * 2.14 Just enable querying roweditor by itemId
		 * 
		 * <pre>
		 *   In the gird config,
		 *   plugins : [ {
		 * 		 itemId : 'projectGrid-roweditor',
		 * 		 ptype : 'rowediting'
		 * 	 }
		 *  Then query by Ext.ComponentQuery.query('#projectGrid-roweditor')
		 * </pre>
		 */
		Ext.define('Ext.enhance.grid.plugin.RowEditing', {
			override : 'Ext.grid.plugin.RowEditing',
			initEditor : function() {
				var me = this, grid = me.grid, view = me.view;
				var headerCt = grid.headerCt;
				var btns = [ 'saveBtnText', 'cancelBtnText', 'errorsText', 'dirtyText' ], b, bLen = btns.length;
				var cfg = {
					itemId : me.itemId, // this line added by tony
					autoCancel : me.autoCancel,
					errorSummary : me.errorSummary,
					fields : headerCt.getGridColumns(),
					hidden : true,
					view : view,
					editingPlugin : me,
					renderTo : view.el
				};
				var item;

				for (b = 0; b < bLen; b++) {
					item = btns[b];

					if (Ext.isDefined(me[item])) {
						cfg[item] = me[item];
					}
				}

				return Ext.create('Ext.grid.RowEditor', cfg);
			}

		});

		// End of Part 2

	}
});