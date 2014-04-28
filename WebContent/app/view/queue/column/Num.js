Ext.define('Ecfa.view.queue.column.Num', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.missionNum',
	header : Locale.getMsg('view.common.id'),
	dataIndex : 'num',
	
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}

});
