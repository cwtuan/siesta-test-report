Ext.define('Ecfa.view.monitor.UsagePanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.usagePanel',
	layout : 'border',
	border : false,
	requires : [ 'Ecfa.view.monitor.UsageGrid', 'Ecfa.view.monitor.UsageChart' ],
	hostname : null,
	id : 'usagePanel',
	itemId : 'usagePanel',

	initComponent : function() {
		var me = this;

		var items = [];

		if (Ecfa.Config.isOP()) {
			items.push({
				region : 'west',
				xtype : 'usageGrid',
				flex : 1.0,
				split : true,
				border : false
			});
		} else {
			items.push(/*{
				//icon : 'css/images/server_16.png',
				region : 'west',
				itemId : 'westRegion',
				flex : 1,
				split : true,
				collapsible : true,
				animCollapse : true,
				layout : 'border',
				border : false,
				items : [ *//*
							 * { xtype : 'panel', region : 'west', split : true, border : false, region : 'north', defaultType : 'displayfield', items : [ {
							 * fieldLabel : Locale.getMsg('view.resource.pool.startTime'), padding : '0 5 5 5', itemId : 'startTime' }, { fieldLabel :
							 * Locale.getMsg('view.resource.pool.endTime'), padding : '0 5 5 5', itemId : 'endTime' } ] }
							 */
				{
					itemId : 'currentPoolInfo',
					xtype : 'label',
					region : 'north',
					border: true,
					height : 30,
					padding : '5 0 5 10'
					//style : 'color:#305D8E;'
				}, {
					region : 'west',
					xtype : 'usageGrid',
					flex : 1.0,
					split : true,
					border : true
				} 
				//]
			//}
		  );
		}

		items.push({
			xtype : 'container',
			region : 'center',
			flex : 2,
			items : [ {
				itemId : 'cpuChart',
				xtype : 'usageChart',
				margins : '5 5 0 0',
				flex : 2,
				chartTitle : Locale.getMsg('view.monitor.cpu'),
				store : Ext.create('Ecfa.store.monitor.Cpu'),
				maxYaxis : 100,
				unitFormatLabel : '%',
				seriesData : [ {
					type : 'area',
					name : 'CPU',
					data : [],
					dataIndex : 'amount'
				} ],
				interval : 10000
			}, {
				itemId : 'networkChart',
				xtype : 'usageChart',
				margins : '5 5 0 0',
				chartTitle : Locale.getMsg('view.monitor.network'),
				store : Ext.create('Ecfa.store.monitor.Network'),
				legendOn : true,
				unitFormatLabel : 'bps', // 'Kbps','Mbps'
				seriesData : [ {
					name : Locale.getMsg('view.monitor.network.out'),
					data : [],
					dataIndex : 'amount'
				}, {
					color : '#DF5353',
					name : Locale.getMsg('view.monitor.network.in'),
					data : [],
					dataIndex : 'amount'
				} ],
				interval : 10000
			} ]
		});

		me.items = items;

		me.callParent(arguments);

		me.on({
			activate : function(comp, eOpts) {
				Ecfa.Restful.request({
					url : 'rest/monitor/pool',
					method : 'GET',
					params : {
						userId : Ecfa.Session.getUser().id
					},
					success : function(jsonResp) {
						if (jsonResp.target.name) {
							/*me.down('#westRegion').setTitle(Locale.getMsg('view.billing.pool', jsonResp.target.name));
							me.down('#startTime').setValue(Ecfa.Format.dateTime(jsonResp.target.startTime));
							me.down('#endTime').setValue(Ecfa.Format.dateTime(jsonResp.target.endTime));*/
							var pool = jsonResp['target'];
							var msg = Locale.getMsg('view.billing.pool',pool['name'])+' : ' 							
							+ Ecfa.Format.date(pool['startTime'])+'~' + Ecfa.Format.date(pool['endTime']);
							
							me.down('#currentPoolInfo').setText(msg);
						}
					},
					failure : function(jsonResp) {

					}
				});

				me.down('usageGrid').load();
			}
		});
	}

});
