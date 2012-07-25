/**
 * @filename Indicator.js
 * @name Controller for shopping cart Indicator
 * @fileOverview Controller for Indicator component
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120725
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.app.Controller
 * @requires Ext.ux.Cart.src.Cart Cart singleton
 * @requires Ext.ux.Cart.Indicator Indicator view
 * @requires Ext.ux.Cart.Panel Cart panel view 
 * 
 */

Ext.define('Ext.ux.Cart.controller.Indicator', {
    extend: 'Ext.app.Controller',

    /**
     * @event updated
     * Fires whenever the Indicator badges are updated
     */
    
    config: {
        views: [
            'Ext.ux.Cart.Indicator',
            'Ext.ux.Cart.Panel'
        ],
        
        panelView: 'Ext.ux.Cart.Panel',
        
        refs: {
            cartBtn: '#cartBtn',
            cartPanel: '#cartPanel'
        },

        control: {
            cartBtn: {
                initialize: 'initializeIndicator',
                tap: 'onBtnTap'            
            },
            
            cartPanel: {
                closed: 'refreshIndicator'
            }
        }
    },
    
    /**
     * @private
     */
    initializeIndicator: function() {
        
        // Subscribe to Cart changes
        Cart.on({
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
        var cartBtn = this.getCartBtn();
        cartBtn.enable();
        
        var itemsCount = Cart.getProductsCount();
        
        if (itemsCount > 0) {
            
            // View cart info on badges
            cartBtn.setBadgeText(itemsCount);
            cartBtn.setTotalBadgeText(Cart.getTotalSum());            
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
    onBtnTap: function(cartBtn) {
        
        // Disable indicator button while cart  is open
        cartBtn.disable();
        
        // Use created view or create new
        var cartPanel = this.getCartPanel() ||
                        Ext.create(this.getPanelView());
                
        // Add cart panel to viewport and show 
        Ext.Viewport.add(cartPanel);
        cartPanel.show();
    }
});
