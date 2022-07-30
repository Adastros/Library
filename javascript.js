let myLibrary = [],
  overlayButtonOpen = document.querySelector(".add-button"),
  overlay = document.querySelector(".overlay"),
  overlayButtonClose = document.querySelector(".close-overlay"),
  addBooktToLibraryButton = document.querySelector(".add-book-button"),
  bookGrid = document.querySelector(".grid-container"),
  form = document.querySelector("form"),
  formFields = form.elements,
  editBookFlag = false;

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;

  this.getInfo = () => {
    return [this.title, this.author, this.pages, this.read];
  };
}

function createBookCard() {
  let card = document.createElement("div"),
    editButton = createEditButtonElement(),
    newestBook = myLibrary[myLibrary.length - 1];

  card.classList.add("card", "shadow");
  card.setAttribute("data-index", myLibrary.length - 1);

  newestBook.getInfo().forEach((info, i) => {
    let infoField;

    if (i === 0) {
      infoField = document.createElement("h2");
    } else {
      infoField = document.createElement("p");
    }

    infoField.textContent = addContextToInfo(info, i);
    card.append(infoField);
  });

  addEditButtonListener(editButton);
  card.append(editButton);
  bookGrid.prepend(card);
}

// Adds more text to book information to make the text on the card readable
function addContextToInfo(info, index) {
  let contextualizedInfo = "";
  switch (index) {
    case 1:
      contextualizedInfo = `by ${info}`;
      break;
    case 2:
      contextualizedInfo = `Pages: ${info}`;
      break;
    default:
      contextualizedInfo = info;
      break;
  }

  return contextualizedInfo;
}

function createEditButtonElement() {
  let button = document.createElement("button"),
    icon = createEditIconElement();

  button.classList.add("edit");
  button.append(icon);

  return button;
}

function createEditIconElement() {
  let icon = document.createElement("img");

  icon.classList.add("icon-medium");
  icon.setAttribute("src", "./icons/pencil.svg");
  icon.setAttribute("alt", "Edit icon");

  return icon;
}

function addEditButtonListener(editButton) {
  editButton.addEventListener("click", (e) => {
    let cardIndex = e.currentTarget.parentElement.dataset.index;

    editBookFlag = true;
    fillOverlayForm(cardIndex);
    showOverlay();
  });
}

function fillOverlayForm(cardIndex) {
  let book = myLibrary[cardIndex];

  form.dataset.cardIndexEdit = cardIndex;
  book.getInfo().forEach((info, i) => {
    if (i === 3) {
      // checkbox field
      formFields[i].checked = info;
    } else {
      formFields[i].value = info;
    }
  });
}

function editBook() {
  let cardIndex = +form.dataset.cardIndexEdit,
    book = myLibrary[cardIndex];

  Object.keys(book).forEach((key, i) => {
    if (key === "read") {
      book[key] = formFields[i].checked;
    } else if (key !== "getInfo") {
      book[key] = formFields[i].value;
    }
  });
}

function updateBookDisplay() {
  let cardIndex = form.dataset.cardIndexEdit,
    book = myLibrary[cardIndex],
    cardToUpdate = document.querySelector(`[data-index="${cardIndex}"]`),
    cardFields = cardToUpdate.children;

  // Update only elements that user can change which are the first 4 elements. All other child elements ignored.
  book.getInfo().forEach((info, i) => {
    cardFields[i].textContent = addContextToInfo(info, i);
  });
  editBookFlag = false;
}

function addBooktoLibrary(title, author, pages, read) {
  myLibrary.push(new Book(title, author, pages, read));
}

function showBooksinLibrary() {
  myLibrary.forEach((book) => {
    return book.getInfo();
  });
}

function showOverlay() {
  overlay.style.width = "100%";
}

function hideOverlay() {
  overlay.style.width = "0%";
}

function clearOverlayForm() {
  for (let i = 0; i < formFields.length; i++) {
    if (formFields[i].id === "read") {
      formFields[i].checked = false;
    } else {
      formFields[i].value = "";
    }
  }
}

overlayButtonOpen.addEventListener("click", () => {
  editBookFlag = false;
  showOverlay();
});

overlayButtonClose.addEventListener("click", () => {
  editBookFlag = false;
  hideOverlay();
  clearOverlayForm();
});

addBooktToLibraryButton.addEventListener("click", () => {
  let title = formFields[0].value,
    author = formFields[1].value,
    pages = formFields[2].value,
    read = formFields[3].checked;

  if (editBookFlag) {
    editBook();
    updateBookDisplay();
  } else {
    addBooktoLibrary(title, author, pages, read);
    createBookCard();
  }

  hideOverlay();
  clearOverlayForm();
});
