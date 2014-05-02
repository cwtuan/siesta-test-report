Ext.define('MyApp.Session', {
	singleton : true,
	user : null,
	constructor : function() {
		var me = this;
		// me.getSession(); // -> init at viewport
	},

	getSession : function() {
		var me = this;
		var url;
		if (MyApp.Config.isOP()) {
			url = 'rest/op/session/user';
		} else {
			url = 'rest/session/user';
		}

		Ext.Ajax.request({
			url : url,
			method : 'GET',
			async : false,
			success : function(response) {
				console.log(response);
				if (Ext.isEmpty(response.responseText)) {

					console.log('ERRRR');
					location.href = './signout';
					// redirect to sign in
				} else {
					me.user = Ext.decode(response.responseText).target;
				}
			}
		});
	},
	getUser : function() {
		// if (this.user) {
		return this.user;
		// }
	}
});
