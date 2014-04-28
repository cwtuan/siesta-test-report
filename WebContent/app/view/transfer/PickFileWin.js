Ext.define('Ecfa.view.transfer.PickFileWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.pickFileWin',
	requires : [ 'Ecfa.view.transfer.TransferPanel' ],
	projectOid : null,
	subFolder : 'resource',
	width : 400,
	height : 400,
	modal : true,
	layout : 'anchor',
	// defaults : {
	// anchor : '100%'
	// },
	title : 'Scene File Picker',
	initComponent : function() {
		var me = this;

		// me.items = [{xtype:'assetPanel'}];

		me.items = [ {
			xtype : 'container',
			layout : 'vbox',
			// defaults : {
			// anchor : '100% 50%'
			// },

			items : [

			Ext.create('Ecfa.view.transfer.FileGrid', {
				layout : 'fit',
				flex : 3,
				margins : '5 5 0 0'
			}),

			Ext.create('Ecfa.ux.panel.upload.FileUploadPanel', {
				uploadUrl : 'rest/transfer/uploadAjax',
				flex : 2,
				margins : '5 5 0 0',
				collapsible : true,
				animCollapse : true
			})

			// ,{
			// xtype : 'fileUploadPanel',
			// uploadUrl : 'rest/transfer/uploadAjax',
			// flex : 2,
			// margins : '5 5 0 0',
			// collapsible : true,
			// animCollapse : true
			// }
			]
		}

		];

		// me.items = [ {
		// xtype : 'panel',
		// // layout : 'anchor',
		// layout : 'border',
		// bodyPadding : 10,
		// items : [ {
		// xtype : 'assetPanel'
		// }
		// // {
		// // xtype : 'folderTreePanel',
		// // region : 'west',
		// // margins : '5 0 0 0',
		// // flex : 1,
		// // split : true,
		// // collapsible : true,
		// // animCollapse : true,
		// // layout : 'fit'
		// // }, {
		// // region : 'center',
		// // xtype : 'fileGrid',
		// // layout : 'fit',
		// // flex : 3,
		// // margins : '5 5 0 0'
		// // }
		// ],
		// buttons : [ {
		// text : Locale.getMsg('view.common.ok'),
		// formBind : true,
		// type : 'submit',
		// handler : function() {
		//
		// // var params = this.up('panel').;
		//
		// }
		// }, {
		// text : Locale.getMsg('view.common.cancel'),
		// handler : function() {
		// me.close();
		// }
		// } ]
		// } ];
		me.callParent();
	}
});
