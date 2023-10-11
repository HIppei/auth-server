import type { AccessCredentials } from '@/types/app-type';

type CodeGrantRecord = {
  [code: string]: AccessCredentials;
};

class DataStoreClass {
  records: CodeGrantRecord;

  constructor() {
    this.records = {};
  }

  // TODO: An authorization code expiration
  insert(code: string, accessCredentials: AccessCredentials) {
    this.records[code] = accessCredentials;
  }

  remove(code: string) {
    delete this.records[code];
  }
}

declare global {
  var dataStore: DataStoreClass;
}

let DataStore: DataStoreClass;
if (process.env.NODE_ENV === 'production') {
  DataStore = new DataStoreClass();
} else {
  if (!global.dataStore) {
    global.dataStore = new DataStoreClass();
  }
  DataStore = global.dataStore;
}

export default DataStore;
