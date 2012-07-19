/**
 * @filename ItemsList.js
 * @name Cart items list
 * @fileOverview Config for cart items list (component DataView)
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120719
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.DataView
 * @requires Cs.component.cart.Item
 * @requires cart.css With definition of cart-items-list css class
 * 
 */

Ext.define('Cs.component.cart.ItemsList', {
    extend: 'Ext.DataView',
    xtype: 'itemslist',

    requires: [
        'Cs.component.cart.Item'
    ],

    config: {
        useComponents: true,
        defaultType: 'cartitem',
        emptyText: 'Your cart is empty',// @todo Move emptyText to global cart config
        
        /**
         * @cfg {String} cls
         * Class for styling each line in dataview 
         */
        cls: 'cart-items-list',
        
        scrollable: 'vertical'
    }
});
