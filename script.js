// Book constructor
function Book(title, author, pages, haveRead) {
    // Do nothing if function is invoked without new keyword
    if (!new.target) throw new Error("You must use the 'new' operator to call the constructor");

    if (typeof title !== "string" || title.trim() === "")
        throw new Error("Title field is required.");
    if (typeof author !== "string" || author.trim() === "")
        throw new Error("Author field is required.");
    if (typeof pages !== "number")
        throw new Error("Pages field is required and must be a number.");
    if (typeof haveRead !== "boolean")
        throw new Error("haveRead property must be boolean.");


    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
}

Book.prototype.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead ? "completed" : "not read yet"}`;
}

const myLibrary = [];

function addBookToLibrary(title, author, pages, haveRead) {
    let newBook;
    
    try {
        newBook = new Book(title, author, pages, haveRead);
    }
    catch (error) {
        return error;
    }

    myLibrary.push(newBook);
}

function renderBooks() {
    const fragment = document.createDocumentFragment();
    const tableBody = document.querySelector(".books>tbody");

    // Reset previously rendered books.
    tableBody.innerHTML = "";

    myLibrary.map(book => {
        const row = document.createElement("tr");

        row.innerHTML +=
            `<td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td>${book.haveRead ? "Yes" : "No"}</td>`;

        fragment.appendChild(row);
    })

    tableBody.appendChild(fragment);

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
const addBookDialog = document.querySelector("#add-book-dialog");
const addBookForm = document.querySelector("#add-book-form");

// Form inputs
const formElements = [...addBookForm.elements];

// Depends on the order of declaration in index.html
const [title, author, pages, haveRead] = formElements;

// We can also do this
// const title = formElements.find(element => element.getAttribute("id") === "title").value;
// const author = formElements.find(element => element.getAttribute("id") === "author").value;
// const pages = formElements.find(element => element.getAttribute("id") === "pages").value;
// const haveRead = formElements.find(element => element.getAttribute("id") === "have-read").checked;

addBookBtn.addEventListener("click", () => {
    addBookDialog.showModal();
})

addBookForm.addEventListener("submit", (e) => {
    try {
        addBookToLibrary(title.value, author.value, +pages.value, haveRead.checked);
    } 
    catch (error) {
        console.log(error)
        alert(error.message);
        return;
    }
    renderBooks();
    addBookForm.reset();
})