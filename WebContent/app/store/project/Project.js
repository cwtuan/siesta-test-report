Ext.define('Ecfa.store.project.Project', {
	extend : 'Ext.data.Store',
	model : 'Ecfa.model.project.Project',
	sorters : [ 
//	            {
//		sorterFn : function(o1, o2) {
//			var getRank = function(o) {
//				var projectRole = o.get('projectRole');
//
//				if (projectRole === Ecfa.Const.Project.Role.OWNER) {
//					return 1;
//				} else if (projectRole === Ecfa.Const.Project.Role.ADMIN) {
//					return 2;
//				} else if (projectRole === Ecfa.Const.Project.Role.MEMBER) {
//					return 3;
//				} else {
//					throw 'no such projectRole: ' + projectRole;
//				}
//			}, rank1 = getRank(o1), rank2 = getRank(o2);
//			if (rank1 === rank2) {
//				return 0;
//			}
//			return rank1 < rank2 ? -1 : 1;
//		}
//	},
	{
		property : 'name',
		direction : 'ASC'
	} ]
});
