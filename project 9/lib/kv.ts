// Simple in-memory key-value store
class KVStore {
  private store: Map<string, string>;

  constructor() {
    this.store = new Map();
  }

  async get(key: string): Promise<any> {
    const value = this.store.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any): Promise<void> {
    if (typeof value === 'string') {
      this.store.set(key, value);
    } else {
      this.store.set(key, JSON.stringify(value));
    }
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

export const kv = new KVStore();