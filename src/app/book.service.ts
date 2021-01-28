import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Book } from './book';
import { BOOKS } from './mock-books';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private booksUrl = 'api/books';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.booksUrl)
      .pipe(
        tap(books => this.log('fetched books')),
        catchError(this.handleError<Book[]>('getBooks', []))
      )
  }

  /** IDから本を取得、idが見つからない場合は`undefined`を返す */
  getBookNo404<Data>(id: number): Observable<Book> {
    const url = `${this.booksUrl}/?id=${id}`;
    return this.http.get<Book[]>(url)
    .pipe(
      map(books => books[0]),
      tap(h => {
        const outcome = h ? `fetched` : `did not find`;
        this.log(`${outcome} book id=${id}`);
      })
    )
  }

  /** IDから本を取得、見つからない場合は404を返す */
  getBook(id: number): Observable<Book | undefined> {
    const url = `${this.booksUrl}/${id}`;
    return this.http.get<Book>(url).pipe(
      tap(_ => this.log(`fetched book id=${id}`)),
      catchError(this.handleError<Book>(`getBook id=${id}`))
    )
  }

  /**
 * 失敗したHttp操作を処理します。
 * アプリを持続させます。
 * @param operation - 失敗した操作の名前
 * @param result - observableな結果として返す任意の値
 */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: リモート上のロギング基盤にエラーを送信する
      console.error(error); // かわりにconsoleに出力

      // TODO: ユーザーへの開示のためにエラーの変換処理を改善する
      this.log(`${operation} failed: ${error.message}`);

      // 空の結果を返して、アプリを持続可能にする
      return of(result as T);
    };
  }

  updateBook(book: any): Observable<any> {
    return this.http.put(this.booksUrl, book, this.httpOptions).pipe(
      tap(_ => this.log(`updated book id=${book.id}`)),
      catchError(this.handleError<any>('updateBook'))
    );
  }

  private log(message: string) {
    this.messageService.add(`BookService: ${message}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.booksUrl, book, this.httpOptions).pipe(
      tap((newBook: Book) => this.log(`added book w/ id=${newBook.id}`)),
      catchError(this.handleError<Book>(`addBook`))
    )
  }

  deleteBook(book: Book | number): Observable<Book> {
    const id = typeof book === 'number' ? book : book.id;
    const url = `${this.booksUrl}/${id}`;

    return this.http.delete<Book>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted book id=${id}`)),
      catchError(this.handleError<Book>('deleteBook'))
    );
  }

  /* 検索語を含むヒーローを取得する */
  searchBooks(term: string): Observable<Book[]> {
    if (!term.trim()) {
      // 検索語がない場合、空のヒーロー配列を返す
      return of([]);
    }
    return this.http.get<Book[]>(`${this.booksUrl}/?title=${term}`).pipe(
      tap(_ => this.log(`found books matching "${term}"`)),
      catchError(this.handleError<Book[]>('searchBooks', []))
    );
  }
}
