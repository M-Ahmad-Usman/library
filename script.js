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