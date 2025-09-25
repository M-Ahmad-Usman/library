// Book constructor
function Book(title, author, pages, haveRead) {
    // Do nothing if function is invoked without new keyword
    if (!new.target) throw new Error("You must use the 'new' operator to call the constructor");

    if (typeof title !== "string" && title.trim() !== "")
        throw new Error("Title field is required.");
    if (typeof author !== "string" && author.trim() !== "")
        throw new Error("Title field is required.");
    if (typeof pages !== "number")
        throw new Error("Title field is required.");
    if (typeof haveRead !== "boolean")
        throw new Error("Title field is required.");


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
    try {
        const newBook = new Book(title, author, pages, haveRead);
        myLibrary.push(newBook);
    }
    catch (error) {
        console.error(error.message);
        return;
    }
}

function renderBooks() {
    const fragment = document.createDocumentFragment();
    const tableBody = document.querySelector(".books>tbody");

    myLibrary.map(book => {
        const row = document.createElement("tr");
        
        row.innerHTML += 
            `<td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td>${book.haveRead? "Yes": "No"}</td>`;
        
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

renderBooks()