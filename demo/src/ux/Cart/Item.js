/**
 * @filename Item.js
 * @name Item view
 * @fileOverview Config for default compoment for component DataView
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120725
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.dataview.component.DataItem
 * @requires Ext.ux.Cart.ItemLine
 * 
 */

Ext.define('Ext.ux.Cart.Item', {
    extend: 'Ext.dataview.component.DataItem',
    xtype: 'cartitem',

    requires: [
        'Ext.ux.Cart.ItemLine'
    ],

    config: {
        itemLine: true,
        
        // Map product's data to dataItem setter
        dataMap: {
            getItemLine: {
                setProduct: 'product'
            }
        }
    },
    
    /**
     * Create object for Item line component
     * @private
     */
    applyItemLine: function(config) {
        return Ext.factory(config, 
                           Ext.ux.Cart.ItemLine, 
                           this.getItemLine());
    },
    
    /**
     * Add or remove lines
     * @private
     */
    updateItemLine: function(newItemLine, oldItemLine) {
        if (oldItemLine) {
            this.remove(oldItemLine);
        }

        if (newItemLine) {
            
            // Attach lines to DataView
            this.add(newItemLine);
        }
    }
});