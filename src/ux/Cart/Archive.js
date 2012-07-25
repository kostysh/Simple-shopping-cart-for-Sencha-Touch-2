/**
 * @filename Archive.js
 * @name Panel for archive of submited carts
 * @fileOverview Config for archived carts panel
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120725
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.Panel  
 * @requires Ext.ux.Cart.src.Cart
 * @requires Ext.TitleBar
 * @requires Ext.Button
 * @requires cart.css With css classes: cart-archive, archive-date, archive-total
 * 
 */

Ext.define('Ext.ux.Cart.Archive', {
    extend: 'Ext.Panel',
    xtype: 'archpanel',
    id: 'archPanel',

    requires: [
        'Ext.TitleBar',
        'Ext.Button'
    ],

    config: {
        fullscreen: true,
        showAnimation: {
            type: 'slide'
        },
        zIndex: 0,
        
        /**
         * @cfg {String} cls
         * Cart panel container css style
         */        
        cls: 'cart-archive',
        
        /**
         * @cfg {String} titleText
         * Text on cart panel title
         */        
        titleText: 'Archive',
        
        /**
         * @cfg {String} closeBtnText
         * Text on close button
         */
        closeBtnText: 'Close',
        
        /**
         * @cfg {String} clearBtnText
         * Text on clear button
         */
        clearBtnText: 'Clear',
		
        layout: 'fit',
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                ui: 'light',
                title: ''
            },

            {
                xtype: 'toolbar',
                docked: 'bottom',

                items: [
                    {
                        id: 'closeArchBtn',
                        xtype: 'button',                        
                        text: ''
                    },

                    {
                        xtype: 'spacer'
                    },
                    
                    {
                        id: 'clearArchBtn',
                        xtype: 'button',                        
                        ui: 'action',
                        text: ''
                    }
                ]
            },
            
            {
                id: 'archList',
                xtype: 'list',
                itemTpl: '<div><span class="archive-date">{created}</span> ' + 
                         '<span class="archive-total">{total}</span></div>',
                onItemDisclosure: true,
                disableSelection: true
            }
        ]
    },
    
    /**
     * @private
     */
    updateTitleText: function(text) {
        if (text) {
            this.down('titlebar').setTitle(text);
        }
    },
    
    /**
     * @private
     */
    updateCloseBtnText: function(text) {
        if (text) {
            this.down('#closeArchBtn').setText(text);
        }
    },
    
    /**
     * @private
     */
    updateClearBtnText: function(text) {
        if (text) {
            this.down('#clearArchBtn').setText(text);
        }
    }
});
