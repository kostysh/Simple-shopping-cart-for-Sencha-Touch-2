/**
 * @filename Item.js
 * @name Item view
 * @fileOverview Config for default compoment for component DataView
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120629
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.dataview.component.DataItem
 * @requires Cs.component.cart.ItemLine
 * 
 */

Ext.define('Cs.component.cart.Item', {
    extend: 'Ext.dataview.component.DataItem',
    xtype: 'cartitem',

    requires: [
        'Cs.component.cart.ItemLine'
    ],

    config: {
        itemLine: true,
        
        // This config based on products data structure
        dataMap: {
            getItemLine: {
                setProduct_id: 'id',
                setImg: 'img_tmb',
                setText: 'text',
                setPrice: 'price',
                setWeight: 'weight',
                setQuantity: 'quantity'
            }
        }
    },
    
    /**
     * Create object for Item line component
     * @private
     */
    applyItemLine: function(config) {
        return Ext.factory(config, 
                           Cs.component.cart.ItemLine, 
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