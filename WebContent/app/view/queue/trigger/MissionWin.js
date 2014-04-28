Ext.define('Ecfa.view.queue.trigger.MissionWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.missionWin',
	inputValue : null,
	inputData : [],
	displayData : [], 
	projectOid : null,
	initComponent : function() {
		var me = this;

		me.items = [ {
			itemId : 'dependencyGrid',
			xtype : 'gridpanel',
			store : Ext.create('Ecfa.store.queue.MissionByProject'),//avoid polling refresh, create new instance
			layout : 'fit',
			border : false,
			selType : 'checkboxmodel',
			selModel : {
				mode : 'MULTI'
			},			
			columns : [{
				header : Locale.getMsg('view.common.id'),
				dataIndex : 'num',
				flex : 0.5				
			},{
				header : Locale.getMsg('view.job.name'),
				dataIndex : 'name',
				flex : 1.5
			}, {
				header : Locale.getMsg('view.job.sceneFile'),
				dataIndex : 'sceneFile',
				flex : 2
			}, {
				header : Locale.getMsg('view.job.frameRange'),
				dataIndex : 'frameFirst',// frameFirst+'-'+frameLast
				flex : 1,
				renderer : function(val, metadata, record) {
					val = record.get('frameFirst') + '-' + record.get('frameLast');
					return val;
				}
			}, {
				header : Locale.getMsg('view.job.timeCreate'),
				flex : 1.5,
				dataIndex : 'timeCreation',
				renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {	
					
					if (value != 0) {
						return Ext.util.Format.date(new Date(value), "Y/m/d H:i:s");
					}
					return '';
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
				header : Locale.getMsg('view.common.status'),
				dataIndex : 'state',
				flex : 1,
				renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {			
					return Ecfa.locale.Converter.getMissionState(value);
				}
			},/*{				
				flex : 1.5,
				hidden : true,
				dataIndex : 'submissionOid',
				renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {
					var submission = record.raw.submission;					
					return submission['oid'];
				}
			}*/{				
				flex : 1.5,
				hidden : true,
				dataIndex : 'oid'				
			}]
		} ];
		
		me.buttons = [ {
			type : 'submit',
			text : Locale.getMsg('view.common.ok'),
			action : 'add'
		}, {
			text : Locale.getMsg('view.common.cancel'),
			scope : this,
			handler : me.close
		} ];

		

		me.callParent(arguments);
		
		me.on({
			beforeshow : function(me, eOpts){
				//console.log('beforeshow');
			},
			activate : function(){
				//console.log('activate');
				me.load();
			},
			
			show : function(){
				console.log('show');
				//me.load();
				var grid = me.down('#dependencyGrid');
				/*String to selection*/				
				if(me.inputValue){
					console.log('String to selection');
					console.log(me.inputData);
					grid.store.on('load', function( store, records, successful, eOpts){
					
						var missionStore = grid.getStore();
						var selectRecords = [];	    		
			    		console.log(missionStore);
						var data = me.inputValue.split(',');
						Ext.each(data, function(oid) {
							console.log(oid);
							//var record = missionStore.findRecord('submissionOid',oid );						
							var record = missionStore.findRecord('oid',oid );
							if(record){//oid found in missionStore							
								selectRecords.push(record);													
							}
							
						});	
						console.log(selectRecords);
						grid.getSelectionModel().select(selectRecords);	
					});
					
				}
				
				/*selection to String*/
				grid.selModel.on('selectionchange', function(selModel, selected, eOpts) {
					//me.displayData = [];
					//me.inputData = [];
					var displayData = [];
					var inputData = [];
					Ext.each(selected, function(record){
						console.log(record);
						var display = record.get('num')+':'+record.data.name;
						displayData.push(display);

						//inputData.push(record.data.submissionOid);
						inputData.push(record.data.oid);
					});
					
					me.displayData = displayData;
					me.inputData = inputData;
					console.log(me.displayData);
					console.log(me.inputData);
				});
				
				
				
				
			}
		});		
		
	},
	
	load : function() {	
		//console.log(this.projectOid);
		this.down('gridpanel').getStore().load({
			ids : [ this.projectOid ]
		});
		
	}
});