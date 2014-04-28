Ext.define('Ecfa.view.queue.AssetGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.assetGrid',
	store : 'queue.Asset',
	border : false,
	header : false, // hide the title of the panel
	layout : 'fit',
	projectOid : null,
	productOid : null, // for classify which engine (different rule for upload missing file)
	viewConfig : {
		getRowClass : function(record, index) {
			if (record.get('status') == Ecfa.Const.Asset.Status.MISSING)
				return 'type4';
		}
	},

	load : function(productOid, sceneFileName, workspace, projectOid) {
		// Ecfa.event.Track.fireEvent('running', true);
		var me = this;
		this.productOid = productOid;
		this.getStore().load({
			params : {
				sceneFileName : sceneFileName,
				productOid : productOid,
				workspace : workspace,
				projectOid : projectOid
			},
			callback : function(records, operation, success) {
				
				if (success) {
					me.up('submitCheck').decideNextStep();
				} else {
					Ecfa.event.Track.fireEvent('fail', operation.error);
				}

			}

		});
	},

	initComponent : function() {
		var me = this;

		me.columns = [ {
			header : Locale.getMsg('view.transfer.file.name'),
			dataIndex : 'filename',
			flex : 1.5
		}, {
			header : Locale.getMsg('view.common.type'),
			dataIndex : 'type',
			flex : 1

		}, {
			header : Locale.getMsg('view.common.size'),
			dataIndex : 'size',
			flex : 1,
			renderer : function(value, m, record) {
				if (value == -1) {
					return '-';
				}
				return Ext.util.Format.fileSize(value);
			}

		}, {
			header : Locale.getMsg('view.transfer.file.modifyTime'),
			dataIndex : 'modifyTime',
			flex : 1.5
		}, {
			header : Locale.getMsg('view.asset.foundPath'),
			dataIndex : 'foundPath',
			flex : 3
		}, {
			header : Locale.getMsg('view.common.status'),
			dataIndex : 'status',
			flex : 0.6,
			renderer : function(val, metadata, record) {

				metadata.tdCls = Ext.util.Format.lowercase(record.get('status'));
				return val;
			}
		}, {
			header : Locale.getMsg('view.transfer.upload'),
			xtype : 'componentcolumn',
			itemId : 'upload',
			renderer : function(value, m, record) {

				var pathType = record.get('pathType');

				console.log(pathType);
				console.log(me.productOid);
				// missing file upload or not
				// yes : Maya
				// no : Blender
				if (Ecfa.SpecUtil.isBlender(me.productOid) && pathType == Ecfa.Const.Asset.PathType.ABS) {
					// if type is ABS, the file can be found in the folder which is as same as the scenefile
					console.log('is blender');
					return {
						xtype : 'linkButton',
						text : Locale.getMsg('view.asset.msg.noupload'),
						tooltip : Locale.getMsg('view.asset.msg.blender.abs')
					};

				} else {

					if (record.get('status') == Ecfa.Const.Asset.Status.MISSING) {// MISSING

						//2014.1.9 alter foud path rel path
						var foundPath = record.get('foundPath');
						var folderPath = Ecfa.Format.alterRelFilePath(foundPath, 0);					
						var filename = Ecfa.Format.retriveFilename(foundPath);
						console.log('folderPath',folderPath);
						console.log('filename',filename);
						return { //upload link
							xtype : 'linkButton',
							text : '+ ' + Locale.getMsg('view.transfer.upload'),
							listeners : {
								click : function() {
									console.log('upload!!', me.projectOid);
									Ext.widget('simpleUploaderWin', {
										// projectOid : me.projectOid
										foundPath : foundPath,
										fileName : filename,
										folderPath : folderPath
									}).show();
								}
							}
						};

					} else { // FOUND

						return '';
					}
				}
			}

		} ];

		me.callParent(arguments);

		me.on({
		/*
		 * render : function(){ console.log('render'); //console.log(me.missionId); me.load(); }, show : function(){ console.log('SHOW');
		 * //console.log(me.missionId); me.load(); }
		 */
		});

		/*
		 * me.getStore().on({ load : function(){ //missing file upload or not //yes : Maya //no : Blender if(Ecfa.SpecUtil.Maya(productOid)){
		 * 
		 * }else{
		 *  } } });
		 */

	}
});
