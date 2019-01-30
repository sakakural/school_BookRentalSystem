class BookDetail {
    /**
     * ステータスfalse,貸出年月日もnull
     * @param {Number} serial ユニークな本のシリアルコード
     */
    constructor(isbn,serial) {
        /**
         * @type {Number} ISBNコード
         */
        this.isbn = isbn;
        /**
         * @type {Number} シリアル番号
         */
        this.serial = serial;
        /**
         * @type {Number} 貸出中ならidが入る。それ以外null
         */
        this.status = null;
        /**
         * @type {Date} 貸出日、貸し出してない
         */
        this.date = null;
    }
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
}

function doPost(e) {
    /**
     * @type {DB}
     */
    var json = JSON.parse(e.postData.getDataAsString());
    var SpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    var bookSheet = SpreadSheet.getSheetByName('Book');
    var bookDetailSheet = SpreadSheet.getSheetByName('BookDetail');
    var personSheet = SpreadSheet.getSheetByName('Person');

    bookSheet.clear();
    bookSheet.appendRow(['ISBN','title','Date','Code','Actor']);
    json.books.forEach(function(book){
        bookSheet.appendRow([book.isbn,book.title,book.date,book.code,book.actor]);
    });

    personSheet.clear();
    personSheet.appendRow(['ID','name','email','address','tel']);
    json.persons.forEach(function(person){
        personSheet.appendRow([person.id,person.name,person.email,person.address,person.tel]);
    });
    
    bookDetailSheet.clear();
    bookDetailSheet.appendRow(['ISBN','serial','status','date']);
    json.bookDetails.forEach(function(bookDetail){
        bookDetailSheet.appendRow([bookDetail.isbn,bookDetail.serial,bookDetail.status,bookDetail.date]);
    });

    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({ message: "success!" }));

    return output;
}

function doGet(){
    /**
     * @type {DB}
     */
    var json = new DB();
    var SpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    var bookSheet = SpreadSheet.getSheetByName('Book');
    var bookDetailSheet = SpreadSheet.getSheetByName('BookDetail');
    var personSheet = SpreadSheet.getSheetByName('Person');
    
    var bookKeys = ['isbn','title','date','dode','actor'];
    var bookData = bookSheet.getDataRange().getValues();
    bookData.shift();
    var bookDetailKeys = ['id','name','email','address','tel'];
    var bookDetailData = bookDetailSheet.getDataRange().getValues();
    bookDetailData.shift();
    var personKeys = ['ISBN','serial','status','date];
    var personData = personSheet.getDataRange().getValues();
    personData.shift();

    
}