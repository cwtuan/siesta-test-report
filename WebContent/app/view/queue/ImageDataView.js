Ext.define('Ecfa.view.queue.ImageDataView', {
	extend : 'Ext.DataView',
	alias : 'widget.imageDataView',
	store : 'queue.Image',	
	isMouseover : false,
	border : false,
	//width : 220,
	
	tpl: Ext.create('Ext.XTemplate',
          '<tpl for=".">',
	        	'<div style="margin-bottom: 10px;display: inline-block;" class="thumb-wrap">',
	        		'<img src="{url}" />',
	        		'<br/><span>'+Locale.getMsg('view.project.path')+' : {name}</span>',
	        	'</div>',            
          '</tpl>'
    ),
    itemSelector: 'div.thumb-wrap',
    images : null,
    prefix : null,
	initComponent : function() {
		var me = this;
		//var data = me.images;

		//console.log(me.images);
		Ext.Array.each(me.images, function(img){
			if(img['url'].indexOf('?path') !== -1){
				//console.log('dont compose');
				return false;
			}				
			//console.log(encodeURIComponent(img['url']));
			img['url'] = me.prefix+'?path='+encodeURIComponent(img['url']);			
			//console.log(img['url']);
		});
		
		
		me.callParent(arguments);
		//console.log(data);
		me.store.loadData(me.images);
		
//		me.on({
//			afterrender : function(me){
//				me.mon(me.el, 'mouseover', me.onMouseover);
//				me.mon(me.el, 'mouseout', me.close);	
//			}
//		});

		
	},
	onMouseover : function(){
		this.isMouseover = true;
		console.log('set true?',this.isMouseover);
	},
	close : function(){
		//this.up('window').close();
		this.isMouseover = false;
		console.log('set false?',this.isMouseover);
		Ext.getCmp('imagewin').close();
	}
	
	
	
});
