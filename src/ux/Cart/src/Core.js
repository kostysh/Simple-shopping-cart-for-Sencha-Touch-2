/**
 * @filename Core.js
 * @name Simple shopping cart for Sencha Touch singleton prototype
 * @fileOverview Shopping cart manager singleton prototype
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120725
 * @version 1.1
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.Logger
 * @requires Ext.MessageBox
 * @requires Ext.data.Store
 * @requires Ext.data.StoreManager
 * @requires Ext.mixin.Observable
 * @requires Ext.data.proxy.WebStorage !!! Important. Fix for hasMany issue in 2.1.0 Beta
 * @requires Ext.ux.Cart.store.Cart
 * @requires Ext.ux.Cart.controller.Indicator
 * @requires Ext.ux.Cart.controller.Panel
 * 
 */

Ext.define('Ext.ux.Cart.src.Core', {
    mixins: {
        observable: 'Ext.mixin.Observable'
    },
    
    requires: [
        'Ext.Logger',
        'Ext.MessageBox',
        'Ext.data.Store',
        'Ext.data.StoreManager',        
        'Ext.ux.Cart.utils.WebStor',// Fix for hasMany issue in 2.1.0 Beta
                                          // @todo Looking for next SDK version and remove
        'Ext.ux.Cart.store.Cart'// @todo Move cart store require to controller
    ],
	
    /**
     * @event changed
     * Fired when cart is changed
     * @param {Ext.data.Model} cart Active cart record object
     */
	
    /**
     * @event submit
     * Fired when cart data is submitted
     * @param {Ext.data.Model} cart Active cart record object
     */

    config: {
        /**
         * @cfg {String} version Current shopping cart core version
         * @private
         */
        version: '1.1',
        
        /**
         * @cfg {Ext.data.Model} activeCart Link to current opened cart record
         * @private
         */
        activeCart: null,

        /**
         * @cfg {Ext.data.Store} activeProducts Link to cart products store
         * @private
         */
        activeProducts: null,

        /**
         * @cfg {String} currency Main currency
         */
        currency: 'MONEY',
        
        /**
         * @cfg {Object} models Cart models names
         */
        models: {
            cart: 'Ext.ux.Cart.model.Cart',
            product: 'Ext.ux.Cart.model.Product'
        },
        
        /**
         * @cfg {String/Ext.data.Store} store Cart store
         */
        store: 'Ext.ux.Cart.store.Cart',

        /**
         * @cfg {Boolean} encodeEnabled Send encoded cart data to callback
         *
         */
        encodeEnabled: true,

        /**
         * @cfg {Function} callback Cart submit callback
         * @param {String/Object} data JSON encoded or Object cart data
         */
        callback: Ext.emptyFn,
        
        /**
         * @cfg {string} productsStore 
         * Store with products (from app)
         */
        productsStore: null,
        
        formats: {
            ARCH_DATE: 'd F Y'
        },
        
        strings: {
            ARCH_CLEAR_CONFIRM: 'Are you want to clear carts archive?',
            ARCH_RESTORE_CONFIRM: 'Are you want to restore cart form {0}?',
            CART_REMOVE_PRODUCT: 'Are you want to remove this product from cart?',
            CART_CLEAR_CONFIRM: 'Are you want to remove all products from cart?'
        }
    },
    
    /**
     * Class constructor
     * @private
     */
    constructor: function(config) {
        this.initConfig(config);
        return this;
    },
	
    /**
     * Create new cart
     * @method create
     * @private
     */
    create: function() {
        var newCart = Ext.create(this.getModels().cart, {
            'created': new Date(),
            'active': true,
            'submited': 0
        });
        
        var store = this.getStore();

        store.add(newCart);
        store.sync();
        store.load();
    },
    
    /**
     * Deactivate current active cart
     * @method deactivate
     */
    deactivate: function() {
        this.getActiveCart().set('active', false);
        var store = this.getStore();
        store.sync();

        // Create and init new empty cart
        store.load();
    },

    /**
     * Add new record to cart (or update existed)
     * Shortcut to update method
     * @method add
     * @param {String} id Unique product Id
     * @param {Integer} qty Item quantity
     */
    add: function(id, qty) {
        return this.update(id, qty, true);
    },

    /**
     * Update cart item
     * @method update
     * @param {String} id Product Id (not record id)
     * @param {Integer} qty Item quantity
     * @param {Boolean} increment Quantity incrementation flag
     */
    update: function(id, qty, increment) {
        var activeProducts = this.getActiveProducts();
        var record = activeProducts.findRecord('product_id', id);

        if (record !== null) {
            record.join(activeProducts);
            
            var newQty;
            if (increment) {
                
                // Increase value of existed record
                newQty = record.get('quantity') + qty;
            } else {
                
                // Update record with new quantity value
                newQty = qty;
            }
            
            // Set new value of quantity for selected record
            record.set('quantity', newQty);
        } else {

            // Create new record
            activeProducts.add(Ext.create(this.getModels().product, {
                'product_id': id,
                'price': this.getProductById(id).get('price'),
                'quantity': qty
            }));
        }

        this.onCartChanged();
    },

    /**
     * Remove product record from cart by Id
     * @method remove
     * @param {String} id Product Id
     */
    remove: function(id) {
        var activeProducts = this.getActiveProducts();        
        var record = activeProducts.findRecord('product_id', id);
        
        if (record !== -1) {
            activeProducts.removeAt(activeProducts.indexOf(record));
            this.onCartChanged();            
        }
    },
    
    /**
     * Remove all products from cart
     * @method removeAll
     */
    removeAll: function() {
        this.getActiveProducts().removeAll();
        this.onCartChanged();
    },

    /**
     * Call cart submit callback and deactivate current cart on demand
     * @method submit
     */
    submit: function(callback, scope) {
        var self = this;
        var cartData = self.buildCartData(true);

        if (!Ext.isFunction(callback)) {
            callback = Ext.emptyFn;
        }

        if (!Ext.isObject(scope)) {
            scope = this;
        }

        if (this.getEncodeEnabled()) {
            cartData = Ext.encode(cartData);
        } 
				
        // @todo Move confirmation text to cart config
        Ext.Msg.confirm(null, 
                        'Are you want to clean cart after submit?', 
                        function(answer) {
            
            // Get submited value
            var cart = self.getActiveCart();
            var submited = cart.get('submited');
            
            // Set new submited value
            cart.set('submited', submited+1);
            self.getStore().sync();
            
            if (answer === 'yes') {
                
                // Deactivate current cart
                self.deactivate();
            }
            
            // Call predefined submit action
            self.fireAction('submit', [cartData], callback, scope)
        });
    },
	
    /**
     * Return count of items (products) in active cart
     * @method getProductsCount
     * @return {Integer} count
     */
    getProductsCount: function() {
        return this.getActiveProducts().getCount();
    },
	
    /**
     * Get total sum of products in active cart
     * @method getTotalSum
     * @param {String/undefined} cartId Cart id
     * @return {Float} total
     */
    getTotalSum: function(cartId) {
        var cartAll = [];
        var total = 0;
        
        if (typeof cartId === 'undefined') {
            cartAll = this.getActiveProducts().data.all;
        } else {
            var cart = this.getStore().findRecord('id', cartId);
            
            if (cart) {
                cartAll = cart.products().data.all;
            }            
        }
        
        for (var i in cartAll) {
            var cartItem = cartAll[i];            
            total += cartItem.get('price') * cartItem.get('quantity');
        }
        
        return total;
    },
    
    /**
     * Get product record by Id from products store
     * @param {String} id Product Id
     * @return {Object/null} Product record object
     * @method getProductById
     */
    getProductById: function(id) {
        var productsAll = this.getProductsStore().data.all;
        
        for (var i in productsAll) {
            var category = productsAll[i];
            var products = category.getProducts();
            var product = products.getById(id);
            
            if (product) {
                return product;
            }
        }
        
        return null;
    },
    
    /**
     * Build data Array for cart panel list store
     * @private
     * @method buildCartData
     * @param {Boolean} plain Enable plain cartData array output
     * @return {Array} cartData
     */
    buildCartData: function(plain) {
        var cartAll = this.getActiveProducts().data.all;
        var cartData = [];
        
        for (var i in cartAll) {
            var cartItem = cartAll[i];
            var product = this.getProductById(cartItem.get('product_id'));
            
            if (product) {
                if (plain) {
                    cartData[cartData.length] = Ext.apply({
                        'quantity': cartItem.get('quantity')
                    }, product.raw);
                } else {
                    cartData[cartData.length] = {
                        'product': Ext.apply({
                                       'quantity': cartItem.get('quantity')
                                   }, product.raw)
                    };
                }
                    
            }
        }

        return cartData;
    },
    
    /**
     * Called when cart is changed
     * @private
     */
    onCartChanged: function() {
        this.getActiveProducts().sync();
        this.getStore().sync();
        this.fireEvent('changed', [this.getActiveCart()]);
    },
    
    /**
     * Check for archived carts
     * @method isArchive
     * @return {Boolean}
     */    
    isArchive: function() {
        var record = this.getStore().find('active', false);
        
        if (record === -1) {
            return false;
        } else {
            return true;
        }
    },
    
    /**
     * Build data Array for archive store
     * @private
     * @method buildArchiveData
     * @return {Array} archData
     */
    buildArchiveData: function() {
        var carts = this.getStore().data.all;
        var archData = [];
        
        for (var i in carts) {
            var cart = carts[i];
            
            if (cart.get('active') === false) {
                archData[archData.length] = {
                    'id': cart.get('id'),
                    'created': cart.get('created'),
                    'total': Cart.getTotalSum(cart.get('id')) + ' ' + 
                             Cart.getCurrency(),
                    'submited': cart.get('submited')
                }
            }
        }
        
        return archData;
    }, 
    
    /**
     * Restore archived cart by Id
     * @method restore
     * @param {String} id Cart id
     */
    restore: function(id) {
        var store = this.getStore();
        
        if (this.getProductsCount() === 0) {
            
            // Remove current active empty cart
            store.removeAt(store.indexOf(this.getActiveCart()));
        } else {
            
            // Deactivate active non empty cart
            this.getActiveCart().set('active', false);
        }
        
        // Apply changes
        store.sync();
        
        // Find cart record for restore
        var cart = store.findRecord('id', id);

        if (cart) {
            cart.set('active', true);
            store.sync();
        }

        this.onStoreLoad();
        this.onCartChanged();
    },
    
    /**
     * Clear all archived carts
     * @method clearArchive
     */
    clearArchive: function() {
        var store = this.getStore();        
        
        // Work with cloned store because we will be change the original
        var carts = Ext.clone(store.data.all);
        
        for (var i in carts) {
            var cart = carts[i];
            
            if (cart.get('active') === false) {
                var products = cart.products();
                
                // Remove all products from archived cart
                products.removeAll();
                products.sync();
                
                // Remove archived cart
                store.removeAt(store.indexOf(cart));
                store.sync();
            }
        }
        
        // Refresh carts store
        store.load();
    },
    
    /**
     * Called when cart store is loaded
     * @private
     */
    onStoreLoad: function() {
        var store = this.getStore();
        
        // Search for active cart in store
        var activeCart = store.findRecord('active', true);
        
        // Looking for active cart record
        if (activeCart !== null) {
            this.setActiveCart(activeCart);
            this.setActiveProducts(activeCart.products());
            this.fireEvent('changed', [activeCart]);            
        } else {
            this.setActiveCart(null);
            this.setActiveProducts(null);
            
            // If active cart not found - create one
            return this.create();
        }
    },
    
    /**
     * @private
     */
    applyStore: function(storeName) {
		
        // Create and register cart store
        var store = Ext.create(storeName);

        if (store && Ext.isObject(store) && store.isStore) {

            // Listen for load event of cart store
            store.on({
                scope: this,
                load: this.onStoreLoad
            });
        } else {

        // <debug>
        Ext.Logger.warn('Cart data store cannot be found', this);
        // </debug>
        }

        return store;
    },
	
    /**
     * @private
     */
    updateStore: function(newStore, oldStore) {
        if (oldStore && Ext.isObject(oldStore) && oldStore.isStore) {

            // Unregister and destroy old cart store
            Ext.data.StoreManager.unregister(oldStore);
            oldStore.destroy();
        }

        if (newStore && Ext.isObject(newStore) && newStore.isStore) {

            // Register load new cart store
            Ext.data.StoreManager.register(newStore);
            newStore.load();
        }
    },

    /**
     * @private
     */
    applyProductsStore: function(storeName) {
        if (Ext.isEmpty(storeName)) {
            
            // <debug>
            Ext.Logger.warn('Products store not defined');
            // </debug>
        } else {
            var storeObj = Ext.data.StoreManager.lookup(storeName);

            if (!Ext.isObject(storeObj)) {
                
                // <debug>
                Ext.Logger.warn('Store with name "' + storeName + 
                                '" not found');
                // </debug>
            } else {
                return storeObj;
            }
        }
    },

    /**
     * @private
     */
    updateCallback: function(newFn, oldFn) {
        if (Ext.isFunction(oldFn)) {
            this.un({
                submit: oldFn
            });
        }

        if (Ext.isFunction(newFn)) {
            this.on({
                scope: this,
                submit: newFn
            });
        }
    }
});