/**
 * @filename Cart.js
 * @name Cart store
 * @fileOverview Config for cart LocalStorage store
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120629
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.data.Store
 * @requires Ext.data.proxy.LocalStorage
 * @requires Cs.component.cart.model.Cart
 * 
 */

Ext.define('Cs.component.cart.store.Cart', {
    extend: 'Ext.data.Store',

    requires: [
        'Ext.data.proxy.LocalStorage',
        'Cs.component.cart.model.Cart'
    ],

    config: {
        model: 'Cs.component.cart.model.Cart',

        proxy: {
            type: 'localstorage',
            id: 'carts'
        }
    }
});
