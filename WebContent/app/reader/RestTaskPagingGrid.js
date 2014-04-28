//  Data example:
// {
//		success : true,
//		error : null,
//		target : {
//			total : 0,
//			items : []
//		}
// }

Ext.define('Ecfa.reader.RestTaskPagingGrid', {
	extend : 'Ecfa.reader.RestTaskGrid',
	alias : 'reader.restTaskPagingGrid',
	totalProperty : 'target.total',
	root : 'target.items'

});
