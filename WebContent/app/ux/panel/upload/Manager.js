/**
 * The object is responsible for uploading the queue.
 * 
 */
Ext.define('Ecfa.ux.panel.upload.Manager', {
	mixins : {
		observable : 'Ext.util.Observable'
	},
	queue : null,

	requires : [ 'Ecfa.ux.panel.upload.uploader.AbstractUploader' ],

	config : {
		queue : null,
		uploader : null,
		uploaderOptions : null,
		synchronous : true,
		toAbortXhr : []
	},

	DEFAULT_UPLOADER_CLASS : 'Ecfa.ux.panel.upload.uploader.ExtJsUploader',

	constructor : function(config) {
		this.mixins.observable.constructor.call(this);

		this.addEvents({
			'beforeupload' : true,

			/**
			 * @event
			 * 
			 * Fired when the upload completes.
			 * 
			 * @param {Ecfa.ux.panel.upload.Manager}
			 *            manager
			 * @param {Ecfa.ux.panel.upload.Queue}
			 *            queue
			 * @param {number}
			 *            errorCount
			 */
			'uploadcomplete' : true,

			/**
			 * @event
			 * 
			 * Fired after the upload has been aborted.
			 * 
			 * @param {Ecfa.ux.panel.upload.Manager}
			 *            manager
			 * @param {Ecfa.ux.panel.upload.Queue}
			 *            queue
			 */
			'abortupload' : true,

			/**
			 * @event
			 * 
			 * Fired after a single item has been uploaded successfully.
			 * 
			 * @param {Ecfa.ux.panel.upload.Manager}
			 *            manager
			 * @param {Ecfa.ux.panel.upload.Item}
			 *            item
			 * @param {Object}
			 *            info
			 */
			'itemuploadsuccess' : true,

			/**
			 * @event
			 * 
			 * Fired after an error has occurred while uploading an item.
			 * 
			 * @param {Ecfa.ux.panel.upload.Manager}
			 *            manager
			 * @param {Ecfa.ux.panel.upload.Item}
			 *            item
			 * @param {Object}
			 *            info
			 */
			'itemuploadfailure' : true
		});

		this.initConfig(config);

		if (!(this.uploader instanceof Ecfa.ux.panel.upload.uploader.AbstractUploader)) {
			var uploaderClass = this.DEFAULT_UPLOADER_CLASS;
			if (Ext.isString(this.uploader)) {
				uploaderClass = this.uploader;
			}

			var uploaderOptions = this.getUploaderOptions() || {};
			Ext.applyIf(uploaderOptions, {
				success : this.onUploadSuccess,
				failure : this.onUploadFailure,
				progress : this.onUploadProgress
			});

			this.uploader = Ext.create(uploaderClass, uploaderOptions);
		}

		this.mon(this.uploader, 'uploadsuccess', this.onUploadSuccess, this);
		this.mon(this.uploader, 'uploadfailure', this.onUploadFailure, this);
		this.mon(this.uploader, 'uploadprogress', this.onUploadProgress, this);

		Ext.apply(this, {
			syncQueue : null,
			currentQueue : null,
			uploadActive : false,
			errorCount : 0
		});

		this.queue.on('queuechange', this.onQueueChange, this);
		this.queue.on('beforemultiremove', this.onBeforemultiremove, this);
		this.queue.on('multiremove', this.onMultiremove, this);
		// finishUpload

	},

	/**
	 * tony: Keeps the xhr to this.getToAbortXhr() Abort them later, otherwise, the next item about to be removed will start to upload and abort again and again
	 */
	onBeforemultiremove : function(queue, itemKeys) {
		var i = 0, ln = itemKeys.length;
		var item, xhr;
		var toAbortXhr = this.getToAbortXhr();
		for (; i < ln; ++i) {

			item = this.queue.getByKey(itemKeys[i]);
			if (item) {
				xhr = item.getXhr();

				if (xhr) {
					// console.log('[onBeforemultiremove] remove item readyState', itemKeys[i], xhr.readyState);
					if (xhr.readyState != 0 && xhr.readyState != 4) {
						toAbortXhr.push(xhr);
					}
				}
			}

		}

	},

	/**
	 * tony: abort connection after remove them from queue
	 */
	onMultiremove : function() {
		var xhr;
		var toAbortXhr = this.getToAbortXhr();
		// console.log(toAbortXhr);
		while (xhr = toAbortXhr.pop()) {
			console.log('going to abort file uploading connection', xhr);
			xhr.abort();
		}

	},

	// tony
	onQueueChange : function(queue) {
		// console.log('manger on queue change', queue.getCount());
		if (!queue.getCount()) {
			this.finishUpload();
		}
	},

	uploadQueue : function(queue) {

		// this.uploadActive = false;
		// check 'uploadActive' status
		// Ext.each(queue.getItems(), function(item) {
		// if (item.isUploading()) {
		// this.uploadActive = true;
		// return false;
		// }
		// });

		if (this.uploadActive) {
			return;
		}

		this.startUpload(queue);

		// remove uploaded files
		queue.reset();

		if (this.synchronous) {
			this.uploadQueueSync(queue);
			return;
		}

		this.uploadQueueAsync(queue);

	},

	uploadQueueSync : function(queue) {
		this.uploadNextItemSync();
	},

	uploadNextItemSync : function() {
		console.log('uploadActive', this.uploadActive);

		if (!this.uploadActive) {
			return;
		}

		var item = this.currentQueue.getFirstReadyItem();
		if (!item) {
			console.log('finishUpload');
			this.finishUpload(); // tony: 沒有可傳的(包含skip), 也算傳輸完畢
			return;
		}
		this.uploader.uploadItem(item);
	},

	uploadQueueAsync : function(queue) {
		var i;
		var num = queue.getCount();

		for (i = 0; i < num; i++) {
			this.uploader.uploadItem(queue.getAt(i));
		}
	},

	startUpload : function(queue) {
		this.uploadActive = true;
		this.currentQueue = queue;
		this.fireEvent('beforeupload', this, queue);
	},

	finishUpload : function() {
		this.fireEvent('uploadcomplete', this, this.currentQueue, this.errorCount);
	},

	resetUpload : function() {
		this.currentQueue = null;
		this.uploadActive = false;
		this.errorCount = 0;
	},

	abortUpload : function() {
		this.uploader.abortUpload();
		this.currentQueue.recoverAfterAbort();
		this.resetUpload();

		this.fireEvent('abortupload', this, this.currentQueue);
	},

	afterItemUpload : function(item, info) {
		if (this.synchronous) {
			this.uploadNextItemSync();
		}

		// console.log('afterItemUpload', item, info, this.currentQueue);

		if (this.currentQueue && this.currentQueue.isLast(item)) {
			this.finishUpload();
			console.log('finishUpload');
		}
	},

	onUploadSuccess : function(item, info) {
		item.setUploaded();

		this.fireEvent('itemuploadsuccess', this, item, info);

		this.afterItemUpload(item, info);
	},

	onUploadFailure : function(item, info) {
		item.setUploadError(info.message);

		console.log('itemuploadfailure', item, info);

		this.fireEvent('itemuploadfailure', this, item, info);
		this.errorCount++;

		this.afterItemUpload(item, info);// ///////////////////////////////////////////////////////////////toyn
	},

	onUploadProgress : function(item, event) {
		item.setProgress(event.loaded);
	}
});
