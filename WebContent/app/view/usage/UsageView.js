Ext.define('Ecfa.view.usage.UsageView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.usageView',
	border : false,
	margins : '0 0 5 0',
	requires : [ 'Ecfa.view.usage.UsageTabPeriod', 'Ecfa.view.usage.UsageTabProject', 'Ecfa.view.resource.PoolInfoGrid' ],
	layout : 'border',
	initComponent : function() {
		var me = this;
		
		me.items = [{
			xtype : 'tabpanel',
			region : 'center',
			border : 'false',
			items : [{
				xtype : 'usageTabPeriod'
			}, {
				xtype : 'usageTabProject'
			},{
				itemId : 'poolInfoGrid',
				xtype : 'poolInfoGrid'
			}]
		}];
		
		if(Ecfa.Config.isUP()){
			var label =Ext.widget('label',{
				itemId : 'poolInfo',
				xtype : 'label',
				region : 'north',		
				height : 30,
				padding : '5 0 5 10',
				style : 'cursor: pointer;color:#305D8E;text-decoration:underline;'
			});
			me.items.push(label);
		}
//		me.items = [ {
//			xtype : 'usageTabPeriod'
//		}, {
//			xtype : 'usageTabProject'
//		} ];

		me.callParent(arguments);
		
		if(Ecfa.Config.isOP()){ // hide tab in op
			console.log(me.down('tabpanel'));
			me.down('tabpanel').child('#poolInfoGrid').tab.hide();
		}
			
		
		me.on({
			activate : function(view){
				//console.log('activate : usage view:', view);
				if(Ecfa.Config.isUP()){		
				
					Ecfa.Restful.request({
						url : 'rest/resource/lastPool',
						method : 'GET',
						params : {
							userId : Ecfa.Session.getUser().id						
						},
						success : function(jsonResp) {						
							console.log('get lastPool', jsonResp['error']);
							//console.log('yaya',jsonResp['target']);
							var pool = jsonResp['target'];
							//jsonResp['error']!=null : U003 in OP
							
							if(pool==null || pool['status']==null){
								me.down('#poolInfo').setVisible(false);
							}else{
								var msg = Locale.getMsg('view.resource.poolinfo.brief')+' : ' +pool['name']+' ' 
								//+ Locale.getMsg('view.common.status')
								+'['+ Ecfa.locale.Converter.getPoolInfoStatus(pool['status']) + ']'
								+'('+ Ecfa.Format.date(pool['startTime'])+'~' + Ecfa.Format.date(pool['endTime'])+')';
								
								me.down('#poolInfo').setVisible(true);
								me.down('#poolInfo').setText(msg);
								me.down('#poolInfo').el.on('click', function() {
									me.down('tabpanel').setActiveTab(me.down('poolInfoGrid'));
								});
							}
							
						},
						failure : function(jsonResp) {	
							var msg = Locale.getMsg('view.resource.poolinfo.brief')+' : '
								+ jsonResp['error'] ;
							console.log('err',msg);
							me.down('#poolInfo').setVisible(false);
							//me.down('#poolInfo').setText(msg);
						}
					});
				}
				
			}
		});

	}

});
