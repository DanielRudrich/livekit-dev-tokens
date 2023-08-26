import assert from 'assert';
import EventEmitter from 'events';
import { v4 as uuidv4 } from 'uuid';

export type Item<T> = {
  id: string;
  version: string;
} & T;

export enum DatabaseEvent {
  CHANGE = 'change',
}

export class Database<T> extends EventEmitter {
  constructor(readonly key: string) {
    super();
  }

  getItems(): Item<T>[] {
    const items = JSON.parse(localStorage.getItem(this.key) || '[]') as Item<T>[];
    return items.filter((result) => result !== null);
  }

  getItem(id: string): Item<T> | undefined {
    const items = this.getItems();
    return items.find((result) => result.id === id);
  }

  storeItems(items: T[]) {
    const resultsJson = JSON.stringify(items);
    localStorage.setItem(this.key, resultsJson);
    this.emit(DatabaseEvent.CHANGE);
  }

  addItem(item: T): string {
    let entries = this.getItems();

    const insert = {
      id: uuidv4(),
      version: '1',
      ...item,
    };
    entries.push(insert);

    this.storeItems(entries);

    return insert.id;
  }

  clearData(): number {
    const numResults = this.getNumItems();

    localStorage.removeItem(this.key);
    this.emit(DatabaseEvent.CHANGE);
    assert(this.getNumItems() == 0);
    return numResults;
  }

  getNumItems() {
    return this.getItems().length;
  }

  //   updateResult(
  //     id: string,
  //     update: {
  //       name?: string;
  //       device?: string;
  //       headphones?: string;
  //       person?: string;
  //       notes?: string;
  //     },
  //   ): number {
  //     const entries = this.getResults();

  //     const index = entries.findIndex((result) => result.id === id);

  //     if (index === -1) return 0;

  //     if (update.name != undefined) {
  //       entries[index].name = update.name;
  //     }

  //     if (update.device != undefined) {
  //       entries[index].metaInfo.device = update.device;
  //     }

  //     if (update.headphones != undefined) {
  //       entries[index].metaInfo.headphones = update.headphones;
  //     }

  //     if (update.person != undefined) {
  //       entries[index].metaInfo.person = update.person;
  //     }

  //     if (update.notes != undefined) {
  //       entries[index].metaInfo.notes = update.notes;
  //     }

  //     this.storeResults(entries);
  //     return 1;
  //   }

  deleteItem(id: string): number {
    const items = this.getItems();
    const filtered = items.filter((result) => result.id !== id);

    this.storeItems(filtered);

    return items.length - filtered.length;
  }
}
