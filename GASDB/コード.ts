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
    /**
     * 書籍データ群用配列
     */
    public books = new Array<Book>();
    /**
     * ユーザー用配列
     */
    public persons = new Array<Person>();
    /**
     * 書籍詳細情報配列
     */
    public bookDetails = new Array<BookDetail>();
}

function doPost(e) {
    var json: DB;
    json = JSON.parse(e.postData.getDataAsString());
    var SpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    
    Object.keys(json).forEach((tableName) => {
        var sheet = SpreadSheet.getSheetByName(tableName);
        sheet.clear();
        sheet.appendRow(Object.keys(json[tableName][0]));
        json[tableName].forEach((record: Array<String>) => {
            var row = new Array<String>();
            Object.keys(record).forEach((data) => {
                row.push(record[data]);
            });
            sheet.appendRow(row);
        });
    });

    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({ message: "success!" }));

    return output;
}

function doGet() {
    var json = new DB();
    var SpreadSheet = SpreadsheetApp.getActiveSpreadsheet();

    Object.keys(new DB).forEach((tableName)=>{
        var sheet = SpreadSheet.getSheetByName(tableName);
        var datas = sheet.getDataRange().getValues();
        var top = datas.shift();
        var headlines = new Array<string>();
        top.forEach((data)=>{
            headlines.push(data.toString())
        });
        datas.forEach((record)=>{
            var row = new Object;
            record.forEach((value,idx)=>{
                row[headlines[idx]] = value;
            });
            json[tableName].push(row);
        });
    });

    var output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify(json, null, '  '));

    return output;
}