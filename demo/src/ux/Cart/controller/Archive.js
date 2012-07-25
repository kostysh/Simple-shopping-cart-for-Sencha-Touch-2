/**
 * @filename Archive.js
 * @name Archive panel controller
 * @fileOverview Config for archive panel controller
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
 * @requires Ext.Template
 * 
 */

Ext.define('Ext.ux.Cart.controller.Archive', {
    extend: 'Ext.app.Controller',

    requires: [
        'Ext.MessageBox',
        'Ext.data.Store',
        'Ext.Template'
    ],
    
    config: {
        refs: {
            archPanel: '#archPanel',
            closeBtn: '#archPanel #closeArchBtn',
            clearBtn: '#archPanel #clearArchBtn',
            archList: '#archPanel #archList'
        },

        control: {
            archPanel: {
                initialize: 'initializeArchPanel',
                painted: 'onArchPanelPainted'
            },
            
            closeBtn: {
                tap: 'onCloseBtnTap'
            },
            
            clearBtn: {
                tap: 'onClearBtnTap'
            },
            
            archList: {
                disclose: 'onArchListDisclose'
            }
        }
    },
    
    /**
     * Called when archive panel is initialized
     */
    initializeArchPanel: function() {
                
        // Subscribe to Cart changed event
        Cart.on({
            scope: this,
            changed: this.onArchPanelPainted
        });
    },
    
    /**
     * @private
     */
    convertDate: function(date) {
        return Ext.Date.format(date, Cart.getFormats().ARCH_DATE);
    },
    
    /**
     * Called when archive panel is painted
     */
    onArchPanelPainted: function() {
        var archList = this.getArchList();        
        archList.setStore(Ext.create('Ext.data.Store', {
            fields: [
                {name: 'id', type: 'string'},
                {name: 'created', convert: this.convertDate},
                {name: 'total', type: 'string'},
                {name: 'submited', type: 'integer'}
            ],
            data: Cart.buildArchiveData(),
            sorters: [
                {
                    property: 'submited',
                    direction: 'DESC'
                }
            ]
        }));        
    },
    
    /**
     * Called when close button is tapped
     */
    onCloseBtnTap: function() {
        var archPanel = this.getArchPanel();
        archPanel.hide();
        archPanel.fireEvent('closed');
    },
    
    /**
     * Called when clear button is tapped 
     */
    onClearBtnTap: function() {
        var self = this;
        
        // Show clear confirmation dialog
        Ext.Msg.confirm(null, 
                        Cart.getStrings().ARCH_CLEAR_CONFIRM, 
                        function(answer) {

            if (answer === 'yes') {
                Cart.clearArchive();
                self.onCloseBtnTap();
            }
        });        
    },
    
    /**
     * Called when archive list disclosed
     */
    onArchListDisclose: function(list, record) {
        var self = this;
        
        var dialog = new Ext.Template(Cart.getStrings().ARCH_RESTORE_CONFIRM);
        Ext.Msg.confirm(null, 
                        dialog.apply([record.get('created')]), 
                        function(answer) {

            if (answer === 'yes') {
                Cart.restore(record.get('id'));
                self.onCloseBtnTap();
            } 
        });
    }
});
