/**
 * @filename Cart.js
 * @name Shopping cart manager singleton
 * @fileOverview Define a singltone from core class
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120725
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.ux.Cart.src.Core
 * 
 */

Ext.define('Ext.ux.Cart.src.Cart', {
    extend: 'Ext.ux.Cart.src.Core',
    alternateClassName: 'Cart', // Use this shortcut for access singleton in your app
    singleton: true
});