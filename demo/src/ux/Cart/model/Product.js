/**
 * @filename Product.js
 * @name Product data model
 * @fileOverview Config for product data model
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120725
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.data.Model
 * @requires Ext.ux.Cart.model.Cart
 * 
 */

Ext.define('Ext.ux.Cart.model.Product', {
    extend: 'Ext.data.Model',

    config: {
        fields: [
            {name: 'id', type: 'string'},// Generated unique product identifier
            {name: 'product_id', type: 'string'},
            {name: 'price', type: 'float'},
            {name: 'quantity', type: 'integer'},
            {name: 'cart_id', type: 'string'},
        ],

        identifier: {
            type: 'uuid'
        },

        belongsTo: 'Ext.ux.Cart.model.Cart'
    }
});
