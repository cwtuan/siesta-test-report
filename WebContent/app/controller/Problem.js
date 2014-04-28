Ext.define('Ecfa.controller.Problem', {
	extend : 'Ext.app.Controller',
	//requires : ['Ecfa.view.problem.ProblemGrid','Ecfa.view.problem.OpProblemGrid','Ecfa.view.problem.ProblemPropertyGrid','Ecfa.view.problem.ProblemPanel'],
	stores : [ 'problem.Problem', 'problem.Discuss' ],
	models : [ 'problem.Problem', 'problem.Discuss'],
	refs : [ {
		ref : 'problemGrid',
		selector : 'problemGrid'
	}, {
		ref : 'opProblemGrid',
		selector : 'opProblemGrid'
	}, {
		ref : 'problemPropertyGrid',
		selector : 'problemPropertyGrid'
	},{
		ref : 'discussGrid',
		selector : 'discussGrid'
	} ],
	init : function() {
		var me = this;

		me.control({
			'problemGrid' : {
				select : function(selectionRowModel, record, index, eOpts) {
					// show the detail properties at right panel
					me.getProblemPropertyGrid().load(record);		
					me.getDiscussGrid().load(record.get('oid'),record.get('userId'));
				}
			},
		    'opProblemGrid' : {
		    	select : function(selectionRowModel, record, index, eOpts){
		    		//me.getProblemPropertyGrid().load(record);
		    		me.getDiscussGrid().load(record.get('oid'),record.get('userId'));
		    	}
		    }
		});

	}
});
