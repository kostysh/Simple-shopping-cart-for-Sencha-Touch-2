/**
 * @filename Cart.js
 * @name Simple shopping cart for Sencha Touch
 * @fileOverview Shopping cart manager singleton
 * 
 * @author Constantine V. Smirnov kostysh(at)gmail.com
 * @date 20120629
 * @license GNU GPL v3.0
 *
 * @requires Sencha Touch 2.0 SDK http://www.sencha.com/products/touch/
 * @requires Ext.Logger
 * @requires Ext.MessageBox
 * @requires Ext.data.Store
 * @requires Ext.data.StoreManager
 * @requires Ext.mixin.Observable
 * @requires Ext.data.proxy.WebStorage !!! Important. Fix for hasMany issue in 2.0.1.1
 * @requires Cs.component.cart.store.Cart
 * @requires Cs.component.cart.controller.Indicator
 * @requires Cs.component.cart.controller.Panel
 * 
 */

Ext.define('Cs.component.cart.src.Cart', {
    alternateClassName: 'Cs.Cart', // Use this shortcut for access singleton in your app
    mixins: {
        observable: 'Ext.mixin.Observable'
    },
    singleton: true,

    requires: [
        'Ext.Logger',
        'Ext.MessageBox',
        'Ext.data.Store',
        'Ext.data.StoreManager',        
        'Cs.component.cart.utils.WebStor',// Fix for hasMany issue in 2.0.1.1
                                          // @todo Looking for next SDK version and remove
        'Cs.component.cart.store.Cart'
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
         * @cfg {String/Ext.data.Store} store Cart store
         */
        store: 'Cs.component.cart.store.Cart',

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
        productsStore: null
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
     * @private
     */
    create: function() {
        var newCart = Ext.create('Cs.component.cart.model.Cart', {
            'created': new Date(),
            'active': true
        });
        
        var store = this.getStore();

        store.add(newCart);
        store.sync();
        store.load();
        this.onCartChanged();
    },
    
    /**
     * Deactivate current active cart
     */
    deactivate: function() {
		this.getActiveCart().set('active', false);
		this.getStore().sync();
		
		// Create and init new empty cart
		this.onStoreLoad();
	},

    /**
     * Add new record to cart (or update existed)
     * Shortcut to add method
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
            activeProducts.add(Ext.create('Cs.component.cart.model.Product', {
                'product_id': id,
                'price': this.getProductById(id).get('price'),
                'quantity': qty
            }));
        }

        this.onCartChanged();
    },

    /**
     * Remove product record from cart
     * @method remove
     * @param {String} id Product Id
     */
    remove: function(id) {
        var record = this.getActiveProducts().findRecord('product_id', id);

        if (record !== null) {
            record.destroy();
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
        var cartData = self.buildCartData();

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

            if (answer === 'yes') {
                self.deactivate();
            }
            
            // Call predefined submit action
            self.fireAction('submit', [cartData], callback, scope)
        }); 
    },
	
	/**
	 * Return count of items (products) in active cart
	 * @method getItemsCount
	 */
    getItemsCount: function() {
        return this.getActiveProducts().getCount();
    },
	
	/**
	 * Get total sum of products in active cart
	 * @method getTotalSum
	 */
    getTotalSum: function() {
        var cartAll = this.getActiveProducts().data.all;
        var total = 0;
        
        for (var i in cartAll) {
            var cartItem = cartAll[i];            
            total += cartItem.get('price') * cartItem.get('quantity');
        }
        
        return total;
    },
    
    /**
     * Get product record by Id
     * from products store
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
     * @method buildCartData
     */
    buildCartData: function() {
        var cartAll = this.getActiveProducts().data.all;
        var cartData = [];
        
        for (var i in cartAll) {
            var cartItem = cartAll[i];
            var product = this.getProductById(cartItem.get('product_id'));
            
            if (product) {
                cartData[cartData.length] = Ext.apply({
                    'quantity': cartItem.get('quantity')
                }, product.raw);
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
     * Called when cart store is loaded
     * @private
     */
    onStoreLoad: function() {
		var store = this.getStore();
        
        // Search for active cart in store
        var activeCart = store.findRecord('active', true);
		
        // Check if store not empty and get the active cart record
        if (!store.getCount() || activeCart === null) {
            this.setActiveCart(null);
            this.setActiveProducts(null);
            this.create();
        } else {
            this.setActiveCart(activeCart);
            this.setActiveProducts(activeCart.products());
        }
    },
    
    /**
     * @private
     */
    applyStore: function(storeName) {
		
		// Create and register cart store
        var store = Ext.create('Cs.component.cart.store.Cart');
        
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
                Ext.Logger.warn('Store with name "' + storeName + '" not found');
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
