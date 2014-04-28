// TODO generate data automatically from Ecfa.Const.Job

Ext.define('Ecfa.store.Priority', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value', 'number' ],
	data : [ {
		display : Ecfa.locale.Converter.getJobPriority(Ecfa.Const.Job.Priority.LOW),
		value : Ecfa.Const.Job.Priority.LOW,
		number : 1
	}, {
		display : Ecfa.locale.Converter.getJobPriority(Ecfa.Const.Job.Priority.MEDIUM),
		value : Ecfa.Const.Job.Priority.MEDIUM,
		number : 2
	}, {
		display : Ecfa.locale.Converter.getJobPriority(Ecfa.Const.Job.Priority.HIGH),
		value : Ecfa.Const.Job.Priority.HIGH,
		number : 3
	} ]
});
