Ext.define('Ecfa.view.queue.FrameGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.frameGrid',
	//store : 'queue.Frame',//create instanse and bind when adding tabpanel
	border : false,
	//overflowY : 'scroll',
	//region : 'south',
	header : false, // hide the title of the panel	
	layout : 'fit',	
	missionId : null, //from missionView
	softDel : false, //from missionView (for preview link)
	projectLastCleanTime : null, //from missionView (for preview tooltip)
	requires : ['Ecfa.view.usage.UframeRetryGrid','Ecfa.ux.button.WinGridLinkButton'],
	
	load : function() { //FrameTabs on tabchange
		
		this.getStore().load({
			params : {
				missionOid : this.missionId
			}
		});
	},

	initComponent : function() {
		var me = this;
		
		me.columns = [ {
			header : Locale.getMsg('view.frame.frameNum'),
			dataIndex : 'frameSeq',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.common.state'),
			dataIndex : 'state',
			flex : 1,			
			renderer : function(value, m, record) {
				return Ecfa.locale.Converter.getMissionState(record.get('state'));
			}

		}, {
			header : Locale.getMsg('view.queue.common.startTime'),
			dataIndex : 'startTime',
			flex : 1.5
		}, {
			header : Locale.getMsg('view.frame.endTime'),
			dataIndex : 'endTime',
			flex : 1.5
		},{
			header : Locale.getMsg('view.frame.startCount'),
			dataIndex : 'startCount',
			align : 'right',
			flex : 0.5
		}
//		,{//FIXME : performance
//			xtype : 'startCount',
//			missionId : me.missionId,
//			showDetail : true,
//			flex : 0.5			
//		}
		,{
			header : Locale.getMsg('view.frame.totTimeUsed'),
			dataIndex : 'totTimeUsed',
			flex : 1,
			align : 'right',
			renderer : function(value, m, record) {
				//return value+ 's';
				return Ecfa.Format.secondsToTime(value);
			}
		},{
			header : Locale.getMsg('view.frame.totCost'),
			dataIndex : 'totCost',
			flex : 1,
			align : 'right',
			renderer : function(value, m, record) {
				return Ecfa.Format.currency(value);
			}
			
		},{
			header : Locale.getMsg('view.queue.menu.frameLog'),		
			flex : 1,
			//xtype : 'componentcolumn',
			align : 'left',
			renderer : function(value, m, record) {
				if (record.get('state') === Ecfa.Const.Mission.State.RDY)
					return '';

				var domId = me.getFrameLogDomId(record);
				return '&nbsp;<a id="' + domId + '" href="javascript: void(0)">' + Locale.getMsg('view.frame.viewlog') + '</a>';
//				if(record.get('state')===Ecfa.Const.Mission.State.RDY)
//					return '';
//				return {
//					xtype : 'linkButton',
//					text : Locale.getMsg('view.frame.viewlog'),
//					handler : function() {
//						
//						//var uri = 'rest/queue/framelog?missionOid='+me.missionId+'&frameSeq='+record.get('frameSeq');
//						var uri = 'rest/queue/framelog/'+me.missionId+'?frameSeq='+record.get('frameSeq');
//						window.open(uri);
//					}
//				};
			}
		},{
			header : Locale.getMsg('view.frame.preview'),		
			flex : 1.5,
			//xtype : 'componentcolumn',
			align : 'left',
			renderer : function(value, m, record) {								
				if(me.softDel){
					var cleanTime = Ext.util.Format.date(
							new Date(me.projectLastCleanTime),
							Ecfa.Config.DATETIME_FORMAT);	
					
					
					return '&nbsp;<a href="javascript: void(0)" title="'
						+ Locale.getMsg('view.msg.softdel.detail', cleanTime) +'">' 
						+ Locale.getMsg('view.msg.softdel')+ '</a>';					
				}
					
				
				if (record.get('state') !== Ecfa.Const.Mission.State.DON)
					return '';

				// var uri = 'rest/queue/previewFrame/' + me.missionId + '?frameSeq=' + record.get('frameSeq');
				var domId = me.getFramePreviewDomId(record);
				return '&nbsp;<a id="' + domId + '" href="javascript: void(0)">' + Locale.getMsg('view.frame.preview') + '</a>';
				
				/*if(record.get('state')!==Ecfa.Const.Mission.State.DON)
					return '';
				var uri = 'rest/queue/previewFrame/'+me.missionId+'?frameSeq='+record.get('frameSeq');
				
				return {
					xtype : 'linkButton',
					text : Locale.getMsg('view.frame.preview'),
					//tooltip : '123456',
					enableMouseover : true,
					//imgsrc : 'http://www.oneredrobin.com/wp-content/blogimages/2008/aranzi_aronzo_softies.jpg'
					imgsrc : uri
				};*/
			}
		}];	

		me.callParent(arguments);
		
		//console.log('softDel',me.softDel);
		
		
		me.store.on({
			load : function(store, records, successful) {
				if (successful) {
					Ext.each(records, function(record) {
						// Note: event listen will be removed automatically when element destroyed
						var el = Ext.get(me.getFrameLogDomId(record));
						if (el) {
							el.on('click', Ext.bind(me.onFrameLogClick, me, [ record ]));
						}

						if (record.get('state') == Ecfa.Const.Mission.State.DON && !me.softDel) {
							//console.log(me.getFramePreviewDomId(record));
							el = Ext.get(me.getFramePreviewDomId(record));							
							el.on('mouseover', Ext.bind(me.onFramePreviewMouseover, me, [ record, el ]));
							//el.on('mouseout', Ext.bind(me.onFramePreviewMouseout, me, [ record, el ]));
						}

					});
				}

				//console.log(me.id, 'loading time', (new Date()).getTime() - me.t);
			},
			beforeload : function() {
				me.t = (new Date()).getTime();
			}
		});
	},
	
	onFrameLogClick : function(record) {
		// var uri = 'rest/queue/framelog?missionOid=' + me.missionId + '&frameSeq=' + record.get('frameSeq');
		var uri = 'rest/queue/framelog/' + this.missionId + '?frameSeq=' + record.get('frameSeq');
		console.log('open', uri);
		window.open(uri);
	},
	onFramePreviewMouseover : function(record, el) {
		var me = this;
		//console.log('over', record.get('images'));
		//console.log('over');
		//var prefix = 'rest/queue/previewFrame/' + this.missionId + '?sq=' + record.get('frameSeq');
		//console.log('el', el);
		if (!Ext.getCmp('imagewin-'+el.id)) {
			var prefix = 'rest/queue/previewFrame/' + this.missionId + '/' + record.get('frameSeq');
			var item =  Ext.create('Ecfa.view.queue.ImageDataView',{
				images : record.get('images'),
				prefix : prefix
				 
			});
			
			var win = Ext.create('Ecfa.view.queue.ImageDataWin',{
				id : 'imagewin-'+el.id,
				x : el.getX() + 25,
				y : el.getY() - 40,
				items : [item],
				targetEl : el
			});
			//console.log(win.id);
			
			win.show();
		}
	},
	onFramePreviewMouseout : function(record) {		
		//var win  = Ext.getCmp('imagewin');
//		if (Ext.getCmp('imagewin')) {
//			Ext.getCmp('imagewin').close();
//		}		
	},
	getFrameLogDomId : function(record) {
		var func = '-frameLog-';
		return this.composeDomUnique(record, func);
	},
	getFramePreviewDomId : function(record) {
		var func = '-framePreview-';
		return this.composeDomUnique(record, func);
	},
	composeDomUnique : function(record, funcPrefix){		
		//console.log('missionView',this.up('missionView'));
		var parentId = this.up('missionView').down('grid').itemId;
		if(record.getId()==null||record.getId()==''){
			return parentId +'-'+this.missionId + funcPrefix + record.get('frameSeq');
		}else{
			return parentId +'-'+this.missionId + funcPrefix + record.getId();
		}
		
	}
});
