import { deleteDB, openDB } from "idb";

// ========== JSDOC TYPE DEFINITIONS ==========

/**
 * @typedef {Object} IndexConfig
 * @property {string} keyPath - The property name to index on
 * @property {boolean} [unique=false] - Whether the index should be unique
 * @property {boolean} [multiEntry=false] - Whether the index should be multi-entry
 */

/**
 * @typedef {Object} StoreConfig
 * @property {string|null} keyPath - The property name to use as key, or null for external keys
 * @property {boolean} [autoIncrement=false] - Whether to auto-increment keys
 * @property {Object<string, IndexConfig>} [indexes] - Index definitions
 */

/**
 * @typedef {Object<string, StoreConfig>} DatabaseSchema
 */

/**
 * @typedef {Object} UpgradeConfig
 * @property {function} [upgrade] - Custom upgrade function
 * @property {function} [blocked] - Called when database is blocked
 * @property {function} [blocking] - Called when this connection is blocking
 * @property {function} [terminated] - Called when database is terminated
 */

/**
 * @typedef {Object} BatchOperation
 * @property {'add'|'put'|'get'|'delete'|'clear'|'getAll'} type - Operation type
 * @property {string} storeName - Store name
 * @property {*} [value] - Value for add/put operations
 * @property {*} [key] - Key for operations
 * @property {*} [query] - Query for getAll operations
 * @property {number} [count] - Count limit for getAll operations
 */

/**
 * @typedef {Object} CursorOptions
 * @property {*} [query] - Query range for cursor
 * @property {'next'|'nextunique'|'prev'|'prevunique'} [direction='next'] - Cursor direction
 * @property {string} [indexName] - Index name if using index cursor
 */

/**
 * @typedef {Object} Tweet
 * @property {string} id
 * @property {string} collectionID
 */

/**
 * @typedef {Object} SnaData
 * @property {string} collections
 * @property {string} recording
 * @property {Tweet} [tweets]
 */

// ========== EXAMPLE TYPE DEFINITIONS ==========

/**
 * Example: User record structure
 * @typedef {Object} UserRecord
 * @property {string} id - User ID
 * @property {string} name - User full name
 * @property {string} email - User email address
 * @property {Date} createdAt - Account creation date
 * @property {string[]} [tags] - Optional user tags
 */

/**
 * Example: Settings record structure
 * @typedef {Object} SettingsRecord
 * @property {'light'|'dark'} theme - UI theme preference
 * @property {string} language - Language code (e.g., 'en', 'fr')
 * @property {boolean} notifications - Whether notifications are enabled
 * @property {Object} [advanced] - Advanced settings object
 */

/**
 * Example: Cache record structure
 * @typedef {Object} CacheRecord
 * @property {string} key - Cache key
 * @property {*} data - Cached data (any type)
 * @property {Date} createdAt - Cache creation time
 * @property {Date} expiresAt - Cache expiration time
 */

/**
 * Generic IndexedDB wrapper using the idb library
 * Provides simplified CRUD operations, transaction management, and schema versioning
 *
 * @template {import('idb').DBSchema} T - Database schema interface (for TypeScript)
 */
class DBStorage {
  constructor(name, version = 1, schema = {}) {
    this.name = name;
    this.version = version;
    this.schema = schema;
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the database with schema definition
   * @param {Object} upgradeConfig - Configuration for database upgrades
   * @returns {Promise<import('idb').IDBPDatabase<T>>} The opened database instance
   */
  async init(upgradeConfig = {}) {
    try {
      this.db = await openDB(this.name, this.version, {
        upgrade: (db, oldVersion, newVersion, transaction, event) => {
          // Execute schema creation/migration
          this._handleUpgrade(db, oldVersion, newVersion, transaction);

          // Execute custom upgrade logic if provided
          if (upgradeConfig.upgrade) {
            upgradeConfig.upgrade(
              db,
              oldVersion,
              newVersion,
              transaction,
              event,
            );
          }
        },
        blocked: upgradeConfig.blocked,
        blocking: upgradeConfig.blocking,
        terminated: upgradeConfig.terminated,
      });

      this.isInitialized = true;
      return this.db;
    } catch (error) {
      this._handleError("Database initialization failed", error);
      throw error;
    }
  }

  /**
   * Handle database schema upgrades
   * @private
   */
  _handleUpgrade(db, _oldVersion, _newVersion, _transaction) {
    // Create object stores based on schema
    Object.entries(this.schema).forEach(([storeName, storeConfig]) => {
      if (!db.objectStoreNames.contains(storeName)) {
        const store = db.createObjectStore(storeName, {
          keyPath: storeConfig.keyPath,
          autoIncrement: storeConfig.autoIncrement || false,
        });

        // Create indexes if defined
        if (storeConfig.indexes) {
          Object.entries(storeConfig.indexes).forEach(
            ([indexName, indexConfig]) => {
              store.createIndex(indexName, indexConfig.keyPath || indexName, {
                unique: indexConfig.unique || false,
                multiEntry: indexConfig.multiEntry || false,
              });
            },
          );
        }
      }
    });
  }

  /**
   * Ensure database is initialized
   * @private
   */
  async _ensureInitialized() {
    if (!this.isInitialized || !this.db) {
      await this.init();
    }
  }

  // ========== CRUD OPERATIONS ==========

  /**
   * Add a new record to a store
   * @param {keyof T} storeName - Name of the object store
   * @param {T[keyof T]['value']} value - Value to add
   * @param {T[keyof T]['key']} key - Optional key (if not using keyPath)
   * @returns {Promise<T[keyof T]['key']>} The key of the added record
   */
  async add(storeName, value, key) {
    await this._ensureInitialized();
    try {
      return await this.db.add(storeName, value, key);
    } catch (error) {
      this._handleError(`Failed to add record to ${storeName}`, error);
      throw error;
    }
  }

  /**
   * Put (add or update) a record in a store
   * @param {keyof T} storeName - Name of the object store
   * @param {T[keyof T]['value']} value - Value to put
   * @param {T[keyof T]['key']} key - Optional key (if not using keyPath)
   * @returns {Promise<T[keyof T]['key']>} The key of the record
   */
  async put(storeName, value, key) {
    await this._ensureInitialized();
    try {
      return await this.db.put(storeName, value, key);
    } catch (error) {
      this._handleError(`Failed to put record in ${storeName}`, error);
      throw error;
    }
  }

  /**
   * Get a record from a store by key
   * @param {keyof T} storeName - Name of the object store
   * @param {T[keyof T]['key']} key - Key to retrieve
   * @returns {Promise<T[keyof T]['value'] | undefined>} The retrieved value or undefined
   */
  async get(storeName, key) {
    await this._ensureInitialized();
    try {
      return await this.db.get(storeName, key);
    } catch (error) {
      this._handleError(`Failed to get record from ${storeName}`, error);
      throw error;
    }
  }

  /**
   * Get all records from a store
   * @param {keyof T} storeName - Name of the object store
   * @param {*} query - Optional query (key range)
   * @param {number} count - Optional count limit
   * @returns {Promise<T[keyof T]['value'][]>} Array of all values
   */
  async getAll(storeName, query, count) {
    await this._ensureInitialized();
    try {
      return await this.db.getAll(storeName, query, count);
    } catch (error) {
      this._handleError(`Failed to get all records from ${storeName}`, error);
      throw error;
    }
  }

  /**
   * Get all keys from a store
   * @param {string} storeName - Name of the object store
   * @param {*} query - Optional query (key range)
   * @param {number} count - Optional count limit
   * @returns {Promise<Array>} Array of all keys
   */
  async getAllKeys(storeName, query, count) {
    await this._ensureInitialized();
    try {
      return await this.db.getAllKeys(storeName, query, count);
    } catch (error) {
      this._handleError(`Failed to get all keys from ${storeName}`, error);
      throw error;
    }
  }

  /**
   * Delete a record from a store
   * @param {string} storeName - Name of the object store
   * @param {*} key - Key to delete
   * @returns {Promise<void>}
   */
  async delete(storeName, key) {
    await this._ensureInitialized();
    try {
      return await this.db.delete(storeName, key);
    } catch (error) {
      this._handleError(`Failed to delete record from ${storeName}`, error);
      throw error;
    }
  }
  async deleteByIndex(storeName, indexName, value) {
    await this._ensureInitialized();
    const tx = this.db.transaction(storeName);
    try {
      const index = tx.store.index(indexName);
      for await (const cursor of index.iterate(value)) {
        cursor.delete();
      }
    } catch (error) {
      this._handleError(`Failed to delete record from ${storeName}`, error);
      throw error;
    } finally {
      await tx.done;
    }
  }

  /**
   * Clear all records from a store
   * @param {string} storeName - Name of the object store
   * @returns {Promise<void>}
   */
  async clear(storeName) {
    await this._ensureInitialized();
    try {
      return await this.db.clear(storeName);
    } catch (error) {
      this._handleError(`Failed to clear store ${storeName}`, error);
      throw error;
    }
  }

  /**
   * Delete DB
   *  @returns {Promise<void>}
   */
  async deleteDB() {
    await this._ensureInitialized();
    try {
      return await this.db.deleteDB(this.name);
    } catch (error) {
      this._handleError(`Failed to delete db ${this.name}`, error);
      throw error;
    }
  }
  /**
   * Count records in a store
   * @param {string} storeName - Name of the object store
   * @param {*} query - Optional query (key range)
   * @returns {Promise<number>} Number of records
   */
  async count(storeName, query) {
    await this._ensureInitialized();
    try {
      return await this.db.count(storeName, query);
    } catch (error) {
      this._handleError(`Failed to count records in ${storeName}`, error);
      throw error;
    }
  }

  // ========== INDEX OPERATIONS ==========

  /**
   * Get a record from an index
   * @param {keyof T} storeName - Name of the object store
   * @param {keyof T[keyof T]['indexes']} indexName - Name of the index
   * @param {T[keyof T]['indexes'][keyof T[keyof T]['indexes']]} key - Key to retrieve
   * @returns {Promise<T[keyof T]['value'] | undefined>} The retrieved value or undefined
   */
  async getFromIndex(storeName, indexName, key) {
    await this._ensureInitialized();
    try {
      return await this.db.getFromIndex(storeName, indexName, key);
    } catch (error) {
      this._handleError(
        `Failed to get record from index ${indexName} in ${storeName}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Get all records from an index
   * @param {string} storeName - Name of the object store
   * @param {string} indexName - Name of the index
   * @param {*} query - Optional query (key range)
   * @param {number} count - Optional count limit
   * @returns {Promise<Array>} Array of all values
   */
  async getAllFromIndex(storeName, indexName, query, count) {
    await this._ensureInitialized();
    try {
      return await this.db.getAllFromIndex(storeName, indexName, query, count);
    } catch (error) {
      this._handleError(
        `Failed to get all records from index ${indexName} in ${storeName}`,
        error,
      );
      throw error;
    }
  }

  /**
   * Count records in an index
   * @param {string} storeName - Name of the object store
   * @param {string} indexName - Name of the index
   * @param {*} query - Optional query (key range)
   * @returns {Promise<number>} Number of records
   */
  async countFromIndex(storeName, indexName, query) {
    await this._ensureInitialized();
    try {
      return await this.db.countFromIndex(storeName, indexName, query);
    } catch (error) {
      this._handleError(
        `Failed to count records in index ${indexName} of ${storeName}`,
        error,
      );
      throw error;
    }
  }

  // ========== TRANSACTION MANAGEMENT ==========

  /**
   * Execute operations within a transaction
   * @param {Array<string>} storeNames - Names of stores to include in transaction
   * @param {string} mode - Transaction mode ('readonly' or 'readwrite')
   * @param {Function} callback - Function to execute within transaction
   * @returns {Promise<*>} Result of the callback function
   */
  async transaction(storeNames, mode = "readonly", callback) {
    await this._ensureInitialized();
    try {
      const tx = this.db.transaction(storeNames, mode);
      const result = await callback(tx);
      await tx.done;
      return result;
    } catch (error) {
      this._handleError("Transaction failed", error);
      throw error;
    }
  }

  /**
   * Batch operations within a single transaction
   * @param {Array<Object>} operations - Array of operation objects
   * @param {string} mode - Transaction mode ('readonly' or 'readwrite')
   * @returns {Promise<Array>} Array of operation results
   */
  async batch(operations, mode = "readwrite") {
    await this._ensureInitialized();

    // Get all unique store names from operations
    const storeNames = [...new Set(operations.map((op) => op.storeName))];

    try {
      const tx = this.db.transaction(storeNames, mode);
      const results = await Promise.all(
        operations.map(async (op) => {
          const store = tx.objectStore(op.storeName);

          switch (op.type) {
            case "add":
              return await store.add(op.value, op.key);
            case "put":
              return await store.put(op.value, op.key);
            case "get":
              return await store.get(op.key);
            case "delete":
              return await store.delete(op.key);
            case "clear":
              return await store.clear();
            case "getAll":
              return await store.getAll(op.query, op.count);
            default:
              throw new Error(`Unknown operation type: ${op.type}`);
          }
        }),
      );

      await tx.done;
      return results;
    } catch (error) {
      this._handleError("Batch operation failed", error);
      throw error;
    }
  }

  // ========== CURSOR OPERATIONS ==========

  /**
   * Iterate over records using a cursor
   * @param {string} storeName - Name of the object store
   * @param {Function} callback - Function to call for each record
   * @param {Object} options - Cursor options (query, direction)
   * @returns {Promise<void>}
   */
  async iterateCursor(storeName, callback, options = {}) {
    await this._ensureInitialized();
    try {
      const tx = this.db.transaction(storeName, "readonly");
      const store = tx.objectStore(
        options.indexName
          ? tx.objectStore(storeName).index(options.indexName)
          : tx.objectStore(storeName),
      );

      let cursor = await store.openCursor(options.query, options.direction);

      while (cursor) {
        const shouldContinue = await callback(cursor);
        if (shouldContinue === false) break;
        cursor = await cursor.continue();
      }

      await tx.done;
    } catch (error) {
      this._handleError(`Failed to iterate cursor on ${storeName}`, error);
      throw error;
    }
  }

  // ========== UTILITY METHODS ==========

  /**
   * Check if a record exists
   * @param {string} storeName - Name of the object store
   * @param {*} key - Key to check
   * @returns {Promise<boolean>} True if record exists
   */
  async exists(storeName, key) {
    const value = await this.get(storeName, key);
    return value !== undefined;
  }

  /**
   * Update specific fields of a record
   * @param {string} storeName - Name of the object store
   * @param {*} key - Key of the record to update
   * @param {Object} updates - Object with fields to update
   * @returns {Promise<*>} The updated record
   */
  async update(storeName, key, updates) {
    const existing = await this.get(storeName, key);
    if (!existing) {
      throw new Error(`Record with key ${key} not found in ${storeName}`);
    }

    const updated = { ...existing, ...updates };
    await this.put(storeName, updated);
    return updated;
  }

  /**
   * Get database information
   * @returns {Object} Database information
   */
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      isInitialized: this.isInitialized,
      storeNames: this.db ? Array.from(this.db.objectStoreNames) : [],
    };
  }

  /**
   * Close the database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.isInitialized = false;
    }
  }

  /**
   * Delete the database
   * @param {Object} options - Delete options
   * @returns {Promise<void>}
   */
  async deleteDatabase(options = {}) {
    this.close();
    try {
      await deleteDB(this.name, options);
    } catch (error) {
      this._handleError("Failed to delete database", error);
      throw error;
    }
  }

  // ========== ERROR HANDLING ==========

  /**
   * Handle errors with logging
   * @private
   */
  _handleError(message, error) {
    console.error(`[DBStorage ${this.name}] ${message}:`, error);
  }
}

// ========== FACTORY FUNCTIONS ==========

/**
 * Create a simple key-value store
 * @template {import('idb').DBSchema} T - Database schema interface (for TypeScript)
 * @param {string} name - Database name
 * @param {number} version - Database version
 * @returns {DBStorage<T>} Configured DBStorage instance
 */
export function createKeyValueStore(name, version = 1) {
  const schema = {
    keyval: {
      keyPath: null, // External keys
    },
  };
  return new DBStorage(name, version, schema);
}

/**
 * Create a document store with auto-incrementing IDs
 * @template {import('idb').DBSchema} T - Database schema interface (for TypeScript)
 * @param {string} name - Database name
 * @param {string} storeName - Store name
 * @param {Array<string>} indexes - Index field names
 * @param {number} version - Database version
 * @returns {DBStorage<T>} Configured DBStorage instance
 */
export function createDocumentStore(
  name,
  storeName,
  indexes = [],
  version = 1,
) {
  const schema = {
    [storeName]: {
      keyPath: "id",
      autoIncrement: true,
      indexes: indexes.reduce((acc, indexName) => {
        acc[indexName] = { keyPath: indexName };
        return acc;
      }, {}),
    },
  };
  return new DBStorage(name, version, schema);
}

/**
 * Simple key-value operations for quick usage
 */
export const keyValueDB = (() => {
  let instance = null;

  return {
    async init(name = "keyval-store") {
      if (!instance) {
        instance = createKeyValueStore(name);
        await instance.init();
      }
      return instance;
    },

    async get(key) {
      const db = await this.init();
      return db.get("keyval", key);
    },

    async set(key, value) {
      const db = await this.init();
      return db.put("keyval", value, key);
    },

    async delete(key) {
      const db = await this.init();
      return db.delete("keyval", key);
    },

    async clear() {
      const db = await this.init();
      return db.clear("keyval");
    },

    async keys() {
      const db = await this.init();
      return db.getAllKeys("keyval");
    },
  };
})();

export default DBStorage;

/**
 * ========== JSDOC USAGE EXAMPLES (JAVASCRIPT) ==========
 *
 * Here's how to use the DBStorage wrapper with JSDoc types in JavaScript:
 *
 * ```javascript
 * import DBStorage from '@/utils/dbstorage';
 *
 * // 1. CREATE DATABASE WITH SCHEMA
 * const userDB = new DBStorage('UserApp', 1, {
 *   users: {
 *     keyPath: 'id',
 *     indexes: {
 *       'by-email': { keyPath: 'email', unique: true },
 *       'by-name': { keyPath: 'name' },
 *       'by-created': { keyPath: 'createdAt' }
 *     }
 *   },
 *   settings: {
 *     keyPath: 'key'
 *   },
 *   cache: {
 *     keyPath: 'key'
 *   }
 * });
 *
 * await userDB.init();
 *
 * // 2. ADD USERS WITH TYPE ANNOTATIONS
 * /** @type {UserRecord} *\/
 * const newUser = {
 *   id: 'user_123',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   createdAt: new Date(),
 *   tags: ['admin', 'verified']
 * };
 *
 * await userDB.add('users', newUser);
 *
 * // 3. RETRIEVE WITH TYPE ANNOTATIONS
 * /** @type {UserRecord|undefined} *\/
 * const user = await userDB.get('users', 'user_123');
 *
 * /** @type {UserRecord[]} *\/
 * const allUsers = await userDB.getAll('users');
 *
 * /** @type {UserRecord|undefined} *\/
 * const userByEmail = await userDB.getFromIndex('users', 'by-email', 'john@example.com');
 *
 * // 4. SETTINGS WITH UNION TYPES
 * /** @type {SettingsRecord} *\/
 * const userSettings = {
 *   theme: 'dark',  // IDE will suggest 'light' | 'dark'
 *   language: 'en',
 *   notifications: true
 * };
 *
 * await userDB.put('settings', userSettings, 'user-prefs');
 *
 * // 5. BATCH OPERATIONS WITH TYPED DATA
 * /** @type {BatchOperation[]} *\/
 * const operations = [
 *   {
 *     type: 'add',
 *     storeName: 'users',
 *     value: {
 *       id: 'user_456',
 *       name: 'Jane Smith',
 *       email: 'jane@example.com',
 *       createdAt: new Date()
 *     }
 *   },
 *   {
 *     type: 'put',
 *     storeName: 'cache',
 *     key: 'api-data',
 *     value: {
 *       key: 'api-data',
 *       data: { users: 150, posts: 1200 },
 *       createdAt: new Date(),
 *       expiresAt: new Date(Date.now() + 3600000) // 1 hour
 *     }
 *   }
 * ];
 *
 * await userDB.batch(operations);
 *
 * // 6. CURSOR ITERATION WITH TYPES
 * await userDB.iterateCursor('users', async (cursor) => {
 *   /** @type {UserRecord} *\/
 *   const user = cursor.value;
 *
 *   console.log(`User: ${user.name} (${user.email})`);
 *
 *   // Process user...
 *   return true; // Continue iteration
 * });
 *
 * // 7. CUSTOM RECORD TYPES FOR YOUR APP
 * /** @typedef {Object} ArticleRecord
 *  * @property {number} [id] - Auto-generated ID
 *  * @property {string} title - Article title
 *  * @property {string} content - Article content
 *  * @property {string} author - Author name
 *  * @property {Date} publishedAt - Publication date
 *  * @property {string[]} tags - Article tags
 *  * @property {boolean} draft - Is article draft
 * *\/
 *
 * const articleDB = new DBStorage('Blog', 1, {
 *   articles: {
 *     keyPath: 'id',
 *     autoIncrement: true,
 *     indexes: {
 *       'by-author': { keyPath: 'author' },
 *       'by-date': { keyPath: 'publishedAt' },
 *       'by-draft': { keyPath: 'draft' }
 *     }
 *   }
 * });
 *
 * /** @type {ArticleRecord} *\/
 * const article = {
 *   title: 'Getting Started with IndexedDB',
 *   content: 'IndexedDB is a powerful...',
 *   author: 'John Doe',
 *   publishedAt: new Date(),
 *   tags: ['javascript', 'database', 'tutorial'],
 *   draft: false
 * };
 *
 * await articleDB.add('articles', article);
 *
 * // 8. SIMPLE KEY-VALUE USAGE
 * import { keyValueDB } from '@/utils/dbstorage';
 *
 * // Store user preferences
 * await keyValueDB.set('user-theme', 'dark');
 * await keyValueDB.set('user-lang', 'en');
 * await keyValueDB.set('last-login', new Date());
 *
 * // Retrieve with type annotations
 * /** @type {string|undefined} *\/
 * const theme = await keyValueDB.get('user-theme');
 *
 * /** @type {Date|undefined} *\/
 * const lastLogin = await keyValueDB.get('last-login');
 * ```
 *
 * BENEFITS OF JSDOC TYPES:
 * - ✅ IDE autocompletion and IntelliSense
 * - ✅ Type checking in VS Code and other IDEs
 * - ✅ Documentation integrated with code
 * - ✅ No build step changes required
 * - ✅ Works with existing JavaScript toolchain
 * - ✅ Gradual adoption - add types where needed
 */

/**
 * TYPESCRIPT USAGE EXAMPLES
 *
 * When using this wrapper in TypeScript, you can extend DBSchema for strong typing:
 *
 * ```typescript
 * import DBStorage from '@/utils/dbstorage';
 * import { DBSchema } from 'idb';
 *
 * // Define your database schema interface
 * interface MyAppDB extends DBSchema {
 *   users: {
 *     key: string;  // Primary key type
 *     value: {      // Value object structure
 *       id: string;
 *       name: string;
 *       email: string;
 *       createdAt: Date;
 *     };
 *     indexes: {    // Index definitions
 *       'by-email': string;
 *       'by-name': string;
 *       'by-created': Date;
 *     };
 *   };
 *   settings: {
 *     key: string;
 *     value: {
 *       theme: 'light' | 'dark';
 *       language: string;
 *       notifications: boolean;
 *     };
 *   };
 *   cache: {
 *     key: string;
 *     value: any;  // For flexible cache storage
 *   };
 * }
 *
 * // Create typed database instance
 * const db = new DBStorage<MyAppDB>('MyApp', 1, {
 *   users: {
 *     keyPath: 'id',
 *     indexes: {
 *       'by-email': { keyPath: 'email', unique: true },
 *       'by-name': { keyPath: 'name' },
 *       'by-created': { keyPath: 'createdAt' }
 *     }
 *   },
 *   settings: {
 *     keyPath: 'key'
 *   },
 *   cache: {
 *     keyPath: null  // External keys
 *   }
 * });
 *
 * await db.init();
 *
 * // Now you get full type safety and autocompletion:
 *
 * // ✅ This works - correct types
 * await db.add('users', {
 *   id: 'user1',
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   createdAt: new Date()
 * });
 *
 * // ❌ This fails at compile time - wrong value type
 * await db.add('users', {
 *   id: 'user1',
 *   name: 'John Doe',
 *   email: 123,  // Type error: email should be string
 *   createdAt: new Date()
 * });
 *
 * // ❌ This fails at compile time - wrong store name
 * await db.add('invalidStore', { some: 'data' });
 *
 * // ✅ Type-safe queries
 * const user: MyAppDB['users']['value'] | undefined = await db.get('users', 'user1');
 * const users: MyAppDB['users']['value'][] = await db.getAll('users');
 * const userByEmail = await db.getFromIndex('users', 'by-email', 'john@example.com');
 *
 * // ✅ Type-safe settings
 * await db.put('settings', {
 *   theme: 'dark',  // Autocompleted to 'light' | 'dark'
 *   language: 'en',
 *   notifications: true
 * }, 'user-prefs');
 *
 * // ✅ Batch operations with type safety
 * await db.batch([
 *   {
 *     type: 'add',
 *     storeName: 'users',
 *     value: {
 *       id: 'user2',
 *       name: 'Jane Smith',
 *       email: 'jane@example.com',
 *       createdAt: new Date()
 *     }
 *   },
 *   {
 *     type: 'put',
 *     storeName: 'cache',
 *     key: 'api-response',
 *     value: { data: 'cached api response' }
 *   }
 * ]);
 * ```
 *
 * TYPED FACTORY FUNCTIONS:
 *
 * ```typescript
 * // Create typed document store
 * interface ArticleDB extends DBSchema {
 *   articles: {
 *     key: number;
 *     value: {
 *       id?: number;
 *       title: string;
 *       content: string;
 *       publishedAt: Date;
 *       tags: string[];
 *     };
 *     indexes: {
 *       'by-date': Date;
 *       'by-title': string;
 *     };
 *   };
 * }
 *
 * const articleDB = new DBStorage<ArticleDB>('Articles', 1, {
 *   articles: {
 *     keyPath: 'id',
 *     autoIncrement: true,
 *     indexes: {
 *       'by-date': { keyPath: 'publishedAt' },
 *       'by-title': { keyPath: 'title' }
 *     }
 *   }
 * });
 * ```
 *
 * BENEFITS OF TYPESCRIPT INTEGRATION:
 * - Full autocompletion for store names, index names, and value properties
 * - Compile-time type checking prevents runtime errors
 * - IntelliSense support in IDEs
 * - Refactoring safety when changing database schema
 * - Self-documenting code through type definitions
 */
