/**
 * @author Grgur Grisogono
 *
 * IndexedDB proxy connects models and stores to local IndexedDB storage. 
 *
 * IndexedDB is only available in Firefox 4+ and Chrome 10+ at the moment.
 * 
 * Version: 0.5
 *
 * TODO: respect sorters, filters, start and limit options on the Operation; failover option for remote proxies, ..
 */
 
if (window.indexedDB) {

} else {
	// Initialising the window.indexedDB Object for FireFox
	if (window.mozIndexedDB) {
		window.indexedDB = window.mozIndexedDB;
		
	} else if (window.webkitIndexedDB) {
			// Initialising the window.indexedDB Object for Chrome
			window.indexedDB = window.webkitIndexedDB;
			
			window.IDBTransaction = window.webkitIDBTransaction;
			window.IDBKeyRange = window.webkitIDBKeyRange;
			window.IDBCursor = window.webkitIDBCursor;
			window.IDBDatabase = window.webkitIDBDatabase;
			//window.IDBDatabaseError = window.webkitIDBDatabaseError;
			window.IDBDatabaseException = window.webkitIDBDatabaseException;
			//window.IDBErrorEvent = window.webkitIDBErrorEvent;
			//window.IDBEvent = window.webkitIDBEvent;
			window.IDBFactory = window.webkitIDBFactory;
			window.IDBIndex = window.webkitIDBIndex;
			window.IDBKeyRange = window.webkitIDBKeyRange;
			window.IDBObjectStore = window.webkitIDBObjectStore;
			window.IDBRequest = window.webkitIDBRequest;
			//window.IDBSuccessEvent = window.webkitIDBSuccessEvent;
			window.IDBTransaction = window.webkitIDBTransaction;

		} else if (window.msIndexedDB) {
			// Initialiseing the window.indexedDB Object for IE 10 preview 3+
			window.indexedDB = window.msIndexedDB;

		} else if (navigator.appName == 'Microsoft Internet Explorer') {
			// Initialising the window.indexedDB Object for IE 8 & 9
                try {
                    window.indexedDB = new ActiveXObject("SQLCE.Factory.4.0");
                    window.indexedDBSync = new ActiveXObject("SQLCE.FactorySync.4.0");
                }
                catch (ex) {
                    console.log("Initializing IE prototype exception", ex);
                }

                if (window.JSON) {
                    window.indexedDB.json = window.JSON;
                    window.indexedDBSync.json = window.JSON;
                } else {
                    var jsonObject = {
                        parse: function (txt) {
                            if (txt === "[]") return [];
                            if (txt === "{}") return {};
                            throw { message: "Unrecognized JSON to parse: " + txt };
                        }
                    };
                    window.indexedDB.json = jsonObject;
                    window.indexedDBSync.json = jsonObject;
                }

                // Add some interface-level constants and methods.
                window.IDBDatabaseException = {
                    UNKNOWN_ERR: 0,
                    NON_TRANSIENT_ERR: 1,
                    NOT_FOUND_ERR: 2,
                    CONSTRAINT_ERR: 3,
                    DATA_ERR: 4,
                    NOT_ALLOWED_ERR: 5,
                    SERIAL_ERR: 11,
                    RECOVERABLE_ERR: 21,
                    TRANSIENT_ERR: 31,
                    TIMEOUT_ERR: 32,
                    DEADLOCK_ERR: 33
                };

                window.IDBKeyRange = {
                    SINGLE: 0,
                    LEFT_OPEN: 1,
                    RIGHT_OPEN: 2,
                    LEFT_BOUND: 4,
                    RIGHT_BOUND: 8
                };

                window.IDBRequest = {
                    INITIAL: 0,
                    LOADING: 1,
                    DONE: 2
                };

                window.IDBTransaction = {
                    READ_ONLY: 0,
                    READ_WRITE: 1,
                    VERSION_CHANGE: 2
                };

                window.IDBKeyRange.only = function (value) {
                    return window.indexedDB.range.only(value);
                };

                window.IDBKeyRange.leftBound = function (bound, open) {
                    return window.indexedDB.range.lowerBound(bound, open);
                };

                window.IDBKeyRange.rightBound = function (bound, open) {
                    return window.indexedDB.range.upperBound(bound, open);
                };

                window.IDBKeyRange.bound = function (left, right, openLeft, openRight) {
                    return window.indexedDB.range.bound(left, right, openLeft, openRight);
                };

                window.IDBKeyRange.lowerBound = function (left, openLeft) {
                    return window.IDBKeyRange.leftBound(left, openLeft);
                };
				
	} else {
	}
	
}

Ext.define('Ext.data.proxy.IndexedDB', {
    extend              : 'Ext.data.proxy.Proxy',

    alias               : 'proxy.idb',

    alternateClassName  : 'Ext.data.IdbProxy',

    /**
     * @cfg {String} version
     * database version. If different than current, use updatedb event to update database
     */
    dbVersion           : '1.0',

    /**
     * @cfg {String} dbName
     * Name of database
     */
    dbName              : undefined,

    /**
     * @cfg {String} objectStoreName
     * Name of object store
     */
    objectStoreName     : undefined,

    /**
     * @cfg {String} keyPath
     * Primary key for objectStore. Proxy will use reader's idProperty if not keyPath not defined. 
     */
    keyPath             : undefined,
    
    /**
     * @cfg {Boolean} autoIncrement
     * Set true if keyPath is to autoIncrement. Defaults to IndexedDB default specification (false)
     */
    autoIncrement       : false,
    
    /**
     * @cfg {Array} indexes
     * Array of Objects. Properties required are "name" for index name and "field" to specify index field
     * e.g. indexes: [{name: 'name', field: 'somefield', options: {unique: false}}]
     */
    indexes             : [],
    
    /**
     * @cfg {Array} initialData
     * Initial data that will be inserted in object store on store creation
     */
    initialData         : [],
    
    /**
     * @private
     * indexedDB object (if browser supports it)
     */
    indexedDB           : window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB,

    /**
     * @private
     * db object
     */
    db                  : undefined,

    /**
     * @private
     * used to monitor initial data insertion. A helper to know when all data is in. Helps fight asynchronous nature of idb. 
     */
    initialDataCount    : 0,
    
    /**
     * @private
     * Trigger that tells that proxy is currently inserting initial data
     */
    insertingInitialData: false,
    
    /**
     * Creates the proxy, throws an error if local storage is not supported in the current browser.
     * @param {Object} config (optional) Config object.
     */
    constructor: function(config) {
        this.callParent(arguments);
        
        this.checkDependencies();

        this.addEvents('dbopen', 'updatedb','exception', 'cleardb', 'initialDataInserted', 'noIdb');

        //<debug>
        //fix old webkit references
        if ('webkitIndexedDB' in window) {
          window.IDBTransaction = window.webkitIDBTransaction;
          window.IDBKeyRange = window.webkitIDBKeyRange;
        }
        //</debug>

        this.initialize();
    },

    /**
     * @private
     * Sets up the Proxy by opening database and creatinbg object store if necessary
     */
    initialize: function() {
        var me      = this,
            request = me.indexedDB.open(me.dbName);
            
        me.on('updatedb', me.addInitialData);
        
        request.onsuccess = function(e) {
            var db      = me.db = me.indexedDB.db = e.target.result, 
                indexes = me.indexes,
                setVrequest,
                keyPath,
                store;

            // We can only create Object stores in a setVersion transaction;
            if(me.dbVersion !== db.version) {
                setVrequest = db.setVersion(me.dbVersion);

              // onsuccess is the only place we can create Object Stores
              setVrequest.onfailure = me.onError;

              setVrequest.onsuccess = function(e) {
                var i;

                //clean old versions
                if(db.objectStoreNames.contains(me.objectStoreName)) {
                  db.deleteObjectStore(me.objectStoreName);
                }
                
                //set keyPath. Use idProperty if keyPath is not specified
                if (!me.keyPath) {
                    me.keyPath = me.getReader().getIdProperty();
                }
                

                // create objectStore
                keyPath = me.keyPath?{keyPath: me.keyPath}:undefined;
                store = db.createObjectStore(me.objectStoreName, keyPath, me.autoIncrement);
                
                // set indexes
                for (i in indexes) {
                    if (indexes.hasOwnProperty(i)) {
                        db.objectStore.createIndex(indexes.name, indexes.field, indexes.options);
                    }
                }

                //Database is open and ready so fire dbopen event
                me.fireEvent('updatedb', me, db);
              };
            }
            me.fireEvent('dbopen', me, db);
        };

        request.onfailure = me.onerror;
    },
    
    /**
     * Universal error reporter for debugging purposes
     * @param {Object} err Error object.
     */
    onError: function(err) {
        if (window.console) console.log(err);
    },

    /**
     * Check if all needed config options are set
     */
    checkDependencies: function(){
        var me = this;
        window.p=me;
        if (!me.indexedDB) {
            me.fireEvent('noIdb');
            Ext.Error.raise("IndexedDB is not supported in your browser.");
        }
        if (!Ext.isString(me.dbName))  Ext.Error.raise("The dbName string has not been defined in your Ext.data.proxy.IndexedDB");
        if (!Ext.isString(me.objectStoreName)) Ext.Error.raise("The objectStoreName string has not been defined in your Ext.data.proxy.IndexedDB");

        return true;
    },

    /**
     * Add initial data if set at {@link #initialData}
     */
    addInitialData: function() {
        this.addData();
    },

    /**
     * Add data when needed
     * Also add initial data if set at {@link #initialData}
     * @param {Array/Ext.data.Store} newData Data to add as array of objects or a store instance. Optional
     * @param {Boolean} clearFirst Clear existing data first
     */
    addData: function(newData, clearFirst) {
        var me = this,
            model = me.getModel().getName(),
            data = newData || me.initialData;

        //clear objectStore first
        if (clearFirst===true){
            me.clear();
            me.addData(data);
            return;
        }

        if (Ext.isObject(data) && data.isStore===true) {
            data = me.getDataFromStore(data);
        }

        me.initialDataCount = data.length;
        me.insertingInitialData = true;

        Ext.each(data, function(entry) {
            Ext.ModelManager.create(entry, model).save();
        })
    },

    /**
     * Get data from store. Usually from Server proxy.
     * Useful if caching data data that don't change much (e.g. for comboboxes)
     * Used at {@link #addData}
     * @private
     * @param {Ext.data.Store} store Store instance
     * @return {Array} Array of raw data
     */
    getDataFromStore: function(store) {
        var data = [];
        store.each(function(item) {
            data.push(item.data)
        });
        return data;
    },
    //inherit docs
    create: function(operation, callback, scope) {
        var records = operation.records,
            length  = records.length,
            id, record, i;

        operation.setStarted();

        for (i = 0; i < length; i++) {
            record = records[i];
            this.setRecord(record);
        }

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    //inherit docs
    read: function(operation, callback, scope) {
        var records = [],
            me      = this;

        var finishReading = function(record, request, event) {
            me.readCallback(operation,record);

            if (typeof callback == 'function') {
                callback.call(scope || this, operation);
            }
        }

        //read a single record
        if (operation.id) {
            this.getRecord(operation.id,finishReading,me);
        } else {
            this.getAllRecords(finishReading,me);
            operation.setSuccessful();
        }
    },

    /**
     * Injects data in operation instance
     */
    readCallback: function(operation, records) {
        var rec = Ext.isArray(records)?records:[records];
        operation.setSuccessful();
        operation.setCompleted();
        operation.resultSet = Ext.create('Ext.data.ResultSet', {
            records: rec,
            total  : rec.length,
            loaded : true
        });
    },

    //inherit docs
    update: function(operation, callback, scope) {
        var records = operation.records,
            length  = records.length,
            record, id, i;

        operation.setStarted();

        for (i = 0; i < length; i++) {
            record = records[i];
            this.updateRecord(record);
        }
        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    //inherit
    destroy: function(operation, callback, scope) {
        var records = operation.records,
            length  = records.length,
            i;

        for (i = 0; i < length; i++) {
            Ext.Array.remove(newIds, records[i].getId());
            this.removeRecord(records[i], false);
        }

        //this.setIds(newIds);

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    /**
     * Create objectStore instance
     * @param {String} type Transaction type (r, rw)
     * @param {Function} callback Callback function
     * @param {Object} scope Callback fn scope
     * @return {Object} IDB objectStore instance
     */
    getObjectStore: function(type, callback, scope) {
        try {
            var me = this,
                transTypes = {
                    'rw': "readwrite", //IDBTransaction.READ_WRITE,
                    'r': "readonly", //IDBTransaction.READ_ONLY,
                    'vc': "versionchange"//IDBTransaction.VERSION_CHANGE
                },
                transaction = me.db.transaction([me.objectStoreName], type ? transTypes[type] : undefined),
                objectStore = transaction.objectStore(me.objectStoreName);
        } catch(e) {
            //retry until available due to asynchronous nature of indexedDB transaction. Not the best of workaraunds.
            Ext.defer(callback, 20, scope || me, [type, callback, scope]);
            return false;
            //callback.call(scope || me, type, callback, scope);
        }

        return objectStore;
    },

    /**
     * @private
     * Fetches a single record by id.
     * @param {Mixed} id Record id
     * @param {Function} callback Callback function
     * @param {Object} scope Callback fn scope
     */
    getRecord: function(id, callback, scope) {
        var me = this,
            objectStore = me.getObjectStore('r',Ext.bind(me.getRecord, me, [id, callback, scope])),
            Model = this.model,
            record;

        if (!objectStore) return false;

        var request = objectStore.get(id);

        request.onerror = function(event) {
            me.fireEvent('exception',me, event);
        };

        request.onsuccess = function(event) {
            record = new Model(request.result, id);
            if (typeof callback == 'function') {
                callback.call(scope || me, record, request, event);
            }
        };

        return true;
    },

    /**
     * @private
     * Fetches all records
     * @param {Function} callback Callback function
     * @param {Object} scope Callback fn scope
     */
    getAllRecords: function(callback, scope) {
        var me = this,
            objectStore = me.getObjectStore('r',Ext.bind(me.getAllRecords, me, [callback, scope])),
            Model = this.model,
            records = [];
        
        if (!objectStore) return;

        var request = objectStore.openCursor();

        request.onerror = function(event) {
            me.fireEvent('exception',me, event);
        };

        request.onsuccess = function(event) {
            var cursor = event.target.result;
             if (cursor) {
                 //res.push(cursor.value);
               records.push(new Model(cursor.value, cursor.key));
               cursor["continue"]();
             }
             else {

               if (typeof callback == 'function') {
                    callback.call(scope || me, records, request, event)
                }
             }

        };
    },

    /**
     * Saves the given record in the Proxy.
     * @param {Ext.data.Model} record The model instance
     */
    setRecord: function(record) {
		console.log('add');
        var me = this,
            rawData = record.data,
            data    = {},
			model   = me.model,
            fields  = model.prototype.fields.items,
            length  = fields.length,
            i = 0,
            field, name, obj, key,
            objectStore = me.getObjectStore('rw',Ext.bind(me.setRecord, me, [record]));

        if (!objectStore) return;
		
		for (; i < length; i++) {
            field = fields[i];
            name  = field.name;

            if(field.persist) {
                data[name] = rawData[name];
            }
        }
		
		// if the record is a tree node and it's a direct child of the root node, do not store the parentId
        if(record.isNode && record.get('depth') === 1) {
            delete data.parentId;
        }

        var request = objectStore.add(data);
        
        request.onsuccess = function() {
			console.log('good');
            if (me.insertingInitialData) {
                me.initialDataCount--;
                if (me.initialDataCount === 0) {
                    me.insertingInitialData = false;
                    me.fireEvent('initialDataInserted');
                }
            }
        }
		
		
		
		
		
        
    },

    /**
     * Updates the given record.
     * @param {Ext.data.Model} record The model instance
     */
    updateRecord: function(record) {
        var me = this,
            objectStore = me.getObjectStore('rw',Ext.bind(me.updateRecord, me, [record])),
            Model = this.model,
            id = record.internalId || record[me.keyPath],
            modifiedData = record.modified,
            newData = record.data;

        if (!objectStore) return false;

        var keyRange = IDBKeyRange.only(id),
            cursorRequest = objectStore.openCursor(keyRange);

        cursorRequest.onsuccess = function(e) {
            var result = e.target.result;
            if(!!!result) {return me.setRecord(record);}

            for (var i in modifiedData) {
                    result.value[i] = newData[i];
            }
            result.update(result.value);
          };

        cursorRequest.onerror = function(event) {
            me.fireEvent('exception',me, event);
        };

        return true;
    },

    /**
     * @private
     * Physically removes a given record from the object store. 
     * @param {Mixed} id The id of the record to remove
     */
    removeRecord: function(id) {
        var me = this,
            objectStore = me.getObjectStore('rw',Ext.bind(me.removeRecord, me, [id]));
        if (!objectStore) return;
        
        var request = objectStore["delete"](id);

    },

    /**
     * Destroys all records stored in the proxy 
     */
    clear: function(callback, scope) {
        var me = this,
            objectStore = me.getObjectStore('r',Ext.bind(me.clear, me, [callback, scope])),
            Model = this.model,
            records = [];

        if (!objectStore) return;

        var request = objectStore.openCursor();

        request.onerror = function(event) {
            me.fireEvent('exception',me, event);
        };

        request.onsuccess = function(event) {
            var cursor = event.target.result;
             if (cursor) {
                me.removeRecord(cursor.key);
               cursor["continue"]();
             }
            me.fireEvent('cleardb', me);
            callback && callback.call(scope || me);
        };

        
    }
});