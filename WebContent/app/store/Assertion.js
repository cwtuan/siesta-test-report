// TODO generate data automatically from MyApp.Const.Job

Ext.define('MyApp.store.Assertion', {
	extend : 'Ext.data.Store',
	model : 'MyApp.model.Assertion',
	proxy : {
		type : 'memory',
		// url : 'app/data/up_result_chrome.json',
		reader : {
			type : 'json'
		// ,
		// root : 'testCases'
		}
	}
});
