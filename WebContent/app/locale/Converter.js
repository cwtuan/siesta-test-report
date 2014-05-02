/**
 * Convert locale key to value
 * 
 */
Ext.define('MyApp.locale.Converter', {
	singleton : true,
	alternateClassName : [ 'MyApp.Converter' ],
	// input true/false
	yes_no : function(value) {
		return value ? Locale.getMsg('view.common.yes') : Locale.getMsg('view.common.no');
	},

	// input YES/NO
	getYesNo : function(value) {
		return Locale.getMsg('view.common.'+value.toLowerCase()) ;
	},
	getErrorMsg : function(failedMsg, jsonResp) {
		var msg = '';
		var key = 'err.' + ((jsonResp && jsonResp.error) ? jsonResp.error : '');
		//console.log('jsonResp',jsonResp, jsonResp.error);
		msg += failedMsg;
		msg += Locale.getMsg('err.reason');
		if (Locale.hasKey(key)) {
			msg += Locale.getMsg(key);
		} else {
			msg += Locale.getMsg('err.internal');
		}
		return msg;
	},

	// for official store retrieve error key from operation.error
	getSimpleErrorMsg : function(errorCode) {
		var msg = '';
		var key = 'err.' + errorCode;

		if (Locale.hasKey(key)) {
			msg += Locale.getMsg(key);
		} else {
			msg += Locale.getMsg('err.internal');
		}
		return msg;
	},

	convertNumberToWeek : function(n) {
		switch (n) {
		case 1:
			return Locale.getMsg('view.common.sunday');
		case 2:
			return Locale.getMsg('view.common.monday');
		case 3:
			return Locale.getMsg('view.common.tuesday');
		case 4:
			return Locale.getMsg('view.common.wednesday');
		case 5:
			return Locale.getMsg('view.common.thursday');
		case 6:
			return Locale.getMsg('view.common.friday');
		case 7:
			return Locale.getMsg('view.common.saturday');
		default:
			break;
		}
	},
	convertNumberToDay : function(n) {
		return Locale.getMsg('view.day.' + n);
	},
	getProjectRole : function(projectRole) {
		return Locale.getMsg('view.project.user.role.' + projectRole.toLowerCase());
	},
	getAccountFailure : function(error) {
		return Locale.getMsg('view.auth.account.create.failure.' + error.toLowerCase());
	},
	fileStatus : function(status) {

		var result = '';
		// result += '<a href="#">';
		if (status === MyApp.Const.FILE_STATUS_WAITING) {
			result += '<img src="css/images/hourglass_16x16.png" ';
		} else if (status === MyApp.Const.FILE_STATUS_UPLOADING) {
			result += '<img src="css/images/arrow_up_16x16.png" ';
		} else if (status === MyApp.Const.FILE_STATUS_PAUSED) {
			result += '<img src="css/images/stop_16x16.png" ';
		} else if (status === MyApp.Const.FILE_STATUS_PAUSING) {
			result += '<img src="css/images/arrow_up_16x16.png" ';
		} else if (status === MyApp.Const.FILE_STATUS_UPLOAD_FAIL) {
			result += '<img src="css/images/exclamation_16x16.png" ';
		} else if (status === MyApp.Const.FILE_STATUS_COMPLETED) {
			result += '<img src="css/images/check_mark_16x16.png" ';
		} else if (status === MyApp.Const.FILE_STATUS_DELETED) {
			result += '<img src="css/images/delete_16x16.png" ';
		} else if (status === MyApp.Const.FILE_STATUS_DOWNLOADING) {
			result += '<img src="css/images/arrow_down_16x16.png" ';
		} else if (status === MyApp.Const.FILE_STATUS_DOWNLOAD_PAUSE) {
			result += '<img src="css/images/stop_16x16.png" ';
		}

		// result += '" title="' + + '" ';
		result += '\>&nbsp;';
		// retult += '</a>';
		result += Locale.getMsg('view.queue.asset.file.status.' + status.toLowerCase());

		return result;

	},
	hostStatus : function(status) {
		return Locale.getMsg('view.host.status.' + status.toLowerCase());
	},
	problemStatus : function(status) {
		return Locale.getMsg('view.problem.status.' + status.toLowerCase());
	},
	getJobPriority : function(key) {
		return Locale.getMsg('view.job.priority.' + key.toLowerCase());
	},
	getInvitationStatus : function(key) {
		return Locale.getMsg('view.project.user.invite.status.' + key.toLowerCase());
	},
	getMissionState : function(state) {
		return Locale.getMsg('view.job.state.' + state.toLowerCase());
	},
	getMissionAction : function(action) {
		return Locale.getMsg('view.job.action.' + action.toLowerCase());
	},
	getLicenseType : function(type) {
		return Locale.getMsg('view.license.' + type.toLowerCase());
	},
	getRenderLevel : function(key) {
		return Locale.getMsg('view.resource.render.' + key.toLowerCase());
	},
	getRenderPriority : function(key) {
		return Locale.getMsg('view.resource.render.priority.' + key.toLowerCase());
	},
	getRenderOS : function(key) {
		return Locale.getMsg('view.resource.render.os.' + key.toLowerCase());
	},
	getProductState : function(state) {
		return Locale.getMsg('view.product.state.' + state.toLowerCase());
	},
	getRenderStatus : function(status) {
		return Locale.getMsg('view.resource.render.status.' + status.toLowerCase());
	},
	getPoolStatus : function(status) {
		return Locale.getMsg('view.resource.pool.status.' + status.toLowerCase());
	},
	getPoolInfoStatus : function(status){//same code as getPoolStatus, but different translate
		return Locale.getMsg('view.resource.poolinfo.status.' + status.toLowerCase());
	},
	getTrueFalse : function(tf) {
		// console.log(tf);
		// console.log('view.common.'+tf);
		return Locale.getMsg('view.common.' + tf);
	},
	getProblemStatus : function(status) {
		return Locale.getMsg('view.problem.status.' + status.toLowerCase());
	},
	getUserStatus : function(value) {
		return Locale.getMsg('view.auth.user.status.' + value.toLowerCase());
	},
	getMonitorServiceStatus : function(value) {
		return Locale.getMsg('view.monitor.service.status.' + value);
	},
	getMonitorHostStatus : function(value) {
		return Locale.getMsg('view.monitor.host.status.' + value);
	},
	getHostTypeOs : function(value) {
		return Locale.getMsg('view.monitor.host.' + value.toLowerCase());
	},
	getVersionType : function(value) {
		return Locale.getMsg('view.version.versionType.' + value.toLowerCase());
	},
	getEventType : function(value) {
		return Locale.getMsg('view.notification.eventType.'+value.toLowerCase());
	}

});
