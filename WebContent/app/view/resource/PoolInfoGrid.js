//** alvita : for UP usage, list all history of subscribing pool
Ext.define('Ecfa.view.resource.PoolInfoGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.poolInfoGrid',
	store : 'resource.PoolInfo',
	border : true,	
	layout : 'fit',	
	title : Locale.getMsg('view.resource.poolinfo.title'),	
	
	initComponent : function() {
		var me = this;
		
		me.columns = [{
			header : Locale.getMsg('view.common.name'),
			dataIndex : 'name',
			flex : 1.0
		},{
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 1.0,
			renderer : function(value) {
				console.log(value);
				return Ecfa.locale.Converter.getPoolInfoStatus(value);
			}
		}, {
			header : Locale.getMsg('view.resource.pool.startTime'),
			dataIndex : 'startTime',
			flex : 1.0,
			renderer : function(val, metadata, record) {
				return Ecfa.Format.dateTime(val);
			}
		}, {
			header : Locale.getMsg('view.resource.pool.endTime'),
			dataIndex : 'endTime',
			flex : 1.0,
			renderer : function(val, metadata, record) {
				return Ecfa.Format.dateTime(val);
			}
		}/*,{
			header : Locale.getMsg('view.resource.pool.renderNum'),			
			flex : 0.5,
			renderer : function(val, metadata, record) {
				return record.get('levelHighNum') + record.get('levelMidNum') + record.get('levelLowNum');
			}
		}*/];


		me.callParent(arguments);		
		
		//me.load();
		me.on({
			show : function(){				
				console.log('show poolInfoGrid');
				console.log(me.getStore());
				me.load();
			}
		});

	},
	
	load : function(){
		this.getStore().load({
			params:{
				userId : Ecfa.Session.getUser().id // 目前是只提供本人查詢 未來可能有member查詢(?)
			}			
		});
	}
});
