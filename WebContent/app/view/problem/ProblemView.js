Ext.define('Ecfa.view.problem.ProblemView', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.problemView',
	region : 'center',
	layout : 'border',
	border : false,
	requires : [ 'Ecfa.view.problem.ProblemGrid', 'Ecfa.view.problem.OpProblemGrid', 'Ecfa.view.problem.ProblemPropertyGrid', 'Ecfa.view.problem.ProblemPanel',
			'Ecfa.view.problem.DiscussGrid' ],
	initComponent : function() {
		var me = this;

		var items = [];

		if (Ecfa.Config.isOP() === false) {
			items.push({
				itemId : 'problemGrid',
				xtype : 'problemGrid',
				region : 'west',
				margins : '5 0 0 5',
				flex : 1.5,
				split : true,
				layout : 'fit'
			});
		} else {
			items.push({
				itemId : 'opProblemGrid',
				xtype : 'opProblemGrid',
				region : 'west',
				margins : '5 0 0 5',
				flex : 1.5,
				split : true,
				layout : 'fit'
			});
		}
		// Discussion version
		items.push({
			itemId : 'problemPanel',
			region : 'center',
			xtype : 'problemPanel',
			margins : '5 5 0 0',
			flex : 2
		});

		// user beta version
		/*
		 * items.push({ itemId : 'problemPropertyGrid', region : 'center', xtype :'problemPropertyGrid', split : true, layout : 'fit', flex : 3, margins : '5 5
		 * 0 0', border : false });
		 */

		me.items = items;

		me.callParent(arguments);
		
		me.on({			
			activate : function(){				
				if (Ecfa.Config.isOP() === false) {
					me.down('#problemGrid').getStore().load();
				}else{
					me.down('#opProblemGrid').getStore().load();
				}
			}
		});		
	}

});
