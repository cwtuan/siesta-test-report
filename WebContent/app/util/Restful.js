Ext.define('Ecfa.util.Restful', {
	singleton : true,
	alternateClassName : [ 'Ecfa.Restful' ],

	/**
	 * @decrepted
	 */
	// Usage: Ecfa.Restful.GET('rest/auth/users', [ { oid : "a"}, { oid : "b"} ], {success: function(jsonResp){},failure: function(){},callback:
	// function(jsonResp){}});
	// @decrepated. Use request(..) instead.
	GET : function(url, params, callback, timeout) {
		Ext.each(params, function(obj) {
			for (key in obj) {
				url = Ext.urlAppend(url, key + '=' + obj[key]);
			}
		});
		console.log('get url=', url);
		this._ExtAjaxJson(url, 'GET', null, callback, timeout);
	},

	/**
	 * @decrepted
	 */
	// Usage: Ecfa.Restful.POST('rest/auth/users', {id: 123, name:'Tony'}, {success: function(jsonResp){},failure: function(){},callback:
	// function(jsonResp){}});
	// @decrepated. Use request(..) instead.
	POST : function(url, jsonModel, callback, timeout) {
		this._ExtAjaxJson(url, 'POST', jsonModel, callback, timeout);
		console.log('post url=', url);
	},

	/**
	 * @decrepted
	 */
	// Usage: Ecfa.Restful.DELETE('rest/auth/users', [1,2], {success: function(jsonResp){},failure: function(){},callback: function(jsonResp){}});
	// @decrepated. Use request(..) instead.
	DELETE : function(url, ids, callback, timeout) {
		Ext.each(ids, function(id) {
			url = Ext.urlAppend(url, 'id=' + id);
		});
		console.log('delete url=', url);
		this._ExtAjaxJson(url, 'DELETE', null, callback, timeout);
	},

	/**
	 * @decrepted
	 */
	// Usage: Ecfa.Restful.PUT('rest/auth/users', [{id:1 ,name : 'Tony'},{id:2 ,name : 'Tony2'}], {success: function(jsonResp){},failure: function(){},callback:
	// function(jsonResp){}});
	// @decrepated. Use request(..) instead.
	PUT : function(url, jsonModels, callback, timeout) {
		// Ext.each(ids, function(id) {
		// url = Ext.urlAppend(url, 'id=' + id);
		// });
		this._ExtAjaxJson(url, 'PUT', jsonModels, callback, timeout);
	},

	/*
	 * @private
	 */
	getUrl : function(options) {
		var record = null;
		if (options.url) {
			return options.url;
		}

		if (options.record && options.record.isModel) {
			record = options.record;
		} else if (options.records && options.records[0] && options.records[0].isModel) {
			record = options.records[0];
		}
		if (record) {
			var request = {
				operation : {
					records : [ record ]
				},
				url : record.getProxy().url
			};
			// 'rest/projects/xxx/users/{id}' -> 'rest/projects/xxx/users'
			// FIXME dont need to remove id for read operation?
			// TODO need to remove _dc=xxx?
			var url = record.getProxy().buildUrl(request);
			var idIndex = url.indexOf(record.getId());
			if (idIndex !== -1) {
				url = url.substr(0, idIndex);
			}

			return url;
		} else {
			console.error('[Restful.js] URL is not defined. If you dont specify record(s) in extjs model format, you sould specify a url', options);
		}

	},
	// Usage: refer to email "RE: [UI] Ecfa.Restful.request" sent at 2013/8/5 下午 06:18
	request : function(options) {

		var jsonData = {};
		var params = options.params || {};

		options.notifyBar = options.notifyBar || Ext.getCmp('notifybar'); // TODO keep notifybar refeence to this

		var url = this.getUrl(options);
		if (!options.method) {
			console.error('[Restful.js] request method is required.', options);
			return;
		}

		if (options.method === 'DELETE') {
			// delete類的record、records一定要是model，這樣才可以抓到idpProperty
			if (options.record) {
				url += '/' + options.record.getId();
			} else if (options.records) {
				Ext.each(options.records, function(r) {
					// console.log('idProperty', r.idProperty);
					url = Ext.urlAppend(url, r.idProperty + '=' + r.getId());
				});
			}
		} else if (options.method === 'PUT' || options.method === 'POST') {

			if (options.record) {
				if (options.record.isModel) {
					jsonData = options.record.data;
				} else {
					jsonData = options.record;
				}
			} else if (options.records) {
				jsonData = [];
				Ext.each(options.records, function(r) {
					if (r.isModel) {
						jsonData.push(r.data);
					} else {
						jsonData.push(r);
					}

				});
			}
		}

		if (options.eventType) {
			options.eventType.fireEvent('running', true);
		}
		if (options.around != null) {
			options.around();
		}

		if (options.async !== false) {
			options.async = true;
		}

		return Ext.Ajax.request({
			url : encodeURI(url),
			method : options.method,
			async : options.async,
			timeout : options.timeout || Ext.Ajax.timeout,
			headers : {
				'Content-Type' : 'application/json'
			},
			jsonData : jsonData, // for params in body
			params : params, // for params in url
			success : function(response) {
				var jsonResp = Ext.decode(response.responseText);
				if (jsonResp.success === false) {
					// call failure function if server response {success:false}

					console.log('options.failureSubject', options.failureSubject);
					if (options.failureSubject) {
						options.notifyBar.showError(Ecfa.locale.Converter.getErrorMsg(options.failureSubject, jsonResp));
					}

					if (options.failure) {

						options.failure(jsonResp);
					}
				} else {
					// call success function if server response {success:true}
					// or without success field
					if (options.success != null) {
						options.success(jsonResp);
					}
					if (options.successSubject) {
						options.notifyBar.showSuccess(options.successSubject);
					}
					if (options.eventType) {
						if (options.method === 'POST') {
							options.eventType.fireEvent('created', jsonResp.target);
						} else if (options.method === 'PUT') {
							options.eventType.fireEvent('updated', jsonResp.target);
						} else if (options.method === 'DELETE') {
							options.eventType.fireEvent('destroyed', jsonResp.target);
						}
					}
				}

			},
			failure : function() {
				var internalErrorKey = 'internal';
				if (options.failureSubject) {
					options.notifyBar.showError(Ecfa.locale.Converter.getErrorMsg(options.failureSubject, {
						error : internalErrorKey
					}));
				}
				if (options.failure) {

					options.failure({
						// TODO show connection error msg
						error : internalErrorKey
					});
				}
			},
			// TODO make gird loading mask disabled, if gird is pass to request
			// options
			callback : function(response) {
				if (options.eventType) {
					options.eventType.fireEvent('running', false);
				}

				if (options.callback != null) {
					if (response && response.responseText) {
						options.callback(Ext.decode(response.responseText));
					} else {
						options.callback(null);
					}
				}

				if (options.around != null) {
					options.around();
				}
			}
		});
	},

	// @decrepated
	_ExtAjaxJson : function(url, method, jsonData, callback, timeout) {
		var me = this;

		// console.log('ajax timeout',timeout || Ext.Ajax.timeout);

		Ext.Ajax.request({
			url : encodeURI(url),
			method : method,
			async : true,
			timeout : timeout || Ext.Ajax.timeout,
			headers : {
				'Content-Type' : 'application/json'
			},
			jsonData : jsonData,
			// jsonData : this._converJsonObj(jsonData),
			success : function(response) {
				var jsonResp = Ext.decode(response.responseText);
				if (jsonResp.success === false) {
					// call failure function if server response {success:false}
					if (callback != null && callback.failure != null) {
						callback.failure(jsonResp);
					}
				} else {
					// call success function if server response {success:true} or without success field (for READ operation)
					if (callback != null && callback.success != null) {
						callback.success(jsonResp);
					}
				}
			},
			failure : function() {
				if (callback != null && callback.failure != null) {
					callback.failure();
				}
			},
			callback : function(response) {
				if (callback != null && callback.callback != null) {
					callback.callback(Ext.decode(response.responseText));
				}
			}
		});
	}
});
