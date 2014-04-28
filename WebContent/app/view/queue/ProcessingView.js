Ext.define('Ecfa.view.queue.ProcessingView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.processingView',
	// region : 'center',
	layout : 'fit',
	border : false,
	initComponent : function() {
		var me = this;

		me.items = [ {
			xtype : 'progressbar',
			// width : 300,
			margin : 50,
			ui : 'orange'
		} ];

		me.callParent(arguments);

		var p = me.down('progressbar');
		
		var count = 0;
		var task = {
			run : function() {
				count++;
				if (count > 10) {
					count = 0;
				}
				//console.log('count==');
				//console.log(count);
				p.updateProgress(count / 10, Locale.getMsg('view.msg.tracking'));
			},
			interval : 500
		};

		Ecfa.event.Track.on({
			progress : function() {
				count=0;
				me.taskRunnerStart(task);
			},
			progressStop : function(){
				me.taskRunnerStop(task);
			},
			fail : function(errorCode) {
				console.log('processing...', errorCode);
				me.taskRunnerStop(task);
				p.updateProgress(1, Ecfa.locale.Converter.getSimpleErrorMsg(errorCode));
				if(errorCode=='A002'){
					me.up('submitCheck').down('#cardNext').setDisabled(true);
				}else{
					me.up('submitCheck').down('#cardNext').setDisabled(false);
				}

			}
		});
	},

	taskRunnerStart : function(task) {
		Ext.TaskManager.start(task);
	},
	
	taskRunnerStop : function(task) {
		Ext.TaskManager.stop(task);
	},

	updateText : function(text) {

		Ext.TaskManager.stopAll();
		this.down('progressbar').updateProgress(1, text);

	}

});
