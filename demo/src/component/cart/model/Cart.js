/**
 * @filename Cart.js
 * @name Cart data model
 * @fileOverview Config for cart data model
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120629
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.data.Model
 * @requires Ext.data.proxy.LocalStorage
 * @requires Ext.data.identifier.Uuid
 * @requires Cs.component.cart.model.Product
 * 
 */

Ext.define('Cs.component.cart.model.Cart', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.proxy.LocalStorage',
        'Cs.component.cart.model.Product',
        'Ext.data.identifier.Uuid'
    ],

    config: {
        fields: [
            {name: 'id', type: 'string'},
            {name: 'created', type: 'date'},
            {name: 'active', type: 'boolean'}
        ],

        idProperty: 'id',

        identifier: {
            type: 'uuid'
        },

        associations: [
            {
                type: 'hasMany',
                model: 'Cs.component.cart.model.Product',
                associationKey: 'products',
                foreignKey: 'cart_id',
                name: 'products',
                autoLoad: true,
                store: {
                    model: 'Cs.component.cart.model.Product',
                    autoLoad: true,

                    proxy: {
                        type: 'localstorage',
                        id: 'products'
                    }
                }
            }
        ]
    }
});
