/**
 * @filename ItemLine.js
 * @name Cart item line
 * @fileOverview Config for cart panel component DataView
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120719
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Cs.component.cart.src.Cart Definition of Cart singleton
 * @requires Ext.Container
 * @requires Ext.Img 
 * @requires Ext.field.Spinner 
 * @requires cart.css With css classes: cart-item-thumb, cart-item-name, 
 *  cart-item-props, item-prop
 * 
 */

Ext.define('Cs.component.cart.ItemLine', {
    extend: 'Ext.Container',
    xtype: 'itemline',

    requires: [
        'Cs.component.cart.src.Cart',
        'Ext.Img',
        'Ext.field.Spinner'
    ],

    config: {
        
        /**
         * Object with product's data
         */
        product: false,
        
        layout: 'vbox',
        items: [
            {
                xtype: 'container',                
                
                layout: 'hbox',                
                items: [
                    
                    // Product thumbnail
                    {
                        itemId: 'image',
                        xtype: 'image',
                        mode: 'tag',
                        cls: 'cart-item-thumb'
                    },
                    
                    {
                        xtype: 'container',                        
                        flex: 1,
                        
                        layout: 'vbox',                        
                        items: [
                            
                            // Product name
                            {
                                itemId: 'text',
                                html: '',
                                cls: 'cart-item-name'
                            },
                            
                            // Product properties container
                            {
                                xtype: 'container',
                                cls: 'cart-item-props',
                                
                                layout: 'vbox',
                                items: [
                                    
                                    // Price property
                                    {
                                        itemId: 'price',
                                        html: '',
                                        cls: 'item-prop'
                                    },
                                    
                                    // Weight
                                    {
                                        itemId: 'weight',
                                        html: '',
                                        cls: 'item-prop'
                                    }
                                ]
                            }                                    
                        ]
                    }
                    
                ]
            },

            // Product quantity field
            {
                itemId: 'quantity',
                xtype: 'spinnerfield',
                label: '',
                labelWidth: '60%',
                labelWrap: true,
                labelAlign: 'right',
                increment: 1,
                minValue: 0,
                maxValue: 100
            }
        ]
    },
    
    beforeInitialize: function() {
        
        // Shortcuts to product template elements 
        this.quantityEl = this.down('#quantity');
        this.imageEl = this.down('#image');
        this.textEl = this.down('#text');
        this.priceEl = this.down('#price');
        this.weightEl = this.down('#weight');
    },
    
    /**
     * @private
     */
    updateProduct: function(product) {
        if (product) {
            
            // Update product template
            this.quantityEl.setId(product['id']);
            this.imageEl.setSrc(product['img_tmb']);
            this.textEl.setHtml(product['text']);
            this.priceEl.setHtml('Price: ' + 
                                 product['price'] + ' ' + 
                                 Cs.Cart.getCurrency());
            this.weightEl.setHtml('Weight: ' + product['weight']);
            this.quantityEl.setValue(product['quantity']);
            this.quantityEl.setLabel('Subtotal: ' + 
                                     product['price'] * product['quantity'] + ' ' +
                                     Cs.Cart.getCurrency());
        }
    }
});
