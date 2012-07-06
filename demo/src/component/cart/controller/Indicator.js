/**
 * @filename Indicator.js
 * @name Controller for shopping cart Indicator
 * @fileOverview Controller for Indicator component
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120628
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.app.Controller
 * @requires Cs.component.cart.src.Cart Definition of Cart singleton
 * @requires Cs.component.cart.Indicator Indicator view
 * @requires Cs.component.cart.Panel Cart panel view 
 * 
 */

Ext.define('Cs.component.cart.controller.Indicator', {
    extend: 'Ext.app.Controller',

    requires: [
        'Cs.component.cart.src.Cart'
    ],
    
    /**
     * @event updated
     * Fires whenever the Indicator badges are updated
     */
    
    config: {
        views: [
            'Cs.component.cart.Indicator',
            'Cs.component.cart.Panel'
        ],
        
        refs: {
            cartBtn: '#cartBtn'
        },

        control: {
            cartBtn: {
                initialize: 'initializeIndicator',
                tap: 'onBtnTap'            
            }
        }
    },
    
    /**
     * @private
     */
    initializeIndicator: function() {
        
        // Subscribe to Cart changes
        Cs.Cart.on({
            scope: this,
            changed: this.refreshIndicator
        });
        
        // Refresh Indicator badges on start
        this.refreshIndicator();
    },
    
    /**
     * @private
     */
    refreshIndicator: function() {
        var cartBtn = this.getCartBtn(),        
            itemsCount = Cs.Cart.getItemsCount();
        
        if (itemsCount > 0) {
            
            // View cart info on badges
            cartBtn.setBadgeText(itemsCount);
            cartBtn.setTotalBadgeText(Cs.Cart.getTotalSum());            
        } else {
            
            // Hide all badges
            cartBtn.setBadgeText(null);
            cartBtn.setTotalBadgeText(null);
        }
        
        cartBtn.fireEvent('updated');
    },
    
    /**
     * @private
     */
    onBtnTap: function() {
        var cartBtn = this.getCartBtn();
        
        // Disable indicator button while panel is open
        cartBtn.setDisabled(true);
        
        // Use created view or create new
        var cartPanel = Ext.getCmp('cartPanel') ||
                        Ext.create('Cs.component.cart.Panel');
        
        cartPanel.on({
            single: true,
            
            // Enable indicator then cart panel is closed
            closed: function() {
                cartBtn.setDisabled(false);
            }
        });
        
        // Add cart panel to viewport and show 
        Ext.Viewport.add(cartPanel);
        cartPanel.show();
    }
});
