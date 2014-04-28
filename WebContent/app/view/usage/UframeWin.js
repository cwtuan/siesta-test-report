Ext.define('Ecfa.view.usage.UframeWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.uframeWin',
	id : 'gridwin',
	missionOid : null,
	frameSeq : null,	
	header : false,
	border : false,
	closable : false,
	draggable : false,	
	width : 200,
	layout : 'fit',				
	
	initComponent : function() {
		var me = this;

		me.items = [ {
			itemId : 'uframeGrid',
			xtype : 'columnsGroupGrid',
			store : 'usage.Uframe',
			layout : 'fit',
			border : false,
			columns : [ {				
				xtype : 'retryCount',
				flex : 1
			}, {
				xtype : 'timeUsed',
				flex : 1.5
				
			}, {
				xtype : 'cost',
				flex : 1
			} ]
		} ];

		me.callParent(arguments);
		
		me.on({
			
		});

	},

	load : function() {
		//console.log(this.missionOid);
		//console.log(this.frameSeq);
		this.down('#uframeGrid').getStore().load({
			ids : [ this.missionOid, this.frameSeq ]
		});

	}
});
