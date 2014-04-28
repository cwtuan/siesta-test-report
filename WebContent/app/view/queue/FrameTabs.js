Ext.define('Ecfa.view.queue.FrameTabs', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.frameTabs',
	store : 'queue.Frame',
	border : false,	
	region : 'south',
	header : false, // hide the title of the panel
	plain : true,
	split : true,
	collapsible : true,
	collapsed : true, // default collapsed
	layout : 'fit',
	height : 400,
	//deferredRender : true,
	

	initComponent : function() {
		var me = this;
		

		me.callParent(arguments);
		me.on({
			tabchange : function(){
				//when tabchange relaod the activate panel
				//console.log('tabchange');
				//console.log(me.getActiveTab());
				me.getActiveTab().down('panel').load();
			}
		});

	}
});
