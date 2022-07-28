let myLibrary = [],
  overlayButtonOpen = document.querySelector(".add-button"),
  overlay = document.querySelector(".overlay"),
  overlayButtonClose = document.querySelector(".close-overlay"),
  addBooktToLibraryButton = document.querySelector(".add-book-button"),
  bookGrid = document.querySelector(".grid-container"),
  form = document.querySelector("form"),
  formFields = form.elements;

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = () => {
    let readBook = this.read ? "read book" : "not read yet";

    return [this.title, `by ${this.author}`,  `Pages: ${this.pages}`, readBook];
  };
}

function createBookCard() {
  let card = document.createElement("div"),
    newestBook = myLibrary[myLibrary.length - 1];

  card.classList.add("card", "shadow");

  newestBook.info().forEach((info,i) => {
    let infoField = (i === 0) ? document.createElement("h2") : document.createElement("p");
    
    infoField.textContent = info;
    card.append(infoField);
  });

  bookGrid.prepend(card);
}

function addBooktoLibrary(title, author, pages, read) {
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
  createBookCard();
  hideOverlay();
});
