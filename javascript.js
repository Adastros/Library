let myLibrary = [],
  overlayButtonOpen = document.querySelector(".add-button"),
  demoButton = overlayButtonOpen.nextElementSibling,
  listViewButton = overlayButtonOpen.parentElement.nextElementSibling.firstElementChild,
  gridViewButton = listViewButton.nextElementSibling,
  overlay = document.querySelector(".overlay"),
  overlayButtonClose = document.querySelector(".close-overlay"),
  submitBookButton = document.querySelector(".add-book-button"),
  bookGrid = document.querySelector(".grid-container"),
  form = document.querySelector("form"),
  formFields = form.elements,
  deleteButton = formFields[formFields.length - 1],
  numOfFieldsToValidate = formFields.length - 2,
  editBookFlag = false;

const formFieldObjs = {
  title: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please enter a book title.",
  },
  author: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please enter an author for the book.",
  },
  pagesRead: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please enter the amount of pages you've read.",
    rangeUnderflowErrorMessage:
      "Please enter a valid number for the pages read.",
    rangeOverflowErrorMessage:
      "Please enter a valid number under 50,000 for the pages read.",
  },
  readStatus: {
    validateAggressive: false,
    valueMissingErrorMessage: "Please select a read status.",
  },
};

function checkForErrorType(formField) {
  if (formField.validity.valueMissing) {
    displayErrorMessage(formField, "valueMissingErrorMessage");
    setErrorState(formField);
  } else if (formField.validity.rangeUnderflow) {
    displayErrorMessage(formField, "rangeUnderflowErrorMessage");
    setErrorState(formField);
  } else if (formField.validity.rangeOverflow) {
    displayErrorMessage(formField, "rangeOverflowErrorMessage");
    setErrorState(formField);
  } else {
    setValidState(formField);
  }
}

function displayErrorMessage(formField, messageType) {
  let ErrorMessageField =
      formField.parentElement.nextElementSibling.firstElementChild,
    errorMessage = formFieldObjs[formField.name][messageType];

  if (errorMessage) {
    ErrorMessageField.textContent = errorMessage;
  } else {
    console.log(
      `Error: ${formField.name} does not have a corresponding ${messageType}.`
    );
  }
}

function setErrorState(formField) {
  removeAsValid(formField);
  setAsError(formField);
  showErrorField(formField);
  showErrorIcon(formField);
  showIcon(formField);
}

function setValidState(formField) {
  removeAsError(formField);
  hideErrorField(formField);
  setAsValid(formField);
  showValidIcon(formField);
  showIcon(formField);
}

function resetValidationState() {
  for (let i = 0; i < numOfFieldsToValidate; i++) {
    removeAsValid(formFields[i]);
    removeAsError(formFields[i]);
    hideErrorField(formFields[i]);
    hideFormIcons(formFields[i]);
  }
}

function setAsError(formField) {
  if (!formField.classList.contains("error")) {
    formField.classList.toggle("error");
  }
}

function removeAsError(formField) {
  if (formField.classList.contains("error")) {
    formField.classList.toggle("error");
  }
}

function showErrorField(formField) {
  let errorField = formField.parentElement.nextElementSibling;

  if (errorField.classList.contains("hide")) {
    errorField.classList.toggle("hide");
  }
}

function hideErrorField(formField) {
  let errorField = formField.parentElement.nextElementSibling;

  if (!errorField.classList.contains("hide")) {
    errorField.classList.toggle("hide");
    errorField.firstElementChild.textContent = "";
  }
}

function setAsValid(formField) {
  if (!formField.classList.contains("valid")) {
    formField.classList.toggle("valid");
  }
}

function removeAsValid(formField) {
  if (formField.classList.contains("valid")) {
    formField.classList.toggle("valid");
  }
}

function showIcon(formField) {
  let icon = formField.parentElement,
    visibility = window
      .getComputedStyle(icon, "::after")
      .getPropertyValue("visibility");

  if (visibility === "hidden") {
    icon.style.setProperty("--visibility", "visible");
  }
}

function hideFormIcons(formField) {
  let icon = formField.parentElement,
    visibility = window
      .getComputedStyle(icon, "::after")
      .getPropertyValue("visibility");

  if (visibility !== "hidden") {
    icon.style.setProperty("--visibility", "hidden");
  }
}

function showErrorIcon(formField) {
  let icon = formField.parentElement;

  icon.style.setProperty(
    "--icon-url",
    `url("./icons/error_FILL0_wght400_GRAD0_opsz48.svg")`
  );
}

function showValidIcon(formField) {
  let icon = formField.parentElement;

  icon.style.setProperty(
    "--icon-url",
    `url("./icons/check_circle_FILL0_wght400_GRAD0_opsz48-green.svg")`
  );
}

function setAggressiveValidation(formField, bool) {
  formFieldObjs[formField].validateAggressive = bool;
}

function getAggressiveValidation(formField) {
  return formFieldObjs[formField].validateAggressive;
}

function validateOnSubmit() {
  for (let i = 0; i < numOfFieldsToValidate; i++) {
    if (!formFields[i].validity.valid) {
      checkForErrorType(formFields[i]);
      setAggressiveValidation(formFields[i].name, true);
    }
  }
}

function Book(title, author, pages, readStatus) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;

  this.getInfo = () => {
    return [this.title, this.author, this.pages, this.readStatus];
  };
}

function createBookCard() {
  let card = document.createElement("div"),
    editButton = createEditButtonElement(),
    newestBook = myLibrary[myLibrary.length - 1];

  if (bookGrid.classList.contains("grid-view")) {
    card.classList.add("card-style");
  } else {
    card.classList.add("list-style");
  }
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

  if (bookGrid.classList.contains("grid-view")) {
    button.classList.add("edit-card-style");
  } else {
    button.classList.add("edit-list-style");
  }
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
    let cardIndex = +e.currentTarget.parentElement.dataset.index;

    editBookFlag = true;
    fillOverlayForm(cardIndex);
    showDeleteButton();
    showOverlay();
  });
}

function fillOverlayForm(cardIndex) {
  let book = myLibrary[cardIndex];

  form.dataset.cardIndexEdit = cardIndex;
  book.getInfo().forEach((info, i) => {
    formFields[i].value = info;
  });
}

function showDeleteButton() {
  if (deleteButton.classList.contains("hide")) {
    deleteButton.classList.toggle("hide");
  }
}

function hideDeleteButton() {
  if (!deleteButton.classList.contains("hide")) {
    deleteButton.classList.toggle("hide");
  }
}

function editBook() {
  let cardIndex = +form.dataset.cardIndexEdit,
    book = myLibrary[cardIndex];

  Object.keys(book).forEach((key, i) => {
    if (key !== "getInfo") {
      book[key] = formFields[i].value;
    }
  });
}

function updateBookDisplay() {
  let cardIndex = form.dataset.cardIndexEdit,
    book = myLibrary[cardIndex],
    cardToUpdate = document.querySelector(`[data-index="${cardIndex}"]`),
    cardFields = cardToUpdate.children;

  // Update only elements that user can change which are the first 4 elements.
  // All other child elements ignored.
  book.getInfo().forEach((info, i) => {
    cardFields[i].textContent = addContextToInfo(info, i);
  });
  editBookFlag = false;
}

function addBooktoLibrary(title, author, pages, readStatus) {
  myLibrary.push(new Book(title, author, pages, readStatus));
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
  for (let i = 0; i < numOfFieldsToValidate; i++) {
    if (formFields[i].name === "readStatus") {
      formFields[i].value = "";
    } else {
      formFields[i].value = "";
    }
  }
}

function resetForm() {
  resetValidationState();
  clearOverlayForm();
  hideDeleteButton();
}

function deleteBookFromLibrary() {
  let cardIndex = +form.dataset.cardIndexEdit,
    card = document.querySelector(`[data-index="${cardIndex}"]`);

  myLibrary.splice(cardIndex, 1);
  updateCardIndex(cardIndex, card);
  card.remove();
  hideOverlay();
  resetForm();
}

function updateCardIndex(cardIndex, card) {
  let cardToUpdate = card.previousElementSibling;

  // library length is 1 less due to splice
  while (cardIndex < myLibrary.length) {
    cardToUpdate.dataset.index = cardIndex;
    cardToUpdate = cardToUpdate.previousElementSibling;
    cardIndex++;
  }
}

function updateLibraryView(view, viewStyle) {
  if (!bookGrid.classList.contains(view)) {
    updateView();
    updateBookInfoDisplay(viewStyle);
  }
}

function updateView() {
  bookGrid.classList.toggle("list-view");
  bookGrid.classList.toggle("grid-view");
}

function updateBookInfoDisplay(viewStyle) {
  let allBooksInLibrary = document.querySelectorAll(".card");

  allBooksInLibrary.forEach((book) => {
    let editBtn = book.lastElementChild;
    if (!book.classList.contains(viewStyle)) {
      book.classList.toggle("card-style");
      book.classList.toggle("list-style");
    }
    if (!editBtn.classList.contains("edit-" + viewStyle)) {
      editBtn.classList.toggle("edit-card-style");
      editBtn.classList.toggle("edit-list-style");
    }
  });
}

overlayButtonOpen.addEventListener("click", () => {
  editBookFlag = false;
  showOverlay();
});

overlayButtonClose.addEventListener("click", () => {
  editBookFlag = false;
  hideOverlay();
  resetForm();
});

listViewButton.addEventListener("click", (e) => {
  let view = e.currentTarget.dataset.view,
    viewStyle = e.currentTarget.dataset.viewStyle;
  updateLibraryView(view, viewStyle);
});

gridViewButton.addEventListener("click", (e) => {
  let view = e.currentTarget.dataset.view,
    viewStyle = e.currentTarget.dataset.viewStyle;
  updateLibraryView(view, viewStyle);
});

deleteButton.addEventListener("click", (e) => {
  deleteBookFromLibrary(e.currentTarget);
});

form.addEventListener("submit", (e) => {
  validateOnSubmit();

  if (!form.querySelector(".error")) {
    let bookInfo = [];

    for (let i = 0; i < numOfFieldsToValidate; i++) {
      bookInfo.push(formFields[i].value);
    }

    if (editBookFlag) {
      editBook();
      updateBookDisplay();
    } else {
      addBooktoLibrary(...bookInfo);
      createBookCard();
    }

    hideOverlay();
    resetForm();
  }

  e.preventDefault();
});

// Lazy form validation
// Trigger aggressive validation once out of focus
// No need to check submit button for errors
for (let i = 0; i < numOfFieldsToValidate; i++) {
  formFields[i].addEventListener("focusout", (e) => {
    if (!e.target.validity.valid) {
      checkForErrorType(e.target);
      setAggressiveValidation(e.target.name, true);
    } else {
      setValidState(e.target);
      setAggressiveValidation(e.target.name, false);
    }
  });
}

// Aggressive form validation
// Resets/ disabled when form field is valid
// No need to validate submit button for errors
for (let i = 0; i < numOfFieldsToValidate; i++) {
  formFields[i].addEventListener("input", (e) => {
    if (getAggressiveValidation(e.target.name)) {
      if (!e.target.validity.valid) {
        checkForErrorType(e.target);
      } else {
        setValidState(e.target);
        setAggressiveValidation(e.target.name, false);
      }
    }
  });
}
