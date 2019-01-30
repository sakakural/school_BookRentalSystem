class BookDetail {
    /**
     * ステータスfalse,貸出年月日もnull
     * @param {Number} serial ユニークな本のシリアルコード
     */
    constructor(isbn, serial) {
        this.isbn = isbn;
        this.serial = serial;
        this.status = null;
        this.date = null;
    }
    /**
     * @type {Number} ISBNコード
     */
    public isbn: Number;
    /**
     * @type {Number} シリアル番号
     */
    public serial;
    /**
     * @type {Number} 貸出中ならidが入る。それ以外null
     */
    public status;
    /**
     * @type {Date} 貸出日、貸し出してない
     */
    public date;
}
class Book {
    /**
     * 本の初期化です。何冊あってもこのデータは一つしかない方のやつ
     * @param {Number} isbn ISBNコード
     * @param {String} title 本のタイトル
     * @param {String} actor 本の著者
     * @param {Date} date 発行年月日
     * @param {Number} code 日本十進分類法のそれ
     */
    constructor(isbn, title, actor, date, code) {
        this.isbn = isbn;
        this.title = title;
        this.actor = actor;
        this.date = date;
        this.code = code;
    }
    public isbn;
    public actor;
    public title;
    public date;
    public code;
}
class Person {
    /**
     * 利用者情報の登録でち
     * @param {String} name 利用者の名前
     * @param {String} address 利用者の住所
     * @param {Number} tel 利用者の電話番号
     * @param {String} email 利用者のメールアドレス
     */
    constructor(name, address, tel, email) {
        this.name = name;
        this.address = address;
        this.tel = tel;
        this.email = email;
        this.id = null;
    }
    public name;
    public address;
    public tel;
    public email;
    public id;
}
class DB {
    constructor() {
        /**
         * 書籍データ群用配列
         * @type {Array<Book>}
         */
        this.books = [];
        /**
         * ユーザー用配列
         * @type {Array<Person>}
         */
        this.persons = [];
        /**
         * 書籍詳細情報配列
         * @type {Array<BookDetail>}
         */
        this.bookDetails = [];
    }
    public books;
    public persons;
    public bookDetails;
}

function doPost(e) {
    var json = JSON.parse(e.postData.getDataAsString());
    var SpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    var bookSheet = SpreadSheet.getSheetByName('Book');
    var bookDetailSheet = SpreadSheet.getSheetByName('BookDetail');
    var personSheet = SpreadSheet.getSheetByName('Person');

    bookSheet.clear();
    bookSheet.appendRow(['isbn', 'title', 'date', 'code', 'actor']);
    json.books.forEach(function (book) {
        bookSheet.appendRow([book.isbn, book.title, book.date, book.code, book.actor]);
    });

    personSheet.clear();
    personSheet.appendRow(['id', 'name', 'email', 'address', 'tel']);
    json.persons.forEach(function (person) {
        personSheet.appendRow([person.id, person.name, person.email, person.address, person.tel]);
    });

    bookDetailSheet.clear();
    bookDetailSheet.appendRow(['isbn', 'serial', 'status', 'date']);
    json.bookDetails.forEach(function (bookDetail) {
        bookDetailSheet.appendRow([bookDetail.isbn, bookDetail.serial, bookDetail.status, bookDetail.date]);
    });

    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({ message: "success!" }));

    return output;
}

function doGet() {
    var json = new DB();
    var SpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    var bookSheet = SpreadSheet.getSheetByName('Book');
    var bookDetailSheet = SpreadSheet.getSheetByName('BookDetail');
    var personSheet = SpreadSheet.getSheetByName('Person');

    var bookKeys = ['isbn', 'title', 'date', 'code', 'actor'];
    var booksDatas = bookSheet.getDataRange().getValues();
    booksDatas.shift();

    booksDatas.forEach(function (datas, index) {
        json.books.push({});
        datas.forEach(function (data, keyIdx) {
            json.books[index][bookKeys[keyIdx]] = data;
        });
    });

    var bookDetailKeys = ['isbn', 'serial', 'status', 'date'];
    var booksDetailDatas = bookDetailSheet.getDataRange().getValues();
    booksDetailDatas.shift();
    booksDetailDatas.forEach(function (datas, index) {
        json.bookDetails.push({});
        datas.forEach(function (data, keyIdx) {
            json.bookDetails[index][bookDetailKeys[keyIdx]] = data;
        });
    });

    var personKeys = ['id', 'name', 'email', 'address', 'tel'];
    var personsDatas = personSheet.getDataRange().getValues();
    personsDatas.shift();
    personsDatas.forEach(function (datas, index) {
        json.persons.push({});
        datas.forEach(function (data, keyIdx) {
            json.persons[index][personKeys[keyIdx]] = data;
        });
    });

    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify(json,null,'  '));

    return output;
}