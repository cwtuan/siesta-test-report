Ext.define('Ecfa.view.usage.column.StartCount', {
	extend : 'Ecfa.ux.grid.column.ComponentColumn',
	alias : 'widget.startCount',	
	header : Locale.getMsg('view.frame.startCount'),
	dataIndex : 'startCount',	
	showDetail : false, // param
	missionId : null, // param
	renderer : function(value, m, record) {
		if(!this.showDetail){
			return value;
		}else{
			var missionOid = this.missionId;			
			var frameSeq = record.get('frameSeq');
			return {
				xtype : 'winGridLinkButton',
				text : value,								
				missionOid : missionOid,
				frameSeq : frameSeq					
			};
		}
		
	},
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}

});
