Ext.define('Ecfa.view.queue.column.State', {
	extend : 'Ext.grid.column.Column',
	alias : 'widget.missionState',
	header : Locale.getMsg('view.common.state'),
	dataIndex : 'state',	
	renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {
		if(value==Ecfa.Const.Mission.State.SYS_HOLDING || value==Ecfa.Const.Mission.State.SYS_PAUSE){
			metadata.tdCls = 'missing';
		}
		 
		var state = Ecfa.locale.Converter.getMissionState(record.get('state'));
		metadata.tdAttr = 'data-qtip="' + state + '"';
		return state;
		//return Ecfa.locale.Converter.getMissionState(record.get('state'));
	},
	
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
		
	}

});
