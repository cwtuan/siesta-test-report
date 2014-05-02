Ext.define('MyApp.util.StoreUtil', {
	singleton : true,
	alternateClassName : [ 'MyApp.StoreUtil' ],
	requires : [ 'MyApp.store.project.Project', 'MyApp.store.Priority', 'MyApp.store.auth.ProjectRole', 'MyApp.store.auth.User', 'MyApp.store.resource.Render',
			'MyApp.store.license.LicenseByType', 'MyApp.store.queue.Output', 'MyApp.store.queue.Frame', 'MyApp.store.resource.Pool','MyApp.store.monitor.Service'],
	constructor : function() {

		// 在下列情況，必須重新create一個proxy塞到store
		// 1. proxy的url、type、reader不同於原本的定義
		// 2. create多個同樣store的instance (即使有多個store instance，但會share同個proxy，所以在某個grid設定proxy的param將會影響到其他grid)

		var detailProjects = Ext.create('MyApp.store.project.Project');

		detailProjects.setProxy(Ext.data.proxy.Proxy({
			url : detailProjects.proxy.url,
			type : detailProjects.proxy.type,
			reader : detailProjects.proxy.reader,
			extraParams : {
				filter : 'me',
				detail : [ 'adminIds', 'localFolderPath' ]
			}
		}));

		var upUsers = Ext.create('MyApp.store.auth.User');
		var upUsersProxy = Ext.data.proxy.Proxy({
			url : 'rest/op/auth/users',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		upUsers.setProxy(upUsersProxy);
		upUsers.sort('id', 'ASC');

		var opUsers = Ext.create('MyApp.store.auth.User');
		var opUsersProxy = Ext.data.proxy.Proxy({
			url : 'rest/op/auth/opusers',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		opUsers.setProxy(opUsersProxy);
		opUsers.sort('id', 'ASC');

		var poolRender = Ext.create('MyApp.store.resource.Render');
		var poolRenderProxy = Ext.data.proxy.Proxy({
			url : 'rest/op/resource/poolRenders',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		poolRender.setProxy(poolRenderProxy);

		var availableRender = Ext.create('MyApp.store.resource.Pool');
		var proxyAvailableRender = Ext.data.proxy.Proxy({
			url : 'rest/op/resource/availablePool',
			type : availableRender.proxy.type,
			params : {
				osType : ''
			}
		});
		availableRender.setProxy(proxyAvailableRender);

		var softwareLicense = Ext.create('MyApp.store.license.LicenseByType');
		var proxySoftwareLicense = Ext.data.proxy.Proxy({
			url : softwareLicense.proxy.url,
			type : softwareLicense.proxy.type
		});
		softwareLicense.setProxy(proxySoftwareLicense);
		softwareLicense.proxy.extraParams = {
			type : MyApp.Const.LicenseType.SOFTWARE
		};

		var engineLicense = Ext.create('MyApp.store.license.LicenseByType');
		var proxyEngineLicense = Ext.data.proxy.Proxy({
			url : engineLicense.proxy.url,
			type : engineLicense.proxy.type
		});
		engineLicense.setProxy(proxyEngineLicense);
		engineLicense.proxy.extraParams = {
			type : MyApp.Const.LicenseType.ENGINE
		};

		var resourceFiles = Ext.create('MyApp.store.transfer.File');
		var resourceFilesProxy = Ext.data.proxy.Proxy({
			url : resourceFiles.proxy.url,
			type : resourceFiles.proxy.type
		});
		resourceFiles.setProxy(resourceFilesProxy);
		resourceFiles.proxy.extraParams = {
			folder : 'resource'
		};

		var problem = Ext.create('MyApp.store.problem.Problem');
		var problemProxy = Ext.data.proxy.Proxy({
			url : 'rest/problems',
			type : 'rest',
			reader : {
				type : 'restTaskGrid'
			}
		});
		problem.setProxy(problemProxy);
		
		var monitorProblem = Ext.create('MyApp.store.monitor.Service');
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
			priorities : Ext.create('MyApp.store.Priority'),
			projectRoles : Ext.create('MyApp.store.auth.ProjectRole'),
			projectUsers : Ext.create('MyApp.store.auth.User'),
			upUsers : upUsers,
			opUsers : opUsers,
			poolRender : poolRender,
			availableRender : availableRender,
			softwareLicense : softwareLicense,
			engineLicense : engineLicense,
			output : Ext.create('MyApp.store.queue.Output'),
			allLicenses : Ext.create('MyApp.store.license.Licenses'),
			allProducts : Ext.create('MyApp.store.license.Product'),
			resourceFiles : resourceFiles,
			frameProject : Ext.create('MyApp.store.queue.Frame'),// for MissionView
			frameUser : Ext.create('MyApp.store.queue.Frame'),
			// for UserMssionView
			// Usage: MyApp.StoreUtil.getStore('resourceFiles').load({params:{projectOid:'e61f4c33-f41b-4650-84a4-95a8c4984fd0'}});
			problem : problem,
			monitorProblem : monitorProblem,
			pools : Ext.create('MyApp.store.resource.Pool'),
			hosts : Ext.create('MyApp.store.monitor.Host')
		};

	},
	getStore : function(key) {
		/*
		 * Usage Ex1: Ext.define('MyApp.view.project.ProjectGrid', { store : MyApp.StoreUtil.getStore('myProjects') }
		 * 
		 * Usage Ex2: { xtype : 'combobox', store : MyApp.StoreUtil.getStore('myProjects') }
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
