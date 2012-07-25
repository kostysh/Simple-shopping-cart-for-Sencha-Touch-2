/**
 * @filename Cart.js
 * @name Cart data model
 * @fileOverview Config for cart data model
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120725
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.data.Model
 * @requires Ext.data.proxy.LocalStorage
 * @requires Ext.data.identifier.Uuid
 * @requires Ext.ux.Cart.model.Product
 * 
 */

Ext.define('Ext.ux.Cart.model.Cart', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.proxy.LocalStorage',
        'Ext.ux.Cart.model.Product',
        'Ext.data.identifier.Uuid'
    ],

    config: {
        fields: [
            {name: 'id', type: 'string'},// Generated unique cart identifier
            {name: 'created', type: 'date'},// Created date
            {name: 'active', type: 'boolean'},// Cart status
            {name: 'submited', type: 'integer'},// Count of cart submits
        ],

        idProperty: 'id',

        identifier: {
            type: 'uuid'
        },

        associations: [
            {
                type: 'hasMany',
                model: 'Ext.ux.Cart.model.Product',
                associationKey: 'products',
                foreignKey: 'cart_id',
                name: 'products',
                autoLoad: true,
                store: {
                    model: 'Ext.ux.Cart.model.Product',
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
