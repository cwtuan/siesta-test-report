// To fix bugs in ExtJS, must load ExtJS before this
Ext.define('Ecfa.ExtFix', {
	singleton : true,
	init : function(config) {

		// when display large messages, window height is not correct
		Ext.define('Ext.fix.window.MessageBox', {
			override : 'Ext.window.MessageBox',
			confirm : function() {
				var me = this;
				me.callOverridden(arguments);
				me.doAutoSize();
			}
		});

		// i18n for RowEditor
		if (Ext.grid.RowEditor) {
			Ext.apply(Ext.grid.RowEditor.prototype, {
				saveBtnText : Locale.getMsg('view.common.save'),
				cancelBtnText : Locale.getMsg('view.common.cancel'),
				errorsText : Locale.getMsg('view.common.save.error'),
				dirtyText : Locale.getMsg('view.common.save.dirtyText')
			});
		}

		/* i18n messages in pagingToolbar */
		Ext.define('Ext.PagingToolbar', {
			extend : 'Ext.PagingToolbar',
			displayMsg : Locale.getMsg('view.common.pagingbar.display'),// 'Displaying topics {0} - {1} of {2}',
			emptyMsg : Locale.getMsg('view.common.pagingbar.display.empty'),
			nextText : Locale.getMsg('view.common.pagingbar.display.next'),
			prevText : Locale.getMsg('view.common.pagingbar.display.previous'),
			refreshText : Locale.getMsg('view.common.refresh'),
			firstText : Locale.getMsg('view.common.pagingbar.display.first'),
			lastText : Locale.getMsg('view.common.pagingbar.display.last'),
			beforePageText : Locale.getMsg('view.common.pagingbar.display.page')
		});

		// dont show tooltip in button if tooltip is null
		Ext.define('Ext.fix.button.Button', {
			override : 'Ext.button.Button',
			setTooltip : function(tooltip, initial) {
				tooltip = tooltip || '';
				this.callParent(arguments);
			}
		});

		// FIXME not work with sencha compile
		// Locale fix
		// switch (config.LANG) {
		// case 'zh_TW':
		// Ext.define("Ext.fix.LoadMask", {
		// override : "Ext.LoadMask",
		// msg : '讀取中...'
		// });
		// Ext.define("Ext.fix.view.AbstractView", {
		// override : "Ext.view.AbstractView",
		// loadingText : "讀取中..."
		// });
		// Ext.define('Ext.fix.picker.Date', {
		// override : 'Ext.picker.Date',
		// minText : '日期必須大於或等於最小容許日期',
		// maxText : '日期必須小於或等於最大容許日期'
		// });
		// Ext.define('Ext.fix.form.field.Number', {
		// override : 'Ext.form.field.Number',
		// minText : "此欄位之數值必須大於或等於 {0}",
		// maxText : "此欄位之數值必須小於或等於 {0}"
		// });
		// break;
		// case 'zh_CN':
		// Ext.define("Ext.fix.LoadMask", {
		// override : "Ext.LoadMask",
		// msg : "加载中..."
		// });
		// Ext.define("Ext.fix.view.AbstractView", {
		// override : "Ext.view.AbstractView",
		// loadingText : "加载中..."
		// });
		// Ext.define("Ext.fix.picker.Date", {
		// override : "Ext.picker.Date",
		// minText : "日期必须大于或等于最小允许日期",
		// maxText : "日期必须小于或等于最大允许日期"
		// });
		// break;
		// default:
		// break;
		// }

	}
});
