Ext.define('Ecfa.event.Track', {
    extend : 'Ext.util.Observable',
    mixins:['Ecfa.event.ModelEvent'],
    singleton : true,
    constructor : function() {
        this.callParent(arguments);
    }
});
