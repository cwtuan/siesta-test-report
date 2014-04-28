Ext.define('Ecfa.view.queue.PreviewPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.previewPanel',
	region : 'center',
	layout : 'fit',
	heigh : 200,
	border : false,
	autoscroll : true,
	missionId : null,
	frameTotal : null,
	// requires : [ 'Ecfa.view.queue.FrameGrid'],

	initComponent : function() {
		var me = this;
		me.items = [ {
			itemId : 'multiImageViewer',
			xtype : 'multiImageViewer',			
			src : ['css/images/softDel.jpg'],
			currentImageTemplate: Locale.getMsg('view.frame.viewingpic')+ '{i}/{total}',			
			flex : 1
		} ];
//		var sources = [];
//		var uritpl = 'rest/queue/previewFrame/{id}?frameSeq={seq}';
//		
//		
//		for (var i = 1, len = me.frameTotal; i <= len; i++) {
//			var url =uritpl.replace('{id}',me.missionId);
//			url = url.replace('{seq}', i);		
//			//console.log(url);
//			sources.push(url);
//		}
//        
//		me.items = [ {
//			xtype : 'multiImageViewer',
//			/*src : [ 'http://www.oneredrobin.com/wp-content/blogimages/2008/aranzi_aronzo_softies.jpg', 
//			        'rest/queue/previewFrame/1?frameSeq=1' ],*/
//			src : sources,
//			currentImageTemplate: Locale.getMsg('view.frame.viewingpic')+ '{i}/{total}',
//			flex : 1
//		} ];

		me.callParent(arguments);

	},
	composeSource : function(frameSeqArr, images){
		var me = this;
		var sources = [];
		//var uritpl = 'rest/queue/previewFrame/{id}?frameSeq={seq}';
		
		
		//console.log(me.missionId);
		//console.log(me.frameTotal);
		//console.log(frameSeqArr);
		if(!me.softDel){			
			var uritpl = 'rest/queue/previewFrame/{id}/{seq}';
			for (var i = 0, len = frameSeqArr.length-1; i <= len; i++) {
				//var url =uritpl.replace('{id}',this.missionId);
				
				if(frameSeqArr[i]<0){
					var url = 'css/images/default.jpg';
					//if not finish
					for(var j=0; j < images.length; j++ ){
						sources.push(url);
						//console.log('no',url);
					}
					
				}else{
					var urlprefix =uritpl.replace('{id}',this.missionId);
					urlprefix = urlprefix.replace('{seq}', frameSeqArr[i]);
					
					Ext.each(images, function(image){
						var url = urlprefix + '?path='+ encodeURIComponent(image['url']);
						sources.push(url);
						//console.log('yes',url);
					});
					
				}	
				
			}		
		
			if(sources.length == 0){ // at least put one pic, until frame done, we don't get image url
				sources.push('css/images/default.jpg');
			}
		}else{//softDel
			sources.push('css/images/softDel.jpg');
		}
		
		this.down('#multiImageViewer').setSources(sources);
		this.down('#multiImageViewer').setImageCount(sources.length);
		this.down('#multiImageViewer').currentImageTemplate = Locale.getMsg('view.frame.viewingpic')+ '{i}/{total}';
		this.down('#multiImageViewer').currentImage = 0;
		this.down('#multiImageViewer').src = sources[0];
		this.down('#multiImageViewer').previousImage();
		this.down('#multiImageViewer').nextImage();
	}
});
