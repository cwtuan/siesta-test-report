Ext.define('Ecfa.view.queue.SubmitCheck', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.submitCheck',
	region : 'center',
	layout : 'card',
	overflowY : 'auto',
	overflowX : 'auto',
	style : 'margin-left:20px;margin-right:700px;margin-top:8px;',
	border : true,
	productOid : null,// set by callSceneAnalysis for upload texture then re-track
	sceneFileName : null,//
	workspace : null,
	projectOid : null,
	responseCounter : 0,
	analyseReq : null,
	rendersettingReq : null,	
	
	minWidth : 400,
	initComponent : function() {
		var me = this;
		me.title = Locale.getMsg('view.submit.check', 2);// 'Submit Check (2/3)';
		// me.layout = 'border';

		me.bbar = [ '->', {
			itemId : 'cardPrev',
			text : Locale.getMsg('view.wizard.previous'),
			width : 80,
			handler : function() {
				this.up('#submitWizard').previous();
				if(me.analyseReq!=null){
					Ext.Ajax.abort(me.analyseReq);
				}
				
				if(me.rendersettingReq!=null){
					Ext.Ajax.abort(me.rendersettingReq);
				}
//				console.log(me.down('assetGrid').store.getRequestId());
//				
				me.down('assetGrid').store.abort();

			}
		}, {
			itemId : 'cardNext',
			text : Locale.getMsg('view.wizard.next'),
			width : 80,
			//disabled : true,//************************
			disabled : false,
			handler : function() {
				if(me.up('#submitWizard').renderSetting){
					me.up('#submitWizard').next();
				}else{
					me.up('#submitWizard').end();
				}
			}
		} ];

		me.items = [ {
			xtype : 'processingView',
			flex : 1
		}, {
			xtype : 'analysisView',
			flex : 1
		}, {
			xtype : 'analysisAssetView',
			flex : 1
		} ];

		me.callParent(arguments);

		Ecfa.event.Track.on({
			running : function(cardIdx) {
				if (cardIdx == 0) {// if at progressView, start progress bar
					Ecfa.event.Track.fireEvent('progress');// restart task (listen in ProcessingView)
				} else {// if leave progressView, stop progress bar
					Ecfa.event.Track.fireEvent('progressStop');// restart task (listen in ProcessingView)
					me.down('#cardNext').setDisabled(false);
				}
				// 0: processingView
				// 1: scene analysis
				// 2: scene analysis + assetTracking
				me.getLayout().setActiveItem(cardIdx);
				

			},
			fail : function(errorMsg) {
				//console.log(errorMsg);
				
			},
			track : function() {
				// re-track after upload files
				console.log('fire track');
				console.log(me.productOid);
				// console.log(me.projectOid);
				console.log(me.sceneFileName);
				me.callAssetTracking(me.productOid, me.sceneFileName, me.workspace, me.projectOid);
			}
		});
	},

	callAssetTracking : function(productOid, sceneFileName, workspace, projectOid) {

		this.down('assetGrid').load(productOid, sceneFileName, workspace, projectOid);

	},
	// analyse
	callSceneAnalysis : function(productOid, sceneFileName, workspace, projectOid) {
		// this.down('assetGrid').load(productOid, projectOid, sceneFileName);
		var me = this;
		// Ecfa.event.Track.fireEvent('running', true);
		Ecfa.event.Track.fireEvent('running', 0);

		me.sceneFileName = sceneFileName;
		me.productOid = productOid;	
		me.workspace = workspace;
		me.projectOid = projectOid;
		
		me.analyseReq = Ecfa.Restful.request({
			url : 'rest/queue/analyse',
			method : 'GET',
			params : {
				sceneFileName : sceneFileName,
				productOid : productOid,
				projectOid : projectOid
			},
			success : function(jsonResp) {
				console.log('analysis success');
				console.log(jsonResp);

				// analysistView, analysisAssetView
				Ecfa.event.Track.fireEvent('analysis', jsonResp['target']);
				
				me.decideNextStep();		

			},
			failure : function(jsonResp) {
				console.log('analysis fail');
				console.log(jsonResp);
				Ecfa.event.Track.fireEvent('fail', jsonResp['error']);
			}
		});

	},

	analysisRenderSetting : function(productOid, sceneFileName,workspace, projectOid) {
		var me = this;

		// var productChrcallBenny
		
		me.rendersettingReq = 	Ecfa.Restful.request({
			url : 'rest/queue/analyseRenderSetting',
			method : 'GET',
			params : {
				sceneFileName : sceneFileName,
				productOid : productOid,
				workspace : workspace,
				projectOid : projectOid
			},
			success : function(jsonResp) {
				// console.log('SSS',jsonResp);

				var renderSetting = me.up('#submitWizard').down('#renderSetting');
				var items = renderSetting.productSpecParser(jsonResp['target']);

				var submitConfirm = me.up('#submitWizard').down('#submitConfirm');
				if (items.length > 0) {
					renderSetting.removeAll();
					renderSetting.add(items);
					submitConfirm.updateTitle(4); // last step 4
					me.up('#submitWizard').renderSetting = true;
				} else {
					submitConfirm.updateTitle(3);// last step 3
					me.up('#submitWizard').renderSetting = false;
				}
				
				me.decideNextStep();			


//				if (me.checkCounter(2)) {
//					if (me.up('#submitWizard').assetTracking) {
//						Ecfa.event.Track.fireEvent('running', 2);
//					} else {
//						Ecfa.event.Track.fireEvent('running', 1);
//					}
//				}

			},
			failure : function(jsonResp) {
				// console.log('FFF',jsonResp);
			}
		});

		me.doLayout();
	},

	analysisParser : function(analysis) {
		console.log(analysis);
		var os = analysis['osTypeInfo'];
		var engine = analysis['renderEngineInfo'];
		var version = analysis['versionInfo'];

		var msg = '';

		if (os['match'] && engine['match'] && version['match']) {
			msg = Locale.getMsg('view.analysis.pass') + '<br>';
		} else {
			msg = Locale.getMsg('view.analysis.warning') + '<br><br>' + Locale.getMsg('view.analysis.fyi') + '<br>';

			if (!os['match']) {
				console.log('os not match');
				msg += '◎' + Locale.getMsg('view.analysis.notmatch.reason.os', os['db'], os['scene']) + '<br>';
			}

			if (!engine['match']) {
				msg += '◎' + Locale.getMsg('view.analysis.notmatch.reason.engine', engine['db'], engine['scene']) + '<br>';
			}

			if (!version['match']) {
				console.log('version not match');
				msg += '◎' + Locale.getMsg('view.analysis.notmatch.reason.version', version['db'], version['scene']) + '<br>';
			}

		}
		// console.log(msg);
		return msg;
	},

	checkCounter : function(target) {
		if (this.responseCounter != (target-1)) {
			this.responseCounter++;
			//console.log(this.responseCounter);
			return false;
		}
		return true;
	},
	
	decideNextStep : function(){
		var me = this;
		if (me.up('#submitWizard').assetTracking) {
			if (me.checkCounter(3)) {
				Ecfa.event.Track.fireEvent('running', 2);
			}
		} else {
			if (me.checkCounter(2)) {
				Ecfa.event.Track.fireEvent('running', 1);
			}
		}				

	}

});
