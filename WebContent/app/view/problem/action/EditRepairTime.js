Ext.define('Ecfa.view.problem.action.EditRepairTime', {
	extend : 'Ext.container.Container',
	alias : 'widget.editRepairTime',
	layout : {
		type : 'hbox'
	},
	occurTime : null,

	constructor : function(config) {
		var me = this;
		
		me.items = [ {
			xtype : 'datefield',
			format : 'Y/m/d',
			value : new Date(),
			id : 'repairDate',
			itemId : 'repairDate',
			//minValue: new Date(),//new Date(me.occurtTime), 
			//maxValue: new Date(),
			width : 85,			
			validator : function(value) {
				me.down('#repairTime').validate();				
				
				// Disable selection before occurTime
				this.setMinValue(new Date(me.occurTime));
				return true;
				
				/*var occurDate = Ext.util.Format.date(new Date(me.occurTime), "Y/m/d");
				if (new Date(value).getTime() >= new Date(occurDate).getTime())
					return true;
				return Locale.getMsg('view.problem.repairDate.invalid');*/
			}
		}, {
			xtype : 'timefield',
			format : 'H:i:s',
			increment : 60,
			value : new Date(new Date().getTime()),
			id : 'repairTime',
			itemId : 'repairTime',
			width : 80,
			validator : function(value) {
				//console.log('timefield validate',value,me.getValue(),me.occurTime);
				var fullvalue = me.getValue();
				if (new Date(fullvalue).getTime() >= me.occurTime)
					return true;
				return Locale.getMsg('view.problem.repairTime.invalid');
			}
		} ],
		
		me.callParent([ config ]);
	},

	getValue : function(config) {
		var me = this;
		var value = Ext.util.Format.date(me.down('#repairDate').getValue(), "Y/m/d") + ' ' + Ext.util.Format.date(me.down('#repairTime').getValue(), "H:i:s");
		return value;
	}
});
