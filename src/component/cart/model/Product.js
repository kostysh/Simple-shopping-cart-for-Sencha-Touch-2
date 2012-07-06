/**
 * @filename Product.js
 * @name Product data model
 * @fileOverview Config for product data model
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120629
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.data.Model
 * @requires Cs.component.cart.model.Cart
 * 
 */

Ext.define('Cs.component.cart.model.Product', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'id', type: 'string'},// This id will be generated as unique identifier
            {name: 'product_id', type: 'string'},
            {name: 'price', type: 'float'},
            {name: 'quantity', type: 'integer'},
            {name: 'cart_id', type: 'string'},
        ],

        identifier: {
            type: 'uuid'
        },

        belongsTo: 'Cs.component.cart.model.Cart'
    }
});
