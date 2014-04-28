Ext.define('Ecfa.view.resource.PoolLicenseGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.poolLicenseGrid',
	autoscroll : true,
	border : false,
	// store : 'license.Licenses',
	createflag : false,
	loadfalg : false,
	poolLicenseStore : null,
	poolOid : null,
	licenseOid : null,
	subscriber : null,
	
	initComponent : function() {
		var me = this;
		//console.log('allLicense', Ecfa.StoreUtil.getStore('allLicenses'));

		me.columns = [ {
			dataIndex : 'oid',
			hidden : true
		}, {
			header : Locale.getMsg('view.license.name'),
			dataIndex : 'name',
			flex : 1,
			itemId : 'name'
		}, {
			header : Locale.getMsg('view.license.availableNumbers'),
			dataIndex : 'nonDedicatedNums',
			flex : 0.5
		}, {
			header : Locale.getMsg('view.license.openSource'),
			dataIndex : 'openSource',
			flex : 0.5,
			renderer : function(value, metadata, record, rowIndex, colIndex, store, view) {
				return Ecfa.locale.Converter.getTrueFalse(record.get('openSource'));
			}
		}, {
			header : Locale.getMsg('view.common.quantity'),
			flex : 0.5,
			xtype : 'componentcolumn',
			renderer : function(value, meta, record) {
				value = 0;
				if (!me.createflag && me.loadflag) {
					for ( var i = 0; i < me.poolLicenseStore.getCount(); i++) {
						if (record.get('oid') === me.licenseOid[i]) {
							value = me.poolLicenseStore.getAt(i).get('number');// current pool license number
							break;
						}
					}
				}
				
				return {
					xtype : 'container',
					items : [ new Ext.form.field.Number(new Ecfa.action.OpAction({
						name : 'number',
						itemId : 'number_' + record.get('oid'),
						value : value, // current pool license number
						minValue : 0,
						maxValue : record.get('nonDedicatedNums')+value,
						width : 50,
						listeners: {
					        change:function(number, newValue, oldValue){
					        	console.log('*change',number,newValue,oldValue);
					        }
					    }
					})) ]
				};
			}
		} ];

		me.poolLicenseStore = Ext.create('Ecfa.store.resource.PoolLicense');
		me.poolLicenseStore.on({ // Register event sigleton everytime on is called
			load : function() {  // make sure load ajax has compeleted
				//console.log('load event done',new Date().getTime());
				if (me.poolLicenseStore.getCount() != 0) {
					me.loadflag = true;
					var temp, index;
					me.licenseOid = new Array();
					for ( var i = 0; i < me.poolLicenseStore.getCount(); i++) {
						temp = me.poolLicenseStore.getAt(i).get('name');
						//console.log('subscriber',me.subscriber,me.subscriber.length);
						//index = temp.indexOf("_") + 1;
						//console.log("3.me.subscriber",me.subscriber);
						index = me.subscriber.length+1;
						me.licenseOid.push(temp.slice(index));
					}
				}
				me.setLoading(false);
				me.getView().refresh();
			}
		});

		me.callParent(arguments);
	},

	loadAllLicense : function() {
		var me = this;
		//console.log('2.loadAllLicense');
		me.setLoading(true);
		Ecfa.StoreUtil.getStore('allLicenses').load({ // Clone store after load allLicenses finish!
			callback : function(records, operation, success) {
				me.loadAllLicenseByClone();				
			}
		});
	},

	loadAllLicenseByClone : function() {
		var me = this;
		//console.log('3.loadAllLicenseByClone');
		me.bindStore(Ecfa.StoreUtil.deepCloneStore(Ecfa.StoreUtil.getStore('allLicenses')));
		me.store.filter('openSource', false);
		me.setLoading(false);
	},
	
	setPoolOid : function(poolId,subscriber) {
		var me = this;
		me.poolOid = poolId;
		me.subscriber = subscriber;
	},

	load : function(poolId) { // load license number to poolLicenseStore
		var me = this;
		//console.log('poolLicense load',poolId);
        me.setLoading(true);
   
		if (poolId != null) {
			me.poolLicenseStore.load({
				id : poolId,
				callback : function(records, operation, success) {
					//console.log('callback',success,records,me.store.getRange());
					if (me.poolLicenseStore.getCount() != 0) {
						me.loadflag = true;
						var temp, index;
						me.licenseOid = new Array();
						for ( var i = 0; i < me.poolLicenseStore.getCount(); i++) {
							temp = me.poolLicenseStore.getAt(i).get('name');
							//console.log('subscriber',me.subscriber,me.subscriber.length);
							//index = temp.indexOf("_") + 1;
							//console.log("me.subscriber",me.subscriber);
							index = me.subscriber.length+1;
							me.licenseOid.push(temp.slice(index));
						}
					}
					me.setLoading(false);
					me.getView().refresh();
				}
			});
			me.poolOid = poolId;
		}else{ // Clear license stores
			me.store.loadData([], false);
		}
	},

	getPoolLicense : function() {
		var me = this;

		var records = me.store.getRange();
		var data = new Array();
		var temp = null;
		var flag = false;
		for ( var i = 0; i < me.store.getCount(); i++) {
			// if(me.down('#number_'+records[i].get('oid')).getValue() != 0){
			//console.log('*poolLicense',records[i].get('name'));
			for ( var j = 0; j < me.poolLicenseStore.getCount(); j++) {
				var name = me.poolLicenseStore.getAt(j).get('name');
				//index = name.indexOf("_") + 1;
				index = me.subscriber.length+1;
				if (records[i].get('oid') === name.slice(index)) {
					temp = 'oid:\'' + me.poolLicenseStore.getAt(j).get('oid') + '\',poolOid:\'' + me.poolOid + '\',basename:\'' + records[i].get('name')
							+ '\', number:' + me.down('#number_' + records[i].get('oid')).getValue();
					flag = true;
					data.push(eval('({' + temp + '})'));
				}
			}
			if (flag === false && me.down('#number_' + records[i].get('oid')).getValue() != 0) {
				// console.log('***value', me.down('#number_' + records[i].get('oid')).getValue());
				temp = 'poolOid:\'' + me.poolOid + '\',basename:\'' + records[i].get('name') + '\', number:'
						+ me.down('#number_' + records[i].get('oid')).getValue();
				data.push(eval('({' + temp + '})'));
			}
			flag = false;
			// }
		}
		// console.log('*data', data);
		return data;
	}
});
