Ext.define('MyApp.Config', {
	singleton : true,
	/* others */
	DATETIME_FORMAT : 'Y-m-d H:i:s',
	// DATE_FORMAT : 'Y/m/d',
	// TIME_FORMAT : 'H:i:s',

	// // Test result is generated by seista in WebContent\app\data
	// test_results : [ {
	// display : 'UP in Chrome', // display is optional
	// fileName : 'up_result_chrome.json',
	// testURL : 'http://10.144.149.149:8085/ECFA/test/up/'
	// }, {
	// display : 'OP in Chrome',
	// fileName : 'op_result_chrome.json',
	// testURL : 'http://10.144.149.149:8086/ECFA/test/op/'
	// } ]

	// for multiple browsers
	test_results : [ {
		display : 'User Portal', // display is optional
		files : [ {
			browser : 'chrome',
			fileName : 'up_result_chrome.json'
		}, {
			browser : 'firefox',
			fileName : 'up_result_chrome.json'
		} ],
		testURL : 'http://10.144.149.149:8085/ECFA/test/up/'
	}, {
		display : 'Operation Portal',
		files : [ {
			browser : 'chrome',
			fileName : 'op_result_chrome.json'
		}, {
			browser : 'firefox',
			fileName : 'op_result_chrome.json'
		} ],
		testURL : 'http://10.144.149.149:8086/ECFA/test/op/'
	} ]

});
