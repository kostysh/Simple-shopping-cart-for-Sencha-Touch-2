/**
 * @filename Panel.js
 * @name Panel for Cart 
 * @fileOverview Config for shopping cart content panel view
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120628
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.Panel  
 * @requires Cs.component.cart.src.Cart
 * @requires Cs.component.cart.ItemsList
 * @requires Ext.TitleBar
 * @requires Ext.Button
 * @requires cart.css With css classes: cart-panel, cart-panel-totalbar > title > total
 * 
 */

Ext.define('Cs.component.cart.Panel', {
    extend: 'Ext.Panel',
    xtype: 'cartpanel',
    id: 'cartPanel',

    requires: [
        'Cs.component.cart.src.Cart',
        'Cs.component.cart.ItemsList',
        'Ext.TitleBar',
        'Ext.Button'
    ],

    config: {
        fullscreen: true,
        showAnimation: {
            type: 'slide'
        },
        
        /**
         * @cfg {String} cls
         * Cart panel container css style
         */        
        cls: 'cart-panel',
        
        /**
         * @cfg {String} titleText
         * Text on cart panel title
         */        
        titleText: 'Cart',
        
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
        
        /**
         * @cfg {String} submitBtnText
         * Text on submit button
         */
        submitBtnText: 'Submit',
		
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
                        id: 'closeBtn',
                        xtype: 'button',                        
                        text: ''
                    },

                    {
                        xtype: 'spacer'
                    },
                    
                    {
                        id: 'clearBtn',
                        xtype: 'button',                        
                        ui: 'action',
                        text: ''
                    },

                    {
                        id: 'submitBtn',
                        xtype: 'button',                        
                        ui: 'confirm',
                        text: ''
                    }
                ]
            },

            {
                xtype: 'container',
                docked: 'bottom', 
                cls: 'cart-panel-totalbar',
                
                layout: {
                    type: 'hbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [
                    {
                        html: 'Total:',
                        cls: 'title',
                        flex: 1
                    },

                    {
                        id: 'totalSum',
                        html: '',
                        flex: 2,
                        cls: 'total'
                    }
                ]
            },
            
            // List with cart items
            {
                xtype: 'itemslist',
                id: 'cartItemsList'
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
            this.down('#closeBtn').setText(text);
        }
    },
    
    /**
     * @private
     */
    updateClearBtnText: function(text) {
        if (text) {
            this.down('#clearBtn').setText(text);
        }
    },
    
    /**
     * @private
     */
    updateSubmitBtnText: function(text) {
        if (text) {
            this.down('#submitBtn').setText(text);
        }
    }
});
