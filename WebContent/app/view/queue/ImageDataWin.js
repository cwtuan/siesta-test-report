Ext.define('Ecfa.view.queue.ImageDataWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.imageDataWin',
	//id : 'imagewin',
	header : false,
	border : false,
	closable : false,
	draggable : false,
	height : 300,
	width : 410,
	layout : 'column',
	columnWidth : '1',
	//autoScroll : true,
	overflowY : 'auto',
	targetEl: null,
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
		
		me.on({
			afterrender : function(me){
				var timeout;
				
				me.getEl().on('mouseout', function(){
			        timeout = window.setTimeout(function(){
			            me.close();
			        }, 200);
			    });	
				
				me.getEl().on('mouseover', function(){
			        window.clearTimeout(timeout);
			    });
				
				me.targetEl.on('mouseout', function(){
					//me.close();
			        timeout = window.setTimeout(function(){
			            me.close();
			        }, 200);
			    });
			}
		});
	}
	
	
	
	
});
