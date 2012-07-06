/**
 * @filename Indicator.js
 * @name Indicator for Simple Cart 
 * @fileOverview Shopping cart indicator. Ext.Button based component 
 *  with extra badge for displaying total sum
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120628
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.Button component 
 * @requires cart.css badge-total class
 * 
 * Usage:
   
   // Indicator config...
    {
        xtype: 'cartbtn',
        align: 'right',
        iconCls: 'download',
        iconMask: true
    }
 
 *
 */

Ext.define('Cs.component.cart.Indicator', {
    extend: 'Ext.Button',
    xtype: 'cartbtn',
    id: 'cartBtn',
    
    /**
     * Override for Ext.Button template property 
     */
    template: [
        {
            tag: 'span',
            reference: 'badgeElement',
            hidden: true
        },
        {
            tag: 'span',
            className: 'badge-total',
            reference: 'totalElement',
            hidden: true
        },
        {
            tag: 'span',
            className: Ext.baseCSSPrefix + 'button-icon',
            reference: 'iconElement',
            hidden: true
        },
        {
            tag: 'span',
            reference: 'textElement',
            hidden: true
        }
    ],

    config: {
        
        /**
         * @cfg {String} text 
         * Text label on button
         */
        text: 'Cart',
        
        /**
         * @cfg {String} ui 
         * Button ui
         */
        ui: 'round',
        
        /**
         * @cfg {String} totalBadgeText
         * Text for tatalBadge
         * @private
         */
        totalBadgeText: null,

        /**
         * @cfg {String} iconCls
         * Icon style class
         */
        iconCls: 'cart',        
        iconMask: true
    },
    
    /**
     * @private
     */
    updateTotalBadgeText: function(newText) {
        if (newText && newText !== 0) {
            this.totalElement.show();
            this.totalElement.setText(newText);
        } else {
            this.totalElement.hide();
            this.totalElement.setText('');
        }
    }
});
