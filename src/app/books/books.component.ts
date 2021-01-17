import { Component, OnInit } from '@angular/core';

import { Book } from '../book';
import { BookService } from '../book.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books!: Book[];

  selectedBook!: Book;
  
  constructor(private bookService: BookService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getBookS();
  }

  onSelect(book: Book): void {
    this.selectedBook = book;
    this.messageService.add(`BooksComponent: Seleced book id=${book.id}`);
  }

  getBookS(): void {
    this.bookService.getBooks()
    .subscribe(books => this.books = books);
  }
}
