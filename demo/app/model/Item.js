Ext.define('Cart.model.Item', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'id', type: 'integer'},
            {name: 'text', type: 'string'},
            {name: 'weight', type: 'string'},
            {name: 'price', type: 'float'},
            {name: 'img_tmb', type: 'string'},
            {name: 'leaf', type: 'boolean'}
        ],

        idProperty: 'id',

        belongsTo: 'Cart.model.Categories'
    }
});