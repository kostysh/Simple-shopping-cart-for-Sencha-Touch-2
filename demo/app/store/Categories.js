Ext.define('Cart.store.Categories', {
    extend: 'Ext.data.TreeStore',

    config: {
        model: 'Cart.model.Categories',
        autoLoad: true,

        proxy: {
            type: 'ajax',
            url: 'data/data.json',
            reader: {
                type: 'json',
                rootProperty: 'items',
                idProperty: 'id'
            }
        }
    }
});