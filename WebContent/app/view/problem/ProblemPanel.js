// for OP
Ext.define('Ecfa.view.problem.ProblemPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.problemPanel',
	bodyStyle : 'padding:-10px -10px -10px -10px',
	layout : {
		type : 'vbox',
		align : 'stretch'
	},

	initComponent : function() {
		var me = this;

		var items = [];

		if (Ecfa.Config.isOP() === false) {
			items.push({
				icon : 'css/images/grid.png',
				xtype : 'problemPropertyGrid',
				height : 150
			});
		}

		items.push({
			icon : 'css/images/ChatBlue.png',// 'css/images/chat_16x16.png',
			title : Locale.getMsg('view.problem.discuss'),
			border : false,
			xtype : 'discussGrid',
			flex : 1.5
		}, {
			xtype : 'textarea', // Using form.panel can't input multiline in textarea
			itemId : 'msg',
			hideLabel : true,
			name : 'msg',
			style : 'margin:0',
			flex : 0.5,
			grow : true,
			validator : function(value) {
				if (value || !(/^\s*$/.test(value))) {
					me.down('#submitbtn').setDisabled(false);
				} else 
					me.down('#submitbtn').setDisabled(true);
				
				/* When no selected problem, block adding message in discussGrid */
				if(me.down('discussGrid').problemId === null){
					me.down('#submitbtn').setDisabled(true);	
				}
				return true;
			}
		});

		me.items = items;

		me.bbar = [
				{
					itemId : 'submitbtn',
					text : Locale.getMsg('view.problem.discuss.add'),
					icon : 'css/images/addComment_16x16.png',
					width : 80,
					margin : '0 0 10 0',
					disabled : true,
					handler : function() {
						var submit = Ext.create('Ecfa.model.problem.Discuss', {
							problemId : me.down('discussGrid').problemId,
							msg : me.down('#msg').getValue()
						});
						this.setDisabled(true);
						// console.log('submit', submit);

						submit.save({
							success : function(rec, op) {
								me.down('#submitbtn').setDisabled(false);
								me.down('#msg').reset();
								Ext.getCmp('notifybar').showSuccess(Locale.getMsg('view.problem.discuss.add.success'), 5000);
								Ecfa.event.Discuss.fireEvent('created', rec);
							},

							failure : function(rec, op) {
								me.down('#submitbtn').setDisabled(false);
								Ext.getCmp('notifybar').showError(
										Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.problem.discuss.add.fail'), op.request.scope.reader.jsonData));
								Ecfa.event.Discuss.fireEvent('fail', rec);
							}
						});
					}
				}, {
					text : Locale.getMsg('view.common.clear'),
					margin : '0 0 10 0',
					width : 80,
					handler : function() {
						me.down('#msg').reset();
					}
				} ];

		me.callParent(arguments);
	}
});
