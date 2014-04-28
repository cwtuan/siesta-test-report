Ext.define('Ecfa.view.problem.ProblemPropertyGrid', {
	extend : 'Ecfa.ux.grid.PropertyGrid',
	alias : 'widget.problemPropertyGrid',
	model : 'Ecfa.model.problem.Problem',
	title : Locale.getMsg('view.problem.troubleID'),
	border : false,
	problemId : null,
	id : 'problemPropertyGrid',
	properties : [
	/*
	 * { name : Locale.getMsg('view.problem.name'), dataIndex : 'name' }, { name : Locale.getMsg('view.common.status'), dataIndex : 'status', renderer :
	 * function(value) { return Ecfa.locale.Converter.getProblemStatus(value); } },
	 */
	{
		name : Locale.getMsg('view.problem.occurTime'),
		dataIndex : 'occurTime',
		renderer : Ecfa.Format.dateTime
	}, {
		name : Locale.getMsg('view.problem.repairTime'),
		dataIndex : 'repairTime',
		renderer : Ecfa.Format.dateTime
	}
	/*
	 * ,{ name : Locale.getMsg('view.problem.description'), dataIndex : 'description' }, { name : Locale.getMsg('view.auth.user.id'), dataIndex : 'userId' },
	 */
	/*,{
		name : Locale.getMsg('view.common.email'),
		dataIndex : 'email'
	}*/ ],

	initComponent : function() {
		var me = this;

		me.callParent(arguments);
	},
	load : function(record) {
		//console.log('record', record);
		var me = this;
		me.store.loadRawData([ record.data ]);
		me.problemId = record.get('oid');
		me.setTitle(Locale.getMsg('view.problem.name') + ': ' + record.get('name'));
	},
	clearProperty : function(){
		//console.log('clearProperty');
		var me = this;
	    //me.store.loadRawData([]);
	    me.store.loadData([],false);
	}
});
