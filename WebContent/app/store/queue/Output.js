Ext.define('Ecfa.store.queue.Output', {
	extend : 'Ext.data.Store',
	fields : [ 'display', 'value' ],
	data : [ {
		display : Ecfa.Const.Job.Output.JPG,
		value : Ecfa.Const.Job.Output.JPG
	},{
		display : Ecfa.Const.Job.Output.BMP,
		value : Ecfa.Const.Job.Output.BMP
	},{
		display : Ecfa.Const.Job.Output.PNG,
		value : Ecfa.Const.Job.Output.PNG
	},{
		display : Ecfa.Const.Job.Output.TGA,
		value : Ecfa.Const.Job.Output.TGA
	},{
		display : Ecfa.Const.Job.Output.TIFF,
		value : Ecfa.Const.Job.Output.TIFF
	},{
		display : Ecfa.Const.Job.Output.EXR,
		value : Ecfa.Const.Job.Output.EXR
	}/*,{
		//display : Ecfa.Const.Job.Output.ANIMATION,
		display : Locale.getMsg('view.job.animation'),
		value : Ecfa.Const.Job.Output.ANIMATION
	}*/ ]
});
