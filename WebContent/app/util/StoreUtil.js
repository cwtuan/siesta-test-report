Ext.define('Ecfa.util.StoreUtil', {
	singleton : true,
	alternateClassName : [ 'Ecfa.StoreUtil' ],
	requires : [ 'Ecfa.store.project.Project', 'Ecfa.store.Priority', 'Ecfa.store.auth.ProjectRole', 'Ecfa.store.auth.User', 'Ecfa.store.resource.Render',
			'Ecfa.store.license.LicenseByType', 'Ecfa.store.queue.Output', 'Ecfa.store.queue.Frame', 'Ecfa.store.resource.Pool','Ecfa.store.monitor.Service'],
	constructor : function() {

		// 在下列情況，必須重新create一個proxy塞到store
		// 1. proxy的url、type、reader不同於原本的定義
		// 2. create多個同樣store的instance (即使有多個store instance，但會share同個proxy，所以在某個grid設定proxy的param將會影響到其他grid)

		var detailProjects = Ext.create('Ecfa.store.project.Project');

		detailProjects.setProxy(Ext.data.proxy.Proxy({
			url : detailProjects.proxy.url,
			type : detailProjects.proxy.type,
			reader : detailProjects.proxy.reader,
			extraParams : {
				filter : 'me',
				detail : [ 'adminIds', 'localFolderPath' ]
			}
		}));

		var upUsers = Ext.create('Ecfa.store.auth.User');
		var upUsersProxy = Ext.data.proxy.Proxy({
			url : 'rest/op/auth/users',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		upUsers.setProxy(upUsersProxy);
		upUsers.sort('id', 'ASC');

		var opUsers = Ext.create('Ecfa.store.auth.User');
		var opUsersProxy = Ext.data.proxy.Proxy({
			url : 'rest/op/auth/opusers',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		opUsers.setProxy(opUsersProxy);
		opUsers.sort('id', 'ASC');

		var poolRender = Ext.create('Ecfa.store.resource.Render');
		var poolRenderProxy = Ext.data.proxy.Proxy({
			url : 'rest/op/resource/poolRenders',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		poolRender.setProxy(poolRenderProxy);

		var availableRender = Ext.create('Ecfa.store.resource.Pool');
		var proxyAvailableRender = Ext.data.proxy.Proxy({
			url : 'rest/op/resource/availablePool',
			type : availableRender.proxy.type,
			params : {
				osType : ''
			}
		});
		availableRender.setProxy(proxyAvailableRender);

		var softwareLicense = Ext.create('Ecfa.store.license.LicenseByType');
		var proxySoftwareLicense = Ext.data.proxy.Proxy({
			url : softwareLicense.proxy.url,
			type : softwareLicense.proxy.type
		});
		softwareLicense.setProxy(proxySoftwareLicense);
		softwareLicense.proxy.extraParams = {
			type : Ecfa.Const.LicenseType.SOFTWARE
		};

		var engineLicense = Ext.create('Ecfa.store.license.LicenseByType');
		var proxyEngineLicense = Ext.data.proxy.Proxy({
			url : engineLicense.proxy.url,
			type : engineLicense.proxy.type
		});
		engineLicense.setProxy(proxyEngineLicense);
		engineLicense.proxy.extraParams = {
			type : Ecfa.Const.LicenseType.ENGINE
		};

		var resourceFiles = Ext.create('Ecfa.store.transfer.File');
		var resourceFilesProxy = Ext.data.proxy.Proxy({
			url : resourceFiles.proxy.url,
			type : resourceFiles.proxy.type
		});
		resourceFiles.setProxy(resourceFilesProxy);
		resourceFiles.proxy.extraParams = {
			folder : 'resource'
		};

		var problem = Ext.create('Ecfa.store.problem.Problem');
		var problemProxy = Ext.data.proxy.Proxy({
			url : 'rest/problems',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		problem.setProxy(problemProxy);
		
		var monitorProblem = Ext.create('Ecfa.store.monitor.Service');
		var monitorProblemProxy = Ext.data.proxy.Proxy({
			url : 'rest/op/monitor/problems',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		monitorProblem.setProxy(monitorProblemProxy);
		
		this.stores = {
			detailProjects : detailProjects,
			priorities : Ext.create('Ecfa.store.Priority'),
			projectRoles : Ext.create('Ecfa.store.auth.ProjectRole'),
			projectUsers : Ext.create('Ecfa.store.auth.User'),
			upUsers : upUsers,
			opUsers : opUsers,
			poolRender : poolRender,
			availableRender : availableRender,
			softwareLicense : softwareLicense,
			engineLicense : engineLicense,
			output : Ext.create('Ecfa.store.queue.Output'),
			allLicenses : Ext.create('Ecfa.store.license.Licenses'),
			allProducts : Ext.create('Ecfa.store.license.Product'),
			resourceFiles : resourceFiles,
			frameProject : Ext.create('Ecfa.store.queue.Frame'),// for MissionView
			frameUser : Ext.create('Ecfa.store.queue.Frame'),
			// for UserMssionView
			// Usage: Ecfa.StoreUtil.getStore('resourceFiles').load({params:{projectOid:'e61f4c33-f41b-4650-84a4-95a8c4984fd0'}});
			problem : problem,
			monitorProblem : monitorProblem,
			pools : Ext.create('Ecfa.store.resource.Pool'),
			hosts : Ext.create('Ecfa.store.monitor.Host')
		};

	},
	getStore : function(key) {
		/*
		 * Usage Ex1: Ext.define('Ecfa.view.project.ProjectGrid', { store : Ecfa.StoreUtil.getStore('myProjects') }
		 * 
		 * Usage Ex2: { xtype : 'combobox', store : Ecfa.StoreUtil.getStore('myProjects') }
		 */

		return this.stores[key];
	},
	deepCloneStore : function(source) {
		var target = Ext.create('Ext.data.Store', {
			model : source.model,
			proxy : source.proxy
		});
		// FIXME clone sorters

		Ext.each(source.getRange(), function(record) {
			var newRecordData = Ext.clone(record.copy().data);
			var model = new source.model(newRecordData, newRecordData.id);

			target.add(model);
		});

		return target;
	}
});
