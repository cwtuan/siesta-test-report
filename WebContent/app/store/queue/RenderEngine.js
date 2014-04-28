Ext.define('Ecfa.store.queue.RenderEngine', {
    extend : 'Ext.data.Store',    
    fields : [ 'name', 'value' ],
	data : [ {
		name : 'Blender',
		value : 'BLENDER_BLENDER'
	}, {
		name : 'Cycle',
		value : 'BLENDER_CYCLE'
	}],
    sorters : [ {
		property : 'name',
		direction : 'ASC'
	}]
});
