// Book constructor
function Book(title, author, pages, haveRead) {
    // Do nothing if function is invoked without new keyword
    if (!new.target) throw new Error("You must use the 'new' operator to call the constructor");

    // Will throw error if something is wrong
    validateBookInput(title, author, pages, haveRead);

    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead ? "completed" : "not read yet"}`;
}

function validateBookInput(title, author, pages, haveRead) {

    if (typeof title !== "string" || title.trim() === "")
        throw new Error("Title field is required.");
    if (typeof author !== "string" || author.trim() === "")
        throw new Error("Author field is required.");
    if (typeof pages !== "number")
        throw new Error("Pages field is required and must be a number.");
    if (typeof haveRead !== "boolean")
        throw new Error("haveRead property must be boolean.");

    return true;
}

const myLibrary = [];

function addBookToLibrary(title, author, pages, haveRead) {
    const newBook = new Book(title, author, pages, haveRead);
    myLibrary.push(newBook);
}

function renderBooks() {
    const fragment = document.createDocumentFragment();
    const tableBody = document.querySelector(".books>tbody");

    // Reset previously rendered books.
    tableBody.innerHTML = "";

    const checkedCheckbox = '<input type="checkbox" data-completed-status="true" checked></input>';
    const uncheckedCheckbox = '<input type="checkbox" data-completed-status="false" ></input>';

    myLibrary.map(book => {
        const row = document.createElement("tr");

        row.innerHTML +=
            `<td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td>${book.haveRead ? checkedCheckbox : uncheckedCheckbox}</td>
            <td><button class="delete-book-btn">Delete</button></td>
            <td><button class="edit-book-btn">Edit</button></td>`;

        row.dataset.bookId = book.id;

        fragment.appendChild(row);
    })

    tableBody.appendChild(fragment);

}

function convertKebabIntoCamel(name) {

    if (!(typeof name === "string")) throw new Error("String type is required for converting naming");

    let tokens = name.toLowerCase().split("-");

    let camelCaseName = tokens.
        map((token, index) => {

            if (index === 0) return token;

            return token[0].toUpperCase() + token.slice(1);;
        }).
        join("");

    return camelCaseName;
}

addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, true);
addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, true);
addBookToLibrary("Pride and Prejudice", "Jane Austen", 279, false);
addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, true);
addBookToLibrary("Moby Dick", "Herman Melville", 635, false);
addBookToLibrary("War and Peace", "Leo Tolstoy", 1225, false);
addBookToLibrary("The Catcher in the Rye", "J.D. Salinger", 214, true);
addBookToLibrary("Brave New World", "Aldous Huxley", 268, true);
addBookToLibrary("The Lord of the Rings", "J.R.R. Tolkien", 1178, false);

renderBooks();

// References
const addBookBtn = document.querySelector("#add-book-btn");

const bookDialog = document.querySelector("#book-dialog");
const bookForm = document.querySelector("#book-form");
const bookFormTitle = document.querySelector("#form-title");

const booksTable = document.querySelector(".books");

// Reduce bookFormElements array into an object
// Final shape will be
// bookFormElements = { titleInput, authorInput, haveReadInput ..., cancelFormBtn, submitFormBtn }
const bookFormElements = [...bookForm.elements].
    reduce((accum, curr) => {

        if (curr instanceof HTMLInputElement) {
            // Generate key for input element
            // The pattern will be elementInput like titleInput etc.

            // Get input name like title, author etc
            let inputName = curr.getAttribute("id").replaceAll(/\s/g, "").toLowerCase();

            // If inputName is in kebab case
            if (inputName.includes("-")) inputName = convertKebabIntoCamel(inputName);

            const key = inputName + "Input";
            accum[key] = curr;
            return accum;
        }
        else if (curr instanceof HTMLButtonElement) {

            // If curr is submit button
            if (curr.getAttribute("type") === "submit") {
                const key = "submitFormBtn";
                accum[key] = curr;
            }
            // If curr is cancel button
            else if (curr.getAttribute("id").includes("cancel")) {
                const key = "cancelFormBtn";
                accum[key] = curr;
            }

            return accum;
        }
    }, {});

bookFormElements.cancelFormBtn.addEventListener("click", () => {
    bookDialog.close();
})

addBookBtn.addEventListener("click", () => {

    bookFormTitle.textContent = "Add New Book";
    bookFormElements.submitFormBtn.textContent = "Add Book";

    // This will be used by form submission handler
    bookForm.dataset.form = "add-book";
    bookDialog.showModal();
})

bookForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid = bookForm.reportValidity();
    if (!isValid) return;

    const title = bookFormElements.titleInput.value;
    const author = bookFormElements.authorInput.value;
    const pages = +bookFormElements.pagesInput.value;
    const haveRead = bookFormElements.haveReadInput.checked;

    // If form is for Adding new book
    if (bookForm.dataset.form === "add-book") {
        try {
            validateBookInput(title, author, pages, haveRead);
        }
        catch (error) {
            alert(error.message);
            return;
        }

        addBookToLibrary(title, author, pages, haveRead);
        renderBooks();
        bookForm.reset();
        bookDialog.close();
    }
    // If form is for editing book details
    else if (bookForm.dataset.form === "edit-book") {
        try {
            validateBookInput(title, author, pages, haveRead);
        }
        catch (error) {
            alert(error.message);
            return;
        }

        // BookId has been added by the edit button click handler
        const bookId = bookDialog.dataset.bookId;
        // Find index of book with specified bookId
        const bookIndex = myLibrary.findIndex(book => book.id === bookId);

        myLibrary[bookIndex] = { ...myLibrary[bookIndex], title, author, pages, haveRead };
        renderBooks();
        bookForm.reset();
        bookDialog.close();
    }
});

// Buttons and haveRead toggle functionality. Using event delegation
booksTable.addEventListener("click", (e) => {

    let target = e.target;

    if ((target instanceof HTMLButtonElement)) {

        // Delete button functionality
        if (target.classList.contains("delete-book-btn")) {
            let deleteBookId = target.closest("tr").dataset.bookId;

            let index = myLibrary.findIndex(book => book.id === deleteBookId);
            myLibrary.splice(index, 1);
            renderBooks();
        }

        // Edit button functionality
        else if (target.classList.contains("edit-book-btn")) {
            // This will help to identify the purpose of bookForm
            bookForm.dataset.form = "edit-book";

            let editBookId = target.closest("tr").dataset.bookId;
            // This bookId will be used by the bookForm to update the correct book's info
            bookDialog.dataset.bookId = editBookId;

            const book = myLibrary.find(book => book.id === editBookId);

            // Update the form's title
            bookFormTitle.textContent = "Edit Book Info"
            bookFormElements.submitFormBtn.textContent = "Edit Book";

            // Update the form with book's current data
            bookFormElements.titleInput.value = book.title;
            bookFormElements.authorInput.value = book.author;
            bookFormElements.pagesInput.value = book.pages;
            bookFormElements.haveReadInput.checked = book.haveRead;

            bookDialog.showModal();
        }
    }

    // haveRead toggle functionality
    if (target instanceof HTMLInputElement && target.hasAttribute("data-completed-status")) {
        const completedStatus = target.dataset.completedStatus === "true";

        target.dataset.completedStatus = !completedStatus;

        const bookId = target.closest("tr").dataset.bookId;
        const bookIndex = myLibrary.findIndex(book => book.id === bookId);

        // Update the haveRead key's value
        myLibrary[bookIndex].haveRead = !completedStatus;
    }
})