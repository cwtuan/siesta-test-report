// TODO generate data automatically from Ecfa.Const.Job

Ext.define('Ecfa.store.TestCase', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.TestCase',
	proxy : {
		type : 'ajax',
		url : 'app/data/up_result_chrome.json',
		reader : {
			type : 'json',
			root : 'testCases'
		}
	},
	autoLoad : true
});
