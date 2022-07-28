let myLibrary = [],
  overlayButtonOpen = document.querySelector(".create-button"),
  overlay = document.querySelector(".overlay"),
  overlayButtonClose = document.querySelector(".close-overlay"),
  addBooktToLibraryButton = document.querySelector(".add-book-button"),
  form = document.querySelector("form"),
  formFields = form.elements;

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

function showOverlay() {
  overlay.style.width = "100%";
}

function hideOverlay() {
  overlay.style.width = "0%";
}

overlayButtonOpen.addEventListener("click", () => {
  showOverlay();
});

overlayButtonClose.addEventListener("click", () => {
  hideOverlay();
});

addBooktToLibraryButton.addEventListener("click", () => {
  let title = formFields[0].value,
    author = formFields[1].value,
    pages = formFields[2].value,
    read = formFields[3].checked;

  addBooktoLibrary(title, author, pages, read);
  hideOverlay();
});
