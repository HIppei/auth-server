import type { AccessCredentials } from '@/constants/app-type';

type CodeGrantRecord = {
  [code: string]: AccessCredentials;
};

class DataStore {
  records: CodeGrantRecord;

  constructor() {
    this.records = {};
  }

  insert(code: string, accessCredentials: AccessCredentials) {
    this.records[code] = accessCredentials;
  }
}

declare global {
  var dataStore: DataStore;
}

let dataStore: DataStore;
if (process.env.NODE_ENV === 'production') {
  dataStore = new DataStore();
} else {
  if (!global.dataStore) {
    global.dataStore = new DataStore();
  }
  dataStore = global.dataStore;
}

export default dataStore;
