Ext.define('Ecfa.view.queue.trigger.SelectProjectWorkspaceWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.selectProjectWorkspaceWin',
	requires : [ 'Ecfa.view.transfer.TransferPanel', 'Ecfa.ux.toolbar.NotifyBar' ],
	projectOid : null,
	fileFilter : null,
	width : 600,
	height : 400,
	modal : true,
	layout : 'border',
	title : Locale.getMsg('view.job.project.workspace.select'),
	initComponent : function() {
		var me = this;

		// TODO dont fire folder select event
		me.items = [ {
			xtype : 'folderTreePanel',
			projectOid : me.projectOid,
			onWin : true,
			containerId : 'selectProjectWorkspaceWin',
			region : 'center',
			margins : '0 0 0 0',
			flex : 1,
			split : true,
			collapsible : true,
			animCollapse : true
		}, {
			xtype : 'notifybar',
			region : 'south'
		}, {
			xtype : 'form',
			hidden : true,
			items : [ {
				// file picker
				xtype : 'filefield',
				name : 'file',// for fileUploadBean.java
				listeners : {
					change : me.onFileFieldChange
				}
			} ]
		} ];

		me.dockedItems = [ {
			xtype : 'toolbar',
			dock : 'bottom',
			ui : 'footer',
			// padding : '0 15 10 20',
			items : [ '->', {
				xtype : 'textfield',
				itemId : 'workspaceField',
				labelWidth : 110,
				width : 380,
				fieldLabel : Locale.getMsg('view.job.project.workspace'),
				listeners : {
					change : function(textfield, newValue, oldValue) {
						if (newValue !== '') {
							me.down('#submitBtn').enable();
						}
					}
				}
			}, {
				xtype : 'button',
				itemId : 'submitBtn',
				type : 'submit',
				text : Locale.getMsg('view.job.project.workspace.setAsProject'),
				disabled : true
			// ,handler in Queue.js Controller's onSelectedProjectWorkspace()
			}, {
				xtype : 'button',
				text : Locale.getMsg('view.common.cancel'),
				handler : function() {
					me.close();
				}
			} ]
		} ];

		me.callParent();

	},
	// upload project workspace file immediately whenever user pick a file
	onFileFieldChange : function(field, value) {
		var win = field.up('window');
		var path = win.down('folderTreePanel').getSelectionModel().getLastSelected().getId() + '/' + value;
		win.down('notifybar').showWarning(Locale.getMsg('view.job.project.workspace.uploading', value));

		field.up('form').submit({
			url : 'rest/transfer/files',
			params : {
				action : 'upload',
				path : path
			},
			success : function() {
				// [workaround] reset the field, otherwise, input[type=file] will be null in Queue.js controller when clicking again
				field.reset();
				// check file again
				win.down('#submitBtn').el.dom.click();
			}
		});
	}
});
