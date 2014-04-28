Ext.define('Ecfa.view.license.LicensePanel', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.licensePanel',	
	region : 'center',	
	border : false,
	autoscroll : true,
	requires : ['Ecfa.view.license.LicenseView','Ecfa.view.license.ProductGrid'],

	initComponent : function() {
		var me = this;
		me.layout = 'border';
		
		me.items = [ {
			itemId : 'licenseView',
			title : Locale.getMsg('view.license.title'),			
			xtype : 'licenseView',			
			flex : 1
		},{
			itemId : 'productGrid',
			title : Locale.getMsg('view.product.title'),		
			xtype : 'productGrid',
			flex : 1
		} ];

		me.callParent(arguments);
		
		me.on({
			activate : function(){
				//console.log('license panel activate!');
				//console.log(me.getActiveTab());
				//delegate activate event
				me.getActiveTab().fireEvent('activate');
			}
		});
		
	}
});
