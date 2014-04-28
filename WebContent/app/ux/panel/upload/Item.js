/**
 * A single item designated for upload.
 * 
 * It is a simple object wrapping the native file API object.
 */
Ext.define('Ecfa.ux.panel.upload.Item', {
	mixins : {
		observable : 'Ext.util.Observable'
	},
	statics : {
		STATUS_READY : 'ready',
		STATUS_UPLOADING : 'uploading',
		STATUS_UPLOADED : 'uploaded',
		STATUS_UPLOAD_ERROR : 'uploaderror',
		STATUS_SKIP : 'skip'// tony
	},

	config : {
		/**
		 * @cfg {Object} fileApiObject (required)
		 * 
		 * A native file API object
		 */
		fileApiObject : null,
		remoteFolder : null, // tony
		xhr : null,// tony: for aborting connection

		/**
		 * @cfg {String}
		 * 
		 * The upload error message associated with this file object
		 */
		uploadErrorMessage : ''
	},

	constructor : function(config) {
		this.mixins.observable.constructor.call(this);

		this.addEvents({
			changestatus : true,
			progressupdate : true
		});

		this.initConfig(config);

		console.log('itme size', this.getSize(), Ecfa.Config.SKIP_UPLOAD_SIZE, this.getSize() < Ecfa.Config.SKIP_UPLOAD_SIZE);

		this.reset();
		// Ext.apply(this, {
		// status : this.getSize() < Ecfa.Config.SKIP_UPLOAD_SIZE ? Ecfa.ux.panel.upload.Item.STATUS_READY : Ecfa.ux.panel.upload.Item.STATUS_SKIP,
		// progress : 0
		// });
	},

	reset : function() {
		this.uploadErrorMessage = '';
		this.setStatus(this.getSize() < Ecfa.Config.SKIP_UPLOAD_SIZE ? Ecfa.ux.panel.upload.Item.STATUS_READY : Ecfa.ux.panel.upload.Item.STATUS_SKIP);
		this.setProgress(0);
	},

	getFileApiObject : function() {
		return this.fileApiObject;
	},

	getId : function() {
		// tony
		return this.getRemoteFolder() + '/' + this.getFilename();
		// return this.getFilename();
	},

	getName : function() {
		return this.getProperty('name');
	},

	getFilename : function() {
		return this.getName();
	},

	getSize : function() {
		return this.getProperty('size');
	},

	getType : function() {
		return this.getProperty('type');
	},

	getProperty : function(propertyName) {
		if (this.fileApiObject) {
			return this.fileApiObject[propertyName];
		}

		return null;
	},

	getProgress : function() {
		return this.progress;
	},

	getProgressPercent : function() {
		// tony

		// console.log('size', this.getSize(), 'prog', this.getProgress());

		if (this.getSize() === 0) {
			return 100;
		}
		if (this.isUploaded()) {
			this.percent = 100;
		}
		var progress = this.getProgress();
		if (!progress) {
			return 0;
		}
		this.percent = (progress / this.getSize()) * 100;

		if (this.percent > 100) {
			this.percent = 100;
		}

		return Ext.util.Format.number(this.percent, '0.0');
	},

	setProgress : function(progress) {
		// console.log('setProgress', progress);
		this.progress = progress;
		this.fireEvent('progressupdate', this);
	},

	getStatus : function() {

		// console.log('getStatus', this.status);
		return this.status;
	},

	setStatus : function(status) {

		this.status = status;
		this.fireEvent('changestatus', this, status);
	},

	isSkip : function() {
		return (this.status == Ecfa.ux.panel.upload.Item.STATUS_SKIP);
	},

	isReady : function() {
		return (this.status == Ecfa.ux.panel.upload.Item.STATUS_READY);
	},

	isUploaded : function() {
		return (this.status == Ecfa.ux.panel.upload.Item.STATUS_UPLOADED);
	},

	isUploading : function() {
		return (this.status == Ecfa.ux.panel.upload.Item.STATUS_UPLOADING);
	},

	setUploaded : function() {
		console.log('setUploaded', this.getSize());
		this.setProgress(this.getSize());
		this.setStatus(Ecfa.ux.panel.upload.Item.STATUS_UPLOADED);
	},

	isUploadError : function() {
		return (this.status == Ecfa.ux.panel.upload.Item.STATUS_UPLOAD_ERROR);
	},

	getUploadErrorMessage : function() {
		return this.uploadErrorMessage;
	},

	setUploadError : function(message) {
		this.uploadErrorMessage = message;
		this.setStatus(Ecfa.ux.panel.upload.Item.STATUS_UPLOAD_ERROR);
	},

	setUploading : function() {
		this.setStatus(Ecfa.ux.panel.upload.Item.STATUS_UPLOADING);
	}
});
