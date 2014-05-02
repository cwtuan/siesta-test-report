// TODO generate data automatically from MyApp.Const.Job

Ext.define('MyApp.store.TestCase', {
	extend : 'Ext.data.Store',
	model : 'MyApp.model.TestCase',
	proxy : {
		type : 'ajax',
		// url : 'app/data/up_result_chrome.json',
		reader : {
			type : 'json',
			root : 'testCases'
		}
	}

});
