//// TODO merge with Invitation.js store
//Ext.define('Ecfa.store.project.WaitingInvitation', {
//	extend : 'Ext.data.Store',
//	model : 'Ecfa.model.project.Invitation',
//	sorters : [ {
//		sorterFn : function(o1, o2) {
//			var getRank = function(o) {
//				var status = o.get('status');
//
//				if (status === Ecfa.Const.Invitation.Status.REJECT) {
//					return 0;
//				} else if (status === Ecfa.Const.Invitation.Status.EXPIRED) {
//					return 1;
//				} else if (status === Ecfa.Const.Invitation.Status.WAITING) {
//					return 2;
//				} else if (status === Ecfa.Const.Invitation.Status.ACCEPT) {
//					return 3;
//				} else {
//					throw 'no such invitation status: ' + status;
//				}
//			}, rank1 = getRank(o1), rank2 = getRank(o2);
//			if (rank1 === rank2) {
//				return 0;
//			}
//			return rank1 < rank2 ? -1 : 1;
//		}
//	}, {
//		property : 'expiredTime',
//		direction : 'DESC'
//	} ],
//	proxy : {
//		type : 'rest',
//		url : 'rest/invitations', // TODO dynamic proxy
//		reader : {
//			type : 'json'
//		}
//	}
//});
