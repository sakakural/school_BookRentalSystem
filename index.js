class BookDetail {
    /**
     * ステータスfalse,貸出年月日もnull
     * @param {Number} serial ユニークな本のシリアルコード
     */
    constructor(serial) {
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

        /**
         * 書籍のデータを格納する配列です
         * @type {Array<BookDetail>}
         */
        this.sub = [];
    }
    /**
     * 特定の本の中からシリアル番号で検索します。
     * @param {Number} serial シリアル番号
     */
    searchSerial(serial) {
        for (var detail of this.sub)
            if (detail.serial === serial) return detail;
        return null;
    }
    /**
     * 特定の本を借りているか検索します。
     * @param {Number} id 会員番号
     * @returns {Boolean}
     */
    isLend(id) {
        for (var detail of this.sub) {
            if (detail.status == id) return true;
        }
        return false;
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
    /**
     * 会員番号を生成します。
     * @returns {Number}
     */
    generateID() {
        var id = Math.floor(Math.random() * 90000 + 10000);
        this.id = id;
        return id;
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
    }
    /**
     * ISBNから書籍を検索します。なければnullを返します。
     * @param {Number} isbn ISBNコード
     * @returns {Book} 書籍情報、またはnull
     */
    searchISBN(isbn) {
        for (let Book of this.books) if (Book.isbn === isbn) return Book;
        return null;
    }
    /**
     * シリアルコードが存在すればそれのBookDetailを返します。
     * @param {Number} isbn ISBNコード
     * @param {Number} serial シリアルコード
     * @returns {BookDetail} 書籍詳細情報、なければnull
     */
    searchSerial(isbn, serial) {
        /**
         * @type {Book}
         */
        var book;
        /**
         * @type {BookDetail}
         */
        var detail;
        if ((book = this.searchISBN(isbn)))
            if ((detail = book.searchSerial(serial))) return detail;
        return null;
    }
    /**
     * 本のタイトルから本を検索します
     * 返り値はデータベースです。
     * @param {String} title 本のタイトルの一部
     * @returns {DB}
     */
    getBooksByTitle(title) {
        /**
         * @type {DB}
         */
        var result = new DB();
        this.books.forEach(book => {
            if (book.title.includes(title)) result.books.push(book);
        });
        return result;
    }
    /**
     * 本の著者から本を検索します
     * 返り値はデータベースです。
     * @param {String} actor 本の著者の一部
     * @returns {DB}
     */
    getBooksByActor(actor) {
        /**
         * @type {DB}
         */
        var result = new DB();
        this.books.forEach(book => {
            if (book.actor.includes(actor)) result.books.push(book);
        });
        return result;
    }
    /**
     * 名前の一部から利用者を検索します。
     * 返り値はデータベースです。
     * @param {String} name 名前の一部
     * @returns {DB}
     */
    getUsersByName(name) {
        /**
         * @type {DB}
         */
        var result = new DB();
        this.persons.forEach(person => {
            if (person.name.includes(name)) result.persons.push(person);
        });
        return result;
    }
    /**
     * 本の貸し出しを登録します。成功失敗を返します。
     * @param {Number} isbn ISBNコード
     * @param {Number} serial 本のシリアルコード
     * @param {Number} id 会員番号
     * @returns {Boolean}
     */
    Rental(isbn, serial, id) {
        var abook = this.searchSerial(isbn, serial);
        if (abook && !abook.status) {
            abook.status = id;
            abook.date = Date.now();
            return true;
        }
        return false;
    }
    /**
     * 本の返却を登録します。成功失敗を返します。
     * @param {Number} isbn ISBNコード
     * @param {Number} serial 本のシリアルコード
     * @param {Number} id 会員番号
     * @returns {Boolean}
     */
    Return(isbn, serial, id) {
        var abook = this.searchSerial(isbn, serial);
        if (abook && abook.status == id) {
            abook.status = null;
            abook.date = null;
            return true;
        }
        return false;
    }
}

/**
 * querySelectorの略です。それだけです。
 * @param {string} selector そのままquerySelectorに渡します
 */
const QS = selector => document.querySelector(selector);

/**
 * createElementの略です。それだけです。
 * @param {string} tagName そのままcreateElementに渡します
 */
const CE = tagName => document.createElement(tagName);

var db = new DB();

function userRegist() {
    /**
     * 会員登録用フォーム
     * @type {HTMLFormElement}
     */
    var form = document.forms.userRegistForm;
    var name = form.Name.value;
    var address = form.address.value;
    var tel = form.tel.value;
    var email = form.email.value;

    db.persons.push(new Person(name, address, tel, email));
    alert(
        `会員番号は${db.persons[
            db.persons.length - 1
        ].generateID()}になります。`
    );
}

function bookRegist() {
    /**
     * 書籍情報登録用フォーム
     * @type {HTMLFormElement}
     */
    var form = document.forms.bookRegistForm;
    var ISBN = Number(form.ISBN.value);

    if (!db.searchISBN(ISBN)) {
        var title = form.index.value;
        var actor = form.actor.value;
        var date = new Date(form.date.value);
        var code = Number(form.code.value);

        db.books.push(new Book(ISBN, title, actor, date, code));
    } else {
        alert(
            "既に存在するISBNコードです。シリアル番号の追加は下からお願いします。"
        );
    }
}

function serialRegist() {
    /**
     * シリアル番号登録用フォーム
     * @type {HTMLFormElement}
     */
    var form = document.forms.serialRegistForm;
    var ISBN = Number(form.ISBN.value);

    if (db.searchISBN(ISBN)) {
        var serial = Number(form.serial.value);
        if (!db.searchSerial(ISBN, serial))
            db.searchISBN(ISBN).sub.push(new BookDetail(serial));
        else alert("どうやら既に存在するシリアルコードのようです。");
    } else {
        alert(
            "一致するISBNコードが無いようです、書籍データから作ってください。"
        );
    }
}

function Rental() {
    /**
     * 貸出情報登録用フォーム
     * @type {HTMLFormElement}
     */
    var form = document.forms.rental_returnForm;
    var isbn = Number(form.isbn.value);
    var serial = Number(form.serial.value);
    var id = Number(form.iden.value);

    if (db.Rental(isbn, serial, id)) {
    } else alert("本の貸し出しに失敗しました");
}
function Return() {
    /**
     * 貸出情報登録用フォーム
     * @type {HTMLFormElement}
     */
    var form = document.forms.rental_returnForm;
    var isbn = Number(form.isbn.value);
    var serial = Number(form.serial.value);
    var id = Number(form.iden.value);

    if (db.Return(isbn, serial, id)) {
    } else alert("本の返却に失敗しました");
}

function search() {
    /**
     * 貸出情報登録用フォーム
     * @type {HTMLFormElement}
     */
    var form = document.forms.bookSearchForm;
    var title = form.index.value;

    var result = db.getBooksByTitle(title);
    showBooks(result);
}

/**
 * データベースの中の本を表で表示します
 * @param {DB} database データベース
 */
function showBooks(database) {
    var table = document.createElement("table");

    table.appendChild((() => {
        var thead = document.createElement("thead");
        thead.appendChild((() => {
            var headline = CE("tr");
            Object.keys(database.books[0]).forEach((key) => {
                headline.appendChild((() => {
                    var column = CE('th');
                    column.innerText = key;
                    return column;
                })());
            });
            return headline;
        })());
        return thead;
    })());

    table.appendChild((() => {
        var tbody = document.createElement("tbody");
        database.books.forEach(book => {
            tbody.appendChild((() => {
                var record = document.createElement("tr");
                Object.keys(book).forEach((key) => {
                    record.appendChild((() => {
                        var colElement = CE("td");
                        if (key == 'date')
                            colElement.innerText = getDateString(book[key]);
                        else
                            colElement.innerText = book[key];
                        return colElement;
                    })());
                });
                return record;
            })());
        });
        return tbody;
    })());

    QS('.resultArea').innerHTML = '';
    QS('.resultArea').appendChild(table);
}

/**
* Dateインスタンスを'YYYY年MM月DD日'形式で返します。
* @param {Date} date 年月日
* @returns {String}
*/
function getDateString(date) {
    var result = '';
    result = `${date.getFullYear()}年${('  ' + (date.getMonth() + 1)).substr(-2)}月${('  ' + date.getDate()).substr(-2)}日`;
    return result;
}

function output() {
    QS("#exportArea").value = JSON.stringify(db, null, "  ");
    QS("#exportArea").style.display = "block";
}

/**
 * タブを変更したときの関数
 * @param {Event} e FireFoxの場合ここにイベント発行元のオブジェクトが来ます。
 */
function tabChange(e) {
    if (!e) e = event;
    /**
     * @type {Element}
     */
    var target = e.target;
    document.querySelectorAll("body form").forEach(element => {
        if (element.name === target.className + "Form")
            element.style.display = "table";
        else element.style.display = "none";
    });
    document.querySelectorAll("nav li").forEach(element => {
        if (element.classList.contains("selected"))
            element.classList.remove("selected");
    });
    target.classList.add("selected");
}

(() => {
    document.querySelectorAll("nav li").forEach(element => {
        element.addEventListener("click", tabChange);
    });
    document.querySelectorAll("form").forEach(element => {
        element.style.display = "none";
    });

    //テストデータ挿入,データは適当
    db.books.push(new Book(5784932643,'吾輩は猫である','夏目漱石',new Date('Fri Jan 25 2019 09:00:00 GMT+0900 (日本標準時)'),0));
    db.books[db.books.length -1].sub.push(new BookDetail(1))
    db.books.push(new Book(6243251643,'坊ちゃん','夏目漱石',new Date('Thu Jan 24 2019 09:00:00 GMT+0900 (日本標準時)'),0));
    db.books[db.books.length -1].sub.push(new BookDetail(2))
    db.books.push(new Book(5431903042,'学問のすゝめ','福沢諭吉',new Date('Wed Jan 23 2019 09:00:00 GMT+0900 (日本標準時)'),0));
    db.books[db.books.length -1].sub.push(new BookDetail(3))
    db.persons.push(new Person('鈴木','北海道','080xxxxxxxx','aaaa@example.com'));
    db.persons[db.persons.length-1].generateID();
    db.persons.push(new Person('佐藤','青森県','080yyyyyyyy','bbbb@example.com'));
    db.persons[db.persons.length-1].generateID();
    db.persons.push(new Person('田中','秋田県','080zzzzzzzz','cccc@example.com'));
    db.persons[db.persons.length-1].generateID();
})();
