/**
 * @filename Cart.js
 * @name Cart store
 * @fileOverview Config for cart LocalStorage store
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120725
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.data.Store
 * @requires Ext.data.proxy.LocalStorage
 * @requires Ext.ux.Cart.model.Cart
 * 
 */

Ext.define('Ext.ux.Cart.store.Cart', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.LocalStorage',
        'Ext.ux.Cart.model.Cart'
    ],

    config: {
        model: 'Ext.ux.Cart.model.Cart',

        proxy: {
            type: 'localstorage',
            id: 'carts'
        }
    }
});
