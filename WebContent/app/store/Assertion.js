// TODO generate data automatically from Ecfa.Const.Job

Ext.define('Ecfa.store.Assertion', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.Assertion',
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
