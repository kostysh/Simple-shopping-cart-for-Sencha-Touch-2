/**
 * @filename ItemLine.js
 * @name Cart item line
 * @fileOverview Config for cart panel component DataView
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120707
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
         * These config fields should be equal to mapped data fields
         */
        product_id: false,
        img: false,
        text: false,
        description: false,
        price: false,
        weight: false,
        quantity: false,
        
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
    
    /**
     * Setup product thumbnail
     * @private
     */
    updateImg: function(newImg, oldImg) {
        var img = this.down('#image');

        if (oldImg) {
            img.setSrc('');
        }

        if (newImg) {
            img.setSrc(newImg);
        }
    },
    
    /**
     * Setup product name
     * @private
     */
    updateText: function(newText, oldText) {
        var text = this.down('#text');

        if (oldText) {
            text.setHtml('');
        }

        if (newText) {
            text.setHtml(newText);
        }
    },
    
    /**
     * Setup product price
     * @private
     */
    updatePrice: function(newPrice, oldPrice) {
        var price = this.down('#price');

        if (Ext.isDefined(oldPrice)) {
            price.setHtml('');
        }

        if (Ext.isDefined(newPrice)) {
            price.setHtml('Price: ' + 
                          newPrice + ' ' + 
                          Cs.Cart.getCurrency());
        }
    },
    
    /**
     * Setup product weight
     * @private
     */
    updateWeight: function(newWeight, oldWeight) {
        var weight = this.down('#weight');

        if (oldWeight) {
            weight.setHtml('');
        }

        if (newWeight) {
            weight.setHtml('Weight: ' + newWeight);
        }
    },
    
    /**
     * Setup product quantity
     * @private
     */
    updateQuantity: function(newQty, oldQty) {
        var qtyEl = this.down('#quantity');

        if (Ext.isDefined(oldQty)) {
            qtyEl.setValue(0);
            qtyEl.setId(this.getProduct_id());
            qtyEl.setLabel('');
        }

        if (Ext.isDefined(newQty)) {
            var price = this.getPrice();
            
            qtyEl.setValue(newQty);
            qtyEl.setId(this.getProduct_id());
            qtyEl.setLabel('Subtotal: ' + 
                           price * newQty + ' ' +
                           Cs.Cart.getCurrency());
        }
    }
});
