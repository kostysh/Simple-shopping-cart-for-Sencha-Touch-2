/**
 * @filename Panel.js
 * @name Cart panel controller
 * @fileOverview Config for shopping cart panel controller
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120719
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.app.Controller  
 * @requires Cs.component.cart.src.Cart
 * @requires Ext.data.Store
 * @requires Ext.MessageBox
 * 
 */

Ext.define('Cs.component.cart.controller.Panel', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.data.Store',
        'Ext.MessageBox'
    ],
    
    /**
     * @event itemslistupdated
     * Fired when cart items list is updated
     */
	
	/**
     * @event closed
     * Fired when cart panel is closed
     */
	
    config: {
        refs: {
            cartPanel: '#cartPanel',
            closeBtn: '#cartPanel #closeBtn',
            itemsList: '#cartPanel #cartItemsList',
            itemSpinner: '#cartPanel spinnerfield',
            totalSum: '#cartPanel #totalSum',
            clearBtn: '#cartPanel #clearBtn',
            submitBtn: '#cartPanel #submitBtn'
        },

        control: {
            cartPanel: {
                initialize: 'initializeCartPanel',
                painted: 'onCartPanelPainted'
            },
            
            itemSpinner: {
                spin: 'onItemSpinnerSpin'
            },
            
            closeBtn: {
                tap: 'onCloseBtnTap'
            },
            
            clearBtn: {
                tap: 'onClearBtnTap'
            },
            
            submitBtn: {
                tap: 'onSubmitBtnTap'
            }
        }
    },
    
    /**
     * Called when cart panel is initialized
     */
    initializeCartPanel: function() {
                
        // Subscribe to Cart changed event
        Cs.Cart.on({
            scope: this,
            changed: this.onCartPanelPainted
        });
    },
    
    /**
     * Called when cart panel is painted
     */
    onCartPanelPainted: function() {
        
        // Work if cart panel opened only
        if (this.getCartPanel().getHidden()) {
            return;
        }

        var itemsListView = this.getItemsList();
        var itemsData = Cs.Cart.buildCartData();
        
        // Disable some buttons if cart is empty
        if (itemsData.length === 0) {
            this.getClearBtn().disable();
            this.getSubmitBtn().disable();
        } else {
            this.getClearBtn().enable();
            this.getSubmitBtn().enable();
        }
        
        // Create new Store for cart items list 
        var cartItemsStore = Ext.create('Ext.data.Store', {
            fields: ['product'],
            data: itemsData
        });
        
        itemsListView.setStore(cartItemsStore);
        
        this.getTotalSum().setHtml(Cs.Cart.getTotalSum() + ' ' + 
                                   Cs.Cart.getCurrency());
        
        this.fireEvent('itemslistupdated');
    },
    
    /**
     * Change item in cart panel by id
     */
    changeItem: function(id, qty) {
        
        // Get and remember last scroller Y position
        var scroller = this.getItemsList().getScrollable().getScroller();
        var lastPosY = scroller.position.y;
        
        // Listen for itemslistupdated event
        this.on({
            single: true,
            itemslistupdated: function() {
                
                // Restore scroller position after item was updated
                scroller.scrollTo(0, lastPosY);
            }
        });
        
        // Save updated qty value
        // spinField has id equal product_id
        Cs.Cart.update(id, qty);
    },
    
    /**
     * Remove item from cart by id
     */
    removeItem:  function(id) {
        Cs.Cart.remove(id);
    },
    
    /**
     * Called when spinner is tapped
     */
    onItemSpinnerSpin: function(spinField, qty) {
        var self = this;
        var id = spinField.getId();
        
        if (qty === 0) {
            
            // Show deletion confirmation dialog if current qty === 0
            // @todo Move confirmation string to config
            Ext.Msg.confirm(null, 
                            'Are you want to remove this product from cart?', 
                            function(answer) {
                            
                if (answer === 'yes') {
                    self.removeItem(id);
                } else {
                    self.changeItem(id, qty);
                }
            });
        } else {
            self.changeItem(id, qty);
        }       
    },
    
    /**
     * Called when close button is tapped
     */
    onCloseBtnTap: function() {
        var cartPanel = this.getCartPanel();
        cartPanel.hide();
        cartPanel.fireEvent('closed');
    },
    
    /**
     * Called when clear button is tapped 
     */
    onClearBtnTap: function() {
        var self = this;
        
        // <debug>
        //localStorage.clear();
        // </debug>
        
        // Show clear confirmation dialog
        // @todo Move clear confirmation string to config
        Ext.Msg.confirm(null, 
                        'Are you want to remove all products from cart?', 
                        function(answer) {

            if (answer === 'yes') {
                Cs.Cart.removeAll();
                self.onCloseBtnTap();
            }
        });        
    },
    
    /**
     * Called when submit button is tapped
     */
    onSubmitBtnTap: function() {
        
        // Submit cart data with callback and close cart panel
        Cs.Cart.submit(this.onCloseBtnTap, this);
    }
});
