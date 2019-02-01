class BookDetail {
    /**
     * ステータスfalse,貸出年月日もnull
     * @param {Number} serial ユニークな本のシリアルコード
     */
    constructor(isbn, serial) {
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
    /**
     * 会員番号を生成します。被ります。適当に判定してください。
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
        /**
         * 書籍詳細情報配列
         * @type {Array<BookDetail>}
         */
        this.bookDetails = [];
    }
    /**
     * ISBNコードからBookDetailを取ってきます
     * @param {Number} isbn 書籍ISBNコード
     * @returns {Array<BookDetail>}
     */
    getBookDetailsByISBN(isbn) {
        /**
         * @type {Array<BookDetail>}
         */
        var result = [];
        this.bookDetails.forEach((bookDetail) => {
            if (bookDetail.isbn == isbn)
                result.push(bookDetail);
        });
        return result;
    }
    /**
     * ISBNから書籍を検索します。なければnullを返します。
     * @param {Number} isbn ISBNコード
     * @returns {Book} 書籍情報、またはnull
     */
    getBookByISBN(isbn) {
        var result = null;
        this.books.forEach(book => {
            if (book.isbn === isbn) result = book;
        });
        return result;
    }
    /**
     * ISBNから書籍のインデックスを検索します。なければnullを返します。
     * @param {Number} isbn ISBNコード
     * @returns {Number}
     */
    getBookIdxByISBN(isbn) {
        var result = null;
        this.books.forEach((book, index) => {
            if (book.isbn === isbn) result = index;
        });
        return result;
    }
    /**
     * シリアルコードが存在すればそれのBookDetailを返します。
     * @param {Number} isbn ISBNコード
     * @param {Number} serial シリアルコード
     * @returns {BookDetail} 書籍詳細情報、なければnull
     */
    getBookDetailByISBNSerial(isbn, serial) {
        /**
         * @type {BookDetail}
         */
        var result = null;
        this.bookDetails.forEach((bookDetail) => {
            if (bookDetail.isbn == isbn && bookDetail.serial == serial)
                result = bookDetail;
        });
        return result;
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
        if (title)
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
        if (actor)
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
     * 会員番号から会員を返します。無しはnullです。
     * @param {Number} id 会員番号
     * @returns {Person}
     */
    getUserByID(id) {
        var result = null;
        this.persons.forEach(person => {
            if (person.id == id) result = person;
        });
        return result;
    }
    /**
     * 会員番号から会員のインデックスを返します。無しはnullです。
     * @param {Number} id 会員番号
     * @returns {Number}
     */
    getUserIdxByID(id) {
        var result = null;
        this.persons.forEach((person, index) => {
            if (person.id == id) result = index;
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
        var abook = this.getBookDetailByISBNSerial(isbn, serial);
        if (abook && !abook.status) {
            abook.status = id;
            abook.date = new Date(Date.now());
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
        var abook = this.getBookDetailByISBNSerial(isbn, serial);
        if (abook && abook.status == id) {
            abook.status = null;
            abook.date = null;
            return true;
        }
        return false;
    }
    /**
     * 同志を合体します。
     * @param {DB} db 併合元
     */
    marge(db) {
        db.persons.forEach(person => {
            if (!this.getUserByID(person.id)) this.persons.push(person);
        });
        db.books.forEach(book => {
            if (!this.getBookByISBN(book.isbn)) this.books.push(book);
        });
    }
    //diff(db){
    //    db.persons.forEach((person)=>{
    //        var p = this.getUserIdxByID(person.id);
    //        if(p)
    //            this.persons.splice(p,1);
    //    });
    //    db.books.forEach((book)=>{
    //        var b = this.getBookIdxByISBN(book.isbn);
    //        if(b)
    //            this.books.splice(b,1);
    //    });
    //}
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
    //alert(
    //    `会員番号は${generateID()}になります。`
    //);
    generateID();

    /**
     * db.personsの配列の最後のPersonにIDを生成します。被りは起こしません。
     */
    function generateID() {
        var person = db.persons[db.persons.length - 1];
        while (db.getUserByID(person.generateID()));
        return person.id;
    }
}

function bookRegist() {
    /**
     * 書籍情報登録用フォーム
     * @type {HTMLFormElement}
     */
    var form = document.forms.bookRegistForm;
    var ISBN = Number(form.ISBN.value);

    if (!db.getBookByISBN(ISBN)) {
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

/**
 * ISBNから本を特定してシリアル番号登録します
 */
function serialRegist() {
    var ISBN = QS("#Book tr.selected").book.isbn;

    if (db.getBookByISBN(ISBN)) {
        var serial = Number(document.forms.serialRegistForm.serial.value);
        if (!db.getBookDetailByISBNSerial(ISBN, serial))
            db.bookDetails.push(new BookDetail(ISBN, serial));
        else alert("どうやら既に存在するシリアルコードのようです。");
    } else {
        alert(
            "一致するISBNコードが無いようです、書籍データから作ってください。"
        );
    }
    QS("#Book .selected").be;
}

function Rental() {
    /**
     * 貸出情報登録用フォーム
     * @type {HTMLFormElement}
     */
    var form = document.forms.rental_returnForm;
    var isbn = Number(form.ISBN.value);
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
    var isbn = Number(form.ISBN.value);
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
    var actor = form.actor.value;

    var result = db.getBooksByTitle(title);
    //if(form.andor.value=='AND')
    //    result.diff(db.getBooksByActor(actor));
    //else
    result.marge(db.getBooksByActor(actor));

    showBooks(result);
}

/**
 * データベースの中の本を表で表示します
 * @param {DB} database データベース
 */
function showBooks(database) {
    var table = document.createElement("table");

    table.appendChild(createHeadline(database));
    table.appendChild(listBookRecoads(database));

    QS(".resultArea").innerHTML = "";
    QS(".resultArea").appendChild(table);
}

/**
 * 書籍リストをtbodyで書きだします。適当なtableに突っ込んでください。
 * @param {DB} database データベース
 * @returns {HTMLTableSectionElement}
 */
function listBookRecoads(database) {
    var tbody = document.createElement("tbody");
    database.books.forEach(book => {
        tbody.appendChild(
            (() => {
                var record = document.createElement("tr");
                Object.keys(book).forEach(key => {
                    if (key != "sub")
                        record.appendChild(
                            (() => {
                                var colElement = CE("td");
                                if (key == "date")
                                    colElement.innerText = getDateString(
                                        book[key]
                                    );
                                else colElement.innerText = book[key];
                                return colElement;
                            })()
                        );
                });
                record.book = book;
                return record;
            })()
        );
    });
    return tbody;
}

/**
 * 会員リストをtbodyで書きだします。適当なtableに突っ込んでください。
 * @param {DB} database データベース
 * @returns {HTMLTableSectionElement}
 */
function listPersonRecoads(database) {
    var tbody = document.createElement("tbody");
    database.persons.forEach(person => {
        tbody.appendChild(
            (() => {
                var record = document.createElement("tr");
                Object.keys(person).forEach(key => {
                    record.appendChild(
                        (() => {
                            var colElement = CE("td");
                            colElement.innerText = person[key];
                            return colElement;
                        })()
                    );
                });
                record.person = person;
                return record;
            })()
        );
    });
    return tbody;
}

/**
 * 書籍リスト用の見出しを作成します。theadで返します。
 * @param {DB} database データベース
 * @returns {HTMLTableSectionElement}
 */
function createHeadline(database) {
    var thead = document.createElement("thead");
    thead.appendChild(
        (() => {
            var headline = CE("tr");
            Object.keys(database.books[0]).forEach(key => {
                if (key != "sub")
                    headline.appendChild(
                        (() => {
                            var column = CE("th");
                            column.innerText = key;
                            return column;
                        })()
                    );
            });
            return headline;
        })()
    );
    return thead;
}

/**
 * Dateインスタンスを'YYYY年MM月DD日'形式で返します。
 * @param {Date} date 年月日
 * @returns {String}
 */
function getDateString(date) {
    var result = "";
    if (date)
        result = `${date.getFullYear()}年${(
            "  " +
            (date.getMonth() + 1)
        ).substr(-2)}月${("  " + date.getDate()).substr(-2)}日`;
    return result;
}

//function output() {
//    QS("#exportArea").value = JSON.stringify(db, null, "  ");
//    QS("#exportArea").style.display = "block";
//}

/**
 * 書籍情報のテーブルのtbodyに書籍リストをセットします。
 */
function viewBookList() {
    QS("#Book tbody").replaceWith(listBookRecoads(db));
    document.querySelectorAll("#Book tbody tr").forEach(row => {
        row.addEventListener("click", e => {
            try {
                QS("#Book tbody tr.selected").classList.remove("selected");
            } catch { }
            if (!e) e = event;
            var target = e.target;
            while (target.tagName != "TR") {
                target = target.parentElement;
            }
            target.classList.add("selected");
            QS("#Detail tbody").replaceWith(viewBookDetail(target.book));
        });
    });
}

/**
 * 書籍詳細情報をtbodyで書きだします。適当なtableに突っ込んでください。
 * @param {Book} book 書籍情報
 * @returns {HTMLTableSectionElement}
 */
function viewBookDetail(book) {
    var tbody = CE("tbody");
    db.getBookDetailsByISBN(book.isbn).forEach(detail => {
        var record = CE("tr");
        Object.keys(detail).forEach(key => {
            if (key == 'isbn')
                return;
            var col = CE("td");
            if (key == "date") col.innerText = getDateString(detail[key]);
            else col.innerText = detail[key];
            record.appendChild(col);
        });
        tbody.appendChild(record);
    });
    return tbody;
}

/**
 * 指定されたHTMLタグまで親に上ります。
 * @param {HTMLElement} element HTMLエレメント
 * @param {String} tagName HTMLタグの名前
 * @returns {HTMLElement}
 */
function goBackByTagName(element, tagName) {
    tagName = tagName.toUpperCase();
    while (element.tagName != tagName) element = element.parentElement;
    return element;
}

/**
 * 会員情報のテーブルのtbodyに会員リストをセットします。
 */
function viewPersonList() {
    QS("#Person tbody").replaceWith(listPersonRecoads(db));
}

var gasDBUrl = "https://script.google.com/macros/s/AKfycbwgv5NQ9D6OTQyqoZ8k7niQCqM9gZMvfcyb6xISpxMPb5gYL54T/exec";

function save() {
    var request = new XMLHttpRequest();
    request.open("POST", gasDBUrl, true);
    request.onreadystatechange = () => {
        if (request.readyState != 4 || request.status != 200) return;
        console.log(request.responseText);
    };
    var json = JSON.stringify(db)
    console.log(json);
    request.send(json);
}

function load() {
    var request = new XMLHttpRequest();
    request.open("GET", gasDBUrl, true);
    request.onreadystatechange = () => {
        var json = JSON.parse(request.responseText);
        Object.keys(json).forEach((k) => {
            json[k].forEach((table) => {
                Object.keys(table).forEach((key) => {
                    if (key == 'date')
                        table[key] = new Date(String(table[key]));
                });
            });
            db[k] = json[k];
        });
        return;
    };
    request.send();
}

//書籍情報登録フォーム用
(() => {
    QS('#Book input[value="登録"]').addEventListener("click", viewBookList);
    QS("#bookRegistShow").addEventListener("click", registButtonClick);
    var toggle = false;
    function registButtonClick(e) {
        if (!e) e = event;
        var target = goBackByTagName(e.target, "tr");
        if (!toggle) {
            target.classList.add("showed");
            document.querySelectorAll("#Book .bookRegistForm").forEach(trow => {
                trow.style.display = "table-row";
            });
        } else {
            target.classList.remove("showed");
            document.querySelectorAll("#Book .bookRegistForm").forEach(trow => {
                trow.style.display = "none";
            });
        }
        toggle = !toggle;
    }
})();

//会員情報登録フォーム用
(() => {
    QS('#Person input[value="登録"]').addEventListener("click", viewPersonList);
    QS("#userRegistShow").addEventListener("click", registButtonClick);
    var toggle = false;
    function registButtonClick(e) {
        if (!e) e = event;
        var target = goBackByTagName(e.target, "tr");
        if (!toggle) {
            target.classList.add("showed");
            document
                .querySelectorAll("#Person .userRegistForm")
                .forEach(trow => {
                    trow.style.display = "table-row";
                });
        } else {
            target.classList.remove("showed");
            document
                .querySelectorAll("#Person .userRegistForm")
                .forEach(trow => {
                    trow.style.display = "none";
                });
        }
        toggle = !toggle;
    }
})();

(() => {
    var sections = new Object();
    document.querySelectorAll('main>section').forEach((section) => {
        sections[section.className] = section;
        section.remove();
    });

    document.querySelectorAll("nav li").forEach(list => {
        list.addEventListener("click", tabChange);
    });

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
        if(QS('.unselected')){
            QS('.unselected').classList.remove('unselected');
            QS('main').appendChild(sections[target.className]);
        }
        else{
            var prev = QS('main>section');
            sections[prev.className] = prev;
            prev.remove();

            QS('main').appendChild(sections[target.className]);
            switch(target.className){
                case 'bookRegist':
                    viewBookList();
                break;
                case 'userRegist':
                    viewPersonList();
                break;
            }
        }
    }
})();