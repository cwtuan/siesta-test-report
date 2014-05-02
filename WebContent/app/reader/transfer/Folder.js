// TODO tooltip for project folder

Ext.define('MyApp.reader.transfer.Folder', {
	extend : 'Ext.data.reader.Json',
	alias : 'reader.folder',
	getChildrenNodes : function(jsonNodes) {
		var me = this;
		var treeNodes = [];

		// console.log('jsonNodes', jsonNodes);

		Ext.each(jsonNodes, function(jsonNode) {

			var treeNode = {
				id : jsonNode.id,
				text : jsonNode.name,
				leaf : false,
				loaded : false,
				expanded : false
			// ,
			// cls : 'folder'
			};

			if (jsonNode.projectName) {
				treeNode.qtip = Locale.getMsg('view.project.name') + ': ' + jsonNode.projectName;
			}

			// console.log('jsonNode.id', jsonNode.id);

			// var treeNode = {
			// id : jsonNode.path, // path is unique
			// text : jsonNode.name,
			// qtip : me.getQtip(jsonNode.name)
			// };
			var children = me.getChildrenNodes(jsonNode.childFiles);// recursive
			if (children.length > 0) {
				treeNode.children = children;
			}

			treeNodes.push(treeNode);
		});

		return treeNodes;
	},
	getQtip : function(name) {
		var key = 'view.transfer.folder.' + name + '.tooltip';
		return Locale.hasKey(key) ? Locale.getMsg(key) : null;
	},
	getResponseData : function(response) {
		return this.readRecords(this.getChildrenNodes(Ext.decode(response.responseText)));
	}
});
