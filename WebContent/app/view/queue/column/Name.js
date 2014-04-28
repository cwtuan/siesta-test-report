Ext.define('Ecfa.view.queue.column.Name', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.missionName',
	header : Locale.getMsg('view.job.name'),
	dataIndex : 'name',
	//flex : 1.5,
	renderer : function(val, metadata, record) {
		
		metadata.style = 'cursor: pointer;';
		metadata.tdCls = Ext.util.Format.lowercase(record.get('state')); 
		metadata.tdAttr = 'data-qtip="' + Locale.getMsg('view.queue.menu.showFrames') + '"';
		return val;
	},
	
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
		
	}

});
