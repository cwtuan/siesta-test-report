Ext.define('Ecfa.view.project.ProjectGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.projectGrid',
	requires : [ 'Ecfa.view.project.CreateProjectWin', 'Ecfa.view.project.action.DeleteProjectAction', 'Ecfa.view.project.action.EditProjectAction',
			'Ext.grid.plugin.RowEditing'
	// , 'Ecfa.view.project.action.CreateProjectAction',
	],

	viewConfig : {
		getRowClass : function(record, index) {
			return 'cursorPointer';
		},
		preserveSelectionOnRefresh : true
	},
	selType : 'rowmodel',
	plugins : [ {
		itemId : 'projectGrid-roweditor',
		ptype : 'rowediting'
	} ],
	border : false,

	store : Ecfa.StoreUtil.getStore('detailProjects'),
	// store : 'project.Project',

	initComponent : function() {
		var me = this;

		me.columns = [
		// // TODO 文字太長 => 換行 instead of "...."
		{
			header : Locale.getMsg('view.common.action'),
			xtype : 'componentcolumn',
			width : 50,
			renderer : function(value, metadata, record) {
				return {
					xtype : 'container',
					items : [ new Ext.button.Button(Ext.widget('deleteProjectAction', {
						record : record
					})), new Ext.button.Button(Ext.widget('editProjectAction', {
						record : record,
						panel : me
					})) ]
				};
			}
		}, {
			header : Locale.getMsg('view.common.title'),
			dataIndex : 'name',
			flex : 2,
			editor : {
				xtype : 'textfield',
				itemId : 'projectGrid-name',
				allowBlank : false,
				maxLength : 50
			// TODO validator in model
			}
		// ,
		// renderer : function(val, metadata, record) {
		// metadata.style = 'background-color: #FFFFCC !important;cursor: pointer;';
		// // metadata.tdAttr = 'data-qtip="' + Locale.getMsg('view.project.user.show') + '"';
		// return val;
		// }
		}, {
			header : Locale.getMsg('view.project.user.role'),
			tooltip : Locale.getMsg('view.project.user.role.forCurrentUser'),
			dataIndex : 'projectRole',
			width : 45,
			renderer : Ecfa.locale.Converter.getProjectRole
		}, {
			header : Locale.getMsg('view.job.priority'),
			tooltip : Locale.getMsg('view.project.priority.max.tooltip'),
			dataIndex : 'maximumPriority',
			width : 55,
			renderer : Ecfa.locale.Converter.getJobPriority,
			editor : {
				xtype : 'combobox',
				itemId : 'projectGrid-maximumPriority',
				store : Ecfa.StoreUtil.getStore('priorities'),
				queryMode : 'local',
				editable : false,
				displayField : 'display',
				valueField : 'value',
				allowBlank : false
			}
		} ];

		me.tbar = [
		// { // TODO
		// xtype : 'createProjectAction'
		// },
		{
			itemId : 'createBtn',
			icon : 'css/images/add_16x16.png',
			text : Locale.getMsg('view.common.add'),
			handler : function() {
				Ext.widget('createProjectWin').show();
			}
		}, {
			icon : 'css/images/refresh.png',
			text : Locale.getMsg('view.common.refresh'),
			handler : function() {
				me.load({
					callback : function(records, operation, success) {
						// to notify folder tree to remove extra project folders
						Ecfa.event.Project.fireEvent('refresh', me.store.getData());
					}
				});
			}
		} ];

		me.callParent(arguments);

		me.load();

		me.on({
			select : function(panel, record) {
				Ecfa.event.Project.fireEvent('selected', record);// to reload project's user and file grid
			},
			viewready : function() {
				// select the first project as default
				if (me.store.getCount() != 0) {
					me.getSelectionModel().select(0);
				}
			}
		});

		me.store.on({
			load : function(store, records, successful) {
				if (successful) {
					if (records.length === 0) {
						Ecfa.event.Project.fireEvent('selected', null); // to reset project's user grid
					}
				}
			}
		});

		Ecfa.event.Project.on({
			destroyed : function(projectData) {

				/* select another project */

				// console.log('task', task);
				var selectedProject = me.getSelectionModel().getSelection()[0];
				console.log('destroyed -> selectedProject', selectedProject);
				if (selectedProject && selectedProject.getId() === projectData.oid) {
					// if the current selected project was deleted, select the defualt one
					me.load({
						callback : function(records, operation, success) {
							if (success) {
								var toSelectRecord;
								// TODO select the default one
								toSelectRecord = me.store.first();
								// console.log('toSelectRecord', toSelectRecord);
								if (toSelectRecord) {
									me.getSelectionModel().select(toSelectRecord);
								}

							}
						}
					});
				} else {
					me.load();
				}

			},
			created : function(projectData) {

				// FIXME preserveSelectionOnRefresh will select on load again!!
				// TODO 抽出slection default on create and destroy

				me.load({
					callback : function(records, operation, success) {
						/* select the project just created */
						if (success) {
							var toSelectRecord = me.store.getById(projectData.oid);
							me.getSelectionModel().select(toSelectRecord);
						}

					}
				});
			},
			updated : function(task) {
				me.load();
			}
		});
	},
	load : function(options) {
		options = options || {};
		var me = this;
		me.store.load({
			callback : options.callback ? options.callback : Ext.emptyFn
		});
	}
});
