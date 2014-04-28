Ext.define('Ecfa.view.auth.OpUserView', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.opUserView',
	region : 'center',	
	border : false,
	autoscroll : true,
	requires : ['Ecfa.view.auth.UserGrid','Ecfa.view.auth.OpUserGrid',
	            'Ecfa.view.auth.CreateUserWin','Ecfa.view.auth.EditUserWin',
	            'Ecfa.view.auth.action.CreateUserAction','Ecfa.view.auth.action.EditUserAction','Ecfa.view.auth.action.DeleteUserAction','Ecfa.view.auth.action.CreditAction','Ecfa.view.auth.action.ResendLinkUserAction'
	            //,'Ext.ux.LiveSearchGridPanel','Ext.tip.QuickTipManager'
	            ,'Ext.toolbar.TextItem','Ext.form.field.Checkbox','Ext.form.field.Text','Ext.ux.statusbar.StatusBar','Ecfa.view.auth.QueryCreditGrid'
	            ],
	plain : false,
	initComponent : function() {
		var me = this;

		me.items = [ {
			xtype : 'userGrid',
			title : Locale.getMsg('view.auth.user.upUserGrid'),			
			flex : 1,
			border :false
		},{
			xtype : 'opUserGrid',
			title : Locale.getMsg('view.auth.user.opUserGrid'),
			name :'opUserGrid',
			flex : 1,
			border :false
		}];

		me.callParent(arguments);
		
		me.on({			
			activate : function(){	
				//me.down('#userGrid').store = Ecfa.StoreUtil.getStore('upUsers');
				me.getActiveTab().fireEvent('activate');
			}
		});		
	}
});
