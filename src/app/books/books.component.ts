import { Component, OnInit } from '@angular/core';
import { Book } from './book';
import { BOOKS } from '../mock-books';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  book: Book = {
    id: 1,
    title: '吾輩は猫である',
    point: 5
  }

  // 本のモック
  books = BOOKS;

  selectedBook!: Book;
  
  constructor() { }

  ngOnInit(): void {
  }

  onSelect(book: Book): void {
    this.selectedBook = book;
  }
}
