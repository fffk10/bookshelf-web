import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Book } from './book';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const books = [
      { id: 11, title: '吾輩は猫である', point: 1 },
      { id: 12, title: '鼻', point: 3 },
      { id: 13, title: '浮雲', point: 4 },
      { id: 14, title: 'こころ', point: 7 },
      { id: 15, title: '羅生門', point: 3 },
      { id: 16, title: '火花', point: 6 }
    ];
    return { books };
  }

  genId(books: Book[]): number {
    return books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 11;
  }
}