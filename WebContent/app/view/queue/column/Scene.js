Ext.define('Ecfa.view.queue.column.Scene', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.missionScene',
	header : Locale.getMsg('view.job.sceneFile'),
	dataIndex : 'sceneFile',
	renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
		metadata.tdAttr = 'data-qtip="' + value + '"';
		return value;
	},
	
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
		
	}

});
