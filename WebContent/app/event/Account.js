Ext.define('Ecfa.event.Account', {
    extend : 'Ext.util.Observable',
    mixins:['Ecfa.event.ModelEvent'],
    singleton : true,
    constructor : function() {
        this.callParent(arguments);
    }
});
