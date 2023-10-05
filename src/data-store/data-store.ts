import { AccessCredentials } from '@/constants/app-type';

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

const dataStore = new DataStore();
export default dataStore;
