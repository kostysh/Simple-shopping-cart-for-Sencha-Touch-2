Ext.define('Cart.model.Categories', {
    extend: 'Ext.data.Model',

    requires: [
        'Cart.model.Item'
    ],

    config: {
        fields: [
            {name: 'id', type: 'integer'},
            {name: 'text', type: 'string'},
            {name: 'leaf', type: 'boolean'}
        ],

        idProperty: 'id',

        associations: [
            {
                type: 'hasMany',
                model: 'Cart.model.Item',
                associationKey: 'products',
                name: 'getProducts',
                autoLoad: true
            }
        ]
    }
});