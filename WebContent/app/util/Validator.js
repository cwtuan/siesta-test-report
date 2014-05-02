// FIXME  not work in resetPassword.jsp

Ext.define('MyApp.util.Validator', {
	singleton : true,
	alternateClassName : [ 'MyApp.Validator' ],
	// constructor : function() {
	// },
	minPasswordLength : function(value) {
		if (value != '' && value.length < 6) {
			return Locale.getMsg('view.auth.password.min.error');
		}
		return true;
	},
	/*
	 * projectFolder duplication validator is in server side. This validator is only for allowd charactars
	 */
	fileName : function(folderName) {

		var i = folderName.length;
		while (i--) {
			// TODO more symbols such as (, ), @...
			if (!(/^[a-zA-Z0-9-_]+$/.test(folderName))) {
				return Locale.getMsg('view.project.file.name.validator.char');
			}
		}
		return true;
	},
	inviteEmail : function(email) {
		email = email.toLowerCase();

		if (email === MyApp.Session.getUser().email) {
			return Locale.getMsg('view.project.user.invite.validator.current_user');
		} else if (MyApp.StoreUtil.getStore('projectUsers').findExact('email', email) !== -1) {
			return Locale.getMsg('view.project.user.invite.validator.user_in_project');
		} else if (Ext.getStore('project.Invitation').findExact('email', email) !== -1) {
			return Locale.getMsg('view.project.user.invite.validator.user_in_invitation');
		}

		return true;
	},
	/**
	 * check if folder is resource folder or its sub-folder
	 */
	resourceFolder : function(folder) {
		if (folder) {
			var folderNames;
			if (folder.isModel) {
				folderNames = folder.getId().split('/');
			} else {
				folderNames = folder.split('/');
			}
			if (folderNames.length >= 3 && folderNames[2] === MyApp.Const.Folder.Name.RESOURCE) {
				return true;
			} else {
				return Locale.getMsg('view.transfer.folder.path.invalid.shouldResourceFolder');
			}
		}

	},

	// evaluation render mode, frame numbers <= 5
	evalutionFrames : function(first, last, step) {
		var num = ((last - first)/step) + 1;
		//console.log('num', num);
		if(num >= 6){
			return Locale.getMsg('view.job.frange.evaluation',5);
		}else{
			return true;
		}
	}

});
