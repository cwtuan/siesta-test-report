Ext.define('Ecfa.view.queue.MissionHistoryGrid', {
	extend : 'Ecfa.view.common.ColumnsGrid',
	alias : 'widget.missionHistoryGrid',
	store : 'queue.MissionHistoryByProject',
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
				//me.load();
				me.up('missionView').reloadWholeParts(me);
			}
		}, '-', {
			itemId : 'projectCombo',
			xtype : 'combobox',
			fieldLabel : Locale.getMsg('view.queue.project.title'),
			labelWidth : 50,
			labelAlign : 'right',
			name : 'project',
			store : Ecfa.StoreUtil.getStore('detailProjects'),
			queryMode : 'remote',
			editable : false,
			displayField : 'name',
			valueField : 'oid',
			emptyText : Locale.getMsg('view.msg.project.select'),
			listeners : {
				select : function(combo, records, eOpts) {
					
					me.loadWithFilter(records[0].data.oid, me.down('#filterButton').pressed);
					
				}
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
	        			me.loadWithFilter(me.down('#projectCombo').getValue(), me.down('#filterButton').pressed);
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
	        			me.loadWithFilter(me.down('#projectCombo').getValue(), me.down('#filterButton').pressed);
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
	    	hidden : true,
	    	listeners : {
//	    		show : function(){
//	    			if(me.down('#filterButton').pressed){
//	    				this.setText(Locale.getMsg('view.common.filter.on'));
//	    			}else{
//	    				this.setText(Locale.getMsg('view.common.filter.off'));
//	    			}
//	    			
//	    		}
	    	}
	    } ];

		me.columns = [ {
			header : Locale.getMsg('view.common.id'),
			dataIndex : 'num',
			flex : 0.5
		},{
			xtype : 'missionName',
			flex : 1.5
		}, {
			header : Locale.getMsg('view.job.userName'),
			flex : 1.5,
			dataIndex : 'userName'
		},{ 
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
			header : Locale.getMsg('view.job.dependency'),
			flex : 1.5,
			dataIndex : 'dependencyName'
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
			flex : 1.5
		}, {
			header : Locale.getMsg('view.queue.count.done'),
			dataIndex : 'numDone',
			flex : 1.5
		}, {
			header : Locale.getMsg('view.queue.count.total'),
			dataIndex : 'numTotal',
			flex : 1.5
		}, {
			header : Locale.getMsg('view.transfer.download'),
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

		} ],

		me.callParent(arguments);

		
		/* if no value in project combobox, set firt project as default */
		me.down('#projectCombo').store.on({
			load : function() {
				// console.log('project combobox reload!');
				var combo = me.down('#projectCombo');
				if ((combo.value == null || combo.value == '') && combo.store.totalCount > 0) {
					// project combo haven't been select,
					// select first as default
					// and reload grid
					combo.select(combo.store.getAt(0));
					var projectOid = combo.store.getAt(0).get('oid');					
					
					me.load(projectOid);
					
					
				}

			}
		});
		
		Ecfa.event.Project.on({
			destroyed : function(projectData) {
				var projectCombo = me.down('#projectCombo');
				var selectedProject = projectCombo.value;
				console.log('destroyed effect combo in missionHistoryGrid', selectedProject);
				if (selectedProject && selectedProject === projectData.oid) {
					// if the current selected project was deleted, select the defualt one
					projectCombo.store.load({
						callback : function(records, operation, success) {
							if (success) {
								var toSelectRecord;
								// TODO select the default one
								toSelectRecord = projectCombo.store.first();
								// console.log('toSelectRecord', toSelectRecord);
								if (toSelectRecord) {
									projectCombo.select(toSelectRecord);
								}

							}
						}
					});
				} /*else {
					me.load();
				}*/
			}
		});
		
		me.store.on({
			load : function(store, records, successful) {
				if (successful) {
					
					// render link for download
					Ext.each(records, function(record) {
						// Note: event listen will be removed automatically when element destroyed

						if (record.get('state') == Ecfa.Const.Mission.State.DON) {
							//console.log(me.getMissionDownloadDomId(record));
							var el = Ext.get(me.getMissionDownloadDomId(record));
							//console.log(el);
							if (el)
								el.on('click', Ext.bind(me.onDownloadClick, me, [ record ]));
						} 

					});
				}

			}
		});
	},	
	
	

	load : function(projectOid) {
		// trigger by refresh or combobox selection
		var start = null;
		var end = null;
		if (projectOid==null) {
			projectOid = this.down('#projectCombo').getValue();
			//console.log('project oid is null',projectOid);
		}
		// first time activate, project combo haven't been selected, no value
		// don't load, combo select will load
		if(projectOid!=null){
			
			if(this.down('#filterButton').pressed){
				('filter on');
				start = this.getStartDate();		
				end = this.getEndDate();	
			}			
			
			this.store.load({
				ids : [ projectOid ],
				params : {
					start : start,
					end : end
				}
			});

		}

	},

	loadWithFilter : function(projectOid, filter ){
		var start = null;
		var end = null;
		if(this.down('#filterButton').pressed){
			('filter on');						
			start = this.getStartDate();		
			end = this.getEndDate();		
		}
		
		
		this.store.load({
			ids : [ projectOid ],
			params : {
				start : start,
				end : end
			}
		});
	},
	
	reloadFilter : function() {
		// console.log('reload filter');
		this.down('#projectCombo').getStore().reload();
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
