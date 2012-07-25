/**
 * @filename Panel.js
 * @name Cart panel controller
 * @fileOverview Config for shopping cart panel controller
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120725
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.app.Controller  
 * @requires Ext.ux.Cart.src.Cart
 * @requires Ext.data.Store
 * @requires Ext.MessageBox
 * 
 */

Ext.define('Ext.ux.Cart.controller.Panel', {
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
        views: [
            'Ext.ux.Cart.Panel',
            'Ext.ux.Cart.Archive'
        ],
        
        archiveView: 'Ext.ux.Cart.Archive',
        
        refs: {
            cartPanel: '#cartPanel',
            closeBtn: '#cartPanel #closeBtn',
            itemsList: '#cartPanel #cartItemsList',
            itemSpinner: '#cartPanel spinnerfield',
            totalSum: '#cartPanel #totalSum',
            clearBtn: '#cartPanel #clearBtn',
            submitBtn: '#cartPanel #submitBtn',
            archPanel: '#archPanel',
            archBtn: '#archBtn'
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
            },
            
            archPanel: {
                closed: 'refreshArchBtn'
            },
            
            archBtn: {
                initialize: 'initializeArchBtn',
                tap: 'onArchBtnTap'            
            }
        }
    },
    
    /**
     * Called when cart panel is initialized
     */
    initializeCartPanel: function() {
                
        // Subscribe to Cart changed event
        Cart.on({
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
        var itemsData = Cart.buildCartData();
        
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
        
        this.getTotalSum().setHtml(Cart.getTotalSum() + ' ' + 
                                   Cart.getCurrency());
        
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
        Cart.update(id, qty);
    },
    
    /**
     * Remove item from cart by id
     */
    removeItem:  function(id) {
        Cart.remove(id);
    },
    
    /**
     * Called when spinner is tapped
     */
    onItemSpinnerSpin: function(spinField, qty) {
        var self = this;
        var id = spinField.getId();
        
        if (qty === 0) {
            
            // Show deletion confirmation dialog if current qty === 0
            Ext.Msg.confirm(null, 
                            Cart.getStrings().CART_REMOVE_PRODUCT, 
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
        
        // Show clear confirmation dialog
        Ext.Msg.confirm(null, 
                        Cart.getStrings().CART_CLEAR_CONFIRM, 
                        function(answer) {

            if (answer === 'yes') {
                Cart.removeAll();
                self.onCloseBtnTap();
            }
        });        
    },
    
    /**
     * Called when submit button is tapped
     */
    onSubmitBtnTap: function() {
        
        // Submit cart data with callback and close cart panel
        Cart.submit(this.onCloseBtnTap, this);
    },
    
    /**
     * Called when archive button is initialized
     */
    initializeArchBtn: function() {
        
        // Subscribe to Cart changes
        Cart.on({
            scope: this,
            changed: this.refreshArchBtn
        });
        
        // Refresh Indicator badges on start
        this.refreshArchBtn();
    },
    
    /**
     * Called when cart is changed
     */
    refreshArchBtn: function() {
        var archBtn = this.getArchBtn();
        
        if (Cart.isArchive()) {
            
            // Enable cart archive button
            archBtn.enable();
        } else {
            
            // Disable cart archive button
            archBtn.disable();
        }
    },
    
    /**
     * Called when archive button is tapped
     */
    onArchBtnTap: function(archBtn) {
                
        // Disable archive button while archive panel is open
        archBtn.disable();
        
        // Use created view or create new
        var archPanel = this.getArchPanel() ||
                        Ext.create(this.getArchiveView());
                
        // Add cart panel to viewport and show 
        Ext.Viewport.add(archPanel);
        archPanel.show();
    }
});
