Ext.define('Ecfa.view.queue.UserMissionHistoryGrid', {
	extend : 'Ecfa.view.common.ColumnsGrid',
	alias : 'widget.userMissionHistoryGrid',
	store : 'queue.MissionHistoryByUser',
	border : false,
	region : 'center',
	layout : 'fit',

	initComponent : function() {
		var me = this;

		me.tbar = [ {
			itemId : 'refresh',
			tooltip : Locale.getMsg('view.common.refresh'),
			icon : 'css/images/refresh.png',
			handler : function() {
				// me.load();
				me.up('missionView').reloadWholeParts(me);
			}
		},{
	        itemId : 'fromField',
			xtype: 'datefield',
	        labelAlign : 'right',
	        anchor: '100%',
	        fieldLabel: Locale.getMsg('view.common.from'),
	        name: 'fromDate',
	        format: Ecfa.Config.DATE_FORMAT,
	        maxValue: new Date(),  // limited to the current date or prior
	        listeners : {
	        	change : function( field, newValue, oldValue){
	        		if(me.down('#filterButton').pressed){	        		
	        			me.load();
	        		}
	        	}
	        }
	    }, {
	    	itemId : 'toField',
	    	xtype: 'datefield',
	        labelAlign : 'right',
	        labelWidth : 30,
	        anchor: '100%',
	        fieldLabel: Locale.getMsg('view.common.to'),
	        name: 'toDate',
	        format: Ecfa.Config.DATE_FORMAT,
	        value: new Date(),  // defaults to today
	        listeners : {
	        	change : function( field, newValue, oldValue){
	        		if(me.down('#filterButton').pressed){
	        			me.load();
	        		}
	        	}
	        }
	    },{
	    	itemId : 'filterButton',
	    	xtype : 'button',
	    	icon : 'css/images/filter_16.png',
	    	enableToggle : true,
	    	handler : function(){
	    		console.log('pressed',this.pressed);
	    		me.load();
	    		var label = me.down('#filterLabel');
	    		if(this.pressed){
	    			label.setText(Locale.getMsg('view.common.filter.on'));
	    		}else{
	    			label.setText(Locale.getMsg('view.common.filter.off'));
	    		}
	    		
	    		label.show();
	    		Ext.defer(function () {
	    			label.hide();		            
	            }, 2000);
	    	}
	    },{
	    	itemId : 'filterLabel',
	    	xtype : 'label',
	    	text : '',
	    	hidden : true	    	
	    } ];

		me.columns = [ {
			header : Locale.getMsg('view.queue.project.title'),
			dataIndex : 'projectName',
			flex : 1.5
		},{
			header : Locale.getMsg('view.common.id'),
			dataIndex : 'num',
			flex : 0.5
		},{
			xtype : 'missionName',
			flex : 1.5
		}, { 
			xtype : 'missionProduct'
		}, {
			xtype : 'missionScene',
			flex : 2

		}, {
			header : Locale.getMsg('view.job.frameRange'),
			dataIndex : 'frameFirst',// frameFirst+'-'+frameLast
			flex : 1.5,
			renderer : function(val, metadata, record) {
				val = record.get('frameFirst') + '-' + record.get('frameLast');
				return val;
			}
		}, {
			header : Locale.getMsg('view.job.isconvertanimate'),
			flex : 1,
			dataIndex : 'convertVideo', 
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {				
				return Ecfa.locale.Converter.getTrueFalse(value);
			}
		}, {
			header : Locale.getMsg('view.job.timeStart'),
			flex : 1.5,
			dataIndex : 'timeStart',
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {

				if (value != 0) {
					return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
				}
				return '';
			}
		}, {

			header : Locale.getMsg('view.job.timeDone'),
			flex : 1.5,
			dataIndex : 'timeDone',
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {
				if (value != 0) {
					return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
				}
				return '';
			}
		}, {
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'state',
			flex : 1.5,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {
				return Ecfa.locale.Converter.getMissionState(record.get('state'));
			}
		}, {
			header : Locale.getMsg('view.queue.count.fail'),
			dataIndex : 'numFail',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.queue.count.done'),
			dataIndex : 'numDone',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.queue.count.total'),
			dataIndex : 'numTotal',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.transfer.download'),
			flex : 0.5,
			//xtype : 'componentcolumn',
			renderer : function(value, m, record) {
				/*is soft delete*/
				var softDel = Ecfa.Util.isDateEarlier(
						record.get('timeStart'),
						record.get('projectLastCleanTime'));
				
				if(softDel){
					var cleanTime = Ext.util.Format.date(
							new Date(record.get('projectLastCleanTime')),
							Ecfa.Config.DATETIME_FORMAT);
					
					//console.log(Locale.getMsg('view.msg.softdel.detail', cleanTime));				
					
					
					return '&nbsp;<a href="javascript: void(0)" title="'
						+ Locale.getMsg('view.msg.softdel.detail', cleanTime) +'">' 
						+ Locale.getMsg('view.msg.softdel')+ '</a>';
				}
				
				if (record.get('state') == Ecfa.Const.Mission.State.CMP) {
					return Locale.getMsg('view.transfer.compress.compressing');

				} else if (record.get('state') == Ecfa.Const.Mission.State.SKP) {
					return '';
				} else {
					var domId = me.getMissionDownloadDomId(record);
					return '&nbsp;<a id="' + domId + '" href="javascript: void(0)">' + Locale.getMsg('view.transfer.download') + '</a>';
					// return {
					// xtype : 'linkButton',
					// text : Locale.getMsg('view.transfer.download'),
					// handler : function() {
					// Ext.getCmp('downloadIframe').load(
					// Ext.String.format('rest/queue/download/{0}/{1}', record.get('oid'), record.get('compressedFileName')));
					//
					// }
					// };
				}

			}

		}, {
			xtype : 'averageFrameTime',
			flex : 1.2
		}, {
			xtype : 'coreHours',
			flex : 1.2				
		}, {
			xtype : 'cost',
			flex : 0.8				
		}  ],

		me.callParent(arguments);

		me.on({
		/*
		 * activate : function() { me.load(); }
		 */
		});
		me.store.on({
			load : function(store, records, successful) {
				if (successful) {
					Ext.each(records, function(record) {
						// Note: event listen will be removed automatically when element destroyed

						if (record.get('state') == Ecfa.Const.Mission.State.DON) {
							// console.log(me.getMissionDownloadDomId(record));
							var el = Ext.get(me.getMissionDownloadDomId(record));
							// console.log(el);
							if (el)
								el.on('click', Ext.bind(me.onDownloadClick, me, [ record ]));
						}

					});
				}
				// console.log(me.id, 'loading time', (new Date()).getTime() - me.t);

			},
			beforeload : function() {
				me.t = (new Date()).getTime();
			}

		});

	},

	load : function() {
		var start = null;
		var end = null;
		if(this.down('#filterButton').pressed){
			('filter on');						
			start = this.getStartDate();		
			end = this.getEndDate();	
		}
		
		this.getStore().load({
			params : {
				userId : Ecfa.Session.getUser().id,
				start : start,
				end : end
			}
		});
	},
	onDownloadClick : function(record) {
		Ext.getCmp('downloadIframe').load(Ext.String.format('rest/queue/download/{0}/{1}', record.get('oid'), record.get('compressedFileName')));
	},
	getMissionDownloadDomId : function(record) {
		return this.itemId + '-download-' + record.get('oid');
	},
	
	getStartDate : function(){
		start = this.down('#fromField').rawValue;
		if(start!=''){
			start = start + ' 00:00:00';
		}
		console.log('start',start);	
		return start;
	},
	
	getEndDate : function(){
		end = this.down('#toField').rawValue;
		if(end!=''){
			end = end + ' 23:59:59';
		}
		console.log('end',end);
		return end;
	}
	
});
