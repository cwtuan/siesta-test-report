Ext.define('Ecfa.Config', {
	singleton : true,
	NO_INTERNET_RETRY_PERIOD : 5000, // ms
	SECURE_COOKIES : false,

	/* Queue */
	TASK_UPDATING_PERIOD : 10000,
	BALANCE_UPDATING_PERIOD : 20000,
	AJAX_TIMEOUT : 180000, // 3 mins,
	/* usage */
	USAGE_PERIOD_MONTH_NUM : 6, // used in UsageView.js
	// CURRENCY : 'USD',//used in currency format//Ecfa.Const.Currency.USD
	CURRENCY : 'POINT',

	/* dashboard */
	DASHBOARD_UPDATING_PERIOD : 30000,
	MISSION_EXCEED_HOURS : 3,

	/* transfer */
	SKIP_UPLOAD_SIZE : 4294967296,// 4GB
	FTP_SERVER : null, // get it from REST

	/* others */
	DATETIME_FORMAT : 'Y/m/d H:i:s',
	DATE_FORMAT : 'Y/m/d',
	TIME_FORMAT : 'H:i:s',
	// SOFT_DEL_LIMIT : 30*24*60*60*1000 //30 days to milliseconds

	isOP : function(portalType) {
		return this.PORTAL_TYPE === 'OP';
	},
	isUP : function(portalType) {
		return this.PORTAL_TYPE === 'UP';
	},

	constructor : function() {
		var me = this;
//		Ext.Ajax.request({
//			url : 'rest/configs',
//			method : 'GET',
//			async : false,
//			success : function(resp) {
//				var json = Ext.decode(resp.responseText);
//				if (json.success) {
//					me.PORTAL_TYPE = json.target.portalType;
//					me.FTP_SERVER = json.target.ftpServer;
//				} else {
//					window.location = './signout';
//				}
//			},
//			failure : function() {
//				console.warn('Fail to get config.');
//				window.location = './signout';
//			}
//		});
	}

});
