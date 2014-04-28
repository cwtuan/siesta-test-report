Ext.define('Ecfa.view.usage.UframeRetryGrid', {
	extend : 'Ecfa.view.common.ColumnsGrid',
	alias : 'widget.uframeRetryGrid',
	missionOid : null,
	frameSeq : null,	
	header : false,
	border : false,
	layout : 'fit',
	store : 'usage.Uframe',
	
	initComponent : function() {
		var me = this;

		
		me.columns = [ {
			header : Locale.getMsg('view.usage.ufame.retryCount'),
			dataIndex : 'retryCount',
			flex : 1.5
		}, {
			header : Locale.getMsg('view.usage.uframe.timeUsed'),
			dataIndex : 'timeUsed',
			flex : 1.5,
			renderer : function(val, metadata, record) {
				return val + 's';
			}
		},{
			xtype : 'cost'
		} /*{
			header : Locale.getMsg('view.usage.uframe.cost'),
			dataIndex : 'cost',
			flex : 1.5,
			renderer : function(value, m, record) {
				return Ecfa.Const.DOLLAR_PREFIX+Ecfa.Format.floatRound(value,2);
			}
			
		} */];

		me.callParent(arguments);
		//me.load();
		me.on({
			beforeshow : function(){
				console.log('beforeshow');
				me.load();
			}/*,
			activate : function(){
				console.log('activate');				
				me.load();
			}*/
		});

	},

	load : function() {
		console.log(this.missionOid);
		console.log(this.frameSeq);
		this.getStore().load({
			ids : [ this.missionOid, this.frameSeq ]
		});

	}
});
