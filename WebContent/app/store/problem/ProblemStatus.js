Ext.define('Ecfa.store.problem.ProblemStatus', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getProblemStatus('PROCESSING'),
		value : 'PROCESSING',
		number : 0
	}, {
		display : Ecfa.locale.Converter.getProblemStatus('FINISH'),
		value : 'FINISH',
		number : 10
	},
	/*
	 * { display : Ecfa.locale.Converter.getProblemStatus('CREATED'), value : 'CREATED', number : 20 },
	 */
	{
		display : Ecfa.locale.Converter.getProblemStatus('NEW'),
		value : 'NEW',
		number : 30
	} ]
});
