function doPost(e) {
  var json = JSON.parse(e.postData.getDataAsString());
  var SpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var bookSheet = SpreadSheet.getSheetByName('Book');
  var bookDetailSheet = SpreadSheet.getSheetByName('BookDetail');
  var personSheet = SpreadSheet.getSheetByName('Person');

  bookSheet.clear();
  bookSheet.appendRow(['isbn','title','Date','code','Actor']);
  json.books.forEach(function(book){
      bookSheet.appendRow([book.isbn,book.title,book.date,book.code,book.actor]);
  });

  personSheet.clear();
  personSheet.appendRow(['id','name','email','address','tel']);
  json.persons.forEach(function(person){
      personSheet.appendRow([person.id,person.name,person.email,person.address,person.tel]);
  });
  
  bookDetailSheet.clear();
  bookDetailSheet.appendRow(['isbn','serial','status','date']);
  json.bookDetails.forEach(function(bookDetail){
      bookDetailSheet.appendRow([bookDetail.isbn,bookDetail.serial,bookDetail.status,bookDetail.date]);
  });

  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify({ message: "success!" }));

  return output;
}

function doGet(){
  var json = new DB();
  var SpreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var bookSheet = SpreadSheet.getSheetByName('Book');
  var bookDetailSheet = SpreadSheet.getSheetByName('BookDetail');
  var personSheet = SpreadSheet.getSheetByName('Person');
  
  var bookKeys = ['isbn','title','date','code','actor'];
  var booksDatas = bookSheet.getDataRange().getValues();
  booksDatas.shift();
  
  booksDatas.forEach(function(Datas,index){
      Datas.forEach(function(data,keyIdx){
          json.books[index][bookKeys[keyIdx]] = data;
      });
  });

  var bookDetailKeys = ['id','name','email','address','tel'];
  var booksDetailDatas = bookDetailSheet.getDataRange().getValues();
  booksDetailDatas.shift();
  booksDetailDatas.forEach(function(Datas,index){
      Datas.forEach(function(data,keyIdx){
          json.bookDetails[index][bookDetailKeys[keyIdx]] = data;
      });
  });

  var personKeys = ['isbn','serial','status','date'];
  var personsDatas = personSheet.getDataRange().getValues();
  personsDatas.shift();
  personsDatas.forEach(function(Datas,index){
      Datas.forEach(function(data,keyIdx){
          json.persons[index][personKeys[keyIdx]] = data;
      });
  });

  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  output.setContent(JSON.stringify(json));

  return output;
}