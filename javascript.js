let myLibrary = [],
  html = document.getElementsByName("html");

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = () => {
    let readBook = "not read yet";

    if (this.read) {
      readBook = "read book";
    }

    return `${this.title} by ${this.author}, ${this.pages} pages, ${readBook}`;
  };
}

function addBooktoLibrary(title, author, pages, read) {
  //let title = new Book(title, author, pages, read);
  myLibrary.push(new Book(title, author, pages, read));
}

function showBooksinLibrary() {
  myLibrary.forEach((book) => {
    return book.info();
  });
}
