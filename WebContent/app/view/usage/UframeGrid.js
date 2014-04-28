Ext.define('Ecfa.view.usage.UframeGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.uframeGrid',
	store : 'usage.UframeByUmission',
	border : true,	
	layout : 'fit',	
	title : Locale.getMsg('view.usage.uframe.simpletitle'),
	umissionOid : null,
	load : function(umissionOid, name, missionOid) {
		//3rd param for startCount
		//console.log(this.down('#startCount'));
		//this.down('#startCount').missionId = missionOid;		
		this.setTitle(Locale.getMsg('view.usage.uframe.title', name));
		this.getStore().load({
			params : {
				umissionOid : umissionOid
			}
		});
		
	},
	
	clear : function(){
		this.getStore().loadData([], false);
		this.setTitle(Locale.getMsg('view.usage.uframe.simpletitle'));
	},

	initComponent : function() {
		var me = this;
		
		me.columns = [ {
			header : Locale.getMsg('view.frame.frameNum'),
			dataIndex : 'frameSeq',
			flex : 0.5
		}/*, {
			header : Locale.getMsg('view.job.state'),
			dataIndex : 'state',
			flex : 1,			
			renderer : function(value, m, record) {
				return Ecfa.locale.Converter.getMissionState(record.get('state'));
			}

		}*/, {
			header : Locale.getMsg('view.queue.common.startTime'),
			dataIndex : 'startTime',
			flex : 1
		}, {
			header : Locale.getMsg('view.frame.endTime'),
			dataIndex : 'endTime',
			flex : 1
		},/*{
			itemId : 'startCount',
			xtype : 'startCount',
			flex : 0.5,
			showDetail : true
		},*/{
			header : Locale.getMsg('view.frame.startCount'),
			dataIndex : 'startCount',
			flex : 0.5,
			align : 'right'			
		},{
			header : Locale.getMsg('view.frame.totTimeUsed'),
			dataIndex : 'totTimeUsed',
			flex : 0.5,
			xtype : 'timeUsed'
		},{
			header : Locale.getMsg('view.frame.totCost'),
			dataIndex : 'totCost',
			xtype : 'cost'		
		},{
			header : Locale.getMsg('view.common.remark'),
			dataIndex : 'poolOid',
			flex : 1.5,			
			renderer : function(value, metadata, record) {
				var msg = '';
				if(record.get('renderMode')==Ecfa.Const.Mission.RenderMode.EVALUATION){
					msg = Locale.getMsg('view.usage.msg.evaluation');
				}else if (value==null || value==''){
					msg = '';
				}else{
					msg = Locale.getMsg('view.usage.msg.dedicated');
				}	
				
				if(msg!=''){
					metadata.tdAttr = 'data-qtip="' + msg + '"';
					metadata.tdCls = 'remark';
				}
				
				
				return msg;
			}
		}];	

		me.callParent(arguments);
		me.on({
			
		});

	}
});
