//  Data example:
// {
//		success : true,
//		error : null,
//		target : {
//			total : 0,
//			items : []
//		}
// }

Ext.define('MyApp.reader.RestTaskPagingGrid', {
	extend : 'MyApp.reader.RestTaskGrid',
	alias : 'reader.restTaskPagingGrid',
	totalProperty : 'target.total',
	root : 'target.items'

});
