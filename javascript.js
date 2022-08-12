let bodyElement = document.querySelector("body"),
  overlayButtonOpen = document.querySelector(".add-button"),
  demoButton = overlayButtonOpen.nextElementSibling,
  listViewButton =
    overlayButtonOpen.parentElement.nextElementSibling.firstElementChild,
  gridViewButton = listViewButton.nextElementSibling,
  formOverlay = document.querySelector(".submit-edit-form"),
  overlayButtonClose = document.querySelector(".close-overlay"),
  bookGrid = document.querySelector(".grid-container"),
  form = document.querySelector("form"),
  formFields = form.elements,
  firstFormInput = formFields[0],
  deletionConfirmationOverlay = document.querySelector(".delete-confirmation"),
  deleteConfirmation = document.querySelector(".delete-confirmation-container"),
  deletionButtonYes = document.querySelector(".delete-button"),
  deletionButtonNo = document.querySelector(".no-button"),
  numOfFieldsToValidate = formFields.length - 2,
  editBookFlag = false;

let myLibrary = [];

const demoLibraryData = [
  {
    title: "The Hobbit",
    author: "J. R. R. Tolkien",
    pages: 310,
    readStatus: "Want to Read",
  },
  {
    title: "Infernal Devices",
    author: "K.W. Jeter",
    pages: 384,
    readStatus: "Reading",
  },
  {
    title:
      "Some We Love, Some We Hate, Some We Eat: Why It's So Hard to Think Straight About Animals",
    author: "Hal Herzog",
    pages: 326,
    readStatus: "Want to Read",
  },
  {
    title: "Delicate Edible Birds and Other Stories",
    author: "Lauren Groff",
    pages: 306,
    readStatus: "Finished Reading",
  },
  {
    title: "You Have a Friend in 10A: Stories",
    author: "Maggie Shipstead",
    pages: 272,
    readStatus: "Stopped Reading",
  },
  {
    title:
      "Talking to Strangers: What We Should Know About the People We Don’t Know",
    author: "Malcolm Gladwell",
    pages: 388,
    readStatus: "Want to Read",
  },
];

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
  switch (true) {
    case formField.validity.valueMissing:
      displayErrorMessage(formField, "valueMissingErrorMessage");
      break;
    case formField.validity.rangeUnderflow:
      displayErrorMessage(formField, "rangeUnderflowErrorMessage");
      break;
    case formField.validity.rangeOverflow:
      displayErrorMessage(formField, "rangeOverflowErrorMessage");
      break;
    default:
      setValidState(formField);
      return;
  }
  setErrorState(formField);
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
  let card,
    cardClassArr = ["card", "shadow"],
    bookInfoContainer = createDivElement(["card-book-info-container"]),
    buttonContainer = createDivElement(["card-button-container"]),
    editButton = createEditButtonElement(),
    deleteButton = createDeleteButtonElement(),
    newestBook = myLibrary[myLibrary.length - 1];

  if (bookGrid.classList.contains("grid-view")) {
    cardClassArr.push("card-style");
  } else {
    cardClassArr.push("list-style");
  }

  card = createDivElement(cardClassArr);
  card.setAttribute("data-index", myLibrary.length - 1);

  bookInfoContainer = addBookInfoToCard(newestBook, bookInfoContainer);

  buttonContainer.append(editButton);
  buttonContainer.append(deleteButton);
  card.append(bookInfoContainer);
  card.append(buttonContainer);

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
      contextualizedInfo = `Pages Read: ${info}`;
      break;
    default:
      contextualizedInfo = info;
      break;
  }

  return contextualizedInfo;
}

function createDivElement(classArr) {
  let divElement = document.createElement("div");

  if (classArr) {
    divElement.classList.add(...classArr);
  }

  return divElement;
}

function addBookInfoToCard(newestBook, bookInfoContainer) {
  newestBook.getInfo().forEach((info, i) => {
    let infoField;

    if (i === 0) {
      infoField = document.createElement("h4");
    } else {
      infoField = document.createElement("p");
    }

    infoField.textContent = addContextToInfo(info, i);
    bookInfoContainer.append(infoField);
  });

  return bookInfoContainer;
}

function createEditButtonElement() {
  let button = document.createElement("button"),
    icon = createEditIconElement();

  button.append(icon);
  addEditButtonListener(button);

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
    let cardIndex = +e.currentTarget.parentElement.parentElement.dataset.index;

    editBookFlag = true;
    fillOverlayForm(cardIndex);
    showFormOverlay();
    shiftElementFocus(firstFormInput);
  });
}

function createDeleteButtonElement() {
  let button = document.createElement("button"),
    icon = createDeleteIconElement();

  button.append(icon);
  addDeleteButtonListener(button);

  return button;
}

function createDeleteIconElement() {
  let icon = document.createElement("img");

  icon.classList.add("icon-medium");
  icon.setAttribute("src", "./icons/delete.svg");
  icon.setAttribute("alt", "Delete icon");

  return icon;
}

function addDeleteButtonListener(deleteButton) {
  deleteButton.addEventListener("click", (e) => {
    let cardIndex = +e.currentTarget.parentElement.parentElement.dataset.index;

    deleteConfirmation.dataset.cardIndexTarget = cardIndex;
    showDeletionConfirmationOverlay();
    shiftElementFocus(deletionButtonNo);
  });
}

function fillOverlayForm(cardIndex) {
  let book = myLibrary[cardIndex];

  form.dataset.cardIndexEdit = cardIndex;
  book.getInfo().forEach((info, i) => {
    formFields[i].value = info;
  });
}

function editBook() {
  let cardIndex = form.dataset.cardIndexEdit,
    book = myLibrary[+cardIndex];

  Object.keys(book).forEach((key, i) => {
    if (key !== "getInfo") {
      book[key] = formFields[i].value;
    }
  });
}

function updateBookDisplay() {
  let cardIndex = form.dataset.cardIndexEdit,
    book = myLibrary[+cardIndex],
    cardToUpdate = document.querySelector(`[data-index="${cardIndex}"]`),
    cardFields = cardToUpdate.firstElementChild.children;

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

function showFormOverlay() {
  formOverlay.style.width = "100%";
  bodyElement.style.overflow = "hidden"; // prevent page scoll when overlay is shown
}

function hideFormOverlay() {
  formOverlay.style.width = "0%";
  bodyElement.style.overflow = "visible";
}

function shiftElementFocus(element) {
  element.focus({ preventScroll: true });
}

function showDeletionConfirmationOverlay() {
  deletionConfirmationOverlay.style.width = "100%";
  bodyElement.style.overflow = "hidden";
}

function hideDeletionConfirmationOverlay() {
  deletionConfirmationOverlay.style.width = "0%";
  bodyElement.style.overflow = "visible";
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
}

function deleteBookFromLibrary() {
  let cardIndex = +deleteConfirmation.dataset.cardIndexTarget,
    card = document.querySelector(`[data-index="${cardIndex}"]`);

  myLibrary.splice(cardIndex, 1);
  updateCardIndex(cardIndex, card);
  card.remove();
  hideDeletionConfirmationOverlay();
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
      editBtn.classList.toggle("edit-button-card-position");
      editBtn.classList.toggle("edit-button-list-position");
    }
  });
}

overlayButtonOpen.addEventListener("click", () => {
  editBookFlag = false;
  showFormOverlay();
  shiftElementFocus(firstFormInput);
});

overlayButtonClose.addEventListener("click", () => {
  let cardIndex = form.dataset.cardIndexEdit;

  editBookFlag = false;
  hideFormOverlay();
  resetForm();

  if (cardIndex) {
    let cardTarget = document.querySelector(`[data-index="${cardIndex}"]`),
      editBtn = cardTarget.lastElementChild.firstElementChild;
    shiftElementFocus(editBtn);
  } else {
    shiftElementFocus(overlayButtonOpen);
  }
});

demoButton.addEventListener("click", () => {
  // reset library to demo library
  if (myLibrary) {
    myLibrary = [];
    while (bookGrid.firstChild) {
      bookGrid.removeChild(bookGrid.firstChild);
    }
  }

  demoLibraryData.forEach((obj) => {
    let bookInfo = Object.keys(obj).map((key) => {
      return obj[key];
    });
    addBooktoLibrary(...bookInfo);
    createBookCard();
  });
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

    hideFormOverlay();
    resetForm();
    shiftElementFocus(overlayButtonOpen);
  }

  e.preventDefault();
});

deletionButtonYes.addEventListener("click", () => {
  deleteBookFromLibrary();
  shiftElementFocus(overlayButtonOpen);
});

deletionButtonNo.addEventListener("click", () => {
  let cardIndex = deleteConfirmation.dataset.cardIndexTarget,
    cardTarget = document.querySelector(`[data-index="${cardIndex}"]`),
    deleteBtn = cardTarget.lastElementChild.lastElementChild;

  hideDeletionConfirmationOverlay();
  hideFormOverlay();
  shiftElementFocus(deleteBtn);
});

// Lazy form validation
// Trigger aggressive validation once out of focus
// No need to check last two buttons for errors
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
// No need to validate last two button for errors
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
