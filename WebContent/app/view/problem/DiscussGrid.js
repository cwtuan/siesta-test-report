Ext.define('Ecfa.view.problem.DiscussGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.discussGrid',
	store : 'problem.Discuss',
	scroll : 'vertical',
	columnLines : false,
	trackMouseOver : false,
	disableSelection : true,
	loadMask : true,
	viewConfig : {
		stripeRows : false
	},
	problemId : null,
	problemUser : null,
	isOP : Ecfa.Config.isOP(),

	initComponent : function() {
		var me = this;

		me.columns = [ {
			header : Locale.getMsg('view.problem.discuss.message'),
			dataIndex : 'msg',		
			flex : 1,
			renderer : me.formatTitle
		}, {
			dataIndex : 'author',
			flex : 0.5,
			hidden : true,
			hideable: false // Hide column in default cloumn menu
		}, {
			header : Locale.getMsg('view.common.date'),
			dataIndex : 'createTime',
			flex : 0.5,
			renderer : Ecfa.util.Format.formatDate
		} ],

		me.callParent(arguments);

		Ecfa.event.Discuss.on({
			destroyed : function(record) {
				me.load(me.problemId, me.problemUser);
			},
			created : function(record) {
				me.load(me.problemId, me.problemUser);
			},
			updated : function(record) {
				me.load(me.problemId, me.problemUser);
			},
			running : function(isRunning) {
				me.setLoading(isRunning);
			}
		});
	},

	formatTitle : function(value, p, record) {
		var me = this;
		var newValue = value.replace(/([^>])\r\n|\n|\n/g, '\<br/\>\n');
		var src = 'css/images/ChatOrange.png';
		var author = record.get('author');

		if (record.get('author') != me.up('grid').problemUser) {
			if (!Ecfa.Config.isOP()) {
				author = Locale.getMsg('view.auth.user.type.op.admin');
			}
			src = 'css/images/ChatGreen.png';
		} else
			src = 'css/images/ChatOrange.png';

		return Ext.String.format('<div><img src="' + src + '" class="author"/> <b>{1}</b></div><span class="topic">{0}</span>', newValue, author || "Unknown");
	},

	load : function(problemId, problemUser) {
		var me = this;

		me.store.load({
			id : problemId,	// ,params:{start:0, limit:10} // rest/problem/discuss?start=xxx&limit=xxx
			callback : function(rec, op, success) {
				if (success) {
					//console.log('success', rec, op);
				} else {
					//console.log('fail', rec, op.error);
					Ecfa.event.Problem.fireEvent('updated');
					me.up('problemPanel').down('problemPropertyGrid').clearProperty();
					Ext.getCmp('notifybar').showError(Ecfa.locale.Converter.getErrorMsg(Locale.getMsg('view.problem.query.fail'), op));
				}
			}
		});
		me.problemId = problemId;
		me.problemUser = problemUser;
	}

});
